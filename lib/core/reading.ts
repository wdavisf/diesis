/**
 * Reading music for guitar, pure: where a note sits on the staff, which natural notes a part of
 * the neck gives, and the questions the four reading exercises ask. No React.
 *
 * Guitar music is written an octave above where it sounds, in the treble clef: the open low E
 * (sounding E2) is written as the E under the staff, E3. A staff step is half a line spacing;
 * step 0 is the bottom line (E4), 2 the next line, 8 the top line (F5); odd steps are spaces,
 * and a step below 0 or above 8 on a line needs a ledger line.
 */
import { midiAt, type Position, type Tuning } from './notes';

export type Rng = () => number;

/** Letter index of a natural pitch class: C 0, D 1 … B 6. */
const LETTER_INDEX: Readonly<Record<number, number>> = { 0: 0, 2: 1, 4: 2, 5: 3, 7: 4, 9: 5, 11: 6 };

export function isNaturalMidi(midi: number): boolean {
  return LETTER_INDEX[((midi % 12) + 12) % 12] !== undefined;
}

/** Steps above the bottom line (E4) where a natural note, sounding at `midi`, is written. */
export function staffStep(midi: number): number {
  const written = midi + 12;
  const octave = Math.floor(written / 12) - 1;
  return octave * 7 + LETTER_INDEX[written % 12] - 30;
}

export const BOTTOM_LINE = 0;
export const TOP_LINE = 8;

/** Parts of the neck the reading exercises can ask from, by their highest fret. */
export const READ_ZONES = [3, 7, 12] as const;
export type ReadZone = (typeof READ_ZONES)[number];
export const DEFAULT_ZONE: ReadZone = 3;

export function decodeZone(raw: string | null): ReadZone {
  const n = Number(raw);
  return (READ_ZONES as readonly number[]).includes(n) ? (n as ReadZone) : DEFAULT_ZONE;
}

/** The lowest note asked: the open low E of a six-string. Lower strings are not read from. */
export const LOWEST_READ = 40;

export interface ReadNote {
  /** Sounding pitch. */
  midi: number;
  step: number;
  /** Pitch class, always a natural. */
  pc: number;
}

/** Every natural note the strings give up to `maxFret`, once each, lowest first. */
export function readPool(maxFret: ReadZone | number, tuning: Tuning): ReadNote[] {
  const seen = new Set<number>();
  tuning.forEach((open) => {
    for (let fret = 0; fret <= maxFret; fret++) {
      const midi = open + fret;
      if (midi >= LOWEST_READ && isNaturalMidi(midi)) seen.add(midi);
    }
  });
  return [...seen].sort((a, b) => a - b).map((midi) => ({ midi, step: staffStep(midi), pc: midi % 12 }));
}

/** The steps the staff has to leave room for: from the lowest note to the highest. */
export function poolRange(pool: readonly ReadNote[]): [number, number] {
  return [Math.min(...pool.map((n) => n.step)), Math.max(...pool.map((n) => n.step))];
}

/** One note, never the one just asked while there is another. */
export function nextRead(pool: readonly ReadNote[], previous: ReadNote | null, rng: Rng = Math.random): ReadNote {
  if (pool.length === 0) throw new Error('No notes in this part of the neck');
  const from = previous && pool.length > 1 ? pool.filter((n) => n.midi !== previous.midi) : pool;
  return from[Math.floor(rng() * from.length)];
}

/**
 * A short phrase that moves the way a tune does: mostly by step, sometimes by a third, never
 * the same note twice in a row.
 */
export function phrase(pool: readonly ReadNote[], length: number, rng: Rng = Math.random): ReadNote[] {
  if (pool.length === 0) throw new Error('No notes in this part of the neck');
  let at = Math.floor(rng() * pool.length);
  const out = [pool[at]];
  while (out.length < length) {
    const move = [-2, -1, 1, 2][Math.floor(rng() * 4)];
    let to = at + move;
    if (to < 0 || to >= pool.length) to = at - move;
    if (to < 0 || to >= pool.length || to === at) to = at === 0 ? 1 : at - 1;
    if (pool.length === 1) to = 0;
    at = Math.max(0, Math.min(pool.length - 1, to));
    out.push(pool[at]);
  }
  return out;
}

/** Every place on the neck, up to `maxFret`, that sounds this pitch. Strings count from 1. */
export function positionsOfMidi(midi: number, maxFret: ReadZone | number, tuning: Tuning): Position[] {
  const found: Position[] = [];
  tuning.forEach((open, i) => {
    const fret = midi - open;
    if (fret >= 0 && fret <= maxFret) found.push({ string: i + 1, fret });
  });
  return found;
}

export function isRightPosition(note: ReadNote, position: Position, tuning: Tuning): boolean {
  return midiAt(position, tuning) === note.midi;
}

/** The pace of the scrolling exercise: a note every `gap` ms, each taking `travel` ms to cross. */
export interface Pace {
  gap: number;
  travel: number;
}

export const PACE_START = 2600;
export const PACE_MIN = 1200;
/** The gap shrinks by this share with every right answer. */
const PACE_STEP = 0.04;
const TRAVEL_GAPS = 3.4;

export function paceAfter(rights: number): Pace {
  const gap = Math.max(PACE_MIN, Math.round(PACE_START * Math.pow(1 - PACE_STEP, rights)));
  return { gap, travel: Math.round(gap * TRAVEL_GAPS) };
}
