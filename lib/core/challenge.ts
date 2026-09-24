/**
 * Challenges wrap any mode: practice (endless), timed (how many right before the clock runs out)
 * and streak (how many right before the first mistake). Pure TypeScript.
 */

export type Challenge =
  | { readonly kind: 'practice' }
  | { readonly kind: 'timed'; readonly seconds: number }
  | { readonly kind: 'streak' };

export const TIMED_SECONDS = [60, 120, 300] as const;

export const PRACTICE: Challenge = { kind: 'practice' };

export interface Tally {
  readonly right: number;
  readonly wrong: number;
  /** True once the challenge has ended: time is up, or a streak broke. Practice never ends. */
  readonly over: boolean;
}

export const EMPTY_TALLY: Tally = { right: 0, wrong: 0, over: false };

export function tallyRight(t: Tally): Tally {
  return t.over ? t : { ...t, right: t.right + 1 };
}

export function tallyWrong(t: Tally, c: Challenge): Tally {
  if (t.over) return t;
  return { ...t, wrong: t.wrong + 1, over: c.kind === 'streak' };
}

export function tallyTimeUp(t: Tally, c: Challenge): Tally {
  return c.kind === 'timed' ? { ...t, over: true } : t;
}

/** Seconds left on a timed challenge, never below zero. Null for the others. */
export function secondsLeft(c: Challenge, elapsedMs: number): number | null {
  if (c.kind !== 'timed') return null;
  return Math.max(0, Math.ceil(c.seconds - elapsedMs / 1000));
}

/** Storage key for a personal best, per mode and challenge. Practice keeps no best. */
export function bestKey(mode: string, c: Challenge): string | null {
  if (c.kind === 'practice') return null;
  return c.kind === 'timed' ? `${mode}:timed:${c.seconds}` : `${mode}:streak`;
}

/** Round-trips a challenge through a string, for remembering the last one picked. */
export function encodeChallenge(c: Challenge): string {
  return c.kind === 'timed' ? `timed:${c.seconds}` : c.kind;
}

export function decodeChallenge(s: string | null | undefined): Challenge {
  if (s === 'streak') return { kind: 'streak' };
  const m = /^timed:(\d+)$/.exec(s ?? '');
  if (m && (TIMED_SECONDS as readonly number[]).includes(Number(m[1]))) {
    return { kind: 'timed', seconds: Number(m[1]) };
  }
  return PRACTICE;
}

/** "1:05" for 65 seconds. */
export function formatClock(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}
