import { describe, expect, it } from 'vitest';
import {
  barInStep,
  decodeSpeed,
  DEFAULT_SPEED,
  encodeSpeed,
  normalizePlan,
  progress,
  stepsToTarget,
  tempoAtBar,
  type SpeedPlan,
} from '../speed';

const plan = (over: Partial<SpeedPlan> = {}): SpeedPlan => ({ ...DEFAULT_SPEED, ...over });

describe('speed trainer', () => {
  it('climbs a step every few bars', () => {
    const p = plan({ from: 60, to: 80, step: 5, every: 2 });
    expect([0, 1, 2, 3, 4, 5, 6, 7, 8].map((b) => tempoAtBar(p, b))).toEqual([60, 60, 65, 65, 70, 70, 75, 75, 80]);
  });

  it('holds at the target', () => {
    const p = plan({ from: 60, to: 70, step: 5, every: 1 });
    expect([0, 1, 2, 3, 10].map((b) => tempoAtBar(p, b))).toEqual([60, 65, 70, 70, 70]);
  });

  it('never overshoots when the step does not divide the climb', () => {
    const p = plan({ from: 60, to: 72, step: 5, every: 1 });
    expect(stepsToTarget(p)).toBe(3);
    expect([0, 1, 2, 3, 4].map((b) => tempoAtBar(p, b))).toEqual([60, 65, 70, 72, 72]);
  });

  it('starts over after its bars at the target', () => {
    const p = plan({ from: 60, to: 70, step: 5, every: 1, atTarget: 'restart' });
    expect([0, 1, 2, 3, 4, 5].map((b) => tempoAtBar(p, b))).toEqual([60, 65, 70, 60, 65, 70]);
  });

  it('counts bars within a step', () => {
    const p = plan({ every: 4 });
    expect([0, 1, 3, 4].map((b) => barInStep(p, b))).toEqual([1, 2, 4, 1]);
  });

  it('keeps plans sensible', () => {
    expect(normalizePlan(plan({ from: 120, to: 90 }))).toMatchObject({ from: 120, to: 120 });
    expect(normalizePlan(plan({ step: 3, every: 5 }))).toMatchObject({ step: DEFAULT_SPEED.step, every: DEFAULT_SPEED.every });
    expect(tempoAtBar(plan({ from: 100, to: 100 }), 50)).toBe(100);
  });

  it('measures progress toward the target', () => {
    const p = plan({ from: 60, to: 100 });
    expect(progress(p, 60)).toBe(0);
    expect(progress(p, 80)).toBe(0.5);
    expect(progress(p, 100)).toBe(1);
    expect(progress(plan({ from: 90, to: 90 }), 90)).toBe(1);
  });

  it('round-trips and survives bad storage', () => {
    const p = plan({ from: 72, to: 144, step: 2, every: 8, atTarget: 'restart' });
    expect(decodeSpeed(encodeSpeed(p))).toEqual(p);
    expect(decodeSpeed('{')).toEqual(DEFAULT_SPEED);
    expect(decodeSpeed(null)).toEqual(DEFAULT_SPEED);
  });
});
