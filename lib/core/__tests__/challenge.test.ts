import { describe, expect, it } from 'vitest';
import {
  bestKey,
  decodeChallenge,
  EMPTY_TALLY,
  encodeChallenge,
  formatClock,
  PRACTICE,
  secondsLeft,
  tallyRight,
  tallyTimeUp,
  tallyWrong,
  type Challenge,
} from '../challenge';

const timed: Challenge = { kind: 'timed', seconds: 60 };
const streak: Challenge = { kind: 'streak' };

describe('challenges', () => {
  it('practice never ends', () => {
    let t = tallyWrong(tallyRight(EMPTY_TALLY), PRACTICE);
    t = tallyTimeUp(t, PRACTICE);
    expect(t).toEqual({ right: 1, wrong: 1, over: false });
  });

  it('a streak ends on the first mistake and then stops counting', () => {
    let t = tallyRight(tallyRight(EMPTY_TALLY));
    t = tallyWrong(t, streak);
    expect(t).toEqual({ right: 2, wrong: 1, over: true });
    expect(tallyRight(t)).toBe(t);
  });

  it('a timed run survives mistakes and ends when time is up', () => {
    let t = tallyWrong(tallyRight(EMPTY_TALLY), timed);
    expect(t.over).toBe(false);
    t = tallyTimeUp(t, timed);
    expect(t.over).toBe(true);
    expect(tallyRight(t).right).toBe(1);
  });

  it('counts the clock down in whole seconds', () => {
    expect(secondsLeft(timed, 0)).toBe(60);
    expect(secondsLeft(timed, 400)).toBe(60);
    expect(secondsLeft(timed, 59_001)).toBe(1);
    expect(secondsLeft(timed, 70_000)).toBe(0);
    expect(secondsLeft(streak, 1000)).toBeNull();
  });

  it('keeps separate bests per mode and challenge', () => {
    expect(bestKey('name', PRACTICE)).toBeNull();
    expect(bestKey('name', timed)).toBe('name:timed:60');
    expect(bestKey('find', streak)).toBe('find:streak');
  });

  it('round-trips through a string and falls back to practice', () => {
    for (const c of [PRACTICE, timed, streak, { kind: 'timed', seconds: 300 } as Challenge]) {
      expect(decodeChallenge(encodeChallenge(c))).toEqual(c);
    }
    expect(decodeChallenge('timed:7')).toEqual(PRACTICE);
    expect(decodeChallenge(null)).toEqual(PRACTICE);
  });

  it('formats the clock', () => {
    expect(formatClock(65)).toBe('1:05');
    expect(formatClock(0)).toBe('0:00');
  });
});
