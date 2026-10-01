/**
 * Tuner rules, pure: finding the pitch in a block of samples, and which string of the guitar's
 * tuning it belongs to and how many cents off it is. No React, no Web Audio.
 */
import { frequency, type Tuning } from './notes';

/** Reference pitch for A4: 415–466 Hz, 440 by default. */
export const A4_DEFAULT = 440;
export const A4_MIN = 415;
export const A4_MAX = 466;
export const A4_PRESETS = [432, 440, 442] as const;

export function clampA4(hz: number): number {
  if (!Number.isFinite(hz)) return A4_DEFAULT;
  return Math.min(A4_MAX, Math.max(A4_MIN, Math.round(hz)));
}

/** Within this many cents counts as in tune (a guitar's own wobble is about this much). */
export const IN_TUNE_CENTS = 5;
/** The dial shows this much either side of the target. */
export const RANGE_CENTS = 50;

/** A reading: the pitch heard, how clear it is (0–1), and how loud. */
export interface Pitch {
  hz: number;
  clarity: number;
}

const LOWEST_HZ = 25;
const HIGHEST_HZ = 1200;
const DECIMATE = 4;
const THRESHOLD = 0.15;

/**
 * Pitch of a mono block by YIN (de Cheveigné and Kawahara, 2002): a coarse search on a copy
 * of the block at a quarter of the rate (cheap), then a fine one around the winner at the full
 * rate, so a phone can run it dozens of times a second and still read within a cent or two.
 * Returns null when nothing in the block repeats clearly enough (silence, noise, a chord).
 */
export function detectPitch(samples: Float32Array, sampleRate: number): Pitch | null {
  const d = DECIMATE;
  const m = Math.floor(samples.length / d);
  if (m < 512) return null;
  const low = new Float32Array(m);
  for (let i = 0; i < m; i++) {
    let sum = 0;
    for (let k = 0; k < d; k++) sum += samples[i * d + k];
    low[i] = sum / d;
  }
  const rateLow = sampleRate / d;
  const w = Math.floor(m / 2);
  const tauMax = Math.min(w - 1, Math.floor(rateLow / LOWEST_HZ));
  const tauMin = Math.max(2, Math.floor(rateLow / HIGHEST_HZ));
  if (tauMax <= tauMin + 2) return null;

  // Cumulative mean normalised difference.
  const cmnd = new Float32Array(tauMax + 1);
  cmnd[0] = 1;
  let running = 0;
  for (let tau = 1; tau <= tauMax; tau++) {
    let sum = 0;
    for (let i = 0; i < w; i++) {
      const delta = low[i] - low[i + tau];
      sum += delta * delta;
    }
    running += sum;
    cmnd[tau] = running === 0 ? 1 : (sum * tau) / running;
  }

  // The first dip below the threshold, followed down to its bottom.
  let tau = -1;
  for (let t = tauMin; t < tauMax; t++) {
    if (cmnd[t] < THRESHOLD) {
      while (t + 1 < tauMax && cmnd[t + 1] < cmnd[t]) t++;
      tau = t;
      break;
    }
  }
  if (tau < 0) return null;
  const clarity = 1 - cmnd[tau];

  // Fine search at the full rate around the coarse answer.
  const wf = Math.floor(samples.length / 2);
  const center = tau * d;
  const from = Math.max(2, center - d - 1);
  const to = Math.min(wf - 1, center + d + 1);
  if (to - from < 3) return null;
  const diff = new Float64Array(to - from + 1);
  for (let t = from; t <= to; t++) {
    let sum = 0;
    for (let i = 0; i < wf; i++) {
      const delta = samples[i] - samples[i + t];
      sum += delta * delta;
    }
    diff[t - from] = sum;
  }
  let best = 1;
  for (let i = 1; i < diff.length - 1; i++) if (diff[i] < diff[best]) best = i;
  if (best <= 0 || best >= diff.length - 1) return null;
  // Parabolic interpolation through the lowest point and its neighbours.
  const a = diff[best - 1];
  const b = diff[best];
  const c = diff[best + 1];
  const denom = a - 2 * b + c;
  const shift = denom === 0 ? 0 : (0.5 * (a - c)) / denom;
  const period = from + best + shift;
  return { hz: sampleRate / period, clarity };
}

/** Cents from a target pitch: positive when the heard note is sharp. */
export function centsBetween(hz: number, target: number): number {
  return 1200 * Math.log2(hz / target);
}

export interface Reading {
  /** Index into the tuning's notes, 0 = string 1 (the highest). */
  string: number;
  cents: number;
  hz: number;
}

/**
 * Which string a pitch belongs to and how far off it is. With `pinned` the pitch is measured
 * against that string and no other; otherwise the closest string of the tuning wins.
 */
export function readString(hz: number, tuning: Tuning, a4 = A4_DEFAULT, pinned: number | null = null): Reading {
  if (pinned !== null && pinned >= 0 && pinned < tuning.length) {
    return { string: pinned, cents: centsBetween(hz, frequency(tuning[pinned], a4)), hz };
  }
  let string = 0;
  let cents = Infinity;
  tuning.forEach((midi, i) => {
    const c = centsBetween(hz, frequency(midi, a4));
    if (Math.abs(c) < Math.abs(cents)) {
      string = i;
      cents = c;
    }
  });
  return { string, cents, hz };
}

export type Verdict = 'in' | 'flat' | 'sharp';

export function verdictOf(cents: number): Verdict {
  if (Math.abs(cents) <= IN_TUNE_CENTS) return 'in';
  return cents < 0 ? 'flat' : 'sharp';
}

/** The median of the last readings: a single wild one (a pluck's first instant) cannot jerk the needle. */
export function median(values: readonly number[]): number {
  const sorted = [...values].sort((x, y) => x - y);
  return sorted[Math.floor(sorted.length / 2)];
}

/** A signal this quiet is room noise, not a string. */
export const GATE_RMS = 0.008;

export function rmsOf(samples: Float32Array): number {
  let sum = 0;
  for (let i = 0; i < samples.length; i++) sum += samples[i] * samples[i];
  return Math.sqrt(sum / samples.length);
}

/** The setting stored for the tuner: the reference pitch only (the tuning is the profile's). */
export function decodeA4(raw: string | null): number {
  if (raw === null) return A4_DEFAULT;
  return clampA4(Number(raw));
}
