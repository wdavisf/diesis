import { describe, expect, it } from 'vitest';
import { pitchClassAt, type PitchClass } from '../notes';
import { DEFAULT_SETTINGS, nextFindRound, positionsOf } from '../quiz';

describe('find-the-note rounds', () => {
  it('lists every E in frets 0 to 12', () => {
    const es = positionsOf(4, DEFAULT_SETTINGS);
    // Open and 12th on both E strings, plus one E on each of the four middle strings.
    expect(es).toHaveLength(8);
    expect(es).toContainEqual({ string: 1, fret: 0 });
    expect(es).toContainEqual({ string: 6, fret: 12 });
    expect(es).toContainEqual({ string: 5, fret: 7 });
    expect(es.every((p) => pitchClassAt(p) === 4)).toBe(true);
  });

  it('respects the fret range and strings', () => {
    const settings = { ...DEFAULT_SETTINGS, minFret: 5, maxFret: 9, strings: [3] };
    expect(positionsOf(9, settings)).toEqual([]);
    expect(positionsOf(0, settings)).toEqual([{ string: 3, fret: 5 }]);
  });

  it('gives a round whose positions all sound the target', () => {
    for (let i = 0; i < 100; i++) {
      const r = nextFindRound(DEFAULT_SETTINGS);
      expect(r.positions.length).toBeGreaterThan(0);
      expect(r.positions.every((p) => pitchClassAt(p) === r.target)).toBe(true);
    }
  });

  it('never repeats the previous note', () => {
    let previous: PitchClass = nextFindRound(DEFAULT_SETTINGS).target;
    for (let i = 0; i < 300; i++) {
      const r = nextFindRound(DEFAULT_SETTINGS, previous);
      expect(r.target).not.toBe(previous);
      previous = r.target;
    }
  });

  it('only picks notes the range contains', () => {
    const settings = { ...DEFAULT_SETTINGS, minFret: 1, maxFret: 1, strings: [1] };
    expect(nextFindRound(settings, 5).target).toBe(5);
    expect(() => nextFindRound({ ...DEFAULT_SETTINGS, strings: [] })).toThrow();
  });
});
