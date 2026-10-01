import { describe, expect, it } from 'vitest';
import {
  addDays,
  daysBetween,
  decodeLog,
  EMPTY_LOG,
  encodeLog,
  ENTRY_MAX,
  GOAL_NAME_MAX,
  goalError,
  hasEntry,
  isDay,
  isoWeek,
  localDay,
  weekdayOf,
  weekOf,
  weekStart,
  weekThursday,
  withEntry,
  withGoal,
} from '../log';

describe('days', () => {
  it('accepts real calendar days only', () => {
    expect(isDay('2026-10-01')).toBe(true);
    expect(isDay('2028-02-29')).toBe(true);
    expect(isDay('2026-02-29')).toBe(false);
    expect(isDay('2026-13-01')).toBe(false);
    expect(isDay('2026-1-1')).toBe(false);
    expect(isDay('yesterday')).toBe(false);
    expect(isDay(20261001)).toBe(false);
  });

  it('reads the local day of a moment', () => {
    expect(localDay(new Date(2026, 9, 1, 23, 59))).toBe('2026-10-01');
    expect(localDay(new Date(2026, 0, 5, 0, 0))).toBe('2026-01-05');
  });

  it('adds days across months, years and clock changes', () => {
    expect(addDays('2026-09-30', 1)).toBe('2026-10-01');
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28');
    // Spain puts the clocks back on 25 October 2026: still seven days.
    expect(addDays('2026-10-22', 7)).toBe('2026-10-29');
  });

  it('counts the days between two days', () => {
    expect(daysBetween('2026-10-01', '2026-10-15')).toBe(14);
    expect(daysBetween('2026-10-15', '2026-10-01')).toBe(-14);
    expect(daysBetween('2026-10-01', '2026-10-01')).toBe(0);
    expect(daysBetween('2026-10-20', '2026-10-30')).toBe(10);
  });
});

describe('weeks', () => {
  it('start on Monday', () => {
    expect(weekdayOf('2026-10-01')).toBe(3); // a Thursday
    expect(weekdayOf('2026-09-28')).toBe(0);
    expect(weekdayOf('2026-10-04')).toBe(6);
    expect(weekStart('2026-10-01')).toBe('2026-09-28');
    expect(weekStart('2026-10-04')).toBe('2026-09-28');
    expect(weekStart('2026-09-28')).toBe('2026-09-28');
  });

  it('list their seven days', () => {
    expect(weekOf('2026-10-01')).toEqual(['2026-09-28', '2026-09-29', '2026-09-30', '2026-10-01', '2026-10-02', '2026-10-03', '2026-10-04']);
  });

  it('are named after their Thursday', () => {
    // 28 Sep – 4 Oct 2026 is a week of October.
    expect(weekThursday('2026-09-28')).toBe('2026-10-01');
  });

  it('are numbered as in ISO 8601', () => {
    expect(isoWeek('2026-10-01')).toBe(40);
    expect(isoWeek('2026-09-28')).toBe(40);
    expect(isoWeek('2026-01-01')).toBe(1);
    expect(isoWeek('2026-12-31')).toBe(53);
    expect(isoWeek('2027-01-03')).toBe(53); // still the last week of 2026
    expect(isoWeek('2027-01-04')).toBe(1);
    expect(isoWeek('2024-12-30')).toBe(1); // already the first week of 2025
  });
});

describe('entries', () => {
  it('keeps what was written on a day', () => {
    const log = withEntry(EMPTY_LOG, '2026-10-01', 'Bars 1 to 8 at 104.');
    expect(log.entries['2026-10-01']).toBe('Bars 1 to 8 at 104.');
    expect(hasEntry(log, '2026-10-01')).toBe(true);
    expect(hasEntry(log, '2026-10-02')).toBe(false);
  });

  it('drops a day when its text is blank', () => {
    const log = withEntry(withEntry(EMPTY_LOG, '2026-10-01', 'x'), '2026-10-01', '  \n ');
    expect(log.entries).toEqual({});
  });

  it('keeps spaces while typing and caps the length', () => {
    expect(withEntry(EMPTY_LOG, '2026-10-01', 'Bars ').entries['2026-10-01']).toBe('Bars ');
    expect(withEntry(EMPTY_LOG, '2026-10-01', 'a'.repeat(ENTRY_MAX + 50)).entries['2026-10-01']).toHaveLength(ENTRY_MAX);
  });

  it('ignores a day that is not one', () => {
    expect(withEntry(EMPTY_LOG, 'today', 'x')).toBe(EMPTY_LOG);
  });
});

describe('the goal', () => {
  it('needs a name and a date from today on', () => {
    expect(goalError('', '2026-10-15', '2026-10-01')).toBe('name');
    expect(goalError('   ', '2026-10-15', '2026-10-01')).toBe('name');
    expect(goalError('The solo', '', '2026-10-01')).toBe('date');
    expect(goalError('The solo', '2026-09-30', '2026-10-01')).toBe('past');
    expect(goalError('The solo', '2026-10-01', '2026-10-01')).toBeNull();
    expect(goalError('The solo', '2026-10-15', '2026-10-01')).toBeNull();
  });

  it('is set trimmed, and removed with null, leaving the entries', () => {
    const written = withEntry(EMPTY_LOG, '2026-10-01', 'x');
    const log = withGoal(written, { name: '  The solo for the gig ', date: '2026-10-15' });
    expect(log.goal).toEqual({ name: 'The solo for the gig', date: '2026-10-15' });
    expect(withGoal(log, { name: 'a'.repeat(200), date: '2026-10-15' }).goal?.name).toHaveLength(GOAL_NAME_MAX);
    expect(withGoal(log, { name: '', date: '2026-10-15' })).toBe(log);
    expect(withGoal(log, { name: 'x', date: 'soon' })).toBe(log);
    const cleared = withGoal(log, null);
    expect(cleared.goal).toBeNull();
    expect(cleared.entries).toEqual(written.entries);
  });
});

describe('storage', () => {
  it('round-trips', () => {
    const log = withGoal(withEntry(EMPTY_LOG, '2026-10-01', 'Bars 1 to 8.'), { name: 'The solo', date: '2026-10-15' });
    expect(decodeLog(encodeLog(log))).toEqual(log);
  });

  it('reads anything else as an empty log', () => {
    expect(decodeLog(null)).toBe(EMPTY_LOG);
    expect(decodeLog('')).toBe(EMPTY_LOG);
    expect(decodeLog('{nope')).toBe(EMPTY_LOG);
    expect(decodeLog('42')).toBe(EMPTY_LOG);
    expect(decodeLog('null')).toBe(EMPTY_LOG);
  });

  it('keeps only what is well formed', () => {
    const raw = JSON.stringify({ goal: { name: 'x', date: 'never' }, entries: { '2026-10-01': 'kept', 'not-a-day': 'lost', '2026-10-02': 7, '2026-10-03': '  ' } });
    expect(decodeLog(raw)).toEqual({ goal: null, entries: { '2026-10-01': 'kept' } });
  });
});
