/**
 * Finger independence, pure. Four pads, one per finger; on every click of a metronome one of
 * them is the one to hit. This module holds the sequences of fingers, the timing rules (which
 * click a tap belongs to, how early or late it was, whether that counts as on time), the
 * summary of a run and the fastest clean run kept as a record. Times are milliseconds on one
 * clock (performance.now() in the browser); nothing here knows about audio or the screen.
 */
import { BPM_MAX, BPM_MIN, clampBpm } from './metronome';

/** 1 index, 2 middle, 3 ring, 4 pinky: the numbers fingers carry in guitar music. */
export type Finger = 1 | 2 | 3 | 4;
export const FINGERS: readonly Finger[] = [1, 2, 3, 4];

/** "random", or a four-finger cell repeated: "1234" is index, middle, ring, pinky, again. */
export const PATTERNS = ['random', '1234', '4321', '1324', '2413', '1423'] as const;
export type Pattern = (typeof PATTERNS)[number];

/** Targets per run: four, eight or sixteen bars of 4/4. */
export const LENGTHS = [16, 32, 64] as const;
export type Length = (typeof LENGTHS)[number];

/** Which hand is on the pads. The left hand lies pinky to index from left to right, the right
 *  hand index to pinky, so the pads are drawn in that order. */
export type Hand = 'left' | 'right';

export const COUNT_IN = 4;

export interface FingerSettings {
  bpm: number;
  pattern: Pattern;
  length: Length;
  hand: Hand;
}

export const DEFAULT_FINGERS: FingerSettings = { bpm: 60, pattern: 'random', length: 32, hand: 'left' };

/** The pads from left to right for a hand. */
export function padOrder(hand: Hand): Finger[] {
  return hand === 'left' ? [4, 3, 2, 1] : [1, 2, 3, 4];
}

/** The fingers to hit, one per click. Random never asks for the same finger twice in a row:
 *  lifting and putting down the same finger is not what the exercise trains. */
export function sequence(pattern: Pattern, length: number, rng: () => number = Math.random): Finger[] {
  if (pattern !== 'random') {
    const cell = [...pattern].map(Number) as Finger[];
    return Array.from({ length }, (_, i) => cell[i % cell.length]);
  }
  const out: Finger[] = [];
  for (let i = 0; i < length; i++) {
    const choices = FINGERS.filter((f) => f !== out[i - 1]);
    out.push(choices[Math.min(choices.length - 1, Math.floor(rng() * choices.length))]);
  }
  return out;
}

export function intervalMs(bpm: number): number {
  return 60000 / clampBpm(bpm);
}

/** How far from the click a tap may land and still be on time: 100 ms, or a quarter of the
 *  gap between clicks when that is shorter (at 240 BPM, 63 ms). */
export function windowMs(bpm: number): number {
  return Math.round(Math.min(100, intervalMs(bpm) / 4));
}

/** good: right finger, on time. off: right finger, too early or late. wrong: another finger.
 *  missed: no tap at all. */
export type Verdict = 'good' | 'off' | 'wrong' | 'missed';

export interface Hit {
  verdict: Verdict;
  /** Tap minus click, in ms: negative is early. Null when missed. */
  offset: number | null;
  /** The finger that tapped. Null when missed. */
  finger: Finger | null;
}

export interface Run {
  /** When target 0 is heard. */
  start: number;
  interval: number;
  window: number;
  seq: Finger[];
  hits: (Hit | null)[];
}

export function newRun(seq: Finger[], start: number, bpm: number): Run {
  return { start, interval: intervalMs(bpm), window: windowMs(bpm), seq, hits: seq.map(() => null) };
}

export function targetTime(run: Run, k: number): number {
  return run.start + k * run.interval;
}

/** Moves the run onto the clock: target `k` is heard at `time`. The audio clock and the page's
 *  clock drift a little apart, so each booked click puts the grid back where it is heard. */
export function anchor(run: Run, k: number, time: number): Run {
  const start = time - k * run.interval;
  return start === run.start ? run : { ...run, start };
}

/** The target a tap at `time` belongs to: the nearest click, within half a gap either side. */
export function targetAt(run: Run, time: number): number | null {
  const k = Math.round((time - run.start) / run.interval) || 0; // no -0
  return k >= 0 && k < run.seq.length ? k : null;
}

/**
 * A tap. The first tap near a click decides it; a second tap near the same click, or one
 * before the first target or after the last, is ignored (null).
 */
export function tap(run: Run, finger: Finger, time: number): { run: Run; index: number; hit: Hit } | null {
  const k = targetAt(run, time);
  if (k === null || run.hits[k]) return null;
  const offset = Math.round(time - targetTime(run, k));
  const verdict: Verdict = finger !== run.seq[k] ? 'wrong' : Math.abs(offset) <= run.window ? 'good' : 'off';
  const hit: Hit = { verdict, offset, finger };
  const hits = run.hits.slice();
  hits[k] = hit;
  return { run: { ...run, hits }, index: k, hit };
}

/** Marks as missed every target whose half-gap after the click has passed untouched. Returns
 *  the indexes it marked, so the screen can flash them. */
export function expire(run: Run, now: number): { run: Run; missed: number[] } {
  const missed: number[] = [];
  let hits = run.hits;
  for (let k = 0; k < run.seq.length; k++) {
    if (hits[k] || now < targetTime(run, k) + run.interval / 2) continue;
    if (hits === run.hits) hits = hits.slice();
    hits[k] = { verdict: 'missed', offset: null, finger: null };
    missed.push(k);
  }
  return { run: missed.length ? { ...run, hits } : run, missed };
}

export function finished(run: Run): boolean {
  return run.hits.every((h) => h !== null);
}

export interface Summary {
  good: number;
  total: number;
  /** good / total, 0–1. */
  accuracy: number;
  /** Mean of the signed offsets of the right-finger taps, rounded: negative means early. */
  lean: number | null;
  /** Mean distance from the click of the right-finger taps, rounded. */
  spread: number | null;
  wrong: number;
  missed: number;
}

export function summarize(run: Run): Summary {
  const hits = run.hits.filter((h): h is Hit => h !== null);
  const timed = hits.filter((h) => (h.verdict === 'good' || h.verdict === 'off') && h.offset !== null).map((h) => h.offset as number);
  const good = hits.filter((h) => h.verdict === 'good').length;
  const mean = (xs: number[]) => (xs.length ? Math.round(xs.reduce((a, b) => a + b, 0) / xs.length) : null);
  return {
    good,
    total: run.seq.length,
    accuracy: run.seq.length ? good / run.seq.length : 0,
    lean: mean(timed),
    spread: mean(timed.map(Math.abs)),
    wrong: hits.filter((h) => h.verdict === 'wrong').length,
    missed: hits.filter((h) => h.verdict === 'missed').length,
  };
}

/** A run counts as clean at 90% on time or better. */
export const CLEAN = 0.9;

/** The record kept per pattern and length: the fastest clean run. */
export interface FingerBest {
  bpm: number;
  accuracy: number;
  spread: number;
}

export function bestKeyOf(s: Pick<FingerSettings, 'pattern' | 'length'>): string {
  return `${s.pattern}:${s.length}`;
}

/** Whether a run beats the record: clean, then faster, then more on time, then tighter. */
export function beats(bpm: number, summary: Summary, best: FingerBest | undefined): boolean {
  if (summary.accuracy < CLEAN) return false;
  if (!best) return true;
  if (bpm !== best.bpm) return bpm > best.bpm;
  if (summary.accuracy !== best.accuracy) return summary.accuracy > best.accuracy;
  return (summary.spread ?? Infinity) < best.spread;
}

export function decodeFingers(raw: string | null): FingerSettings {
  if (!raw) return DEFAULT_FINGERS;
  try {
    const v = JSON.parse(raw) as Partial<FingerSettings>;
    return {
      bpm: typeof v.bpm === 'number' ? clampBpm(v.bpm) : DEFAULT_FINGERS.bpm,
      pattern: PATTERNS.includes(v.pattern as Pattern) ? (v.pattern as Pattern) : DEFAULT_FINGERS.pattern,
      length: LENGTHS.includes(v.length as Length) ? (v.length as Length) : DEFAULT_FINGERS.length,
      hand: v.hand === 'right' ? 'right' : 'left',
    };
  } catch {
    return DEFAULT_FINGERS;
  }
}

export function encodeFingers(s: FingerSettings): string {
  return JSON.stringify({ bpm: clampBpm(s.bpm), pattern: s.pattern, length: s.length, hand: s.hand });
}

export function decodeFingerBests(raw: string | null): Record<string, FingerBest> {
  if (!raw) return {};
  try {
    const v = JSON.parse(raw) as Record<string, Partial<FingerBest>>;
    const out: Record<string, FingerBest> = {};
    for (const [key, b] of Object.entries(v ?? {})) {
      const [pattern, length] = key.split(':');
      if (!PATTERNS.includes(pattern as Pattern) || !LENGTHS.includes(Number(length) as Length)) continue;
      if (typeof b?.bpm !== 'number' || b.bpm < BPM_MIN || b.bpm > BPM_MAX) continue;
      if (typeof b.accuracy !== 'number' || typeof b.spread !== 'number') continue;
      out[key] = { bpm: b.bpm, accuracy: b.accuracy, spread: b.spread };
    }
    return out;
  } catch {
    return {};
  }
}
