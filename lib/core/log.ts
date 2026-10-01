/**
 * The practice log, pure: one optional goal with a date, and what the player wrote on each day.
 * A day is a calendar day as `YYYY-MM-DD`, the player's local date: no times and no time zones,
 * so the arithmetic here runs on UTC dates built from those strings and never slips over a
 * daylight-saving change. Stored by lib/game/use-log.ts; display text in lib/i18n.ts (`log`).
 */

/** A calendar day, `YYYY-MM-DD`. */
export type Day = string;

export interface LogGoal {
  readonly name: string;
  /** The day it should be ready by. */
  readonly date: Day;
}

export interface PracticeLog {
  readonly goal: LogGoal | null;
  /** What was written on each day. A day with nothing written has no key. */
  readonly entries: Readonly<Record<Day, string>>;
}

export const EMPTY_LOG: PracticeLog = { goal: null, entries: {} };

export const GOAL_NAME_MAX = 80;
export const ENTRY_MAX = 4000;

const DAY = /^(\d{4})-(\d{2})-(\d{2})$/;
const MS_PER_DAY = 86_400_000;

const pad = (n: number, width: number) => String(n).padStart(width, '0');

/** The day's UTC midnight in milliseconds, NaN for anything that is not a real date. */
function utc(day: Day): number {
  const m = DAY.exec(day);
  if (!m) return NaN;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const ms = Date.UTC(y, mo - 1, d);
  const back = new Date(ms);
  // Date.UTC rolls 02-30 over into March: only a date that reads back the same is real.
  return back.getUTCFullYear() === y && back.getUTCMonth() === mo - 1 && back.getUTCDate() === d ? ms : NaN;
}

function fromUtc(ms: number): Day {
  const d = new Date(ms);
  return `${pad(d.getUTCFullYear(), 4)}-${pad(d.getUTCMonth() + 1, 2)}-${pad(d.getUTCDate(), 2)}`;
}

export function isDay(x: unknown): x is Day {
  return typeof x === 'string' && !Number.isNaN(utc(x));
}

/** The calendar day a moment falls on where the player is (the Date's own local fields). */
export function localDay(date: Date): Day {
  return `${pad(date.getFullYear(), 4)}-${pad(date.getMonth() + 1, 2)}-${pad(date.getDate(), 2)}`;
}

/** The day as a Date at UTC midnight, for `Intl.DateTimeFormat` with `timeZone: "UTC"`. */
export function dateOf(day: Day): Date {
  return new Date(utc(day));
}

export function addDays(day: Day, n: number): Day {
  return fromUtc(utc(day) + n * MS_PER_DAY);
}

/** Whole days from one day to another: positive when `to` is later. */
export function daysBetween(from: Day, to: Day): number {
  return Math.round((utc(to) - utc(from)) / MS_PER_DAY);
}

/** 0 for Monday … 6 for Sunday: weeks start on Monday, as in ISO 8601 and in Spain. */
export function weekdayOf(day: Day): number {
  return (new Date(utc(day)).getUTCDay() + 6) % 7;
}

/** The Monday of the day's week. */
export function weekStart(day: Day): Day {
  return addDays(day, -weekdayOf(day));
}

/** The seven days of the day's week, Monday first. */
export function weekOf(day: Day): Day[] {
  const monday = weekStart(day);
  return Array.from({ length: 7 }, (_, i) => addDays(monday, i));
}

/** The week's Thursday, which decides the month and year a week is named after and its number. */
export function weekThursday(day: Day): Day {
  return addDays(weekStart(day), 3);
}

/** ISO 8601 week number: week 1 is the one with the year's first Thursday. */
export function isoWeek(day: Day): number {
  const thursday = weekThursday(day);
  const jan1 = `${thursday.slice(0, 4)}-01-01`;
  return Math.floor(daysBetween(jan1, thursday) / 7) + 1;
}

export function hasEntry(log: PracticeLog, day: Day): boolean {
  return (log.entries[day] ?? '').trim().length > 0;
}

/** The log with that day's text set. Blank text removes the day, so it loses its dot. */
export function withEntry(log: PracticeLog, day: Day, text: string): PracticeLog {
  if (!isDay(day)) return log;
  const entries = { ...log.entries };
  if (text.trim()) entries[day] = text.slice(0, ENTRY_MAX);
  else delete entries[day];
  return { ...log, entries };
}

export type GoalError = 'name' | 'date' | 'past';

/** What is wrong with a goal as typed, or null: it needs a name and a date from today on. */
export function goalError(name: string, date: string, today: Day): GoalError | null {
  if (!name.trim()) return 'name';
  if (!isDay(date)) return 'date';
  if (daysBetween(today, date) < 0) return 'past';
  return null;
}

/** The log with its goal set (name trimmed) or, with null, removed. The entries stay. */
export function withGoal(log: PracticeLog, goal: LogGoal | null): PracticeLog {
  if (!goal) return { ...log, goal: null };
  const name = goal.name.trim().slice(0, GOAL_NAME_MAX);
  if (!name || !isDay(goal.date)) return log;
  return { ...log, goal: { name, date: goal.date } };
}

export function encodeLog(log: PracticeLog): string {
  return JSON.stringify(log);
}

/** Reads the stored log, keeping only what is well formed; anything else is an empty log. */
export function decodeLog(raw: string | null): PracticeLog {
  if (!raw) return EMPTY_LOG;
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return EMPTY_LOG;
  }
  if (typeof data !== 'object' || data === null) return EMPTY_LOG;
  const { goal, entries } = data as { goal?: unknown; entries?: unknown };
  let log: PracticeLog = EMPTY_LOG;
  if (typeof entries === 'object' && entries !== null) {
    for (const [day, text] of Object.entries(entries)) {
      if (typeof text === 'string') log = withEntry(log, day, text);
    }
  }
  if (typeof goal === 'object' && goal !== null) {
    const { name, date } = goal as { name?: unknown; date?: unknown };
    if (typeof name === 'string' && typeof date === 'string') log = withGoal(log, { name, date });
  }
  return log;
}
