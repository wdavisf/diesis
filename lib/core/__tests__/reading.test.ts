import { describe, expect, it } from 'vitest';
import { STANDARD_TUNING } from '../notes';
import { decodeZone, isRightPosition, nextRead, paceAfter, PACE_MIN, phrase, poolRange, positionsOfMidi, readPool, staffStep } from '../reading';

const seq = (...values: number[]) => {
  let i = 0;
  return () => values[i++ % values.length];
};

describe('staffStep', () => {
  it('writes guitar music an octave above where it sounds', () => {
    expect(staffStep(40)).toBe(-7); // low open E, written E3, under the staff
    expect(staffStep(52)).toBe(0); // E3 sounding, E4 written: the bottom line
    expect(staffStep(55)).toBe(2); // open third string G: second line
    expect(staffStep(59)).toBe(4); // open second string B: the middle line
    expect(staffStep(64)).toBe(7); // open first string E: the space above the fourth line
  });

  it('puts middle C (sounding C3) one ledger line under the staff', () => {
    expect(staffStep(48)).toBe(-2);
  });
});

describe('readPool', () => {
  it('first position holds the naturals of frets 0 to 3, once each', () => {
    const pool = readPool(3, STANDARD_TUNING);
    const midis = pool.map((n) => n.midi);
    expect(new Set(midis).size).toBe(midis.length);
    expect(midis[0]).toBe(40);
    expect(midis).toContain(67); // G on string 1, fret 3
    expect(pool.every((n) => [0, 2, 4, 5, 7, 9, 11].includes(n.pc))).toBe(true);
    expect(midis).toEqual([...midis].sort((a, b) => a - b));
  });

  it('grows with the zone', () => {
    expect(readPool(12, STANDARD_TUNING).length).toBeGreaterThan(readPool(7, STANDARD_TUNING).length);
    expect(readPool(7, STANDARD_TUNING).length).toBeGreaterThan(readPool(3, STANDARD_TUNING).length);
  });

  it('skips the strings below the low E of a six-string', () => {
    const seven = [64, 59, 55, 50, 45, 40, 35];
    expect(Math.min(...readPool(12, seven).map((n) => n.midi))).toBe(40);
  });

  it('says how much room the staff needs', () => {
    expect(poolRange(readPool(12, STANDARD_TUNING))).toEqual([-7, 14]);
  });
});

describe('questions', () => {
  const pool = readPool(7, STANDARD_TUNING);

  it('never asks the same note twice in a row', () => {
    for (let i = 0; i < 40; i++) expect(nextRead(pool, pool[3]).midi).not.toBe(pool[3].midi);
  });

  it('builds a phrase of the length asked, with no repeated neighbours, inside the pool', () => {
    for (let k = 0; k < 40; k++) {
      const p = phrase(pool, 4);
      expect(p).toHaveLength(4);
      for (let i = 1; i < p.length; i++) expect(p[i].midi).not.toBe(p[i - 1].midi);
      expect(p.every((n) => pool.some((q) => q.midi === n.midi))).toBe(true);
    }
  });

  it('moves in small steps', () => {
    const p = phrase(pool, 4, seq(0.5, 0.9, 0.9, 0.1));
    for (let i = 1; i < p.length; i++) {
      const gap = Math.abs(pool.findIndex((n) => n.midi === p[i].midi) - pool.findIndex((n) => n.midi === p[i - 1].midi));
      expect(gap).toBeLessThanOrEqual(2);
    }
  });
});

describe('positions on the neck', () => {
  it('finds every place of a note and nothing else', () => {
    const places = positionsOfMidi(59, 12, STANDARD_TUNING); // B3: string 2 open, string 3 fret 4, string 4 fret 9
    expect(places).toEqual([
      { string: 2, fret: 0 },
      { string: 3, fret: 4 },
      { string: 4, fret: 9 },
    ]);
    const note = readPool(12, STANDARD_TUNING).find((n) => n.midi === 59)!;
    places.forEach((p) => expect(isRightPosition(note, p, STANDARD_TUNING)).toBe(true));
    expect(isRightPosition(note, { string: 1, fret: 0 }, STANDARD_TUNING)).toBe(false);
  });

  it('respects the zone', () => {
    expect(positionsOfMidi(59, 3, STANDARD_TUNING)).toEqual([{ string: 2, fret: 0 }]);
  });
});

describe('pace and zone', () => {
  it('speeds up with right answers down to a floor', () => {
    expect(paceAfter(0).gap).toBeGreaterThan(paceAfter(10).gap);
    expect(paceAfter(500).gap).toBe(PACE_MIN);
    expect(paceAfter(0).travel).toBeGreaterThan(paceAfter(0).gap);
  });

  it('decodes the stored zone', () => {
    expect(decodeZone('7')).toBe(7);
    expect(decodeZone('9')).toBe(3);
    expect(decodeZone(null)).toBe(3);
  });
});
