"use client";

import type { ReactNode } from "react";
import { Lock, Trophy } from "lucide-react";
import { namesFor, pitchClassOf, STRING_COUNTS, tuningsFor } from "@/lib/core/notes";
import { ACHIEVEMENTS, earnedAchievements, type Best } from "@/lib/core/records";
import { useGuitar } from "@/lib/game/use-guitar";
import { eraseLocalData, useRecords } from "@/lib/game/use-records";
import { useSettings } from "@/lib/game/use-settings";
import type { Strings } from "@/lib/i18n";
import { Chip } from "@/components/challenge-card";
import { LangSwitch } from "@/components/lang-switch";
import { cn } from "@/lib/utils";

function Section({ title, lede, aside, children }: { title: string; lede?: string; aside?: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-line bg-surface/40 p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-semibold">{title}</h2>
          {lede ? <p className="mt-1 text-sm text-dim">{lede}</p> : null}
        </div>
        {aside}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

/**
 * The profile: the player's guitar (strings and tuning), how notes are named, the language, the
 * records and the achievements they unlock, and a way to erase it all. Everything is local to
 * this browser; there is no account.
 */
export function Profile({ t }: { t: Strings }) {
  const p = t.profile;
  const guitar = useGuitar();
  const prefs = useSettings(t.code === "es" ? "solfege" : "letters");
  const names = namesFor(prefs.names);
  const bests = useRecords();
  const earned = earnedAchievements(bests);
  const count = guitar.preset.notes.length;

  const bestLabel = (b: Best) =>
    [
      b.exercise === "name" ? t.game.title : t.find.title,
      b.challenge.kind === "timed" ? `${t.challenge.timed} ${t.challenge.minutes.replace("{m}", String(b.challenge.seconds / 60))}` : t.challenge.streak,
      b.naturals ? t.settings.naturals : null,
      b.strings !== 6 ? p.stringsCount.replace("{n}", String(b.strings)) : null,
    ]
      .filter(Boolean)
      .join(" · ");

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-5 px-4 py-6 sm:py-10">
      <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">{p.title}</h1>

      <Section title={p.guitar} lede={p.guitarLede}>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-dim">{p.strings}</span>
            <div role="radiogroup" aria-label={p.strings} className="flex gap-2">
              {STRING_COUNTS.map((n) => (
                <Chip key={n} on={count === n} onClick={() => guitar.setTuning(tuningsFor(n)[0].id)}>
                  {n}
                </Chip>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-dim">{p.tuning}</span>
            <div role="radiogroup" aria-label={p.tuning} className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {tuningsFor(count).map((tu) => {
                const on = guitar.preset.id === tu.id;
                return (
                  <button
                    key={tu.id}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => guitar.setTuning(tu.id)}
                    className={cn(
                      "flex items-baseline justify-between gap-3 rounded-xl border px-3.5 py-2.5 text-left outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50",
                      on ? "border-amber bg-amber/10" : "border-line hover:bg-surface",
                    )}
                  >
                    <span className={cn("font-medium", on ? "text-amber-text" : "text-ink")}>{p.tunings[tu.id]}</span>
                    {/* Lowest string first, the way a player reads a tuning out loud. */}
                    <span className="text-xs text-dim tabular-nums">{[...tu.notes].reverse().map((m) => names[pitchClassOf(m)]).join(" ")}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </Section>

      <Section title={p.names} lede={p.namesLede}>
        <div role="radiogroup" aria-label={p.names} className="flex gap-2">
          <Chip on={prefs.names === "solfege"} onClick={() => prefs.setNames("solfege")}>
            {t.settings.solfege}
          </Chip>
          <Chip on={prefs.names === "letters"} onClick={() => prefs.setNames("letters")}>
            {t.settings.letters}
          </Chip>
        </div>
      </Section>

      <Section title={p.language} aside={<LangSwitch t={t} next={`${t.otherLang === "es" ? "/es" : ""}/profile`} />}>
        <p className="text-sm text-dim">{t.code === "es" ? "Español" : "English"}</p>
      </Section>

      <Section title={p.records}>
        {bests.length === 0 ? (
          <p className="text-sm text-dim">{p.recordsEmpty}</p>
        ) : (
          <ul className="divide-y divide-line">
            {bests.map((b) => (
              <li key={bestLabel(b)} className="flex items-center justify-between gap-4 py-2.5">
                <span className="text-sm">{bestLabel(b)}</span>
                <span className="font-display text-xl font-semibold tabular-nums text-amber-text">{b.value}</span>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section
        title={p.achievements}
        aside={<span className="text-sm text-dim tabular-nums">{p.achievementsCount.replace("{e}", String(earned.size)).replace("{t}", String(ACHIEVEMENTS.length))}</span>}
      >
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
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
      </Section>

      <Section title={p.data} lede={p.dataBody}>
        <button
          type="button"
          onClick={() => {
            if (!window.confirm(p.eraseConfirm)) return;
            eraseLocalData();
            window.location.reload();
          }}
          className="h-10 rounded-xl border border-wrong/60 px-4 text-sm font-medium text-wrong outline-none transition-colors hover:bg-wrong/10 focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {p.erase}
        </button>
      </Section>
    </main>
  );
}
