"use client";

import { useEffect, type PointerEvent as ReactPointerEvent } from "react";
import { Play, Square, Trophy } from "lucide-react";
import { bestKeyOf, COUNT_IN, LENGTHS, padOrder, PATTERNS, type Finger } from "@/lib/core/fingers";
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
  lit,
  flash,
  onPress,
  t,
}: {
  finger: Finger;
  name: string;
  keyLabel: string;
  lit: boolean;
  flash: Flash | undefined;
  onPress: (finger: Finger, time: number) => void;
  t: Strings["fingers"];
}) {
  const good = flash?.verdict === "good";
  const bad = flash && !good;
  return (
    <button
      type="button"
      aria-label={`${finger}, ${name}`}
      onPointerDown={(e: ReactPointerEvent<HTMLButtonElement>) => {
        e.preventDefault();
        onPress(finger, eventTime(e.timeStamp));
      }}
      onContextMenu={(e) => e.preventDefault()}
      className={cn(
        "relative flex min-h-40 flex-1 touch-none flex-col items-center justify-center gap-1 rounded-2xl border-2 outline-none select-none [-webkit-touch-callout:none] transition-[background-color,border-color,transform] duration-75 active:scale-[0.97] motion-reduce:active:scale-100 sm:min-h-52",
        lit ? "border-amber bg-amber/85 text-stage" : "border-line bg-surface text-ink",
        good && "border-correct",
        bad && "border-wrong",
      )}
    >
      <span className="font-display text-4xl font-semibold sm:text-5xl">{finger}</span>
      <span className={cn("text-xs", lit ? "text-stage/80" : "text-dim")}>{name}</span>
      <span className={cn("hidden text-xs font-medium pointer-fine:block", lit ? "text-stage/70" : "text-dim/70")}>{keyLabel}</span>
      {flash ? (
        <span
          key={flash.id}
          className={cn(
            "absolute inset-x-1 bottom-2 rounded-md px-1 py-0.5 text-center text-[11px] leading-tight font-semibold animate-in fade-in zoom-in-95 duration-100 motion-reduce:animate-none sm:text-xs",
            good ? "bg-correct text-stage" : "bg-wrong text-white",
          )}
        >
          {verdictText(flash, t)}
        </span>
      ) : null}
    </button>
  );
}

/**
 * Finger independence (Practice): four dots, one per finger, laid out the way the hand lies on
 * them. A metronome counts in one bar, then on every click one dot is the one to hit; the lit
 * dot is the one due on the next click, so there is a beat to get ready. Each tap is judged
 * against when that click is heard: green on time (with the milliseconds), red early, late, wrong
 * finger or missed. At the end, how much was on time, the lean ahead of or behind the click, and
 * the fastest clean run (90% or better) kept per order and length.
 */
export function Fingers({ t, tm, tg }: { t: Strings["fingers"]; tm: Strings["metronome"]; tg: Strings["game"] }) {
  const { settings, set, bests, phase, seq, run, heard, flash, result, start, stop, press, back } = useFingers();
  const best = bests[bestKeyOf(settings)];
  const order = padOrder(settings.hand);
  const keyLabels = settings.hand === "left" ? ["A", "S", "D", "F"] : ["J", "K", "L", t.semicolonKey];

  // The target due on the next click, and the progress so far.
  const due = heard - COUNT_IN + 1;
  const lit = phase === "running" && due >= 0 && due < seq.length ? seq[due] : null;
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
      <span className="flex gap-3 text-sm tabular-nums">
        <span className="text-correct">{fill(t.onTimeNow, { g: good })}</span>
        <span className="text-dim">{fill(t.progress, { k: done, n: seq.length })}</span>
      </span>
    ) : undefined;

  return (
    <GameShell t={tg} title={t.title} status={status}>
      <div className="flex min-h-0 flex-1 flex-col overflow-auto px-4 pb-6 animate-in fade-in fill-mode-both duration-300 motion-reduce:animate-none">
        <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center gap-6 py-4">
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
              <button type="button" onClick={() => void start()} className={cn(primary, "inline-flex w-full items-center justify-center gap-2 py-3")}>
                <Play className="size-5" aria-hidden />
                {t.start}
              </button>
              <p className="text-center text-sm text-dim">{t.tip}</p>
              <p className="hidden text-center text-xs text-dim pointer-fine:block">{settings.hand === "left" ? t.keysLeft : t.keysRight}</p>
            </>
          ) : null}

          {phase === "running" ? (
            <>
              <div className="flex min-h-16 flex-col items-center justify-center gap-1 text-center">
                {heard < COUNT_IN - 1 ? (
                  <>
                    <p className="font-display text-4xl font-semibold tabular-nums">{heard < 0 ? t.ready : COUNT_IN - heard}</p>
                    <p className="text-sm text-dim">{t.howTo}</p>
                  </>
                ) : (
                  <p className="text-sm text-dim" aria-live="off">
                    {t.next}:{" "}
                    <span className="font-display text-lg font-semibold tracking-widest text-ink tabular-nums">
                      {seq.slice(due + 1, due + 5).join(" ") || "·"}
                    </span>
                  </p>
                )}
              </div>
              <div className="flex gap-2 sm:gap-3">
                {order.map((f, i) => (
                  <Pad key={f} finger={f} name={t.fingerNames[f - 1]} keyLabel={keyLabels[i]} lit={lit === f} flash={flash[f]} onPress={press} t={t} />
                ))}
              </div>
              <button type="button" onClick={stop} className={cn(secondary, "mx-auto inline-flex items-center gap-2")}>
                <Square className="size-4" aria-hidden />
                {t.stop}
              </button>
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
