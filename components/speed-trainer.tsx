"use client";

import { useEffect, type ReactNode } from "react";
import { Minus, Play, Plus, Square } from "lucide-react";
import { clampBpm, METERS, SUBDIVISIONS, tempoMarking } from "@/lib/core/metronome";
import { barInStep, progress, SPEED_EVERY, SPEED_STEPS, tempoAtBar } from "@/lib/core/speed";
import { useMetronome } from "@/lib/game/use-metronome";
import { useSpeedPlan } from "@/lib/game/use-speed-plan";
import type { Strings } from "@/lib/i18n";
import { GameShell } from "@/components/game-frame";
import { Row } from "@/components/setup-screen";
import { Chip, primary } from "@/components/challenge-card";
import { Beats } from "@/components/metronome";
import { cn } from "@/lib/utils";

const step =
  "flex h-9 min-w-9 items-center justify-center rounded-lg border border-line px-2 text-xs font-medium text-ink outline-none transition-[background-color,transform] hover:bg-surface active:scale-95 focus-visible:ring-3 focus-visible:ring-ring/50 sm:text-sm motion-reduce:active:scale-100";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5 sm:grid sm:grid-cols-[8rem_1fr] sm:items-center sm:gap-3">
      <span className="text-sm font-medium text-dim">{label}</span>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );
}

/** −5 −1 value +1 +5, for the start and target tempos. */
function Stepper({ value, onChange, label, slower, faster }: { value: number; onChange: (v: number) => void; label: string; slower: string; faster: string }) {
  return (
    <>
      <button type="button" className={step} onClick={() => onChange(clampBpm(value - 5))} aria-label={`${label}: ${slower} 5`}>
        −5
      </button>
      <button type="button" className={step} onClick={() => onChange(clampBpm(value - 1))} aria-label={`${label}: ${slower}`}>
        <Minus className="size-4" />
      </button>
      <output className="w-14 flex-1 text-center font-display text-2xl font-semibold tabular-nums" aria-label={label}>
        {value}
      </output>
      <button type="button" className={step} onClick={() => onChange(clampBpm(value + 1))} aria-label={`${label}: ${faster}`}>
        <Plus className="size-4" />
      </button>
      <button type="button" className={step} onClick={() => onChange(clampBpm(value + 5))} aria-label={`${label}: ${faster} 5`}>
        +5
      </button>
    </>
  );
}

/**
 * The speed trainer: the metronome with a plan. It starts at one tempo and climbs a step every
 * few bars to a target, then stays there or starts over. Meter and subdivision are the
 * metronome's own settings, shared.
 */
export function SpeedTrainer({ t, tm, tg }: { t: Strings["speed"]; tm: Strings["metronome"]; tg: Strings["game"] }) {
  const { plan, set: setPlan } = useSpeedPlan();
  const { settings, set, running, toggle, click, beat } = useMetronome(plan);

  const bpm = beat?.bpm ?? tempoAtBar(plan, 0);
  const atTarget = bpm >= plan.to;
  const bar = beat?.bar ?? 0;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === " " && !(e.target instanceof HTMLButtonElement)) {
        e.preventDefault();
        void toggle();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle]);

  return (
    <GameShell t={tg} title={t.title}>
      <div className="flex min-h-0 flex-1 flex-col overflow-auto px-4 pb-6 animate-in fade-in fill-mode-both duration-300 motion-reduce:animate-none">
        <div className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center gap-6 py-4">
          <Beats meterId={settings.meter} subdivision={settings.subdivision} accent={settings.accent} click={running ? click : null} />

          <section aria-live="polite" className="flex flex-col items-center gap-3">
            <p className="flex flex-col items-center">
              <span className="font-display text-7xl leading-none font-semibold tabular-nums sm:text-8xl">{bpm}</span>
              <span className="mt-2 text-sm text-dim">
                BPM · <span className="text-amber-text">{tempoMarking(bpm)}</span>
              </span>
            </p>
            <div className="w-full">
              <div className="h-2 w-full overflow-hidden rounded-full bg-line">
                <div
                  className={cn("h-full rounded-full transition-[width] duration-300 motion-reduce:transition-none", atTarget ? "bg-correct" : "bg-amber")}
                  style={{ width: `${progress(plan, bpm) * 100}%` }}
                />
              </div>
              <div className="mt-1.5 flex justify-between text-xs text-dim tabular-nums">
                <span>{plan.from}</span>
                <span className={atTarget && running ? "text-correct" : ""}>
                  {running ? (atTarget && plan.atTarget === "hold" ? t.reached : t.barOf.replace("{b}", String(barInStep(plan, bar))).replace("{e}", String(plan.every))) : ""}
                </span>
                <span>{plan.to}</span>
              </div>
            </div>
          </section>

          <button type="button" onClick={() => void toggle()} className={cn(primary, "inline-flex w-full items-center justify-center gap-2 py-3")}>
            {running ? <Square className="size-5" aria-hidden /> : <Play className="size-5" aria-hidden />}
            {running ? tm.stop : tm.start}
          </button>

          <div className="flex flex-col gap-4">
            <Field label={t.from}>
              <Stepper value={plan.from} onChange={(v) => setPlan({ from: v, to: Math.max(v, plan.to) })} label={t.from} slower={tm.slower} faster={tm.faster} />
            </Field>
            <Field label={t.to}>
              <Stepper value={plan.to} onChange={(v) => setPlan({ to: v, from: Math.min(v, plan.from) })} label={t.to} slower={tm.slower} faster={tm.faster} />
            </Field>
            <Row label={t.step}>
              {SPEED_STEPS.map((n) => (
                <Chip key={n} on={plan.step === n} onClick={() => setPlan({ step: n })}>
                  +{n}
                </Chip>
              ))}
            </Row>
            <Row label={t.every}>
              {SPEED_EVERY.map((n) => (
                <Chip key={n} on={plan.every === n} onClick={() => setPlan({ every: n })}>
                  {n}
                </Chip>
              ))}
            </Row>
            <Row label={t.atTarget}>
              <Chip on={plan.atTarget === "hold"} onClick={() => setPlan({ atTarget: "hold" })}>
                {t.hold}
              </Chip>
              <Chip on={plan.atTarget === "restart"} onClick={() => setPlan({ atTarget: "restart" })}>
                {t.restart}
              </Chip>
            </Row>
            <Row label={tm.meter}>
              {METERS.map((m) => (
                <Chip key={m.id} on={settings.meter === m.id} onClick={() => set({ meter: m.id })}>
                  {m.id}
                </Chip>
              ))}
            </Row>
            <Row label={tm.subdivision}>
              {SUBDIVISIONS.map((n) => (
                <Chip key={n} on={settings.subdivision === n} onClick={() => set({ subdivision: n })}>
                  {n}
                </Chip>
              ))}
            </Row>
          </div>

          <p className="hidden text-center text-xs text-dim pointer-fine:block">{t.keys}</p>
        </div>
      </div>
    </GameShell>
  );
}
