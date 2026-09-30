import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { clampBpm, decodeMetronome, encodeMetronome, tap as tapTempo, type Click, type MetronomeSettings } from "@/lib/core/metronome";
import { createMetronomeEngine, type Beat, type MetronomeEngine } from "@/lib/audio/metronome-engine";
import { encodeSpeed, tempoAtBar, type SpeedPlan } from "@/lib/core/speed";

const KEY = "diesis_metronome";
const CHANGED = "diesis-metronome";

function read(): string | null {
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener(CHANGED, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGED, onChange);
    window.removeEventListener("storage", onChange);
  };
}

type WakeLock = { release(): Promise<void> };

/** Bars of count-in before the tempo begins, on every start and resume. */
export const COUNT_IN_BARS = 1;

/**
 * The metronome screen's state: settings kept in this browser (localStorage `diesis_metronome`,
 * never sent), the engine, the click being heard for the beat display, tap tempo, and a screen
 * wake lock while it runs so the phone does not go dark mid-practice. In climbing mode
 * (`settings.mode === "speed"`) the engine takes its tempo from the plan, bar by bar, and `beat`
 * reports the bar and tempo heard. Every start counts in one bar (`beat.countIn` while it does).
 * A climb can be paused: `pause` holds the bar it was in, `resume` counts in again at that bar's
 * tempo and carries on from it; `stop` forgets it.
 */
export function useMetronome(plan: SpeedPlan | null = null) {
  const raw = useSyncExternalStore(subscribe, read, () => null);
  const settings = decodeMetronome(raw);
  const [running, setRunning] = useState(false);
  const [held_, setPaused] = useState(false);
  const [click, setClick] = useState<Click | null>(null);
  const [beat, setBeat] = useState<Beat | null>(null);
  const engine = useRef<MetronomeEngine | null>(null);
  /** The last click heard, for where a pause holds. */
  const lastBeat = useRef<Beat | null>(null);
  /** The bar a paused climb resumes on. */
  const held = useRef<number | null>(null);
  const taps = useRef<number[]>([]);
  const wake = useRef<WakeLock | null>(null);

  useEffect(() => {
    engine.current = createMetronomeEngine((c, b) => {
      lastBeat.current = b;
      setClick(c);
      setBeat(b);
    });
    return () => {
      engine.current?.dispose();
      engine.current = null;
      void wake.current?.release();
    };
  }, []);

  // Live changes reach the running engine.
  useEffect(() => {
    engine.current?.update(settings);
  }, [settings.bpm, settings.meter, settings.subdivision, settings.accent]); // eslint-disable-line react-hooks/exhaustive-deps

  // The plan reaches the engine as a tempo per bar; edits apply from the next bar.
  const planKey = plan && settings.mode === "speed" ? encodeSpeed(plan) : null;
  useEffect(() => {
    const p = planKey ? plan : null;
    engine.current?.setPlan(p ? (bar) => tempoAtBar(p, bar) : null);
  }, [planKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const save = useCallback((next: MetronomeSettings) => {
    try {
      window.localStorage.setItem(KEY, encodeMetronome(next));
    } catch {
      // Blocked storage: the change still applies, through the event below, for this page.
    }
    window.dispatchEvent(new Event(CHANGED));
  }, []);

  const set = useCallback((patch: Partial<MetronomeSettings>) => save({ ...decodeMetronome(read()), ...patch }), [save]);
  const nudge = useCallback((by: number) => set({ bpm: clampBpm(decodeMetronome(read()).bpm + by) }), [set]);

  const lockScreen = useCallback(async () => {
    try {
      const nav = navigator as Navigator & { wakeLock?: { request(type: "screen"): Promise<WakeLock> } };
      wake.current = (await nav.wakeLock?.request("screen")) ?? null;
    } catch {
      wake.current = null;
    }
  }, []);

  const unlockScreen = useCallback(() => {
    void wake.current?.release();
    wake.current = null;
  }, []);

  const stop = useCallback(() => {
    engine.current?.stop();
    held.current = null;
    lastBeat.current = null;
    setRunning(false);
    setPaused(false);
    setClick(null);
    setBeat(null);
    unlockScreen();
  }, [unlockScreen]);

  /** Begin on bar `from`, after the count-in. */
  const begin = useCallback(
    async (from: number) => {
      const e = engine.current;
      if (!e) return;
      held.current = null;
      setPaused(false);
      setRunning(true);
      await e.start(decodeMetronome(read()), { from, countIn: COUNT_IN_BARS });
      void lockScreen();
    },
    [lockScreen],
  );

  const start = useCallback(async () => {
    lastBeat.current = null;
    setBeat(null);
    await begin(0);
  }, [begin]);

  /** Hold the climb on the bar being heard (the screen keeps showing its bar and tempo). */
  const pause = useCallback(() => {
    if (!running) return;
    engine.current?.stop();
    // During a count-in the bar is the one it leads into, so a pause there resumes on it.
    held.current = lastBeat.current?.bar ?? 0;
    setRunning(false);
    setPaused(true);
    setClick(null);
    unlockScreen();
  }, [running, unlockScreen]);

  const resume = useCallback(async () => {
    await begin(held.current ?? 0);
  }, [begin]);

  // Pausing holds a place in a climb; a steady tempo has none, so Space and the button stop it,
  // and a held climb is forgotten on the screen while Speed up is off (Start begins afresh).
  const canPause = settings.mode === "speed";
  const paused = held_ && canPause;

  /** The main button and the space bar: start, then pause and resume a climb, or stop a steady tempo. */
  const toggle = useCallback(async () => {
    if (running) {
      if (canPause) pause();
      else stop();
    } else if (paused) await resume();
    else await start();
  }, [running, paused, canPause, pause, stop, resume, start]);

  // The wake lock drops when the tab is hidden; take it again on return.
  useEffect(() => {
    if (!running) return;
    const onVisible = () => {
      if (document.visibilityState === "visible") void lockScreen();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [running, lockScreen]);

  const tap = useCallback(() => {
    const r = tapTempo(taps.current, performance.now());
    taps.current = r.taps;
    if (r.bpm !== null) set({ bpm: r.bpm });
  }, [set]);

  return { settings, set, nudge, running, paused, toggle, stop, click, beat, tap };
}
