import { describe, expect, it } from 'vitest';
import { STANDARD_TUNING, TUNINGS } from '../notes';
import {
  decodeStrings,
  DEFAULT_STRINGS,
  feelOf,
  gaugesFor,
  GUITAR_TYPES,
  SETS,
  setsFor,
  suggestGauges,
  tension,
  unitWeight,
  windingOf,
} from '../strings';

describe('string tension', () => {
  it('matches published tensions for a 10–46 set at 25.5" in standard tuning (within 5%)', () => {
    // Published figures for nickel roundwound 10–46, E standard, 25.5": 16.2 15.4 16.6 18.4 19.5 17.5 lb.
    const published = [16.2, 15.4, 16.6, 18.4, 19.5, 17.5];
    [10, 13, 17, 26, 36, 46].forEach((g, i) => {
      expect(Math.abs(tension(g, STANDARD_TUNING[i], 25.5) / published[i] - 1)).toBeLessThan(0.05);
    });
  });

  it('grows with the square of scale length and frequency', () => {
    const t = tension(10, 64, 25.5);
    expect(tension(10, 76, 25.5) / t).toBeCloseTo(4, 5); // an octave up
    expect(tension(10, 64, 51) / t).toBeCloseTo(4, 5);
  });

  it('winds from .021 and a wound string weighs less than a solid one', () => {
    expect(windingOf(20)).toBe('plain');
    expect(windingOf(22)).toBe('wound');
    expect(unitWeight(26, 'wound')).toBeLessThan(unitWeight(26, 'plain'));
  });

  it('calls the feel', () => {
    expect(feelOf(9)).toBe('slack');
    expect(feelOf(16)).toBe('balanced');
    expect(feelOf(25)).toBe('tight');
  });
});

describe('gauge suggestions', () => {
  it('suggests a balanced set close to 10–46 for standard tuning at 25.5"', () => {
    const g = suggestGauges(STANDARD_TUNING, 25.5);
    expect(g[0]).toBe(10);
    expect(g[5]).toBeGreaterThanOrEqual(44);
    expect(g[5]).toBeLessThanOrEqual(49);
  });

  it('keeps every suggested string balanced, for every tuning the profile offers', () => {
    for (const t of TUNINGS) {
      suggestGauges(t.notes, 25.5).forEach((g, i) => expect(feelOf(tension(g, t.notes[i], 25.5))).toBe('balanced'));
    }
  });

  it('goes heavier for drop A on seven strings than for standard B', () => {
    const b = suggestGauges(TUNINGS.find((t) => t.id === 'standard7')!.notes, 25.5);
    const a = suggestGauges(TUNINGS.find((t) => t.id === 'dropA7')!.notes, 25.5);
    expect(a[6]).toBeGreaterThan(b[6]);
  });
});

describe('sets, types and settings', () => {
  it('has sets for 6, 7 and 8 strings with unique ids, gauges thin to thick', () => {
    expect(new Set(SETS.map((s) => s.id)).size).toBe(SETS.length);
    for (const n of [6, 7, 8]) expect(setsFor(n).length).toBeGreaterThan(0);
    for (const s of SETS) expect([...s.gauges].sort((a, b) => a - b)).toEqual([...s.gauges]);
  });

  it('gives every guitar type a scale length and a setup', () => {
    for (const t of GUITAR_TYPES) {
      expect(t.scale).toBeGreaterThan(22);
      expect(t.setup.actionBass).toBeGreaterThanOrEqual(t.setup.actionTreble);
    }
  });

  it('decodes stored settings defensively', () => {
    expect(decodeStrings(null)).toEqual(DEFAULT_STRINGS);
    expect(decodeStrings('nope')).toEqual(DEFAULT_STRINGS);
    const s = decodeStrings(JSON.stringify({ type: 'lesPaul', scale: 24.75, gauges: { '6': [9, 11, 16, 24, 32, 42], '7': [1] } }));
    expect(s.type).toBe('lesPaul');
    expect(s.gauges['6']).toEqual([9, 11, 16, 24, 32, 42]);
    expect(s.gauges['7']).toBeUndefined();
    expect(decodeStrings(JSON.stringify({ scale: 99 })).scale).toBe(25.5);
  });

  it('falls back to 10–46, 10–59 or 10–74', () => {
    expect(gaugesFor(DEFAULT_STRINGS, 6)).toEqual([10, 13, 17, 26, 36, 46]);
    expect(gaugesFor(DEFAULT_STRINGS, 7)).toHaveLength(7);
    expect(gaugesFor(DEFAULT_STRINGS, 8)).toHaveLength(8);
  });
});
