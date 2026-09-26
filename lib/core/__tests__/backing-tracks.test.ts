import { describe, expect, it } from 'vitest';
import { BACKING_TRACKS, STYLES, stylesPresent, tracksOf } from '../backing-tracks';
import { SCALES } from '../scales';

describe('backing tracks', () => {
  it('has unique YouTube ids of the right shape', () => {
    const ids = BACKING_TRACKS.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^[A-Za-z0-9_-]{11}$/);
  });

  it('points every track at a real scale (not "all")', () => {
    for (const t of BACKING_TRACKS) {
      expect(SCALES.some((s) => s.id === t.scale.id && s.id !== 'all')).toBe(true);
    }
  });

  it('filters by style and lists only the styles present', () => {
    expect(tracksOf('all')).toHaveLength(BACKING_TRACKS.length);
    expect(tracksOf('blues').every((t) => t.style === 'blues')).toBe(true);
    expect(stylesPresent().every((s) => STYLES.includes(s))).toBe(true);
    expect(stylesPresent([])).toEqual([]);
  });
});
