/**
 * Personal bests and the achievements they unlock, pure. Bests are stored per exercise, notes
 * setting, string count and challenge (lib/game/use-challenge.ts writes `diesis_best:<key>`);
 * this module builds those keys, reads them back and decides which achievements are earned.
 * Display text lives in lib/i18n.ts under `profile`.
 */
import { bestKey, type Challenge } from './challenge';

export type Exercise = 'name' | 'find';

/**
 * The mode part of a best's key: the exercise, then `naturals` for naturals-only rounds, then
 * `7s`/`8s` for extended-range guitars (a seven-string neck holds more positions, so its scores
 * are kept apart). Six strings add nothing, which keeps the keys written before 0.13.0 valid.
 */
export function modeKey(exercise: Exercise, naturals: boolean, strings: number): string {
  return [exercise, naturals ? 'naturals' : null, strings !== 6 ? `${strings}s` : null].filter(Boolean).join(':');
}

export interface Best {
  exercise: Exercise;
  naturals: boolean;
  strings: number;
  challenge: Challenge;
  value: number;
}

/** Reads one stored best (its key without the `diesis_best:` prefix). Null for anything else. */
export function parseBest(key: string, raw: string | null): Best | null {
  const value = Number(raw);
  if (!Number.isFinite(value) || value <= 0) return null;
  const parts = key.split(':');
  const exercise = parts.shift();
  if (exercise !== 'name' && exercise !== 'find') return null;
  let naturals = false;
  let strings = 6;
  if (parts[0] === 'naturals') {
    naturals = true;
    parts.shift();
  }
  const s = /^(\d)s$/.exec(parts[0] ?? '');
  if (s) {
    strings = Number(s[1]);
    parts.shift();
  }
  let challenge: Challenge;
  if (parts.length === 1 && parts[0] === 'streak') challenge = { kind: 'streak' };
  else if (parts.length === 2 && parts[0] === 'timed' && /^\d+$/.test(parts[1])) challenge = { kind: 'timed', seconds: Number(parts[1]) };
  else return null;
  // Only keys the games could have written.
  if (bestKey(modeKey(exercise, naturals, strings), challenge) !== key) return null;
  return { exercise, naturals, strings, challenge, value };
}

/** Bests in a steady order: exercise, then challenge (clock short to long, then no mistakes). */
export function sortBests(bests: Best[]): Best[] {
  const rank = (b: Best) =>
    (b.exercise === 'name' ? 0 : 1000) + (b.naturals ? 100 : 0) + b.strings * 10 + (b.challenge.kind === 'timed' ? b.challenge.seconds / 60 : 9);
  return [...bests].sort((a, b) => rank(a) - rank(b));
}

export interface Achievement {
  id: string;
  earned: (bests: readonly Best[]) => boolean;
}

const streak = (b: Best) => b.challenge.kind === 'streak';
const timed = (b: Best, seconds: number) => b.challenge.kind === 'timed' && b.challenge.seconds === seconds;

/** In the order they are usually earned. */
export const ACHIEVEMENTS: readonly Achievement[] = [
  { id: 'firstBest', earned: (bs) => bs.length > 0 },
  { id: 'streak10', earned: (bs) => bs.some((b) => streak(b) && b.value >= 10) },
  { id: 'minute20', earned: (bs) => bs.some((b) => b.exercise === 'name' && timed(b, 60) && b.value >= 20) },
  { id: 'allTwelve', earned: (bs) => bs.some((b) => !b.naturals) },
  { id: 'finder', earned: (bs) => bs.some((b) => b.exercise === 'find' && b.challenge.kind === 'timed' && b.value >= 30) },
  { id: 'streak25', earned: (bs) => bs.some((b) => streak(b) && !b.naturals && b.value >= 25) },
  { id: 'minute40', earned: (bs) => bs.some((b) => b.exercise === 'name' && timed(b, 60) && !b.naturals && b.value >= 40) },
  { id: 'extended', earned: (bs) => bs.some((b) => b.strings >= 7) },
  { id: 'streak50', earned: (bs) => bs.some((b) => streak(b) && !b.naturals && b.value >= 50) },
];

export function earnedAchievements(bests: readonly Best[]): Set<string> {
  return new Set(ACHIEVEMENTS.filter((a) => a.earned(bests)).map((a) => a.id));
}
