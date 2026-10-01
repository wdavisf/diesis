import { describe, expect, it } from 'vitest';
import { STANDARD_TUNING, frequency } from '../notes';
import { centsBetween, clampA4, detectPitch, median, readString, rmsOf, verdictOf } from '../tuner';

const RATE = 48000;

/** A plucked-string-like block: a fundamental plus decaying harmonics (the second often the loudest in a low string). */
function pluck(hz: number, harmonics = [1, 0.6, 0.35, 0.2], n = 8192): Float32Array {
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    let v = 0;
    harmonics.forEach((a, k) => {
      v += a * Math.sin((2 * Math.PI * hz * (k + 1) * i) / RATE);
    });
    out[i] = v * 0.1;
  }
  return out;
}

describe('detectPitch', () => {
  it('reads every string of a standard guitar within two cents', () => {
    for (const midi of STANDARD_TUNING) {
      const hz = frequency(midi);
      const got = detectPitch(pluck(hz), RATE);
      expect(got, `midi ${midi}`).not.toBeNull();
      expect(Math.abs(centsBetween(got!.hz, hz))).toBeLessThan(2);
    }
  });

  it('reads the low strings of an eight-string and a drop tuning', () => {
    for (const midi of [30, 28, 33]) {
      const hz = frequency(midi);
      const got = detectPitch(pluck(hz), RATE);
      expect(got, `midi ${midi}`).not.toBeNull();
      expect(Math.abs(centsBetween(got!.hz, hz))).toBeLessThan(3);
    }
  });

  it('finds the fundamental when the second harmonic is the louder one', () => {
    const hz = frequency(40);
    const got = detectPitch(pluck(hz, [0.5, 1, 0.4, 0.2]), RATE);
    expect(Math.abs(centsBetween(got!.hz, hz))).toBeLessThan(3);
  });

  it('reads a string that is a little off, in the right direction', () => {
    const target = frequency(59);
    const got = detectPitch(pluck(target * Math.pow(2, 20 / 1200)), RATE)!;
    expect(centsBetween(got.hz, target)).toBeGreaterThan(17);
    expect(centsBetween(got.hz, target)).toBeLessThan(23);
  });

  it('gives nothing for silence', () => {
    expect(detectPitch(new Float32Array(8192), RATE)).toBeNull();
  });

  it('gives nothing for noise', () => {
    const noise = new Float32Array(8192);
    let seed = 7;
    for (let i = 0; i < noise.length; i++) {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      noise[i] = (seed / 0x7fffffff - 0.5) * 0.2;
    }
    expect(detectPitch(noise, RATE)).toBeNull();
  });

  it('works at 44.1 kHz too', () => {
    const hz = frequency(45);
    const n = 8192;
    const block = new Float32Array(n);
    for (let i = 0; i < n; i++) block[i] = 0.1 * (Math.sin((2 * Math.PI * hz * i) / 44100) + 0.5 * Math.sin((4 * Math.PI * hz * i) / 44100));
    const got = detectPitch(block, 44100)!;
    expect(Math.abs(centsBetween(got.hz, hz))).toBeLessThan(2);
  });
});

describe('readString', () => {
  it('picks the closest string of the tuning', () => {
    const r = readString(frequency(50) * Math.pow(2, 10 / 1200), STANDARD_TUNING);
    expect(r.string).toBe(3);
    expect(Math.round(r.cents)).toBe(10);
  });

  it('follows the tuning: a D is the sixth string in drop D', () => {
    const dropD = [64, 59, 55, 50, 45, 38];
    expect(readString(frequency(38), dropD).string).toBe(5);
    expect(readString(frequency(38), STANDARD_TUNING).string).toBe(5);
    expect(Math.round(readString(frequency(38), STANDARD_TUNING).cents)).toBe(-200);
  });

  it('measures against the pinned string only', () => {
    const r = readString(frequency(45), STANDARD_TUNING, 440, 5);
    expect(r.string).toBe(5);
    expect(Math.round(r.cents)).toBe(500);
  });

  it('moves with the reference pitch', () => {
    const r = readString(432, [69], 442);
    expect(r.cents).toBeLessThan(-30);
  });
});

describe('helpers', () => {
  it('calls five cents either way in tune', () => {
    expect(verdictOf(0)).toBe('in');
    expect(verdictOf(-5)).toBe('in');
    expect(verdictOf(-6)).toBe('flat');
    expect(verdictOf(12)).toBe('sharp');
  });

  it('keeps the reference in range and whole', () => {
    expect(clampA4(300)).toBe(415);
    expect(clampA4(500)).toBe(466);
    expect(clampA4(441.6)).toBe(442);
    expect(clampA4(NaN)).toBe(440);
  });

  it('takes the median and the loudness', () => {
    expect(median([5, 100, 6])).toBe(6);
    expect(rmsOf(new Float32Array([1, -1, 1, -1]))).toBe(1);
  });
});
