import { describe, expect, it } from 'vitest';
import {
  BPM_MAX,
  BPM_MIN,
  clampBpm,
  clickAt,
  clicksPerBar,
  decodeMetronome,
  DEFAULT_METRONOME,
  encodeMetronome,
  groupStarts,
  meterOf,
  secondsPerClick,
  tap,
  tempoMarking,
  type MetronomeSettings,
} from '../metronome';

const s = (over: Partial<MetronomeSettings> = {}): MetronomeSettings => ({ ...DEFAULT_METRONOME, ...over });

describe('metronome', () => {
  it('keeps the tempo in range and whole', () => {
    expect(clampBpm(5)).toBe(BPM_MIN);
    expect(clampBpm(999)).toBe(BPM_MAX);
    expect(clampBpm(120.4)).toBe(120);
    expect(clampBpm(Number.NaN)).toBe(DEFAULT_METRONOME.bpm);
  });

  it('times clicks from tempo and subdivision', () => {
    expect(secondsPerClick(s({ bpm: 120 }))).toBeCloseTo(0.5);
    expect(secondsPerClick(s({ bpm: 120, subdivision: 2 }))).toBeCloseTo(0.25);
    expect(secondsPerClick(s({ bpm: 60, subdivision: 3 }))).toBeCloseTo(1 / 3);
  });

  it('plays sextuplets', () => {
    const st = s({ bpm: 60, subdivision: 6 });
    expect(secondsPerClick(st)).toBeCloseTo(1 / 6);
    expect(clickAt(5, st)).toEqual({ beat: 0, sub: 5, kind: 'sub' });
    expect(clickAt(6, st).kind).toBe('beat');
    expect(decodeMetronome(encodeMetronome(st)).subdivision).toBe(6);
  });

  it('counts clicks per bar', () => {
    expect(clicksPerBar(s({ meter: '4/4' }))).toBe(4);
    expect(clicksPerBar(s({ meter: '6/8', subdivision: 2 }))).toBe(12);
  });

  it('accents the first beat and marks subdivisions', () => {
    const st = s({ meter: '4/4', subdivision: 2 });
    expect(clickAt(0, st)).toEqual({ beat: 0, sub: 0, kind: 'accent' });
    expect(clickAt(1, st)).toEqual({ beat: 0, sub: 1, kind: 'sub' });
    expect(clickAt(2, st)).toEqual({ beat: 1, sub: 0, kind: 'beat' });
    expect(clickAt(8, st)).toEqual({ beat: 0, sub: 0, kind: 'accent' });
  });

  it('gives compound and odd meters their group accents', () => {
    expect(groupStarts(meterOf('6/8'))).toEqual([0, 3]);
    expect(groupStarts(meterOf('7/8'))).toEqual([0, 2, 4]);
    expect(clickAt(3, s({ meter: '6/8' })).kind).toBe('group');
    expect(clickAt(4, s({ meter: '7/8' })).kind).toBe('group');
    expect(clickAt(2, s({ meter: '6/8' })).kind).toBe('beat');
  });

  it('makes every beat alike with the accent off', () => {
    const st = s({ meter: '6/8', accent: false });
    expect(clickAt(0, st).kind).toBe('beat');
    expect(clickAt(3, st).kind).toBe('beat');
  });

  it('falls back to 4/4 for an unknown meter', () => {
    expect(meterOf('9/8').id).toBe('4/4');
  });

  it('taps a tempo from the gaps between taps', () => {
    let r = tap([], 1000);
    expect(r.bpm).toBeNull();
    r = tap(r.taps, 1500);
    expect(r.bpm).toBe(120);
    r = tap(r.taps, 2000);
    expect(r.bpm).toBe(120);
  });

  it('starts a new count after a long pause and keeps only recent taps', () => {
    expect(tap([1000], 5000)).toEqual({ taps: [5000], bpm: null });
    let taps: number[] = [];
    for (let t = 0; t <= 5000; t += 500) taps = tap(taps, t).taps;
    expect(taps).toHaveLength(5);
  });

  it('names the tempo the way scores do', () => {
    expect(tempoMarking(50)).toBe('Largo');
    expect(tempoMarking(90)).toBe('Andante');
    expect(tempoMarking(130)).toBe('Allegro');
    expect(tempoMarking(250)).toBe('Prestissimo');
  });

  it('round-trips settings and survives bad storage', () => {
    const st = s({ bpm: 132, meter: '7/8', subdivision: 3, accent: false, mode: 'speed' });
    expect(decodeMetronome(encodeMetronome(st))).toEqual(st);
    expect(decodeMetronome('nonsense')).toEqual(DEFAULT_METRONOME);
    expect(decodeMetronome('{"bpm":1000,"meter":"9/8","subdivision":5}')).toEqual({ ...DEFAULT_METRONOME, bpm: BPM_MAX });
  });
});
