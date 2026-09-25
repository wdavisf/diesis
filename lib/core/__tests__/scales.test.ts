import { describe, expect, it } from 'vitest';
import { decodeNeck, DEFAULT_NECK, degreeOf, encodeNeck, neckNotes, SCALES, scaleOf, scalePitchClasses } from '../scales';

const A = 9;
const C = 0;

describe('scales', () => {
  it('builds a scale on any root', () => {
    expect(scalePitchClasses(A, scaleOf('pentaMinor'))).toEqual([9, 0, 2, 4, 7]); // A C D E G
    expect(scalePitchClasses(C, scaleOf('major'))).toEqual([0, 2, 4, 5, 7, 9, 11]);
    expect(scalePitchClasses(A, scaleOf('blues'))).toEqual([9, 0, 2, 3, 4, 7]); // A C D D♯ E G
  });

  it('names degrees', () => {
    expect(degreeOf(0, A, scaleOf('pentaMinor'))).toBe('♭3');
    expect(degreeOf(9, A, scaleOf('pentaMinor'))).toBe('1');
    expect(degreeOf(1, A, scaleOf('pentaMinor'))).toBeNull();
    expect(degreeOf(6, C, scaleOf('lydian'))).toBe('♯4');
    expect(degreeOf(6, C, scaleOf('all'))).toBeNull();
  });

  it('keeps every scale well formed', () => {
    for (const s of SCALES) {
      expect(s.intervals[0]).toBe(0);
      expect([...s.intervals].sort((a, b) => a - b)).toEqual(s.intervals);
      if (s.id !== 'all') expect(s.degrees).toHaveLength(s.intervals.length);
    }
  });

  it('lays a scale on the neck', () => {
    const all = neckNotes(A, scaleOf('all'), 0, 12);
    expect(all).toHaveLength(6 * 13);
    expect(all.every((n) => !n.root)).toBe(true);

    const penta = neckNotes(A, scaleOf('pentaMinor'), 0, 12);
    // Five of twelve pitch classes; each string has 13 frets, so 5 or 6 per string.
    expect(penta.length).toBeGreaterThan(25);
    expect(penta.find((n) => n.position.string === 6 && n.position.fret === 5)).toMatchObject({ pc: 9, root: true, degree: '1' });
    expect(penta.find((n) => n.position.string === 6 && n.position.fret === 8)).toMatchObject({ pc: 0, root: false, degree: '♭3' });
    expect(penta.some((n) => n.position.string === 6 && n.position.fret === 6)).toBe(false);
  });

  it('falls back to "all notes" for an unknown scale', () => {
    expect(scaleOf('nope').id).toBe('all');
  });

  it('round-trips neck settings and survives bad storage', () => {
    const s = { root: 4 as const, scale: 'dorian', labels: 'degrees' as const, maxFret: 24 };
    expect(decodeNeck(encodeNeck(s))).toEqual(s);
    expect(decodeNeck('{"root":13,"scale":"x","labels":"y","maxFret":19}')).toEqual(DEFAULT_NECK);
    expect(decodeNeck('not json')).toEqual(DEFAULT_NECK);
  });
});
