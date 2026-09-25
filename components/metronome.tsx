"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Minus, Play, Plus, Square } from "lucide-react";
import { BPM_MAX, BPM_MIN, clampBpm, groupStarts, meterOf, METERS, SUBDIVISIONS, tempoMarking, type Click } from "@/lib/core/metronome";
import { barInStep, progress, SPEED_EVERY, SPEED_STEPS } from "@/lib/core/speed";
import { useMetronome } from "@/lib/game/use-metronome";
import { useSpeedPlan } from "@/lib/game/use-speed-plan";
import type { Strings } from "@/lib/i18n";
import { GameShell } from "@/components/game-frame";
import { Row } from "@/components/setup-screen";
import { Chip, primary } from "@/components/challenge-card";
import { cn } from "@/lib/utils";

const step =
  "flex h-11 min-w-11 items-center justify-center rounded-xl border border-line px-3 text-sm font-medium text-ink outline-none transition-[background-color,transform] hover:bg-surface active:scale-95 focus-visible:ring-3 focus-visible:ring-ring/50 motion-reduce:active:scale-100";
const smallStep =
  "flex h-9 min-w-9 items-center justify-center rounded-lg border border-line px-2 text-xs font-medium text-ink outline-none transition-[background-color,transform] hover:bg-surface active:scale-95 focus-visible:ring-3 focus-visible:ring-ring/50 sm:text-sm motion-reduce:active:scale-100";

/** One circle per beat, group starts ringed in amber, and a dot per subdivision underneath. The
 *  beat being heard lights up. */
function Beats({ meterId, subdivision, accent, click }: { meterId: string; subdivision: number; accent: boolean; click: Click | null }) {
  const meter = meterOf(meterId);
  const starts = groupStarts(meter);
  return (
    <div className="flex justify-center gap-2 sm:gap-3" aria-hidden>
      {Array.from({ length: meter.beats }, (_, beat) => {
        const on = click?.beat === beat;
        const strong = accent && starts.includes(beat);
        return (
          <div key={beat} className="flex flex-col items-center gap-1.5">
            <span
              className={cn(
                "flex size-9 items-center justify-center rounded-full border-2 text-sm font-semibold transition-[background-color,border-color,transform] duration-75 sm:size-11",
                strong ? "border-amber" : "border-line",
                on && click?.sub === 0 ? "scale-110 motion-reduce:scale-100" : "",
                on ? (strong && beat === 0 ? "bg-amber text-stage" : "bg-ink text-stage") : "text-dim",
              )}
            >
              {beat + 1}
            </span>
            {/* Sextuplets: six smaller dots, so a 7/8 bar still fits a phone. */}
            <span className={cn("flex h-1.5 items-center", subdivision > 4 ? "gap-0.5" : "gap-1")}>
              {subdivision > 1
                ? Array.from({ length: subdivision }, (_, sub) => (
                    <span key={sub} className={cn("rounded-full", subdivision > 4 ? "size-1" : "size-1.5", on && click?.sub === sub ? "bg-amber" : "bg-line")} />
                  ))
                : null}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/**
 * A tempo you can type. Tap it, write the number, and it applies on Enter or when you leave the
 * field, clamped to 20–300; Escape puts the old value back. Digits only, three at most.
 */
function BpmInput({ value, onCommit, label, className, readOnly = false }: { value: number; onCommit: (bpm: number) => void; label: string; className?: string; readOnly?: boolean }) {
  const [draft, setDraft] = useState<string | null>(null);
  const cancelled = useRef(false);
  return (
    <input
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      enterKeyHint="done"
      aria-label={label}
      readOnly={readOnly}
      value={draft ?? String(value)}
      onFocus={(e) => {
        if (readOnly) return;
        cancelled.current = false;
        setDraft(String(value));
        e.currentTarget.select();
      }}
      onChange={(e) => setDraft(e.target.value.replace(/\D/g, "").slice(0, 3))}
      onBlur={() => {
        const n = draft === null ? NaN : parseInt(draft, 10);
        if (!cancelled.current && Number.isFinite(n)) onCommit(clampBpm(n));
        setDraft(null);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") e.currentTarget.blur();
        if (e.key === "Escape") {
          cancelled.current = true;
          e.currentTarget.blur();
        }
      }}
      className={cn(
        "min-w-0 rounded-lg border border-transparent bg-transparent text-center font-display font-semibold tabular-nums outline-none transition-colors",
        readOnly ? "cursor-default" : "hover:border-line focus:border-amber focus:bg-surface",
        className,
      )}
    />
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5 sm:grid sm:grid-cols-[8rem_1fr] sm:items-center sm:gap-3">
      <span className="text-sm font-medium text-dim">{label}</span>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );
}

/** −5 −1 [typed tempo] +1 +5, for the start and target of a climb. */
function Stepper({ value, onChange, label, t }: { value: number; onChange: (v: number) => void; label: string; t: Strings["metronome"] }) {
  return (
    <>
      <button type="button" className={smallStep} onClick={() => onChange(clampBpm(value - 5))} aria-label={`${label}: ${t.slower} 5`}>
        −5
      </button>
      <button type="button" className={smallStep} onClick={() => onChange(clampBpm(value - 1))} aria-label={`${label}: ${t.slower}`}>
        <Minus className="size-4" />
      </button>
      <BpmInput value={value} onCommit={onChange} label={label} className="h-10 w-16 flex-1 text-2xl" />
      <button type="button" className={smallStep} onClick={() => onChange(clampBpm(value + 1))} aria-label={`${label}: ${t.faster}`}>
        <Plus className="size-4" />
      </button>
      <button type="button" className={smallStep} onClick={() => onChange(clampBpm(value + 5))} aria-label={`${label}: ${t.faster} 5`}>
        +5
      </button>
    </>
  );
}

/**
 * The metronome, one tool with two ways to run: a steady tempo, or climbing (the speed trainer)
 * from a start tempo to a target, a step every few bars, then staying there or starting over.
 * Meter, subdivision and accent serve both. Upright screen, no neck; settings apply while it
 * runs, a new plan from the next bar.
 */
export function Metronome({ t, ts, tg }: { t: Strings["metronome"]; ts: Strings["speed"]; tg: Strings["game"] }) {
  const { plan, set: setPlan } = useSpeedPlan();
  // The engine follows the plan only in climbing mode (the hook checks settings.mode).
  const { settings, set, nudge, running, toggle, click, beat, tap } = useMetronome(plan);
  const speedOn = settings.mode === "speed";

  const live = speedOn ? (running && beat ? beat.bpm : plan.from) : settings.bpm;
  const atTarget = speedOn && live >= plan.to;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.target instanceof HTMLInputElement && e.target.type === "text") return;
      const typing = e.target instanceof HTMLInputElement;
      if (e.key === " " && !(e.target instanceof HTMLButtonElement)) {
        e.preventDefault();
        void toggle();
      } else if (speedOn) {
        return;
      } else if (!typing && (e.key === "ArrowRight" || e.key === "ArrowUp")) {
        e.preventDefault();
        nudge(e.shiftKey ? 5 : 1);
      } else if (!typing && (e.key === "ArrowLeft" || e.key === "ArrowDown")) {
        e.preventDefault();
        nudge(e.shiftKey ? -5 : -1);
      } else if (e.key === "t" || e.key === "T") {
        tap();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle, nudge, tap, speedOn]);

  return (
    <GameShell t={tg} title={t.title}>
      <div className="flex min-h-0 flex-1 flex-col overflow-auto px-4 pb-6 animate-in fade-in fill-mode-both duration-300 motion-reduce:animate-none">
        <div className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center gap-6 py-4">
          <div role="radiogroup" aria-label={t.mode} className="grid grid-cols-2 gap-1 rounded-xl border border-line p-1">
            {(["steady", "speed"] as const).map((m) => (
              <button
                key={m}
                type="button"
                role="radio"
                aria-checked={settings.mode === m}
                onClick={() => set({ mode: m })}
                className={cn(
                  "h-9 rounded-lg text-sm font-medium outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50",
                  settings.mode === m ? "bg-amber/15 text-amber-text" : "text-dim hover:text-ink",
                )}
              >
                {m === "steady" ? t.steady : t.speed}
              </button>
            ))}
          </div>

          <Beats meterId={settings.meter} subdivision={settings.subdivision} accent={settings.accent} click={running ? click : null} />

          <section aria-label={t.tempo} className="flex flex-col items-center gap-4">
            <p className="flex flex-col items-center">
              <BpmInput
                value={live}
                label={speedOn ? ts.from : t.tempo}
                readOnly={speedOn && running}
                onCommit={(v) => (speedOn ? setPlan({ from: v, to: Math.max(v, plan.to) }) : set({ bpm: v }))}
                className="h-20 w-48 text-7xl leading-none sm:h-24 sm:text-8xl"
              />
              <span className="mt-2 text-sm text-dim">
                BPM · <span className="text-amber-text">{tempoMarking(live)}</span>
              </span>
            </p>

            {speedOn ? (
              <div className="w-full">
                <div className="h-2 w-full overflow-hidden rounded-full bg-line">
                  <div
                    className={cn("h-full rounded-full transition-[width] duration-300 motion-reduce:transition-none", atTarget ? "bg-correct" : "bg-amber")}
                    style={{ width: `${progress(plan, live) * 100}%` }}
                  />
                </div>
                <div className="mt-1.5 flex justify-between text-xs text-dim tabular-nums">
                  <span>{plan.from}</span>
                  <span className={atTarget && running ? "text-correct" : ""}>
                    {running && beat ? (atTarget && plan.atTarget === "hold" ? ts.reached : ts.barOf.replace("{b}", String(barInStep(plan, beat.bar))).replace("{e}", String(plan.every))) : ""}
                  </span>
                  <span>{plan.to}</span>
                </div>
              </div>
            ) : (
              <>
                <div className="flex w-full items-center justify-center gap-2">
                  <button type="button" className={step} onClick={() => nudge(-5)} aria-label={`${t.slower} 5`}>
                    −5
                  </button>
                  <button type="button" className={step} onClick={() => nudge(-1)} aria-label={t.slower}>
                    <Minus className="size-4" />
                  </button>
                  <button type="button" className={cn(step, "min-w-20 border-amber/60 text-amber-text")} onClick={tap}>
                    {t.tap}
                  </button>
                  <button type="button" className={step} onClick={() => nudge(1)} aria-label={t.faster}>
                    <Plus className="size-4" />
                  </button>
                  <button type="button" className={step} onClick={() => nudge(5)} aria-label={`${t.faster} 5`}>
                    +5
                  </button>
                </div>
                <input
                  type="range"
                  min={BPM_MIN}
                  max={BPM_MAX}
                  value={settings.bpm}
                  onChange={(e) => set({ bpm: Number(e.target.value) })}
                  aria-label={t.tempo}
                  className="w-full accent-amber"
                />
              </>
            )}
          </section>

          <button type="button" onClick={() => void toggle()} className={cn(primary, "inline-flex w-full items-center justify-center gap-2 py-3")}>
            {running ? <Square className="size-5" aria-hidden /> : <Play className="size-5" aria-hidden />}
            {running ? t.stop : t.start}
          </button>

          <div className="flex flex-col gap-4">
            {speedOn ? (
              <>
                <Field label={ts.from}>
                  <Stepper value={plan.from} onChange={(v) => setPlan({ from: v, to: Math.max(v, plan.to) })} label={ts.from} t={t} />
                </Field>
                <Field label={ts.to}>
                  <Stepper value={plan.to} onChange={(v) => setPlan({ to: v, from: Math.min(v, plan.from) })} label={ts.to} t={t} />
                </Field>
                <Row label={ts.step}>
                  {SPEED_STEPS.map((n) => (
                    <Chip key={n} on={plan.step === n} onClick={() => setPlan({ step: n })}>
                      +{n}
                    </Chip>
                  ))}
                </Row>
                <Row label={ts.every}>
                  {SPEED_EVERY.map((n) => (
                    <Chip key={n} on={plan.every === n} onClick={() => setPlan({ every: n })}>
                      {n}
                    </Chip>
                  ))}
                </Row>
                <Row label={ts.atTarget}>
                  <Chip on={plan.atTarget === "hold"} onClick={() => setPlan({ atTarget: "hold" })}>
                    {ts.hold}
                  </Chip>
                  <Chip on={plan.atTarget === "restart"} onClick={() => setPlan({ atTarget: "restart" })}>
                    {ts.restart}
                  </Chip>
                </Row>
              </>
            ) : null}
            <Row label={t.meter}>
              {METERS.map((m) => (
                <Chip key={m.id} on={settings.meter === m.id} onClick={() => set({ meter: m.id })}>
                  {m.id}
                </Chip>
              ))}
            </Row>
            <Row label={t.subdivision}>
              {SUBDIVISIONS.map((n) => (
                <Chip key={n} on={settings.subdivision === n} onClick={() => set({ subdivision: n })}>
                  {n}
                </Chip>
              ))}
            </Row>
            <Row label={t.accent}>
              <Chip on={settings.accent} onClick={() => set({ accent: true })}>
                {t.accentOn}
              </Chip>
              <Chip on={!settings.accent} onClick={() => set({ accent: false })}>
                {t.accentOff}
              </Chip>
            </Row>
          </div>

          <p className="hidden text-center text-xs text-dim pointer-fine:block">{speedOn ? ts.keys : t.keys}</p>
        </div>
      </div>
    </GameShell>
  );
}
