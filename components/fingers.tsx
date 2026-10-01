"use client";

import { useEffect, useMemo, useRef, type PointerEvent as ReactPointerEvent, type RefObject } from "react";
import { Play, Square, Trophy } from "lucide-react";
import { bestKeyOf, COUNT_IN, drop, LENGTHS, padOrder, PATTERNS, targetTime, type Finger, type Run } from "@/lib/core/fingers";
import { useFingers, type Flash } from "@/lib/game/use-fingers";
import type { Strings } from "@/lib/i18n";
import { GameShell } from "@/components/game-frame";
import { Row } from "@/components/setup-screen";
import { Chip, primary } from "@/components/challenge-card";
import { Stepper } from "@/components/metronome";
import { cn } from "@/lib/utils";

/** Physical keys (KeyboardEvent.code, so a Spanish Ñ is the same key as ;) per hand, left to right. */
const KEYS = { left: ["KeyA", "KeyS", "KeyD", "KeyF"], right: ["KeyJ", "KeyK", "KeyL", "Semicolon"] } as const;

const secondary =
  "rounded-xl border border-line px-5 py-2.5 text-base text-ink outline-none transition-colors hover:bg-surface focus-visible:ring-3 focus-visible:ring-ring/50";

const fill = (s: string, v: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (_, k: string) => String(v[k] ?? ""));

/** An event's time on the page's clock. Event timestamps are performance.now() time in current
 *  browsers; an old one that is not falls back to now. */
function eventTime(stamp: number): number {
  const now = performance.now();
  return Math.abs(stamp - now) < 1000 ? stamp : now;
}

function verdictText(f: Flash, t: Strings["fingers"]): string {
  if (f.verdict === "wrong") return t.verdict.wrong;
  if (f.verdict === "missed") return t.verdict.missed;
  const ms = Math.abs(f.offset ?? 0);
  if (f.verdict === "good") return fill(t.verdict.good, { ms: (f.offset ?? 0) > 0 ? `+${ms}` : f.offset === 0 ? "0" : `−${ms}` });
  return fill((f.offset ?? 0) < 0 ? t.verdict.early : t.verdict.late, { ms });
}

function Pad({
  finger,
  name,
  keyLabel,
  flash,
  onPress,
  padRef,
  glowRef,
  t,
}: {
  finger: Finger;
  name: string;
  keyLabel: string;
  flash: Flash | undefined;
  onPress: (finger: Finger, time: number) => void;
  padRef: (el: HTMLButtonElement | null) => void;
  glowRef: (el: HTMLSpanElement | null) => void;
  t: Strings["fingers"];
}) {
  const good = flash?.verdict === "good";
  const bad = flash && !good;
  return (
    <button
      ref={padRef}
      type="button"
      aria-label={`${finger}, ${name}`}
      onPointerDown={(e: ReactPointerEvent<HTMLButtonElement>) => {
        e.preventDefault();
        onPress(finger, eventTime(e.timeStamp));
      }}
      onContextMenu={(e) => e.preventDefault()}
      className={cn(
        "relative flex min-h-28 flex-1 touch-none flex-col items-center justify-center gap-0.5 rounded-2xl pb-4 sm:pb-0 border-2 border-line bg-surface text-ink outline-none select-none [-webkit-touch-callout:none] transition-[border-color,transform] duration-75 active:scale-[0.97] motion-reduce:active:scale-100 sm:min-h-44 sm:gap-1",
        good && "border-correct",
        bad && "border-wrong",
      )}
    >
      {/* Lit by the lane as the note reaches this pad: the moment to hit it. */}
      <span ref={glowRef} aria-hidden className="pointer-events-none absolute inset-0 rounded-[calc(1rem_-_2px)] bg-amber/20 opacity-0 ring-2 ring-amber ring-inset" />
      <span className="font-display text-3xl font-semibold sm:text-5xl">{finger}</span>
      <span className="text-xs text-dim">{name}</span>
      <span className="hidden text-xs font-medium text-dim/70 pointer-fine:block">{keyLabel}</span>
      {flash ? (
        <span
          key={flash.id}
          className={cn(
            "absolute inset-x-1 bottom-1 rounded-md px-1 py-0.5 text-center text-[11px] leading-tight font-semibold animate-in fade-in zoom-in-95 duration-100 motion-reduce:animate-none sm:bottom-2 sm:text-xs",
            good ? "bg-correct text-stage" : "bg-wrong text-white",
          )}
        >
          {verdictText(flash, t)}
        </span>
      ) : null}
    </button>
  );
}

/** How long a note stays on screen after it is hit or missed, bursting and fading. */
const POP_MS = 320;

/**
 * The lane: one note per target, falling down its finger's column and reaching the pad exactly
 * as the click is heard, the way notes come down the highway in a rhythm game. Drawn straight
 * to the DOM on every animation frame from the run as it stands (no React render per frame):
 * a note's place is `drop()` from lib/core/fingers.ts, so it is always where the clock says,
 * however the frames fall. A hit note freezes where it was tapped and bursts green or red; a
 * missed one falls on through the pad and fades red. The pad glows as its note arrives.
 */
function Lane({
  seq,
  order,
  getRun,
  stage,
  pads,
  glows,
}: {
  seq: Finger[];
  order: Finger[];
  getRun: () => Run | null;
  stage: RefObject<HTMLDivElement | null>;
  pads: RefObject<(HTMLButtonElement | null)[]>;
  glows: RefObject<(HTMLSpanElement | null)[]>;
}) {
  const notes = useRef<(HTMLDivElement | null)[]>([]);
  const guides = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const stageEl = stage.current;
    if (!stageEl) return;
    // A new run reuses the note elements of the last one: start them clean.
    for (const el of notes.current) {
      if (!el) continue;
      el.dataset.verdict = "none";
      el.style.visibility = "hidden";
    }
    // The column of each finger's pad (by finger number), and the height at which a note meets
    // its pad, in the stage's own coordinates: on a phone the whole shell is drawn turned 90°,
    // so client rects would come back turned, but offsets are measured before the transform.
    const xs = [0, 0, 0, 0, 0];
    let hitY = 0;
    let radius = 0;
    const measure = () => {
      order.forEach((f, i) => {
        const pad = pads.current[i];
        if (!pad) return;
        let left = 0;
        let top = 0;
        for (let el: HTMLElement | null = pad; el && el !== stageEl; el = el.offsetParent as HTMLElement | null) {
          left += el.offsetLeft;
          top += el.offsetTop;
        }
        xs[f] = left + pad.offsetWidth / 2;
        hitY = top + pad.offsetHeight / 2;
        const g = guides.current[i];
        if (g) {
          g.style.left = `${xs[f]}px`;
          g.style.height = `${top}px`;
        }
      });
      radius = (notes.current[0]?.offsetWidth ?? 0) / 2;
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(stageEl);

    const shown: boolean[] = seq.map(() => false);
    const hitAt: (number | null)[] = seq.map(() => null);
    const hide = (k: number) => {
      if (!shown[k]) return;
      shown[k] = false;
      const el = notes.current[k];
      if (el) el.style.visibility = "hidden";
    };
    const show = (k: number) => {
      if (shown[k]) return;
      shown[k] = true;
      const el = notes.current[k];
      if (el) el.style.visibility = "visible";
    };

    let frame = 0;
    const tick = () => {
      frame = requestAnimationFrame(tick);
      const run = getRun();
      const now = performance.now();
      const near = [0, 0, 0, 0, 0];
      if (run) {
        for (let k = 0; k < run.seq.length; k++) {
          const el = notes.current[k];
          if (!el) continue;
          const x = xs[run.seq[k]] - radius;
          const hit = run.hits[k];
          if (hit) {
            if (hitAt[k] === null) {
              hitAt[k] = now;
              el.dataset.verdict = hit.verdict;
            }
            const since = now - (hitAt[k] as number);
            if (since > POP_MS) {
              hide(k);
              continue;
            }
            // A tapped note stays where it was tapped; a missed one keeps falling.
            const p = hit.offset !== null ? 1 + hit.offset / run.lead : drop(run, k, now);
            const f = since / POP_MS;
            el.style.transform = `translate(${x}px, ${hitY * p - radius}px) scale(${1 + 0.6 * f})`;
            el.style.opacity = String(1 - f);
            show(k);
          } else {
            const p = drop(run, k, now);
            if (p < 0 || p > 1.8) {
              hide(k);
              continue;
            }
            el.style.transform = `translate(${x}px, ${hitY * p - radius}px)`;
            el.style.opacity = "1";
            show(k);
            const away = Math.abs(targetTime(run, k) - now);
            near[run.seq[k]] = Math.max(near[run.seq[k]], 1 - away / (run.window * 2));
          }
        }
      } else {
        for (let k = 0; k < seq.length; k++) hide(k);
      }
      order.forEach((f, i) => {
        const g = glows.current[i];
        if (g) g.style.opacity = String(Math.max(0, near[f]));
      });
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
    };
  }, [seq, order, getRun, stage, pads, glows]);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
      {order.map((f, i) => (
        <div
          key={f}
          ref={(el) => {
            guides.current[i] = el;
          }}
          className="absolute top-0 w-px -translate-x-1/2 bg-line/70"
        />
      ))}
      {seq.map((f, k) => (
        <div
          key={k}
          ref={(el) => {
            notes.current[k] = el;
          }}
          data-verdict="none"
          className="invisible absolute top-0 left-0 flex size-11 items-center justify-center rounded-full bg-amber font-display text-xl font-semibold text-stage shadow-[0_0_20px_rgba(224,166,58,0.35)] will-change-transform data-[verdict=good]:bg-correct data-[verdict=missed]:bg-wrong data-[verdict=off]:bg-wrong data-[verdict=wrong]:bg-wrong data-[verdict=missed]:text-white data-[verdict=off]:text-white data-[verdict=wrong]:text-white sm:size-14 sm:text-2xl"
        >
          {f}
        </div>
      ))}
    </div>
  );
}

/**
 * Finger independence (Practice): four pads, one per finger, laid out the way the hand lies on
 * them, and notes falling down each pad's column on a metronome, one per click. A note reaches
 * its pad exactly on the click, and that is when to hit it. A metronome counts in one bar while
 * the first notes are already on their way. Each tap is judged against when that click is
 * heard: green on time (with the milliseconds), red early, late, wrong finger or missed. At the
 * end, how much was on time, the lean ahead of or behind the click, and the fastest clean run
 * (90% or better) kept per order and length.
 */
export function Fingers({ t, tm, tg }: { t: Strings["fingers"]; tm: Strings["metronome"]; tg: Strings["game"] }) {
  const { settings, set, bests, phase, seq, run, getRun, heard, flash, result, start, stop, press, back } = useFingers();
  const best = bests[bestKeyOf(settings)];
  // Stable while the hand is: the lane's animation loop is set up once per run, not per render.
  const order = useMemo(() => padOrder(settings.hand), [settings.hand]);
  const keyLabels = settings.hand === "left" ? ["A", "S", "D", "F"] : ["J", "K", "L", t.semicolonKey];

  const stage = useRef<HTMLDivElement | null>(null);
  const pads = useRef<(HTMLButtonElement | null)[]>([]);
  const glows = useRef<(HTMLSpanElement | null)[]>([]);

  const good = run?.hits.filter((h) => h?.verdict === "good").length ?? 0;
  const done = run?.hits.filter(Boolean).length ?? 0;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.repeat) return;
      if (e.target instanceof HTMLInputElement) return;
      if (e.code === "Space" && !(e.target instanceof HTMLButtonElement && phase !== "running")) {
        e.preventDefault();
        if (phase === "running") stop();
        else void start();
        return;
      }
      if (phase !== "running") return;
      const at = (KEYS[settings.hand] as readonly string[]).indexOf(e.code);
      if (at < 0) return;
      e.preventDefault();
      press(order[at], eventTime(e.timeStamp));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, settings.hand, order, press, start, stop]);

  const status =
    phase === "running" ? (
      <span className="flex items-center gap-3 text-sm tabular-nums">
        <span className="text-correct">{fill(t.onTimeNow, { g: good })}</span>
        <span className="text-dim">{fill(t.progress, { k: done, n: seq.length })}</span>
        <button
          type="button"
          onClick={stop}
          className="inline-flex items-center gap-1.5 rounded-lg border border-line px-2.5 py-1 text-sm text-ink outline-none transition-colors hover:bg-surface focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <Square className="size-3.5" aria-hidden />
          {t.stop}
        </button>
      </span>
    ) : undefined;

  // On a phone the exercise is played sideways, like the other exercises: the pads along the long
  // edge, the notes falling from the far side. The setup screen and the result stay upright.
  return (
    <GameShell t={tg} title={t.title} status={status} sideways={phase === "running"} gate={false}>
      {/* The setup screen scrolls with the page, so its pinned Start sticks to the window (`.cta-pin`). */}
      <div
        className={cn(
          "flex flex-1 flex-col px-4 animate-in fade-in fill-mode-both duration-300 motion-reduce:animate-none",
          phase === "setup" ? "" : "min-h-0 overflow-auto",
          phase === "running" ? "pb-3" : "pb-6",
        )}
      >
        <div className={cn("mx-auto flex w-full max-w-2xl flex-1 flex-col", phase === "running" ? "pt-1" : "justify-center gap-6 py-4")}>
          {phase === "setup" ? (
            <>
              <p className="text-dim">{t.lede}</p>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5 sm:grid sm:grid-cols-[8rem_1fr] sm:items-center sm:gap-3">
                  <span className="text-sm font-medium text-dim">{t.tempo}</span>
                  <div className="flex items-center gap-2">
                    <Stepper value={settings.bpm} onChange={(bpm) => set({ bpm })} label={t.tempo} t={tm} />
                  </div>
                </div>
                <Row label={t.pattern}>
                  <div className="grid w-full grid-cols-3 gap-2 sm:grid-cols-6">
                    {PATTERNS.map((p) => (
                      <Chip key={p} on={settings.pattern === p} onClick={() => set({ pattern: p })}>
                        {p === "random" ? t.random : [...p].join(" ")}
                      </Chip>
                    ))}
                  </div>
                </Row>
                <Row label={t.notes}>
                  {LENGTHS.map((n) => (
                    <Chip key={n} on={settings.length === n} onClick={() => set({ length: n })}>
                      {n}
                    </Chip>
                  ))}
                </Row>
                <Row label={t.hand}>
                  <Chip on={settings.hand === "left"} onClick={() => set({ hand: "left" })}>
                    {t.left}
                  </Chip>
                  <Chip on={settings.hand === "right"} onClick={() => set({ hand: "right" })}>
                    {t.right}
                  </Chip>
                </Row>
              </div>
              <p className="flex items-start gap-2 rounded-xl border border-line p-3 text-sm">
                <Trophy className="mt-0.5 size-4 shrink-0 text-amber" aria-hidden />
                <span className={best ? "" : "text-dim"}>{best ? fill(t.best, { bpm: best.bpm }) : t.noBest}</span>
              </p>
              <p className="text-center text-sm text-dim">{t.tip}</p>
              <div className="cta-pin">
                <button type="button" onClick={() => void start()} className={cn(primary, "inline-flex w-full items-center justify-center gap-2 py-3")}>
                  <Play className="size-5" aria-hidden />
                  {t.start}
                </button>
              </div>
              <p className="hidden text-center text-xs text-dim pointer-fine:block">{settings.hand === "left" ? t.keysLeft : t.keysRight}</p>
            </>
          ) : null}

          {phase === "running" ? (
            <>
              <div ref={stage} className="relative flex min-h-0 flex-1 flex-col">
                {/* The count-in, behind the first notes already on their way. */}
                <div className="flex min-h-24 flex-1 flex-col items-center justify-center gap-1 text-center">
                  {heard < COUNT_IN ? (
                    <>
                      <p className="font-display text-4xl font-semibold text-dim/70 tabular-nums sm:text-5xl" aria-live="polite">
                        {heard < 0 ? t.ready : COUNT_IN - heard}
                      </p>
                      <p className="text-sm text-dim">{t.howTo}</p>
                    </>
                  ) : null}
                </div>
                <div className="flex gap-2 sm:gap-3">
                  {order.map((f, i) => (
                    <Pad
                      key={f}
                      finger={f}
                      name={t.fingerNames[f - 1]}
                      keyLabel={keyLabels[i]}
                      flash={flash[f]}
                      onPress={press}
                      padRef={(el) => {
                        pads.current[i] = el;
                      }}
                      glowRef={(el) => {
                        glows.current[i] = el;
                      }}
                      t={t}
                    />
                  ))}
                </div>
                <Lane seq={seq} order={order} getRun={getRun} stage={stage} pads={pads} glows={glows} />
              </div>
            </>
          ) : null}

          {phase === "done" && result ? (
            <section className="flex flex-col items-center gap-3 rounded-2xl border border-line bg-surface p-6 text-center animate-in fade-in zoom-in-95 duration-300 motion-reduce:animate-none">
              {result.record ? (
                <p className="inline-flex items-center gap-1.5 rounded-full bg-amber/15 px-3 py-1 text-sm font-semibold text-amber-text">
                  <Trophy className="size-4" aria-hidden /> {t.newBest}
                </p>
              ) : null}
              <p className={cn("font-display text-5xl font-semibold tabular-nums", result.summary.accuracy >= 0.9 ? "text-correct" : "text-ink")}>
                {fill(t.result, { p: Math.round(result.summary.accuracy * 100) })}
              </p>
              <p className="text-dim">{fill(t.resultSub, { g: result.summary.good, n: result.summary.total, bpm: result.bpm })}</p>
              <ul className="flex flex-col gap-1 text-sm">
                {result.summary.lean !== null ? (
                  <li>
                    {Math.abs(result.summary.lean) < 10
                      ? t.lean.on
                      : fill(result.summary.lean < 0 ? t.lean.early : t.lean.late, { ms: Math.abs(result.summary.lean) })}
                  </li>
                ) : null}
                {result.summary.spread !== null ? <li className="text-dim">{fill(t.spread, { ms: result.summary.spread })}</li> : null}
                {result.summary.wrong || result.summary.missed ? (
                  <li className="text-dim">{fill(t.mistakes, { w: result.summary.wrong, m: result.summary.missed })}</li>
                ) : null}
              </ul>
              {!result.record ? (
                <p className="text-sm text-dim">{best ? fill(t.best, { bpm: best.bpm }) : t.noBest}</p>
              ) : null}
              <div className="mt-2 flex flex-wrap justify-center gap-3">
                <button type="button" onClick={() => void start()} className={cn(primary, "inline-flex items-center gap-2")}>
                  <Play className="size-5" aria-hidden />
                  {t.again}
                </button>
                <button type="button" onClick={back} className={secondary}>
                  {t.change}
                </button>
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </GameShell>
  );
}
