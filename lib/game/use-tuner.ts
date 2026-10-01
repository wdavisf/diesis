import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createNotePlayer, type NotePlayer } from "@/lib/audio/note-player";
import { microphoneSupported, startTunerEngine, type TunerEngine } from "@/lib/audio/tuner-engine";
import type { Tuning } from "@/lib/core/notes";
import { A4_DEFAULT, clampA4, decodeA4, detectPitch, GATE_RMS, IN_TUNE_CENTS, median, readString, rmsOf, type Reading } from "@/lib/core/tuner";

const KEY = "diesis_tuner";
const CHANGED = "diesis-tuner";

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

export type TunerStatus = "idle" | "starting" | "listening" | "denied" | "unsupported" | "error";

/** Readings kept for the median, and in-tune readings in a row (about 0.4 s) before a string is ticked. */
const EMPTY: ReadonlySet<number> = new Set();
const KEEP = 5;
const HOLD = 8;
/** After a reference note the microphone ignores the room for this long, so it does not tune to the speaker. */
const DEAF_MS = 1800;
/** A pitch that goes quiet for this long stops being shown. */
const FADE_MS = 700;

type WakeLock = { release(): Promise<void> };

/**
 * The tuner's state. The reference pitch (A4) is kept in this browser (localStorage
 * `diesis_tuner`, never sent); the tuning is the profile's and comes in as an argument. While it
 * listens, `reading` is the string heard and how far off it is (null in silence), `tuned` the
 * strings held in tune this session, and `pinned` the string the player fixed by tapping it
 * (otherwise the closest string of the tuning wins). `hear` plays a string's reference note.
 */
export function useTuner(tuning: Tuning) {
  const a4 = decodeA4(useSyncExternalStore(subscribe, read, () => null));
  const setA4 = useCallback((hz: number) => {
    try {
      window.localStorage.setItem(KEY, String(clampA4(hz)));
    } catch {
      // Blocked storage: the choice lasts for this page only.
    }
    window.dispatchEvent(new Event(CHANGED));
  }, []);

  const [status, setStatus] = useState<TunerStatus>("idle");
  // What was heard, ticked and pinned belongs to one tuning (`sig`); a new tuning starts clean
  // without the microphone having to restart.
  const sig = tuning.join(",");
  const live = useRef({ tuning, a4, pinned: null as number | null, sig });
  const [heard, setHeard] = useState<{ sig: string; reading: Reading | null }>({ sig, reading: null });
  const [ticked, setTicked] = useState<{ sig: string; set: ReadonlySet<number> }>({ sig, set: new Set() });
  const [pin_, setPin] = useState<{ sig: string; string: number | null }>({ sig, string: null });
  const reading = heard.sig === sig ? heard.reading : null;
  const tuned = ticked.sig === sig ? ticked.set : EMPTY;
  const pinned = pin_.sig === sig ? pin_.string : null;
  useEffect(() => {
    live.current = { tuning, a4, pinned, sig };
  });
  const setReading = useCallback((r: Reading | null) => setHeard({ sig: live.current.sig, reading: r }), []);
  const setTuned = useCallback(
    (change: (t: ReadonlySet<number>) => ReadonlySet<number>) =>
      setTicked((cur) => {
        const base = cur.sig === live.current.sig ? cur.set : EMPTY;
        const set = change(base);
        return set === base && cur.sig === live.current.sig ? cur : { sig: live.current.sig, set };
      }),
    [],
  );

  const engine = useRef<TunerEngine | null>(null);
  const player = useRef<NotePlayer | null>(null);
  const wake = useRef<WakeLock | null>(null);
  const recent = useRef<{ string: number; cents: number[]; hz: number[] }>({ string: -1, cents: [], hz: [] });
  const streak = useRef<{ string: number; inTune: number; off: number }>({ string: -1, inTune: 0, off: 0 });
  const deafUntil = useRef(0);
  const lastHeard = useRef(0);

  const forget = useCallback(() => {
    recent.current = { string: -1, cents: [], hz: [] };
    streak.current = { string: -1, inTune: 0, off: 0 };
    setReading(null);
  }, [setReading]);

  const onBlock = useCallback((samples: Float32Array, rate: number) => {
    const now = performance.now();
    if (now < deafUntil.current) return;
    const pitch = rmsOf(samples) >= GATE_RMS ? detectPitch(samples, rate) : null;
    if (!pitch) {
      if (lastHeard.current && now - lastHeard.current > FADE_MS) {
        lastHeard.current = 0;
        recent.current = { string: -1, cents: [], hz: [] };
        setReading(null);
      }
      return;
    }
    lastHeard.current = now;
    const { tuning: tn, a4: ref, pinned: pin } = live.current;
    const r = readString(pitch.hz, tn, ref, pin);
    const rec = recent.current;
    if (rec.string !== r.string) {
      rec.string = r.string;
      rec.cents = [];
      rec.hz = [];
    }
    rec.cents.push(r.cents);
    rec.hz.push(r.hz);
    if (rec.cents.length > KEEP) {
      rec.cents.shift();
      rec.hz.shift();
    }
    const cents = median(rec.cents);
    setReading({ string: r.string, cents, hz: median(rec.hz) });

    // A string held in tune for a moment is ticked; one that drifts out is unticked.
    const s = streak.current;
    if (s.string !== r.string) {
      s.string = r.string;
      s.inTune = 0;
      s.off = 0;
    }
    if (Math.abs(cents) <= IN_TUNE_CENTS) {
      s.off = 0;
      if (++s.inTune === HOLD) setTuned((t) => new Set(t).add(r.string));
    } else {
      s.inTune = 0;
      if (Math.abs(cents) > 2 * IN_TUNE_CENTS && ++s.off === HOLD) {
        setTuned((t) => {
          if (!t.has(r.string)) return t;
          const next = new Set(t);
          next.delete(r.string);
          return next;
        });
      }
    }
  }, [setReading, setTuned]);

  const lockScreen = useCallback(async () => {
    try {
      const nav = navigator as Navigator & { wakeLock?: { request(type: "screen"): Promise<WakeLock> } };
      wake.current = (await nav.wakeLock?.request("screen")) ?? null;
    } catch {
      wake.current = null;
    }
  }, []);

  const stop = useCallback(() => {
    engine.current?.stop();
    engine.current = null;
    void wake.current?.release();
    wake.current = null;
    forget();
    setStatus("idle");
  }, [forget]);

  const start = useCallback(async () => {
    if (engine.current) return;
    if (!microphoneSupported()) {
      setStatus("unsupported");
      return;
    }
    setStatus("starting");
    try {
      engine.current = await startTunerEngine(onBlock);
      setTuned(() => EMPTY);
      setStatus("listening");
      void lockScreen();
    } catch (e) {
      engine.current = null;
      const name = e instanceof DOMException ? e.name : "";
      setStatus(name === "NotAllowedError" || name === "SecurityError" ? "denied" : "error");
    }
  }, [onBlock, lockScreen, setTuned]);

  // A new tuning is a new set of strings: what was being measured does not carry over.
  useEffect(() => {
    recent.current = { string: -1, cents: [], hz: [] };
    streak.current = { string: -1, inTune: 0, off: 0 };
  }, [sig]);

  useEffect(() => {
    return () => {
      engine.current?.stop();
      engine.current = null;
      void wake.current?.release();
      player.current?.dispose();
      player.current = null;
    };
  }, []);

  // The wake lock drops when the tab is hidden; take it again on return.
  useEffect(() => {
    if (status !== "listening") return;
    const onVisible = () => {
      if (document.visibilityState === "visible") void lockScreen();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [status, lockScreen]);

  /** Plays string `i`'s reference note, at the reference pitch, and pins the tuner to it. */
  const hear = useCallback(
    async (i: number) => {
      const midi = live.current.tuning[i];
      if (midi === undefined) return;
      player.current ??= createNotePlayer({ keepSession: engine.current !== null });
      deafUntil.current = performance.now() + DEAF_MS;
      forget();
      await player.current.prepare([midi]);
      player.current.play(midi, 1200 * Math.log2(live.current.a4 / A4_DEFAULT));
    },
    [forget],
  );

  const pin = useCallback(
    (i: number | null) => {
      setPin({ sig: live.current.sig, string: i });
      forget();
    },
    [forget],
  );

  return { status, reading, tuned, pinned, pin, hear, start, stop, a4, setA4 };
}
