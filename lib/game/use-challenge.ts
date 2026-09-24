import { useCallback, useEffect, useRef, useState } from "react";
import {
  bestKey,
  decodeChallenge,
  EMPTY_TALLY,
  encodeChallenge,
  secondsLeft,
  tallyRight,
  tallyTimeUp,
  tallyWrong,
  type Challenge,
  type Tally,
} from "@/lib/core/challenge";

const LAST_KEY = "diesis_challenge";
const BEST_PREFIX = "diesis_best:";

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
    // Private windows and blocked storage: the best just is not remembered.
  }
}

export interface ChallengeState {
  challenge: Challenge;
  setChallenge: (c: Challenge) => void;
  tally: Tally;
  /** Seconds left while a timed run is going; null otherwise. */
  left: number | null;
  /** True between begin() and the end of the run. */
  running: boolean;
  /** Best before this run, for the result card. Null for practice or when there is none. */
  best: number | null;
  /** True when the run just ended beat the stored best. */
  newBest: boolean;
  begin: () => void;
  right: () => void;
  wrong: () => void;
  /** Back to the picker. */
  reset: () => void;
}

/**
 * Keeps score for one mode under the chosen challenge, runs the clock for timed runs and stores
 * personal bests in localStorage (per browser only). The last challenge picked is remembered too.
 */
export function useChallenge(mode: string): ChallengeState {
  const [challenge, setChallengeState] = useState<Challenge>({ kind: "practice" });
  const [tally, setTally] = useState<Tally>(EMPTY_TALLY);
  const [running, setRunning] = useState(false);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [left, setLeft] = useState<number | null>(null);
  const [best, setBest] = useState<number | null>(null);
  const [newBest, setNewBest] = useState(false);
  const saved = useRef(false);

  useEffect(() => {
    setChallengeState(decodeChallenge(read(LAST_KEY)));
  }, []);

  const setChallenge = useCallback((c: Challenge) => {
    setChallengeState(c);
    write(LAST_KEY, encodeChallenge(c));
  }, []);

  const begin = useCallback(() => {
    const key = bestKey(mode, challenge);
    const stored = key ? Number(read(BEST_PREFIX + key)) : NaN;
    setBest(Number.isFinite(stored) && stored > 0 ? stored : null);
    setNewBest(false);
    saved.current = false;
    setTally(EMPTY_TALLY);
    setStartedAt(Date.now());
    setLeft(secondsLeft(challenge, 0));
    setRunning(true);
  }, [mode, challenge]);

  // The clock: a light tick, the real time comes from Date.now().
  useEffect(() => {
    if (!running || startedAt === null || challenge.kind !== "timed") return;
    const id = setInterval(() => {
      const s = secondsLeft(challenge, Date.now() - startedAt) ?? 0;
      setLeft(s);
      if (s <= 0) setTally((t) => tallyTimeUp(t, challenge));
    }, 200);
    return () => clearInterval(id);
  }, [running, startedAt, challenge]);

  // A run that ends stores its best once.
  useEffect(() => {
    if (!tally.over || saved.current) return;
    saved.current = true;
    setRunning(false);
    const key = bestKey(mode, challenge);
    if (key && tally.right > 0 && (best === null || tally.right > best)) {
      write(BEST_PREFIX + key, String(tally.right));
      setNewBest(true);
    }
  }, [tally, mode, challenge, best]);

  const right = useCallback(() => setTally((t) => tallyRight(t)), []);
  const wrong = useCallback(() => setTally((t) => tallyWrong(t, challenge)), [challenge]);
  const reset = useCallback(() => {
    setRunning(false);
    setTally(EMPTY_TALLY);
    setLeft(null);
  }, []);

  return { challenge, setChallenge, tally, left, running, best, newBest, begin, right, wrong, reset };
}
