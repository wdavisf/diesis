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

/**
 * The metronome screen's state: settings kept in this browser (localStorage `diesis_metronome`,
 * never sent), the engine, the click being heard for the beat display, tap tempo, and a screen
 * wake lock while it runs so the phone does not go dark mid-practice. With a speed plan the
 * engine takes its tempo from the plan, bar by bar, and `beat` reports the bar and tempo heard.
 */
export function useMetronome(plan: SpeedPlan | null = null) {
  const raw = useSyncExternalStore(subscribe, read, () => null);
  const settings = decodeMetronome(raw);
  const [running, setRunning] = useState(false);
  const [click, setClick] = useState<Click | null>(null);
  const [beat, setBeat] = useState<Beat | null>(null);
  const engine = useRef<MetronomeEngine | null>(null);
  const taps = useRef<number[]>([]);
  const wake = useRef<WakeLock | null>(null);

  useEffect(() => {
    engine.current = createMetronomeEngine((c, b) => {
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
  const planKey = plan ? encodeSpeed(plan) : null;
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

  const toggle = useCallback(async () => {
    const e = engine.current;
    if (!e) return;
    if (running) {
      e.stop();
      setRunning(false);
      setClick(null);
      setBeat(null);
      void wake.current?.release();
      wake.current = null;
    } else {
      setRunning(true);
      await e.start(decodeMetronome(read()));
      void lockScreen();
    }
  }, [running, lockScreen]);

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

  return { settings, set, nudge, running, toggle, click, beat, tap };
}
