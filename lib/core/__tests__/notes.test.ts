import { describe, expect, it } from 'vitest';
import {
  frequency,
  isNatural,
  isValidPosition,
  midiAt,
  noteName,
  pitchClassAt,
  pitchClassOf,
  pitchName,
  positionsInRange,
} from '../notes';

describe('fretboard maths', () => {
  it('maps open strings to E2 A2 D3 G3 B3 E4', () => {
    const open = [6, 5, 4, 3, 2, 1].map((string) => pitchName(midiAt({ string, fret: 0 })));
    expect(open).toEqual(['E2', 'A2', 'D3', 'G3', 'B3', 'E4']);
  });

  it('adds one semitone per fret', () => {
    expect(midiAt({ string: 6, fret: 5 })).toBe(45); // A2, same as open A
    expect(midiAt({ string: 6, fret: 12 })).toBe(52); // E3, octave
    expect(pitchName(midiAt({ string: 1, fret: 12 }))).toBe('E5');
  });

  it('agrees across strings at the classic unison frets', () => {
    expect(midiAt({ string: 6, fret: 5 })).toBe(midiAt({ string: 5, fret: 0 }));
    expect(midiAt({ string: 3, fret: 4 })).toBe(midiAt({ string: 2, fret: 0 }));
    expect(midiAt({ string: 2, fret: 5 })).toBe(midiAt({ string: 1, fret: 0 }));
  });

  it('names pitch classes with sharps by default and flats on request', () => {
    expect(noteName(pitchClassAt({ string: 6, fret: 2 }))).toBe('F♯');
    expect(noteName(pitchClassAt({ string: 6, fret: 2 }), 'flat')).toBe('G♭');
    expect(noteName(pitchClassAt({ string: 2, fret: 1 }))).toBe('C');
  });

  it('wraps pitch classes and handles negative midi', () => {
    expect(pitchClassOf(60)).toBe(0);
    expect(pitchClassOf(71)).toBe(11);
    expect(pitchClassOf(-1)).toBe(11);
  });

  it('knows which pitch classes are natural', () => {
    expect([0, 2, 4, 5, 7, 9, 11].every((pc) => isNatural(pc as never))).toBe(true);
    expect([1, 3, 6, 8, 10].some((pc) => isNatural(pc as never))).toBe(false);
  });

  it('tunes A4 to 440 Hz and low E to about 82.4 Hz', () => {
    expect(frequency(69)).toBe(440);
    expect(frequency(40)).toBeCloseTo(82.41, 2);
  });

  it('validates positions', () => {
    expect(isValidPosition({ string: 1, fret: 0 })).toBe(true);
    expect(isValidPosition({ string: 6, fret: 24 })).toBe(true);
    expect(isValidPosition({ string: 7, fret: 0 })).toBe(false);
    expect(isValidPosition({ string: 1, fret: 25 })).toBe(false);
    expect(isValidPosition({ string: 1, fret: 1.5 })).toBe(false);
  });

  it('enumerates positions in a range', () => {
    expect(positionsInRange(0, 12)).toHaveLength(6 * 13);
    expect(positionsInRange(5, 7, [6])).toEqual([
      { string: 6, fret: 5 },
      { string: 6, fret: 6 },
      { string: 6, fret: 7 },
    ]);
  });
});
