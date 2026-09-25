import { describe, expect, it } from 'vitest';
import { ACHIEVEMENTS, earnedAchievements, modeKey, parseBest, sortBests } from '../records';

describe('records', () => {
  it('keeps six-string keys as they were', () => {
    expect(modeKey('name', false, 6)).toBe('name');
    expect(modeKey('find', true, 6)).toBe('find:naturals');
    expect(modeKey('name', true, 7)).toBe('name:naturals:7s');
    expect(modeKey('find', false, 8)).toBe('find:8s');
  });

  it('reads stored bests back', () => {
    expect(parseBest('name:timed:60', '23')).toEqual({ exercise: 'name', naturals: false, strings: 6, challenge: { kind: 'timed', seconds: 60 }, value: 23 });
    expect(parseBest('find:naturals:7s:streak', '12')).toEqual({ exercise: 'find', naturals: true, strings: 7, challenge: { kind: 'streak' }, value: 12 });
  });

  it('ignores anything the games could not have written', () => {
    expect(parseBest('name:timed:60', '0')).toBeNull();
    expect(parseBest('name:timed:60', 'x')).toBeNull();
    expect(parseBest('metronome', '5')).toBeNull();
    expect(parseBest('name:7s:naturals:streak', '5')).toBeNull();
    expect(parseBest('name:6s:streak', '5')).toBeNull();
  });

  it('sorts by exercise, then challenge', () => {
    const bests = ['find:streak', 'name:streak', 'name:timed:300', 'name:timed:60'].map((k) => parseBest(k, '1')!);
    expect(sortBests(bests).map((b) => `${b.exercise}:${b.challenge.kind === 'timed' ? b.challenge.seconds : 's'}`)).toEqual(['name:60', 'name:300', 'name:s', 'find:s']);
  });

  it('earns achievements from bests', () => {
    expect(earnedAchievements([]).size).toBe(0);
    const bests = [parseBest('name:naturals:streak', '12')!, parseBest('name:timed:60', '41')!];
    const earned = earnedAchievements(bests);
    expect([...earned]).toEqual(['firstBest', 'streak10', 'minute20', 'allTwelve', 'minute40']);
    expect(earnedAchievements([parseBest('find:7s:timed:120', '31')!])).toEqual(new Set(['firstBest', 'allTwelve', 'finder', 'extended']));
  });

  it('has unique achievement ids', () => {
    expect(new Set(ACHIEVEMENTS.map((a) => a.id)).size).toBe(ACHIEVEMENTS.length);
  });
});
