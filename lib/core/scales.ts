/**
 * Scales, pure: a scale is data (intervals from the root and the name of each degree), so any
 * scale on any root on the whole neck comes from the same few functions. "all" is the chromatic
 * set: every note, no degrees. Display names live in lib/i18n.ts under `neck.scales`, keyed by id.
 */
import { pitchClassAt, type PitchClass, type Position, STRING_COUNT } from './notes';

export interface Scale {
  id: string;
  /** Semitones above the root, ascending, starting at 0. */
  intervals: readonly number[];
  /** Degree names in the order of `intervals` ("1", "♭3", "♯4"…). Empty for "all". */
  degrees: readonly string[];
}

export const SCALES: readonly Scale[] = [
  { id: 'all', intervals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], degrees: [] },
  { id: 'pentaMinor', intervals: [0, 3, 5, 7, 10], degrees: ['1', '♭3', '4', '5', '♭7'] },
  { id: 'pentaMajor', intervals: [0, 2, 4, 7, 9], degrees: ['1', '2', '3', '5', '6'] },
  { id: 'blues', intervals: [0, 3, 5, 6, 7, 10], degrees: ['1', '♭3', '4', '♭5', '5', '♭7'] },
  { id: 'major', intervals: [0, 2, 4, 5, 7, 9, 11], degrees: ['1', '2', '3', '4', '5', '6', '7'] },
  { id: 'minor', intervals: [0, 2, 3, 5, 7, 8, 10], degrees: ['1', '2', '♭3', '4', '5', '♭6', '♭7'] },
  { id: 'harmonicMinor', intervals: [0, 2, 3, 5, 7, 8, 11], degrees: ['1', '2', '♭3', '4', '5', '♭6', '7'] },
  { id: 'melodicMinor', intervals: [0, 2, 3, 5, 7, 9, 11], degrees: ['1', '2', '♭3', '4', '5', '6', '7'] },
  { id: 'dorian', intervals: [0, 2, 3, 5, 7, 9, 10], degrees: ['1', '2', '♭3', '4', '5', '6', '♭7'] },
  { id: 'phrygian', intervals: [0, 1, 3, 5, 7, 8, 10], degrees: ['1', '♭2', '♭3', '4', '5', '♭6', '♭7'] },
  { id: 'lydian', intervals: [0, 2, 4, 6, 7, 9, 11], degrees: ['1', '2', '3', '♯4', '5', '6', '7'] },
  { id: 'mixolydian', intervals: [0, 2, 4, 5, 7, 9, 10], degrees: ['1', '2', '3', '4', '5', '6', '♭7'] },
  { id: 'locrian', intervals: [0, 1, 3, 5, 6, 8, 10], degrees: ['1', '♭2', '♭3', '4', '♭5', '♭6', '♭7'] },
];

export function scaleOf(id: string): Scale {
  return SCALES.find((s) => s.id === id) ?? SCALES[0];
}

/** The pitch classes of a scale on a root, in scale order from the root. */
export function scalePitchClasses(root: PitchClass, scale: Scale): PitchClass[] {
  return scale.intervals.map((i) => ((root + i) % 12) as PitchClass);
}

/** The degree a pitch class is in the scale, or null if it is not in it (or the scale is "all"). */
export function degreeOf(pc: PitchClass, root: PitchClass, scale: Scale): string | null {
  const i = scale.intervals.indexOf((pc - root + 12) % 12);
  return i === -1 ? null : (scale.degrees[i] ?? null);
}

export interface NeckNote {
  position: Position;
  pc: PitchClass;
  root: boolean;
  /** Degree name, null for "all". */
  degree: string | null;
}

/** Every position from `minFret` to `maxFret` on all strings whose note is in the scale. */
export function neckNotes(root: PitchClass, scale: Scale, minFret: number, maxFret: number): NeckNote[] {
  const set = new Set(scalePitchClasses(root, scale));
  const out: NeckNote[] = [];
  for (let string = 1; string <= STRING_COUNT; string++) {
    for (let fret = minFret; fret <= maxFret; fret++) {
      const position = { string, fret };
      const pc = pitchClassAt(position);
      if (!set.has(pc)) continue;
      out.push({ position, pc, root: scale.id !== 'all' && pc === root, degree: degreeOf(pc, root, scale) });
    }
  }
  return out;
}

export type NeckLabels = 'names' | 'degrees';
export const NECK_RANGES = [12, 24] as const;

export interface NeckSettings {
  root: PitchClass;
  scale: string;
  labels: NeckLabels;
  /** Highest fret shown; the neck always starts at the open strings. */
  maxFret: number;
}

/** Opens on every note; the root starts on A, so picking the minor pentatonic lands on the
 *  first scale most players learn. */
export const DEFAULT_NECK: NeckSettings = { root: 9, scale: 'all', labels: 'names', maxFret: 12 };

export function decodeNeck(raw: string | null): NeckSettings {
  if (!raw) return DEFAULT_NECK;
  try {
    const v = JSON.parse(raw) as Partial<NeckSettings>;
    return {
      root: typeof v.root === 'number' && Number.isInteger(v.root) && v.root >= 0 && v.root < 12 ? (v.root as PitchClass) : DEFAULT_NECK.root,
      scale: typeof v.scale === 'string' && SCALES.some((s) => s.id === v.scale) ? v.scale : DEFAULT_NECK.scale,
      labels: v.labels === 'degrees' ? 'degrees' : 'names',
      maxFret: (NECK_RANGES as readonly number[]).includes(v.maxFret as number) ? (v.maxFret as number) : DEFAULT_NECK.maxFret,
    };
  } catch {
    return DEFAULT_NECK;
  }
}

export function encodeNeck(s: NeckSettings): string {
  return JSON.stringify(s);
}
