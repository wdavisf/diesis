import type { Metadata } from "next";
import Link from "next/link";
import { Achievements } from "@/components/achievements";
import { RememberTrack } from "@/components/learn-link";
import { LEARN_TRACKS, MenuCards, trackPath } from "@/components/tool-menu";
import type { TrackId } from "@/lib/i18n";
import { appMetadata, currentStrings } from "@/lib/lang";
import { cn } from "@/lib/utils";

export async function learnMetadata(track: TrackId): Promise<Metadata> {
  const t = await currentStrings();
  return appMetadata(trackPath(track), `${t.learnMenu.tracks[track].name} · ${t.learnMenu.title}`);
}

/**
 * Learn's page, one per track (Will, 2026-10-02, design C of five: "C all the way"). On phones a
 * picker at the top (from md the sidebar lists the tracks, so there the track's name instead), Fretboard · Notation · Tab, each its own address (/learn/notes, /learn/reading,
 * /learn/tab), and under it that track's exercises as cards. Learn opens on the track opened last
 * (`RememberTrack`); the tracks still to come are named at the foot.
 */
export async function LearnMenu({ track }: { track: TrackId }) {
  const t = await currentStrings();
  const m = t.learnMenu;
  const { items } = LEARN_TRACKS.find(({ id }) => id === track)!;
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-6 sm:py-10">
      <RememberTrack id={track} />
      <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">{m.title}</h1>
      <p className="mt-2 text-dim">{m.lede}</p>

      {/* Phones only: from md the sidebar lists the tracks already (Will, 2026-10-02). */}
      <nav aria-label={m.title} className="mt-6 grid w-full max-w-md grid-cols-3 gap-1 rounded-xl border border-line bg-surface p-1 md:hidden">
        {LEARN_TRACKS.map(({ id }) => {
          const on = id === track;
          return (
            <Link
              key={id}
              href={`${t.base}${trackPath(id)}`}
              aria-current={on ? "page" : undefined}
              scroll={false}
              className={cn(
                "flex h-10 min-w-0 items-center justify-center rounded-lg px-2 text-sm outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50",
                on ? "bg-surface-raised font-semibold text-amber-text ring-1 ring-amber/35" : "text-dim hover:text-ink",
              )}
            >
              <span className="truncate">{m.tracks[id].short}</span>
            </Link>
          );
        })}
      </nav>

      {/* Where the picker is hidden, the track's name says which one is open. */}
      <h2 className="sr-only md:not-sr-only md:mt-10 md:font-display md:text-2xl md:font-semibold">{m.tracks[track].name}</h2>
      <p className="mt-6 text-dim md:mt-1">{m.tracks[track].lede}</p>
      <div className="mt-4">
        <MenuCards t={t} modes={m.tracks[track].modes} items={items} />
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-1.5">
        <span className="mr-1 text-sm text-dim">{t.home.later}:</span>
        {m.later.map(({ title }) => (
          <span key={title} className="rounded-full border border-line px-2.5 py-0.5 text-xs text-dim">
            {title}
          </span>
        ))}
      </div>
      <Achievements t={t} className="mt-8" />
    </main>
  );
}
