"use client";

import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { TIMED_SECONDS, type Challenge } from "@/lib/core/challenge";
import type { Settings } from "@/lib/game/use-settings";
import type { Strings } from "@/lib/i18n";
import { Chip, primary } from "@/components/challenge-card";
import { cn } from "@/lib/utils";

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[6.5rem_1fr] items-center gap-3 sm:grid-cols-[8rem_1fr]">
      <span className="text-sm font-medium text-dim">{label}</span>
      <div role="radiogroup" aria-label={label} className="flex gap-2">
        {children}
      </div>
    </div>
  );
}

/**
 * The screen before a round, in place of the board: the challenge, the clock, which notes and
 * how they are named, then Start. Same shell as the game, so a phone stays sideways. The Start
 * tap is also the gesture that unlocks audio.
 */
export function SetupScreen({
  tc,
  ts,
  hint,
  value,
  onChange,
  settings,
  best,
  onStart,
  loading,
  loadingLabel,
}: {
  tc: Strings["challenge"];
  ts: Strings["settings"];
  /** One line on what the mode asks of you. */
  hint: string;
  value: Challenge;
  onChange: (c: Challenge) => void;
  settings: Settings;
  /** Personal best for the challenge as picked, or null. */
  best: number | null;
  onStart: () => void;
  loading: boolean;
  loadingLabel: string;
}) {
  const seconds = value.kind === "timed" ? value.seconds : null;
  const sub = value.kind === "timed" ? tc.timedSub : value.kind === "streak" ? tc.streakSub : tc.practiceSub;
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-auto px-4 pb-3 animate-in fade-in fill-mode-both duration-300 motion-reduce:animate-none">
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center gap-3 py-2 [@media(max-height:30rem)]:gap-2">
        <p className="text-sm text-dim [@media(max-height:26rem)]:hidden">{hint}</p>
        <Row label={ts.challenge}>
          <Chip on={value.kind === "practice"} onClick={() => onChange({ kind: "practice" })}>
            {tc.practice}
          </Chip>
          <Chip on={value.kind === "timed"} onClick={() => onChange({ kind: "timed", seconds: seconds ?? TIMED_SECONDS[0] })}>
            {tc.timed}
          </Chip>
          <Chip on={value.kind === "streak"} onClick={() => onChange({ kind: "streak" })}>
            {tc.streak}
          </Chip>
        </Row>
        {seconds !== null ? (
          <Row label={ts.time}>
            {TIMED_SECONDS.map((s) => (
              <Chip key={s} on={s === seconds} onClick={() => onChange({ kind: "timed", seconds: s })}>
                {tc.minutes.replace("{m}", String(s / 60))}
              </Chip>
            ))}
          </Row>
        ) : null}
        <Row label={ts.notes}>
          <Chip on={!settings.naturalsOnly} onClick={() => settings.setNaturalsOnly(false)}>
            {ts.all}
          </Chip>
          <Chip on={settings.naturalsOnly} onClick={() => settings.setNaturalsOnly(true)}>
            {ts.naturals}
          </Chip>
        </Row>
        <Row label={ts.names}>
          <Chip on={settings.names === "solfege"} onClick={() => settings.setNames("solfege")}>
            {ts.solfege}
          </Chip>
          <Chip on={settings.names === "letters"} onClick={() => settings.setNames("letters")}>
            {ts.letters}
          </Chip>
        </Row>
        <div className="mt-1 flex items-center justify-between gap-4 border-t border-line pt-3">
          <p className="min-w-0 text-sm text-dim">
            {sub}
            {best !== null ? <span className="text-amber-text"> · {tc.best.replace("{n}", String(best))}</span> : null}
          </p>
          <button type="button" onClick={onStart} disabled={loading} className={cn(primary, "inline-flex shrink-0 items-center gap-2")}>
            {loading ? loadingLabel : tc.start}
            {loading ? null : <ArrowRight className="size-5" aria-hidden />}
          </button>
        </div>
      </div>
    </div>
  );
}
