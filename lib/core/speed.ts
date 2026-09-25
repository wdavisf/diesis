/**
 * Speed trainer rules, pure: a plan that starts at one tempo and climbs by a step every few
 * bars up to a target, then holds there or starts over. The metronome engine asks for the tempo
 * of each bar as it books it (lib/audio/metronome-engine.ts, `setPlan`).
 */
import { clampBpm } from "./metronome";

export const SPEED_STEPS = [1, 2, 5, 10] as const;
export const SPEED_EVERY = [1, 2, 4, 8] as const;

export type AtTarget = "hold" | "restart";

export interface SpeedPlan {
  from: number;
  to: number;
  /** BPM added at each step. */
  step: number;
  /** Bars at each tempo before the next step. */
  every: number;
  /** Once at the target: stay there, or drop back to the start and climb again. */
  atTarget: AtTarget;
}

export const DEFAULT_SPEED: SpeedPlan = { from: 60, to: 100, step: 5, every: 4, atTarget: "hold" };

/** A plan that makes sense: tempos in range, target not below the start, step and bars from the
 *  offered choices. */
export function normalizePlan(p: SpeedPlan): SpeedPlan {
  const from = clampBpm(p.from);
  const to = Math.max(from, clampBpm(p.to));
  const step = (SPEED_STEPS as readonly number[]).includes(p.step) ? p.step : DEFAULT_SPEED.step;
  const every = (SPEED_EVERY as readonly number[]).includes(p.every) ? p.every : DEFAULT_SPEED.every;
  return { from, to, step, every, atTarget: p.atTarget === "restart" ? "restart" : "hold" };
}

/** Steps from the start tempo to the target (the last one may be shorter than `step`). */
export function stepsToTarget(p: SpeedPlan): number {
  const n = normalizePlan(p);
  return Math.ceil((n.to - n.from) / n.step);
}

/** Which step (0 = the start tempo) bar `bar` (from 0) is played at. */
export function stepAtBar(p: SpeedPlan, bar: number): number {
  const n = normalizePlan(p);
  const raw = Math.floor(Math.max(0, bar) / n.every);
  const total = stepsToTarget(n);
  // Start over: the target gets its own `every` bars, then back to step 0.
  return n.atTarget === "restart" ? raw % (total + 1) : Math.min(raw, total);
}

export function tempoAtBar(p: SpeedPlan, bar: number): number {
  const n = normalizePlan(p);
  return Math.min(n.to, n.from + n.step * stepAtBar(n, bar));
}

/** Bar within the current step, from 1, for "bar 2 of 4". */
export function barInStep(p: SpeedPlan, bar: number): number {
  return (Math.max(0, bar) % normalizePlan(p).every) + 1;
}

/** How far from the start tempo to the target the given tempo is, 0 to 1. */
export function progress(p: SpeedPlan, bpm: number): number {
  const n = normalizePlan(p);
  if (n.to === n.from) return 1;
  return Math.min(1, Math.max(0, (bpm - n.from) / (n.to - n.from)));
}

export function decodeSpeed(raw: string | null): SpeedPlan {
  if (!raw) return DEFAULT_SPEED;
  try {
    const v = JSON.parse(raw) as Partial<SpeedPlan>;
    const num = (x: unknown, d: number) => (typeof x === "number" && Number.isFinite(x) ? x : d);
    return normalizePlan({
      from: num(v.from, DEFAULT_SPEED.from),
      to: num(v.to, DEFAULT_SPEED.to),
      step: num(v.step, DEFAULT_SPEED.step),
      every: num(v.every, DEFAULT_SPEED.every),
      atTarget: v.atTarget === "restart" ? "restart" : "hold",
    });
  } catch {
    return DEFAULT_SPEED;
  }
}

export function encodeSpeed(p: SpeedPlan): string {
  return JSON.stringify(normalizePlan(p));
}

