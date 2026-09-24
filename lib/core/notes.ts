/**
 * Note model and fretboard maths. Pure TypeScript, no React Native imports.
 *
 * Pitch classes are 0..11 with C = 0. Note names default to sharps; a flat spelling is
 * available for settings that ask for it. MIDI numbers follow the usual convention where
 * middle C (C4) is 60, so the open low E of a guitar (E2) is 40.
 */

export type PitchClass = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

export const SHARP_NAMES = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'] as const;
export const FLAT_NAMES = ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'G♭', 'G', 'A♭', 'A', 'B♭', 'B'] as const;

/** The same twelve pitch classes in solfège, sharps as ♯: Do, Do♯, Re… as Spanish players read them. */
export const SOLFEGE_NAMES = ['Do', 'Do♯', 'Re', 'Re♯', 'Mi', 'Fa', 'Fa♯', 'Sol', 'Sol♯', 'La', 'La♯', 'Si'] as const;

/** How note names are written on screen: letters (C D E) or solfège (Do Re Mi). Display only. */
export type NameStyle = 'letters' | 'solfege';

export function namesFor(style: NameStyle): readonly string[] {
  return style === 'solfege' ? SOLFEGE_NAMES : SHARP_NAMES;
}

export const NATURAL_PITCH_CLASSES: readonly PitchClass[] = [0, 2, 4, 5, 7, 9, 11];

export type Spelling = 'sharp' | 'flat';

/** Standard tuning as MIDI numbers, string 1 (high E) first. Index 0 is string 1. */
export const STANDARD_TUNING: readonly number[] = [64, 59, 55, 50, 45, 40];

export const STRING_COUNT = 6;
export const MAX_FRET = 24;

/** A place on the neck. `string` is 1 (high E) to 6 (low E); `fret` is 0 (open) to 24. */
export interface Position {
  readonly string: number;
  readonly fret: number;
}

export function isValidPosition(p: Position, maxFret = MAX_FRET): boolean {
  return (
    Number.isInteger(p.string) &&
    Number.isInteger(p.fret) &&
    p.string >= 1 &&
    p.string <= STRING_COUNT &&
    p.fret >= 0 &&
    p.fret <= maxFret
  );
}

export function midiAt(p: Position, tuning: readonly number[] = STANDARD_TUNING): number {
  return tuning[p.string - 1] + p.fret;
}

export function pitchClassOf(midi: number): PitchClass {
  return (((midi % 12) + 12) % 12) as PitchClass;
}

export function pitchClassAt(p: Position, tuning: readonly number[] = STANDARD_TUNING): PitchClass {
  return pitchClassOf(midiAt(p, tuning));
}

export function noteName(pc: PitchClass, spelling: Spelling = 'sharp'): string {
  return spelling === 'sharp' ? SHARP_NAMES[pc] : FLAT_NAMES[pc];
}

/** Scientific pitch name, e.g. midi 40 -> "E2", midi 61 -> "C♯4". */
export function pitchName(midi: number, spelling: Spelling = 'sharp'): string {
  const octave = Math.floor(midi / 12) - 1;
  return `${noteName(pitchClassOf(midi), spelling)}${octave}`;
}

export function frequency(midi: number, a4 = 440): number {
  return a4 * Math.pow(2, (midi - 69) / 12);
}

export function isNatural(pc: PitchClass): boolean {
  return NATURAL_PITCH_CLASSES.includes(pc);
}

export function samePosition(a: Position, b: Position): boolean {
  return a.string === b.string && a.fret === b.fret;
}

/** Every position on the neck within a fret range, optionally limited to some strings. */
export function positionsInRange(
  minFret: number,
  maxFret: number,
  strings: readonly number[] = [1, 2, 3, 4, 5, 6],
): Position[] {
  const out: Position[] = [];
  for (const string of strings) {
    for (let fret = minFret; fret <= maxFret; fret++) {
      out.push({ string, fret });
    }
  }
  return out;
}
