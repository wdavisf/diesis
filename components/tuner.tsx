"use client";

import { useEffect, useState } from "react";
import { Check, ChevronDown, Minus, Mic, Plus, Square } from "lucide-react";
import { frequency, namesFor, pitchClassOf, STRING_COUNTS, tuningsFor, type Tuning } from "@/lib/core/notes";
import { A4_MAX, A4_MIN, A4_PRESETS, clampA4, RANGE_CENTS, verdictOf, type Verdict } from "@/lib/core/tuner";
import { useGuitar } from "@/lib/game/use-guitar";
import { useSettings } from "@/lib/game/use-settings";
import { useTuner } from "@/lib/game/use-tuner";
import type { Lang, Strings } from "@/lib/i18n";
import { primary } from "@/components/challenge-card";
import { Sheet } from "@/components/sheet";
import { cn } from "@/lib/utils";

const fill = (text: string, values: Record<string, string | number>) => text.replace(/\{(\w+)\}/g, (_, k) => String(values[k] ?? ""));

/** A choice inside a sheet: amber when it is the one picked. */
const pick = (on: boolean) =>
  cn(
    "rounded-xl border outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50",
    on ? "border-amber bg-amber/15 text-amber-text" : "border-line bg-stage text-dim hover:text-ink",
  );

const verdictColor: Record<Verdict | "idle", string> = {
  in: "text-correct",
  flat: "text-amber-text",
  sharp: "text-amber-text",
  idle: "text-dim",
};

const TAPE_W = 312;
/** Pixels per cent on the tape: the needle sees ±RANGE_CENTS either side. */
const PX = TAPE_W / 2 / RANGE_CENTS;

/**
 * A tape of ticks every 5 cents that slides under a fixed needle: the same idea as the
 * metronome's tempo ruler. Left is flat, right is sharp (the tape moves the other way, as a
 * ruler under a pointer would).
 */
function Tape({ cents, state, label }: { cents: number; state: Verdict | "idle"; label: string }) {
  const shown = Math.max(-RANGE_CENTS, Math.min(RANGE_CENTS, cents));
  const ticks = [];
  for (let c = -RANGE_CENTS * 2; c <= RANGE_CENTS * 2; c += 5) {
    const big = c % 25 === 0;
    ticks.push(
      <line
        key={c}
        x1={c * PX}
        x2={c * PX}
        y1={big ? 8 : 18}
        y2={42}
        strokeWidth={c === 0 ? 3 : 1.25}
        className={cn(c === 0 ? "stroke-correct" : "stroke-ink", !big && c !== 0 && "opacity-40")}
      />,
    );
  }
  return (
    <svg viewBox={`0 0 ${TAPE_W} 66`} role="img" aria-label={label} className="w-full max-w-sm overflow-hidden">
      <g
        className={cn("transition-transform duration-150 ease-out motion-reduce:transition-none", state === "idle" && "opacity-30")}
        style={{ transform: `translateX(${TAPE_W / 2 - shown * PX}px)` }}
      >
        {ticks}
      </g>
      <path d={`M${TAPE_W / 2} 46 l-7 14 h14z`} className={cn(state === "in" ? "fill-correct" : "fill-amber")} />
    </svg>
  );
}

/** One button that shows what it holds, and opens its sheet. */
function Setting({ label, value, onOpen, className }: { label: string; value: string; onOpen: () => void; className?: string }) {
  return (
    <button
      type="button"
      aria-haspopup="dialog"
      onClick={onOpen}
      className={cn(
        "flex min-w-0 items-center justify-between gap-2 rounded-xl border border-line px-3.5 py-2 text-left outline-none transition-colors hover:bg-surface focus-visible:ring-3 focus-visible:ring-ring/50",
        className,
      )}
    >
      <span className="min-w-0">
        <span className="block text-xs text-dim">{label}</span>
        <span className="block truncate text-[0.9375rem] font-semibold">{value}</span>
      </span>
      <ChevronDown className="size-4 shrink-0 text-dim" aria-hidden />
    </button>
  );
}

export function Tuner({ t, tunings, lang }: { t: Strings["tuner"]; tunings: Record<string, string>; lang: Lang }) {
  const guitar = useGuitar();
  const prefs = useSettings(lang === "es" ? "solfege" : "letters");
  const names = namesFor(prefs.names);
  const tuning: Tuning = guitar.preset.notes;
  const count = tuning.length;
  const tuner = useTuner(tuning);
  const { status, reading, tuned, pinned, a4 } = tuner;
  const [panel, setPanel] = useState<"tuning" | "reference" | null>(null);
  const hzFormat = new Intl.NumberFormat(lang === "es" ? "es-ES" : "en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  const listening = status === "listening";
  const verdict: Verdict | "idle" = reading ? verdictOf(reading.cents) : "idle";
  // The string the screen is about: the one heard, else the one pinned.
  const focus = reading ? reading.string : pinned;
  const focusMidi = focus !== null ? tuning[focus] : null;
  const verdictText = verdict === "in" ? t.inTune : verdict === "flat" ? t.flat : verdict === "sharp" ? t.sharp : "";
  const busy = status === "starting";
  const message =
    status === "denied" ? t.denied : status === "unsupported" ? t.unsupported : status === "error" ? t.error : listening ? null : t.idle;

  // Space starts and stops it, like the metronome.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (panel || e.metaKey || e.ctrlKey || e.altKey || e.key !== " ") return;
      if (e.target instanceof HTMLButtonElement || e.target instanceof HTMLInputElement) return;
      e.preventDefault();
      if (listening) tuner.stop();
      else void tuner.start();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [panel, listening, tuner]);

  const spell = (midi: number) => names[pitchClassOf(midi)];
  const tuningName = tunings[guitar.preset.id] ?? guitar.preset.id;

  return (
    <div className="flex flex-1 flex-col px-4 pt-4 pb-6 animate-in fade-in fill-mode-both duration-300 motion-reduce:animate-none">
      <h1 className="sr-only">{t.title}</h1>
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center gap-5">
        <div className="grid w-full grid-cols-[1.6fr_1fr] gap-2">
          <Setting label={t.tuning} value={`${fill(t.count, { n: count })} · ${tuningName}`} onOpen={() => setPanel("tuning")} />
          <Setting label={t.reference} value={fill(t.referenceValue, { hz: a4 })} onOpen={() => setPanel("reference")} />
        </div>

        <div className="flex flex-1 flex-col items-center justify-center gap-1 text-center">
          <p
            aria-live="polite"
            className={cn(
              "flex h-[1.05em] items-center justify-center font-display text-[clamp(5.5rem,16dvh,8.5rem)] leading-none font-semibold tabular-nums",
              reading ? "text-ink" : "text-dim/50",
            )}
          >
            {focusMidi !== null ? spell(focusMidi) : "–"}
          </p>
          <p className="h-5 text-sm text-dim tabular-nums">
            {focus !== null ? (
              <>
                {fill(t.string, { n: focus + 1 })}
                {reading ? ` · ${hzFormat.format(reading.hz)} Hz` : ` · ${hzFormat.format(frequency(tuning[focus], a4))} Hz`}
              </>
            ) : null}
          </p>
          <p className={cn("h-7 text-lg font-semibold", verdictColor[verdict])} aria-live="polite">
            {listening && !reading ? <span className="font-normal text-dim">{t.listening}</span> : verdictText}
          </p>
        </div>

        <Tape cents={reading?.cents ?? 0} state={verdict} label={reading ? fill(t.tapeLabel, { n: Math.round(reading.cents) }) : t.listening} />

        <div role="group" aria-label={t.stringCount} className="flex w-full gap-1.5">
          {tuning.map((midi, i) => {
            const on = pinned === i;
            const heard = reading?.string === i;
            return (
              <button
                key={i}
                type="button"
                aria-pressed={on}
                aria-label={`${fill(t.string, { n: i + 1 })}, ${spell(midi)}`}
                onClick={() => {
                  if (on) tuner.pin(null);
                  else {
                    tuner.pin(i);
                    void tuner.hear(i);
                  }
                }}
                className={cn(
                  "relative flex h-14 min-w-0 flex-1 flex-col items-center justify-center rounded-xl border font-display outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50",
                  on ? "border-amber bg-amber/15 text-amber-text" : heard ? "border-ink/60" : "border-line hover:bg-surface",
                )}
              >
                <span className="text-lg leading-none font-semibold">{spell(midi)}</span>
                <span className="mt-0.5 font-sans text-[0.625rem] text-dim">{i + 1}</span>
                {tuned.has(i) ? (
                  <span className="absolute top-1 right-1 flex size-3.5 items-center justify-center rounded-full bg-correct text-stage">
                    <Check className="size-2.5" strokeWidth={3} aria-label={t.inTune} />
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        <p className="min-h-5 text-center text-sm text-dim">
          {message ?? (pinned !== null ? fill(t.hintPinned, { n: pinned + 1 }) : t.hintAuto)}
        </p>

        <div className="cta-pin w-full">
          <button
            type="button"
            onClick={() => (listening ? tuner.stop() : void tuner.start())}
            disabled={busy}
            className={cn(primary, "inline-flex w-full items-center justify-center gap-2 py-3")}
          >
            {listening ? <Square className="size-5" aria-hidden /> : <Mic className="size-5" aria-hidden />}
            {busy ? t.starting : listening ? t.stop : t.start}
          </button>
        </div>
      </div>

      <TuningSheet t={t} tunings={tunings} open={panel === "tuning"} onClose={() => setPanel(null)} guitar={guitar} spell={spell} />
      <ReferenceSheet t={t} open={panel === "reference"} onClose={() => setPanel(null)} a4={a4} setA4={tuner.setA4} />
    </div>
  );
}

function TuningSheet({
  t,
  tunings,
  open,
  onClose,
  guitar,
  spell,
}: {
  t: Strings["tuner"];
  tunings: Record<string, string>;
  open: boolean;
  onClose: () => void;
  guitar: ReturnType<typeof useGuitar>;
  spell: (midi: number) => string;
}) {
  const count = guitar.preset.notes.length;
  const list = tuningsFor(count);
  return (
    <Sheet open={open} onClose={onClose} title={t.tuningTitle} done="OK">
      <div role="radiogroup" aria-label={t.stringCount} className="flex gap-1.5">
        {STRING_COUNTS.map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={n === count}
            // A new string count starts on that count's standard tuning.
            onClick={() => n !== count && guitar.setTuning(`standard${n}`)}
            className={cn(pick(n === count), "h-11 flex-1 text-sm font-semibold whitespace-nowrap")}
          >
            {fill(t.count, { n })}
          </button>
        ))}
      </div>
      <ul role="radiogroup" aria-label={t.tuningTitle} className="-mx-1 flex flex-col">
        {list.map((p) => {
          const on = p.id === guitar.preset.id;
          return (
            <li key={p.id}>
              <button
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => guitar.setTuning(p.id)}
                className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left outline-none transition-colors hover:bg-stage focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <span className="min-w-0">
                  <span className={cn("block text-base", on && "font-semibold text-amber-text")}>{tunings[p.id] ?? p.id}</span>
                  <span className="mt-0.5 block font-mono text-xs text-dim">{[...p.notes].reverse().map(spell).join(" ")}</span>
                </span>
                {on ? <Check className="size-5 shrink-0 text-amber" aria-hidden /> : null}
              </button>
            </li>
          );
        })}
      </ul>
      <p className="text-sm text-dim">{t.sameAsProfile}</p>
    </Sheet>
  );
}

function ReferenceSheet({ t, open, onClose, a4, setA4 }: { t: Strings["tuner"]; open: boolean; onClose: () => void; a4: number; setA4: (hz: number) => void }) {
  const step = "flex size-12 items-center justify-center rounded-xl border border-line outline-none transition-[background-color,transform] hover:bg-stage active:scale-95 focus-visible:ring-3 focus-visible:ring-ring/50 motion-reduce:active:scale-100";
  return (
    <Sheet open={open} onClose={onClose} title={t.referenceTitle} done="OK">
      <p className="text-sm text-dim">{t.referenceLede}</p>
      <div className="flex items-center justify-center gap-5">
        <button type="button" aria-label={t.lower} onClick={() => setA4(clampA4(a4 - 1))} disabled={a4 <= A4_MIN} className={step}>
          <Minus className="size-5" aria-hidden />
        </button>
        <p className="min-w-[5.5rem] text-center font-display text-4xl font-semibold tabular-nums">
          {a4}
          <span className="ml-1 text-base font-normal text-dim">Hz</span>
        </p>
        <button type="button" aria-label={t.higher} onClick={() => setA4(clampA4(a4 + 1))} disabled={a4 >= A4_MAX} className={step}>
          <Plus className="size-5" aria-hidden />
        </button>
      </div>
      <div role="radiogroup" aria-label={t.reference} className="flex gap-1.5">
        {A4_PRESETS.map((hz) => (
          <button key={hz} type="button" role="radio" aria-checked={a4 === hz} onClick={() => setA4(hz)} className={cn(pick(a4 === hz), "h-11 flex-1 text-sm font-semibold")}>
            {hz}
          </button>
        ))}
      </div>
    </Sheet>
  );
}
