"use client";

import { useState, type ReactNode } from "react";
import { ArrowRight, Flame, Infinity as InfinityIcon, Timer, type LucideIcon } from "lucide-react";
import { TIMED_SECONDS, type Challenge } from "@/lib/core/challenge";
import { namesFor, NATURAL_PITCH_CLASSES, type NameStyle } from "@/lib/core/notes";
import { DEFAULT_SETTINGS } from "@/lib/core/quiz";
import type { Settings } from "@/lib/game/use-settings";
import type { Strings } from "@/lib/i18n";
import { Chip, primary } from "@/components/challenge-card";
import { Fretboard, type Mark } from "@/components/fretboard";
import { useSize } from "@/components/game-frame";
import { cn } from "@/lib/utils";

export function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5 sm:grid sm:grid-cols-[8rem_1fr] sm:items-center sm:gap-3">
      <span className="text-sm font-medium text-dim">{label}</span>
      <div role="radiogroup" aria-label={label} className="flex gap-2">
        {children}
      </div>
    </div>
  );
}

/**
 * One challenge as a card: what it is and the best kept for it. The whole card is the radio
 * (its name is the button, stretched over the card); anything inside that takes its own taps,
 * like the minutes, sits above that.
 */
function ChallengeCard({
  icon: Icon,
  name,
  on,
  onPick,
  best,
  scored,
  children,
}: {
  icon: LucideIcon;
  name: string;
  on: boolean;
  onPick: () => void;
  /** The line about the best: the best itself, that there is none yet, or that none is kept. */
  best: string;
  /** True when `best` is a real best, shown in amber. */
  scored: boolean;
  children: ReactNode;
}) {
  const tone = scored ? "text-amber-text" : "text-dim";
  return (
    <div
      className={cn(
        "relative flex gap-3 rounded-2xl border p-3 transition-colors @2xl:flex-col @2xl:gap-2 @2xl:p-4",
        on ? "border-amber bg-amber/10" : "border-line bg-surface hover:border-dim/60",
      )}
    >
      <Icon className={cn("mt-0.5 size-5 shrink-0", on ? "text-amber-text" : "text-dim")} aria-hidden />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-baseline justify-between gap-2">
          <button
            type="button"
            role="radio"
            aria-checked={on}
            onClick={onPick}
            className="text-left text-base font-semibold text-ink outline-none after:absolute after:inset-0 after:rounded-2xl focus-visible:after:ring-3 focus-visible:after:ring-ring/50"
          >
            {name}
          </button>
          {/* On a phone the best sits beside the name, so three cards and Start fit one screen. */}
          <span className={cn("shrink-0 text-xs @2xl:hidden", tone)}>{best}</span>
        </div>
        {children}
        <p className={cn("mt-auto hidden pt-2 text-sm @2xl:block", tone)}>{best}</p>
      </div>
    </div>
  );
}

/** One of two choices, spelled out: its name and what you get with it. */
export function Tile({ name, detail, on, onClick }: { name: string; detail: string; on: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={on}
      onClick={onClick}
      className={cn(
        "flex min-w-0 flex-col gap-0.5 rounded-xl border px-3 py-2 text-left outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50",
        on ? "border-amber bg-amber/15" : "border-line hover:border-dim/60",
      )}
    >
      <span className={cn("text-sm font-semibold", on ? "text-amber-text" : "text-ink")}>{name}</span>
      <span className="text-xs text-dim">{detail}</span>
    </button>
  );
}

export function Tiles({ label, children, columns = 2 }: { label: string; children: ReactNode; columns?: 2 | 3 }) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <span className="text-sm font-medium text-dim">{label}</span>
      <div role="radiogroup" aria-label={label} className={cn("grid flex-1 gap-2", columns === 3 ? "grid-cols-3" : "grid-cols-2")}>
        {children}
      </div>
    </div>
  );
}

/**
 * The exercise pictured on the player's own neck, so the screen shows what Start leads to; the
 * marks come from the mode, which moves them (`useDemoTick`). Drawn at the width it has: a strip
 * on a phone, a full board beside the sidebar.
 */
function Preview({ marks, strings, label }: { marks: Mark[]; strings: number; label: string }) {
  const { ref, size } = useSize<HTMLDivElement>();
  // Never under 150: the dots have to hold a note's name, on a phone too.
  const height = Math.round(Math.min(230, Math.max(150, size.width * 0.26)) * ((strings + 1) / 7));
  return (
    <div ref={ref} className="min-w-0 [@media(max-height:30rem)]:hidden" style={{ height }}>
      {size.width > 0 ? (
        <Fretboard label={label} width={size.width} height={height} minFret={DEFAULT_SETTINGS.minFret} maxFret={DEFAULT_SETTINGS.maxFret} strings={strings} marks={marks} />
      ) : null}
    </div>
  );
}

/** Fa Sol La Si, or F G A B: the rest of the scale after the three notes that name the style. */
const rest = (style: NameStyle) => NATURAL_PITCH_CLASSES.slice(3).map((pc) => namesFor(style)[pc]).join(" ");

/**
 * The screen before a round: a still of the exercise on the neck, the three challenges as cards,
 * each with the best kept for it, then which notes are asked and how they are named, then Start.
 * Upright, like any page; on a phone Start stays pinned right above the tab bar (`.cta-pin`).
 * The Start tap is also the gesture that unlocks audio.
 */
export function SetupScreen({
  title,
  tc,
  ts,
  hint,
  marks = [],
  strings = 6,
  boardLabel = "",
  preview,
  showNotes = true,
  extra,
  value,
  onChange,
  settings,
  bestOf,
  onStart,
  loading,
  loadingLabel,
}: {
  title: string;
  tc: Strings["challenge"];
  ts: Strings["settings"];
  /** One line on what the mode asks of you. */
  hint: string;
  /** What the still of the exercise shows on the neck. */
  marks?: Mark[];
  strings?: number;
  boardLabel?: string;
  /** A picture of the exercise in place of the neck (the reading exercises draw a staff). */
  preview?: ReactNode;
  /** False for exercises where which notes are asked is not a choice. */
  showNotes?: boolean;
  /** Settings of the exercise's own, above the note names. */
  extra?: ReactNode;
  value: Challenge;
  onChange: (c: Challenge) => void;
  settings: Settings;
  /** The best kept for a challenge, or null. */
  bestOf: (c: Challenge) => number | null;
  onStart: () => void;
  loading: boolean;
  loadingLabel: string;
}) {
  // The minutes last picked stay on the clock card while another challenge is chosen.
  const [lastSeconds, setLastSeconds] = useState<number>(TIMED_SECONDS[0]);
  const seconds = value.kind === "timed" ? value.seconds : lastSeconds;
  const pick = (c: Challenge) => {
    if (value.kind === "timed") setLastSeconds(value.seconds);
    onChange(c);
  };
  const bestLine = (c: Challenge) => {
    const best = bestOf(c);
    return { best: best !== null ? tc.best.replace("{n}", String(best)) : tc.noBest, scored: best !== null };
  };
  const sub = value.kind === "timed" ? tc.timedSub : value.kind === "streak" ? tc.streakSub : tc.practiceSub;
  const names = namesFor(settings.names);
  return (
    // No overflow here: the page scrolls, so the pinned Start sticks to the window, not to this box.
    <div className="@container flex flex-1 flex-col px-4 pb-3 animate-in fade-in fill-mode-both duration-300 motion-reduce:animate-none">
      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-3 py-4 md:justify-center @2xl:gap-5 [@media(max-height:30rem)]:gap-2 [@media(max-height:30rem)]:py-2">
        <div className="flex flex-col gap-1 @2xl:flex-row @2xl:items-baseline @2xl:justify-between @2xl:gap-6">
          {/* A phone's top bar already names the tool. */}
          <h1 className="hidden font-display text-3xl font-semibold tracking-tight md:block [@media(max-height:30rem)]:hidden">{title}</h1>
          <p className="text-sm text-dim [@media(max-height:26rem)]:hidden">{hint}</p>
        </div>
        {preview ?? <Preview marks={marks} strings={strings} label={boardLabel} />}
        <div role="radiogroup" aria-label={ts.challenge} className="grid grid-cols-1 gap-2 @2xl:grid-cols-3 @2xl:gap-3">
          <ChallengeCard icon={InfinityIcon} name={tc.practice} on={value.kind === "practice"} onPick={() => pick({ kind: "practice" })} best={tc.noScore} scored={false}>
            <p className="text-sm text-dim">{tc.practiceCard}</p>
          </ChallengeCard>
          <ChallengeCard icon={Timer} name={tc.timed} on={value.kind === "timed"} onPick={() => pick({ kind: "timed", seconds })} {...bestLine({ kind: "timed", seconds })}>
            <div role="radiogroup" aria-label={ts.time} className="relative z-10 flex gap-2 pt-0.5">
              {TIMED_SECONDS.map((s) => (
                <Chip key={s} on={s === seconds} onClick={() => pick({ kind: "timed", seconds: s })}>
                  {tc.minutes.replace("{m}", String(s / 60))}
                </Chip>
              ))}
            </div>
          </ChallengeCard>
          <ChallengeCard icon={Flame} name={tc.streak} on={value.kind === "streak"} onPick={() => pick({ kind: "streak" })} {...bestLine({ kind: "streak" })}>
            <p className="text-sm text-dim">{tc.streakCard}</p>
          </ChallengeCard>
        </div>
        {extra}
        <div className={cn("grid grid-cols-1 gap-3 @2xl:gap-4", showNotes && "@2xl:grid-cols-[3fr_2fr]")}>
          {showNotes ? (
            <Tiles label={ts.notes}>
              <Tile name={ts.all} detail={names.join(" ")} on={!settings.naturalsOnly} onClick={() => settings.setNaturalsOnly(false)} />
              <Tile
                name={ts.naturals}
                detail={NATURAL_PITCH_CLASSES.map((pc) => names[pc]).join(" ")}
                on={settings.naturalsOnly}
                onClick={() => settings.setNaturalsOnly(true)}
              />
            </Tiles>
          ) : null}
          <Tiles label={ts.names}>
            <Tile name={ts.solfege} detail={rest("solfege")} on={settings.names === "solfege"} onClick={() => settings.setNames("solfege")} />
            <Tile name={ts.letters} detail={rest("letters")} on={settings.names === "letters"} onClick={() => settings.setNames("letters")} />
          </Tiles>
        </div>
        <div className="cta-pin flex flex-col gap-3 @2xl:flex-row @2xl:items-center @2xl:justify-between @2xl:gap-4">
          <p className="hidden min-w-0 text-sm text-dim @2xl:block">{sub}</p>
          <button type="button" onClick={onStart} disabled={loading} className={cn(primary, "inline-flex shrink-0 items-center justify-center gap-2 @2xl:px-8")}>
            {loading ? loadingLabel : tc.start}
            {loading ? null : <ArrowRight className="size-5" aria-hidden />}
          </button>
        </div>
      </div>
    </div>
  );
}
