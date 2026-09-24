"use client";

import type { ReactNode } from "react";
import { formatClock } from "@/lib/core/challenge";
import type { ChallengeState } from "@/lib/game/use-challenge";
import type { Strings } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type T = Strings["challenge"];

const card =
  "w-full max-w-md animate-in fade-in zoom-in-95 fill-mode-both duration-200 motion-reduce:animate-none rounded-2xl border border-line bg-stage/95 p-4 text-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-sm [@media(max-height:30rem)]:p-3";
export const primary =
  "rounded-xl bg-amber px-6 py-2.5 text-lg font-semibold text-stage outline-none transition-colors hover:bg-amber-text focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-70";
const secondary =
  "rounded-xl border border-line px-5 py-2.5 text-base text-ink outline-none transition-colors hover:bg-surface focus-visible:ring-3 focus-visible:ring-ring/50";

export function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={on}
      onClick={onClick}
      className={cn(
        "h-9 flex-1 whitespace-nowrap rounded-lg border px-2 text-xs font-medium sm:text-sm [@media(max-height:30rem)]:h-8 outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50",
        on ? "border-amber bg-amber/15 text-amber-text" : "border-line text-dim hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}

/** The end of a timed or no-mistakes run: score, best, play again. */
export function ChallengeResult({ t, state, onAgain, onChange }: { t: T; state: ChallengeState; onAgain: () => void; onChange: () => void }) {
  const { challenge, tally, best, newBest } = state;
  return (
    <div className={card} role="dialog" aria-label={challenge.kind === "timed" ? t.timeUp : t.broken}>
      <p className="text-sm font-semibold text-dim">{challenge.kind === "timed" ? t.timeUp : t.broken}</p>
      <p className="mt-1 font-display text-4xl font-semibold text-ink">{t.result.replace("{n}", String(tally.right))}</p>
      <p className={cn("mt-1 text-sm", newBest ? "font-semibold text-correct" : "text-dim")}>
        {newBest ? t.newBest : best !== null ? t.best.replace("{n}", String(best)) : " "}
      </p>
      <div className="mt-3 flex justify-center gap-2">
        <button type="button" onClick={onAgain} className={primary} autoFocus>
          {t.again}
        </button>
        <button type="button" onClick={onChange} className={secondary}>
          {t.change}
        </button>
      </div>
    </div>
  );
}

/** Header status: score in practice, the clock against the clock, the streak with no mistakes. */
export function ChallengeStatus({ t, score, state, onStop }: { t: T; score: string; state: ChallengeState; onStop?: () => void }) {
  const { challenge, tally, left } = state;
  const text =
    challenge.kind === "timed"
      ? t.rightNow.replace("{r}", String(tally.right))
      : challenge.kind === "streak"
        ? t.streakNow.replace("{n}", String(tally.right))
        : score;
  return (
    <>
      {challenge.kind === "timed" && left !== null ? (
        <span
          className={cn("font-mono text-base tabular-nums", left <= 10 ? "text-wrong" : "text-amber-text")}
          aria-label={t.clock}
          role="timer"
        >
          {formatClock(left)}
        </span>
      ) : null}
      <span aria-live="polite">{text}</span>
      {onStop ? (
        <button type="button" onClick={onStop} className="rounded-full border border-line px-2.5 py-0.5 text-xs text-dim hover:text-ink">
          {t.stop}
        </button>
      ) : null}
    </>
  );
}
