import { describe, expect, it } from 'vitest';
import {
  anchor,
  beats,
  decodeFingerBests,
  decodeFingers,
  DEFAULT_FINGERS,
  encodeFingers,
  expire,
  finished,
  newRun,
  padOrder,
  sequence,
  summarize,
  tap,
  targetAt,
  windowMs,
  type Finger,
} from '../fingers';

/** A run at 60 BPM (a click every 1000 ms) whose first target is heard at t = 10 000. */
const run60 = (seq: Finger[] = [1, 2, 3, 4]) => newRun(seq, 10000, 60);

describe('finger independence', () => {
  it('repeats a pattern cell', () => {
    expect(sequence('1324', 6)).toEqual([1, 3, 2, 4, 1, 3]);
    expect(sequence('4321', 4)).toEqual([4, 3, 2, 1]);
  });

  it('never asks for the same finger twice in a row at random', () => {
    let seed = 7;
    const rng = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const seq = sequence('random', 500, rng);
    expect(seq).toHaveLength(500);
    expect(seq.every((f, i) => i === 0 || f !== seq[i - 1])).toBe(true);
    expect(new Set(seq)).toEqual(new Set([1, 2, 3, 4]));
    // An rng at its upper edge still picks a finger.
    expect(sequence('random', 3, () => 0.9999999)).toHaveLength(3);
  });

  it('lays the pads out the way each hand lies', () => {
    expect(padOrder('left')).toEqual([4, 3, 2, 1]);
    expect(padOrder('right')).toEqual([1, 2, 3, 4]);
  });

  it('narrows the on-time window at fast tempos', () => {
    expect(windowMs(60)).toBe(100);
    expect(windowMs(240)).toBe(63);
  });

  it('gives a tap to the nearest click, within half a gap', () => {
    const r = run60();
    expect(targetAt(r, 9400)).toBeNull();
    expect(targetAt(r, 9600)).toBe(0);
    expect(targetAt(r, 10499)).toBe(0);
    expect(targetAt(r, 10501)).toBe(1);
    expect(targetAt(r, 13400)).toBe(3);
    expect(targetAt(r, 13600)).toBeNull();
  });

  it('judges finger and timing', () => {
    let r = run60();
    const a = tap(r, 1, 10040)!;
    expect(a.hit).toEqual({ verdict: 'good', offset: 40, finger: 1 });
    r = a.run;
    const b = tap(r, 2, 10850)!;
    expect(b.index).toBe(1);
    expect(b.hit).toEqual({ verdict: 'off', offset: -150, finger: 2 });
    r = b.run;
    expect(tap(r, 4, 12000)!.hit.verdict).toBe('wrong');
  });

  it('lets the first tap decide a click', () => {
    const first = tap(run60(), 1, 10000)!;
    expect(tap(first.run, 1, 10010)).toBeNull();
  });

  it('marks untouched clicks as missed once their half gap has passed', () => {
    const r = tap(run60(), 1, 10000)!.run;
    const early = expire(r, 11400);
    expect(early.missed).toEqual([]);
    expect(early.run).toBe(r);
    const late = expire(r, 12600);
    expect(late.missed).toEqual([1, 2]);
    expect(late.run.hits[2]).toEqual({ verdict: 'missed', offset: null, finger: null });
    expect(finished(late.run)).toBe(false);
    expect(finished(expire(late.run, 14000).run)).toBe(true);
  });

  it('follows the clock when a click is re-anchored', () => {
    const r = anchor(run60(), 2, 12030);
    expect(r.start).toBe(10030);
    expect(tap(r, 3, 12030)!.hit.offset).toBe(0);
  });

  it('sums a run up', () => {
    let r = run60([1, 2, 3, 4]);
    r = tap(r, 1, 9980)!.run; // good, 20 early
    r = tap(r, 2, 11060)!.run; // good, 60 late
    r = tap(r, 1, 12000)!.run; // wrong finger
    r = expire(r, 14000).run; // last one missed
    expect(summarize(r)).toEqual({ good: 2, total: 4, accuracy: 0.5, lean: 20, spread: 40, wrong: 1, missed: 1 });
  });

  it('keeps the fastest clean run', () => {
    const clean = { good: 30, total: 32, accuracy: 30 / 32, lean: 5, spread: 30, wrong: 1, missed: 1 };
    expect(beats(80, clean, undefined)).toBe(true);
    expect(beats(80, { ...clean, accuracy: 0.8 }, undefined)).toBe(false);
    expect(beats(80, clean, { bpm: 90, accuracy: 0.9, spread: 40 })).toBe(false);
    expect(beats(100, clean, { bpm: 90, accuracy: 1, spread: 10 })).toBe(true);
    expect(beats(90, clean, { bpm: 90, accuracy: 0.9, spread: 10 })).toBe(true);
    expect(beats(90, clean, { bpm: 90, accuracy: 30 / 32, spread: 20 })).toBe(false);
  });

  it('reads settings and records back, dropping anything unexpected', () => {
    const s = { bpm: 96, pattern: '2413', length: 64, hand: 'right' } as const;
    expect(decodeFingers(encodeFingers(s))).toEqual(s);
    expect(decodeFingers('{"bpm":999,"pattern":"9999","length":7}')).toEqual({ ...DEFAULT_FINGERS, bpm: 300 });
    expect(decodeFingers('nope')).toEqual(DEFAULT_FINGERS);
    expect(decodeFingerBests('{"random:32":{"bpm":90,"accuracy":0.95,"spread":22},"x:1":{"bpm":1}}')).toEqual({
      'random:32': { bpm: 90, accuracy: 0.95, spread: 22 },
    });
  });
});
