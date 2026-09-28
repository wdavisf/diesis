import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  anchor,
  beats,
  bestKeyOf,
  COUNT_IN,
  decodeFingerBests,
  decodeFingers,
  encodeFingers,
  expire,
  newRun,
  sequence,
  summarize,
  tap as tapRun,
  type Finger,
  type FingerBest,
  type FingerSettings,
  type Hit,
  type Run,
  type Summary,
} from "@/lib/core/fingers";
import { createMetronomeEngine, type MetronomeEngine } from "@/lib/audio/metronome-engine";

const KEY = "diesis_fingers";
const BEST_KEY = "diesis_fingers_best";
const CHANGED = "diesis-fingers";

function read(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Blocked storage: the change still applies for this page, through the event.
  }
  window.dispatchEvent(new Event(CHANGED));
}

function subscribe(onChange: () => void) {
  window.addEventListener(CHANGED, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGED, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export type Phase = "setup" | "running" | "done";

/** What a pad shows for a moment after a tap or a miss. `id` restarts the flash. */
export type Flash = Hit & { id: number };

export interface Result {
  summary: Summary;
  bpm: number;
  record: boolean;
}

const FLASH_MS = 450;

/**
 * The finger exercise: settings and the fastest clean runs kept in this browser
 * (localStorage `diesis_fingers` and `diesis_fingers_best`, never sent), a metronome engine for
 * the clicks, and the run being played. Taps are timed on the page's clock against when each
 * click is heard (the engine reports it as it books the click).
 */
export function useFingers() {
  const settings = decodeFingers(useSyncExternalStore(subscribe, () => read(KEY), () => null));
  const bests = decodeFingerBests(useSyncExternalStore(subscribe, () => read(BEST_KEY), () => null));
  const [phase, setPhase] = useState<Phase>("setup");
  const [run, setRun] = useState<Run | null>(null);
  const [seq, setSeq] = useState<Finger[]>([]);
  /** The last click heard, counted from 0 at the first click of the count-in; -1 before. */
  const [heard, setHeard] = useState(-1);
  const [flash, setFlash] = useState<Partial<Record<Finger, Flash>>>({});
  const [result, setResult] = useState<Result | null>(null);

  const engine = useRef<MetronomeEngine | null>(null);
  const runRef = useRef<Run | null>(null);
  const seqRef = useRef<Finger[]>([]);
  const playing = useRef<FingerSettings | null>(null);
  const flashId = useRef(0);
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());

  const show = useCallback((finger: Finger, hit: Hit) => {
    const id = ++flashId.current;
    setFlash((f) => ({ ...f, [finger]: { ...hit, id } }));
    const timer = setTimeout(() => {
      timers.current.delete(timer);
      setFlash((f) => (f[finger]?.id === id ? { ...f, [finger]: undefined } : f));
    }, FLASH_MS);
    timers.current.add(timer);
  }, []);

  const finish = useCallback(() => {
    const s = playing.current;
    const r = runRef.current;
    engine.current?.stop();
    playing.current = null;
    if (!s || !r) return;
    const summary = summarize(r);
    const all = decodeFingerBests(read(BEST_KEY));
    const key = bestKeyOf(s);
    const record = beats(s.bpm, summary, all[key]);
    if (record) {
      const best: FingerBest = { bpm: s.bpm, accuracy: summary.accuracy, spread: summary.spread ?? 0 };
      write(BEST_KEY, JSON.stringify({ ...all, [key]: best }));
    }
    setResult({ summary, bpm: s.bpm, record });
    setPhase("done");
  }, []);

  // One engine for the page. Its callbacks read refs, so they are set up once.
  const finishRef = useRef(finish);
  const showRef = useRef(show);
  useEffect(() => {
    finishRef.current = finish;
    showRef.current = show;
  }, [finish, show]);

  useEffect(() => {
    const timersNow = timers.current;
    engine.current = createMetronomeEngine(
      (_, beat) => {
        const s = playing.current;
        const r = runRef.current;
        if (!s || !r) return;
        setHeard(beat.count);
        const { run: next, missed } = expire(r, performance.now());
        if (next !== r) {
          runRef.current = next;
          setRun(next);
          for (const k of missed) showRef.current(next.seq[k], next.hits[k] as Hit);
        }
        if (beat.count >= COUNT_IN + r.seq.length) finishRef.current();
      },
      (_, beat) => {
        const s = playing.current;
        if (!s) return;
        const k = beat.count - COUNT_IN;
        if (!runRef.current) {
          runRef.current = newRun(seqRef.current, beat.heardAt - k * (60000 / s.bpm), s.bpm);
        } else if (k >= 0 && k < runRef.current.seq.length) {
          runRef.current = anchor(runRef.current, k, beat.heardAt);
        }
      },
    );
    return () => {
      engine.current?.dispose();
      engine.current = null;
      for (const t of timersNow) clearTimeout(t);
    };
  }, []);

  const set = useCallback((patch: Partial<FingerSettings>) => write(KEY, encodeFingers({ ...decodeFingers(read(KEY)), ...patch })), []);

  const start = useCallback(async () => {
    const e = engine.current;
    if (!e) return;
    const s = decodeFingers(read(KEY));
    const next = sequence(s.pattern, s.length);
    seqRef.current = next;
    runRef.current = null;
    playing.current = s;
    setSeq(next);
    setRun(null);
    setHeard(-1);
    setFlash({});
    setResult(null);
    setPhase("running");
    await e.start({ bpm: s.bpm, meter: "4/4", subdivision: 1, accent: true, mode: "steady" });
  }, []);

  const stop = useCallback(() => {
    engine.current?.stop();
    playing.current = null;
    runRef.current = null;
    setPhase("setup");
  }, []);

  /** A finger came down at `time` (performance.now() milliseconds). */
  const press = useCallback(
    (finger: Finger, time: number) => {
      const r = runRef.current;
      if (!playing.current || !r) return;
      const out = tapRun(r, finger, time);
      if (!out) return;
      runRef.current = out.run;
      setRun(out.run);
      show(finger, out.hit);
    },
    [show],
  );

  return { settings, set, bests, phase, seq, run, heard, flash, result, start, stop, press, back: () => setPhase("setup") };
}
