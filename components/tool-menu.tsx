import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";
import { ExerciseFigure, type ExerciseFigureId } from "@/components/exercise-figure";
import type { Menu, Strings, TrackId, When } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/** One card per entry of `menu.modes`, in the same order: where it goes (null while it is not built), when it comes, and the still drawn at the top of its card (Learn's exercises). */
export type MenuItem = { href: string | null; when: When; figure?: ExerciseFigureId };

/**
 * Learn's tracks (Will, 2026-10-02: the notes on the neck, reading music, reading tab), in the
 * order of the picker on its page and of its rows in the sidebar; each track's cards in the order
 * of `learnMenu.tracks[id].modes`. A track's page is `/learn/<id>`.
 */
export const LEARN_TRACKS: { id: TrackId; items: MenuItem[] }[] = [
  {
    id: "notes",
    items: [
      { href: "/learn/name-the-note", when: "now", figure: "name" },
      { href: "/learn/find-the-note", when: "now", figure: "find" },
      { href: null, when: "next", figure: "hear" },
    ],
  },
  {
    id: "reading",
    items: [
      { href: "/learn/read-the-note", when: "now", figure: "read" },
      { href: "/learn/staff-to-neck", when: "now", figure: "staffNeck" },
      { href: "/learn/read-a-bar", when: "now", figure: "bar" },
      { href: "/learn/sight-reading", when: "now", figure: "sight" },
    ],
  },
  {
    id: "tab",
    items: [
      { href: null, when: "next", figure: "tabNeck" },
      { href: null, when: "next", figure: "neckTab" },
      { href: null, when: "next", figure: "riff" },
      { href: null, when: "next", figure: "symbols" },
    ],
  },
];

export const trackPath = (id: TrackId) => `/learn/${id}`;

/** The track a Learn address belongs to, its own page or one of its exercises ("/learn/read-a-bar" → "reading"). Takes the address without `/es`. */
export function trackOf(path: string): TrackId | null {
  for (const track of LEARN_TRACKS) {
    if (path === trackPath(track.id) || track.items.some(({ href }) => href && path.startsWith(href))) return track.id;
  }
  return null;
}

/** What is coming to Learn, for the landing: a track with nothing built yet is one entry under its name, otherwise its exercises still to come; then the tracks for later. */
export function comingToLearn(t: Strings): { title: string; when: When }[] {
  const coming = LEARN_TRACKS.flatMap(({ id, items }) => {
    const track = t.learnMenu.tracks[id];
    if (items.every((i) => i.when !== "now")) return [{ title: track.name, when: items.some((i) => i.when === "next") ? ("next" as const) : ("later" as const) }];
    return items.flatMap((i, n) => (i.when === "now" ? [] : [{ title: track.modes[n].title, when: i.when }]));
  });
  return [...coming, ...t.learnMenu.later.map(({ title }) => ({ title, when: "later" as const }))];
}

export const PRACTICE_ITEMS: MenuItem[] = [
  { href: "/practice/neck", when: "now" },
  { href: "/practice/metronome", when: "now" },
  { href: "/practice/backing-tracks", when: "now" },
  { href: "/practice/fingers", when: "now" },
];

export const SETUP_ITEMS: MenuItem[] = [
  { href: "/setup/strings", when: "now" },
  { href: "/setup/tuner", when: "now" },
  { href: null, when: "next" },
  { href: null, when: "next" },
  { href: null, when: "later" },
  { href: null, when: "later" },
  { href: null, when: "later" },
  { href: null, when: "later" },
];

/** The cards of a menu, the built ones linked: one per mode, in the order of `items`. */
export function MenuCards({ t, modes, items }: { t: Strings; modes: { title: string; body: string }[]; items: MenuItem[] }) {
  const h = t.home;
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {modes.map((m, i) => {
        const { href: path, when, figure } = items[i];
        const still = figure ? (
          <div className="mb-4">
            <ExerciseFigure id={figure} names={t.game.noteNames} />
          </div>
        ) : null;
        const href = path ? `${t.base}${path}` : null;
        const tag = when === "now" ? h.start : when === "next" ? h.next : h.later;
        const enter = "animate-in fade-in slide-in-from-bottom-3 fill-mode-both duration-500 motion-reduce:animate-none";
        const delay = { animationDelay: `${i * 70}ms` };
        return href ? (
          <li key={m.title} className={enter} style={delay}>
            <Link
              href={href}
              className="group flex h-full min-w-0 flex-col rounded-2xl border border-amber/50 bg-surface p-5 transition-[transform,border-color,background-color] duration-200 hover:-translate-y-0.5 hover:border-amber hover:bg-surface-raised active:translate-y-0 active:scale-[0.99] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              {still}
              <span className="text-xs font-semibold text-correct">{tag}</span>
              <span className="mt-2 flex items-center justify-between font-display text-xl font-semibold">
                {m.title}
                <ArrowRight className="size-5 text-amber transition-transform group-hover:translate-x-0.5" />
              </span>
              <span className="mt-1.5 text-sm text-dim">{m.body}</span>
            </Link>
          </li>
        ) : (
          <li key={m.title} className={cn("flex min-w-0 flex-col rounded-2xl border border-line p-5 opacity-70", enter)} style={delay}>
            {still}
            <span className="flex items-center gap-1.5 text-xs font-semibold text-dim">
              <Lock className="size-3" aria-hidden />
              {tag}
            </span>
            <span className="mt-2 font-display text-xl font-semibold">{m.title}</span>
            <span className="mt-1.5 text-sm text-dim">{m.body}</span>
          </li>
        );
      })}
    </ul>
  );
}

/** A side of the app, Practice or Setup: its tools as cards, the built ones first and linked. Learn has its own page, split into tracks (components/learn-menu.tsx). */
export function ToolMenu({ t, menu, items, footer }: { t: Strings; menu: Menu; items: MenuItem[]; footer?: ReactNode }) {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-6 sm:py-10">
      <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">{menu.title}</h1>
      <p className="mt-2 text-dim">{menu.lede}</p>
      <div className="mt-8">
        <MenuCards t={t} modes={menu.modes} items={items} />
      </div>
      {footer}
    </main>
  );
}
