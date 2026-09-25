/**
 * The metronome's clock. A look-ahead scheduler: a timer wakes every 25 ms and books on the
 * AudioContext every click due in the next 120 ms, at its exact audio time, so the beat stays
 * steady however busy the page is. The timer runs in a small Worker where possible, because
 * browsers slow main-thread timers to once a second in a background tab and a metronome must
 * keep going while you read a score in another tab.
 *
 * Clicks are synthesised (a short pitched blip), no samples to load. What each click is comes
 * from lib/core/metronome.ts.
 */
import { clickAt, clicksPerBar, secondsPerClick, type Click, type ClickKind, type MetronomeSettings } from "@/lib/core/metronome";
import { askForPlaybackSession } from "@/lib/audio/note-player";

const LOOKAHEAD_S = 0.12;
const WAKE_MS = 25;

const VOICE: Record<ClickKind, { freq: number; gain: number }> = {
  accent: { freq: 1760, gain: 0.9 },
  group: { freq: 1320, gain: 0.7 },
  beat: { freq: 1100, gain: 0.6 },
  sub: { freq: 880, gain: 0.3 },
};

export interface MetronomeEngine {
  /** Must be called from a user gesture the first time. Starts on beat one. */
  start(settings: MetronomeSettings): Promise<void>;
  stop(): void;
  /** Takes new settings while running. Tempo changes land on the next click; a new meter or
   *  subdivision restarts the count on the next click at beat one. */
  update(settings: MetronomeSettings): void;
  dispose(): void;
}

/** A timer that keeps its pace in a background tab: a Worker when the browser allows one. */
function createTicker(onWake: () => void): { start(): void; stop(): void; dispose(): void } {
  let worker: Worker | null = null;
  let url: string | null = null;
  try {
    url = URL.createObjectURL(
      new Blob(
        [`let id=null;onmessage=(e)=>{clearInterval(id);id=null;if(e.data==="start")id=setInterval(()=>postMessage(0),${WAKE_MS});};`],
        { type: "text/javascript" },
      ),
    );
    worker = new Worker(url);
    worker.onmessage = onWake;
  } catch {
    worker = null;
  }
  let id: ReturnType<typeof setInterval> | null = null;
  return {
    start() {
      if (worker) worker.postMessage("start");
      else id ??= setInterval(onWake, WAKE_MS);
    },
    stop() {
      if (worker) worker.postMessage("stop");
      if (id !== null) clearInterval(id);
      id = null;
    },
    dispose() {
      this.stop();
      worker?.terminate();
      if (url) URL.revokeObjectURL(url);
    },
  };
}

export function createMetronomeEngine(onClick: (click: Click) => void): MetronomeEngine {
  let ctx: AudioContext | null = null;
  let settings: MetronomeSettings | null = null;
  let running = false;
  let index = 0;
  let nextTime = 0;
  const timeouts = new Set<ReturnType<typeof setTimeout>>();
  const ticker = createTicker(schedule);

  function context(): AudioContext {
    if (!ctx) {
      askForPlaybackSession();
      ctx = new AudioContext();
    }
    return ctx;
  }

  function blip(at: number, kind: ClickKind) {
    const c = context();
    const { freq, gain } = VOICE[kind];
    const osc = c.createOscillator();
    const env = c.createGain();
    osc.type = "triangle";
    osc.frequency.value = freq;
    env.gain.setValueAtTime(0.0001, at);
    env.gain.exponentialRampToValueAtTime(gain, at + 0.002);
    env.gain.exponentialRampToValueAtTime(0.0001, at + 0.045);
    osc.connect(env).connect(c.destination);
    osc.start(at);
    osc.stop(at + 0.06);
  }

  /** Audio time the listener is hearing now: the clock minus the output latency, if known. */
  function heardNow(): number {
    return ctx ? ctx.currentTime - (ctx.outputLatency || 0) : 0;
  }

  /**
   * The screen hears about a click when it sounds, not when it is booked. The timer aims at the
   * click, then checks the audio clock and waits out any remainder: a fresh context's clock runs
   * slow for its first moments, so a delay computed once would light the beat early.
   */
  function announce(at: number, click: Click) {
    const arm = (ms: number) => {
      const id = setTimeout(() => {
        timeouts.delete(id);
        if (!running) return;
        const left = at - heardNow();
        if (left > 0.004) arm(left * 1000);
        else onClick(click);
      }, ms);
      timeouts.add(id);
    };
    arm(Math.max(0, (at - heardNow()) * 1000));
  }

  function schedule() {
    if (!running || !ctx || !settings) return;
    // iOS suspends the context after a call or a lock; wake it and pick the beat up from now.
    if (ctx.state !== "running") {
      void ctx.resume();
      nextTime = Math.max(nextTime, ctx.currentTime + 0.05);
    }
    // Fell far behind (the tab slept): skip ahead rather than fire a burst of late clicks.
    if (nextTime < ctx.currentTime - 0.2) nextTime = ctx.currentTime + 0.05;
    while (nextTime < ctx.currentTime + LOOKAHEAD_S) {
      const click = clickAt(index, settings);
      blip(nextTime, click.kind);
      announce(nextTime, click);
      nextTime += secondsPerClick(settings);
      index = (index + 1) % clicksPerBar(settings);
    }
  }

  function clearAnnouncements() {
    for (const id of timeouts) clearTimeout(id);
    timeouts.clear();
  }

  return {
    async start(next) {
      const c = context();
      if (c.state !== "running") await c.resume();
      settings = next;
      index = 0;
      nextTime = c.currentTime + 0.06;
      running = true;
      schedule();
      ticker.start();
    },
    stop() {
      running = false;
      ticker.stop();
      clearAnnouncements();
    },
    update(next) {
      const prev = settings;
      settings = next;
      if (!running || !prev) return;
      if (prev.meter !== next.meter || prev.subdivision !== next.subdivision) index = 0;
    },
    dispose() {
      this.stop();
      ticker.dispose();
      void ctx?.close();
      ctx = null;
    },
  };
}
