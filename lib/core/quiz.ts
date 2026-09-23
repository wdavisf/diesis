/**
 * Question generation for the note modes. Pure TypeScript.
 */
import {
  isNatural,
  pitchClassAt,
  positionsInRange,
  samePosition,
  type PitchClass,
  type Position,
} from './notes';

export interface QuizSettings {
  readonly minFret: number;
  readonly maxFret: number;
  /** Strings to draw from, 1 (high E) to 6 (low E). */
  readonly strings: readonly number[];
  /** When true only C D E F G A B positions are asked. */
  readonly naturalsOnly: boolean;
}

export const DEFAULT_SETTINGS: QuizSettings = {
  minFret: 0,
  maxFret: 12,
  strings: [1, 2, 3, 4, 5, 6],
  naturalsOnly: false,
};

export interface Question {
  readonly position: Position;
  readonly answer: PitchClass;
}

export type Rng = () => number;

/** All positions the settings allow. */
export function candidatePositions(settings: QuizSettings): Position[] {
  return positionsInRange(settings.minFret, settings.maxFret, settings.strings).filter(
    (p) => !settings.naturalsOnly || isNatural(pitchClassAt(p)),
  );
}

/**
 * Picks the next question. Never repeats the previous position when more than one candidate
 * exists. Throws when the settings allow no position at all.
 */
export function nextQuestion(
  settings: QuizSettings,
  previous: Position | null = null,
  rng: Rng = Math.random,
): Question {
  const all = candidatePositions(settings);
  if (all.length === 0) {
    throw new Error('No positions match the quiz settings');
  }
  const pool =
    previous && all.length > 1 ? all.filter((p) => !samePosition(p, previous)) : all;
  const position = pool[Math.floor(rng() * pool.length)];
  return { position, answer: pitchClassAt(position) };
}

export function isCorrect(question: Question, pick: PitchClass): boolean {
  return question.answer === pick;
}
