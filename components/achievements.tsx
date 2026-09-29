"use client";

import { Lock, Trophy } from "lucide-react";
import { ACHIEVEMENTS, earnedAchievements } from "@/lib/core/records";
import { useRecords } from "@/lib/game/use-records";
import type { Strings } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/** The achievements, earned ones lit, in a card. Read from the bests kept in this browser; used on the profile and under the Learn menu. */
export function Achievements({ t, className }: { t: Strings; className?: string }) {
  const p = t.profile;
  const earned = earnedAchievements(useRecords());
  return (
    <section className={cn("rounded-2xl border border-line bg-surface/40 p-5 sm:p-6", className)}>
      <div className="flex items-start justify-between gap-4">
        <h2 className="font-display text-xl font-semibold">{p.achievements}</h2>
        <span className="text-sm text-dim tabular-nums">{p.achievementsCount.replace("{e}", String(earned.size)).replace("{t}", String(ACHIEVEMENTS.length))}</span>
      </div>
      <ul className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {ACHIEVEMENTS.map((a) => {
          const on = earned.has(a.id);
          const text = p.achievementList[a.id];
          return (
            <li key={a.id} className={cn("flex items-start gap-3 rounded-xl border p-3", on ? "border-amber/60 bg-amber/10" : "border-line opacity-60")}>
              <span className={cn("mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full", on ? "bg-amber text-stage" : "bg-line text-dim")}>
                {on ? <Trophy className="size-4" aria-hidden /> : <Lock className="size-3.5" aria-hidden />}
              </span>
              <span>
                <span className={cn("block text-sm font-semibold", on ? "text-amber-text" : "text-ink")}>{text.title}</span>
                <span className="block text-xs text-dim">{text.body}</span>
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
