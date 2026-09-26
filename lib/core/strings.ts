/**
 * Strings and setup, pure. String tension from physics, not from a maker's table (no licensing
 * question): a plain steel string's unit weight is its cross-section times steel's density; a
 * nickel roundwound's is that of a solid steel wire of the same outer gauge times WOUND_FACTOR,
 * which matches published unit weights within a few percent. Tension, in pounds:
 *   T = UW × (2 × L × f)² / 386.4   (UW lb/in, L scale length in inches, f in Hz, g in in/s²)
 * Nylon (classical) strings are not modelled: their tension is on the packet.
 */
import { frequency, type Tuning } from './notes';

/** Steel, lb per cubic inch. */
const STEEL = 0.2836;
/** A roundwound string weighs this fraction of a solid steel wire of the same gauge. */
export const WOUND_FACTOR = 0.84;
const G = 386.4;
export const LB_TO_KG = 0.45359237;

export type Winding = 'plain' | 'wound';

/** Gauges on sale, in thousandths of an inch. Plain up to .026, wound from .017. */
export const PLAIN_GAUGES = [8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 13, 14, 15, 16, 17, 18, 19, 20, 22, 24, 26] as const;
export const WOUND_GAUGES = [
  17, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 39, 40, 42, 44, 46, 48, 49, 52, 54, 56, 59, 60, 62, 64, 66, 68, 70, 72, 74, 80, 85,
] as const;

/** Wound from .021 up, the way every set is made. */
export function windingOf(gauge: number): Winding {
  return gauge >= 21 ? 'wound' : 'plain';
}

/** Unit weight in lb/in for a gauge in thousandths. */
export function unitWeight(gauge: number, winding: Winding = windingOf(gauge)): number {
  const d = gauge / 1000;
  const solid = (Math.PI / 4) * d * d * STEEL;
  return winding === 'wound' ? solid * WOUND_FACTOR : solid;
}

/** Tension in pounds of a string of `gauge` tuned to `midi` on a `scale`-inch neck. */
export function tension(gauge: number, midi: number, scale: number, winding: Winding = windingOf(gauge)): number {
  const v = 2 * scale * frequency(midi);
  return (unitWeight(gauge, winding) * v * v) / G;
}

export type Feel = 'slack' | 'balanced' | 'tight';
/** Below this a string flops and buzzes; above it, it fights the fingers (lb). */
export const SLACK_BELOW = 12;
export const TIGHT_ABOVE = 21;

export function feelOf(lb: number): Feel {
  return lb < SLACK_BELOW ? 'slack' : lb > TIGHT_ABOVE ? 'tight' : 'balanced';
}

/**
 * The gauge whose tension is nearest the target for each string: about 16 lb on the top string
 * rising to 18 lb on the lowest, the balance most electric sets aim for. Plain on the three
 * highest strings when a plain gauge exists near enough; wound below.
 */
export function suggestGauges(tuning: Tuning, scale: number): number[] {
  const n = tuning.length;
  return tuning.map((midi, i) => {
    const target = 16 + (2 * i) / Math.max(n - 1, 1);
    const pool: readonly number[] = i < 3 ? PLAIN_GAUGES.filter((g) => g < 21) : WOUND_GAUGES;
    let best = pool[0];
    for (const g of pool) {
      if (Math.abs(tension(g, midi, scale) - target) < Math.abs(tension(best, midi, scale) - target)) best = g;
    }
    return best;
  });
}

/** Common sets, gauges from string 1 down. Names are generic ("10–46"), not brands. */
export interface StringSet {
  id: string;
  gauges: readonly number[];
}
export const SETS: readonly StringSet[] = [
  { id: '9-42', gauges: [9, 11, 16, 24, 32, 42] },
  { id: '10-46', gauges: [10, 13, 17, 26, 36, 46] },
  { id: '10-52', gauges: [10, 13, 17, 30, 42, 52] },
  { id: '11-49', gauges: [11, 14, 18, 28, 38, 49] },
  { id: '11-56', gauges: [11, 14, 18, 30, 44, 56] },
  { id: '12-56', gauges: [12, 16, 20, 32, 42, 56] },
  { id: '9-54', gauges: [9, 11, 16, 24, 32, 42, 54] },
  { id: '10-59', gauges: [10, 13, 17, 26, 36, 46, 59] },
  { id: '10-64', gauges: [10, 13, 17, 26, 36, 46, 64] },
  { id: '9-65', gauges: [9, 11, 16, 24, 32, 42, 54, 65] },
  { id: '10-74', gauges: [10, 13, 17, 26, 36, 46, 59, 74] },
];

export function setsFor(strings: number): StringSet[] {
  return SETS.filter((s) => s.gauges.length === strings);
}

/** Setup starting points in millimetres (action measured at the 12th fret, top of fret to
 *  bottom of string). Typical published factory numbers, rounded; everything is to taste. */
export interface Setup {
  actionBass: number;
  actionTreble: number;
  /** Neck relief, at the 7th–8th fret with the string fretted at 1 and at the last fret. */
  relief: number;
  /** Fretboard radius in inches, null for flat (classical). */
  radius: number | null;
  /** Pickup height, bass and treble side, fretted at the last fret; null when there are none. */
  pickupBass: number | null;
  pickupTreble: number | null;
}

/** Guitar types with their usual scale length (inches) and setup. Names are descriptive only;
 *  display names in lib/i18n.ts under `strings.types`. */
export interface GuitarType {
  id: string;
  scale: number;
  strings: 6 | 7 | 8;
  nylon?: boolean;
  setup: Setup;
}
export const GUITAR_TYPES: readonly GuitarType[] = [
  { id: 'strat', scale: 25.5, strings: 6, setup: { actionBass: 2.0, actionTreble: 1.6, relief: 0.25, radius: 9.5, pickupBass: 3.2, pickupTreble: 2.4 } },
  { id: 'tele', scale: 25.5, strings: 6, setup: { actionBass: 2.0, actionTreble: 1.6, relief: 0.25, radius: 9.5, pickupBass: 2.4, pickupTreble: 1.6 } },
  { id: 'lesPaul', scale: 24.75, strings: 6, setup: { actionBass: 2.0, actionTreble: 1.6, relief: 0.3, radius: 12, pickupBass: 2.4, pickupTreble: 1.6 } },
  { id: 'prs', scale: 25, strings: 6, setup: { actionBass: 1.8, actionTreble: 1.6, relief: 0.25, radius: 10, pickupBass: 2.4, pickupTreble: 1.6 } },
  { id: 'superstrat', scale: 25.5, strings: 6, setup: { actionBass: 1.8, actionTreble: 1.5, relief: 0.2, radius: 15.75, pickupBass: 2.4, pickupTreble: 1.6 } },
  { id: 'baritone', scale: 27, strings: 6, setup: { actionBass: 2.2, actionTreble: 1.8, relief: 0.3, radius: 12, pickupBass: 2.4, pickupTreble: 1.6 } },
  { id: 'seven', scale: 25.5, strings: 7, setup: { actionBass: 2.0, actionTreble: 1.6, relief: 0.25, radius: 15.75, pickupBass: 2.4, pickupTreble: 1.6 } },
  { id: 'sevenLong', scale: 26.5, strings: 7, setup: { actionBass: 2.0, actionTreble: 1.6, relief: 0.25, radius: 15.75, pickupBass: 2.4, pickupTreble: 1.6 } },
  { id: 'eight', scale: 27, strings: 8, setup: { actionBass: 2.2, actionTreble: 1.6, relief: 0.3, radius: 17, pickupBass: 2.4, pickupTreble: 1.6 } },
  { id: 'acoustic', scale: 25.4, strings: 6, setup: { actionBass: 2.4, actionTreble: 1.8, relief: 0.2, radius: 16, pickupBass: null, pickupTreble: null } },
  { id: 'classical', scale: 25.6, strings: 6, nylon: true, setup: { actionBass: 4.0, actionTreble: 3.0, relief: 0.2, radius: null, pickupBass: null, pickupTreble: null } },
];

export function guitarType(id: string | null | undefined): GuitarType {
  return GUITAR_TYPES.find((t) => t.id === id) ?? GUITAR_TYPES[0];
}

/** What the strings page keeps (localStorage `diesis_strings`). Gauges are per string count so
 *  switching the profile between 6 and 7 strings does not lose a set. */
export interface StringsSettings {
  type: string;
  /** Scale length in inches, 22–30. */
  scale: number;
  gauges: Record<string, number[]>;
}

export const SCALE_MIN = 22;
export const SCALE_MAX = 30;

export const DEFAULT_STRINGS: StringsSettings = { type: 'strat', scale: 25.5, gauges: {} };

const isGauge = (g: unknown): g is number => typeof g === 'number' && g >= 6 && g <= 100;

export function decodeStrings(raw: string | null): StringsSettings {
  if (!raw) return DEFAULT_STRINGS;
  try {
    const v = JSON.parse(raw) as Partial<StringsSettings>;
    const gauges: Record<string, number[]> = {};
    if (v.gauges && typeof v.gauges === 'object') {
      for (const [k, list] of Object.entries(v.gauges)) {
        if (['6', '7', '8'].includes(k) && Array.isArray(list) && list.length === Number(k) && list.every(isGauge)) gauges[k] = list;
      }
    }
    return {
      type: GUITAR_TYPES.some((t) => t.id === v.type) ? (v.type as string) : DEFAULT_STRINGS.type,
      scale: typeof v.scale === 'number' && v.scale >= SCALE_MIN && v.scale <= SCALE_MAX ? v.scale : DEFAULT_STRINGS.scale,
      gauges,
    };
  } catch {
    return DEFAULT_STRINGS;
  }
}

/** The set a string count starts on: 10–46, 10–59 or 10–74. */
export const DEFAULT_SET: Record<number, string> = { 6: '10-46', 7: '10-59', 8: '10-74' };

/** The gauges in use for a string count: the stored ones, else the usual set for it. */
export function gaugesFor(settings: StringsSettings, strings: number): number[] {
  const stored = settings.gauges[String(strings)];
  if (stored) return stored;
  return [...(SETS.find((s) => s.id === DEFAULT_SET[strings])?.gauges ?? suggestGauges(Array(strings).fill(40), 25.5))];
}

export const mm = (inches: number) => inches * 25.4;
export const inches = (mm: number) => mm / 25.4;
