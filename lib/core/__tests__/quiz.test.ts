import { describe, expect, it } from 'vitest';
import { pitchClassAt } from '../notes';
import { candidatePositions, DEFAULT_SETTINGS, isCorrect, nextQuestion } from '../quiz';

describe('question generator', () => {
  it('stays inside the fret range and string set', () => {
    const settings = { ...DEFAULT_SETTINGS, minFret: 3, maxFret: 5, strings: [2, 4] };
    for (let i = 0; i < 200; i++) {
      const q = nextQuestion(settings);
      expect(q.position.fret).toBeGreaterThanOrEqual(3);
      expect(q.position.fret).toBeLessThanOrEqual(5);
      expect([2, 4]).toContain(q.position.string);
      expect(q.answer).toBe(pitchClassAt(q.position));
    }
  });

  it('asks only naturals when told to', () => {
    const all = candidatePositions({ ...DEFAULT_SETTINGS, naturalsOnly: true });
    expect(all.length).toBeGreaterThan(0);
    expect(all.every((p) => [0, 2, 4, 5, 7, 9, 11].includes(pitchClassAt(p)))).toBe(true);
  });

  it('never repeats the previous position', () => {
    let previous = nextQuestion(DEFAULT_SETTINGS).position;
    for (let i = 0; i < 500; i++) {
      const q = nextQuestion(DEFAULT_SETTINGS, previous);
      expect(q.position).not.toEqual(previous);
      previous = q.position;
    }
  });

  it('is deterministic with a seeded rng', () => {
    const rng = () => 0.5;
    expect(nextQuestion(DEFAULT_SETTINGS, null, rng)).toEqual(
      nextQuestion(DEFAULT_SETTINGS, null, rng),
    );
  });

  it('allows repeating when there is only one candidate', () => {
    const one = { ...DEFAULT_SETTINGS, minFret: 3, maxFret: 3, strings: [1] };
    const q = nextQuestion(one, { string: 1, fret: 3 });
    expect(q.position).toEqual({ string: 1, fret: 3 });
  });

  it('throws when no position matches', () => {
    expect(() => nextQuestion({ ...DEFAULT_SETTINGS, strings: [] })).toThrow();
  });

  it('checks answers', () => {
    const q = { position: { string: 6, fret: 0 }, answer: 4 as const };
    expect(isCorrect(q, 4)).toBe(true);
    expect(isCorrect(q, 5)).toBe(false);
  });
});
