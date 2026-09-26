import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";
import type { Menu, Strings, When } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/** One card per entry of `menu.modes`, in the same order: where it goes (null while it is not built) and when it comes. */
export type MenuItem = { href: string | null; when: When };

export const LEARN_ITEMS: MenuItem[] = [
  { href: "/learn/name-the-note", when: "now" },
  { href: "/learn/find-the-note", when: "now" },
  { href: null, when: "next" },
  { href: null, when: "later" },
  { href: null, when: "later" },
  { href: null, when: "later" },
];

export const PRACTICE_ITEMS: MenuItem[] = [
  { href: "/practice/neck", when: "now" },
  { href: "/practice/metronome", when: "now" },
  { href: "/practice/backing-tracks", when: "now" },
];

export const SETUP_ITEMS: MenuItem[] = [
  { href: "/setup/strings", when: "now" },
  { href: null, when: "next" },
  { href: null, when: "next" },
  { href: null, when: "later" },
  { href: null, when: "later" },
  { href: null, when: "later" },
  { href: null, when: "later" },
];

/** A side of the app, Learn or Practice: its tools as cards, the built ones first and linked. */
export function ToolMenu({ t, menu, items }: { t: Strings; menu: Menu; items: MenuItem[] }) {
  const h = t.home;
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 py-6 sm:py-10">
      <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">{menu.title}</h1>
      <p className="mt-2 text-dim">{menu.lede}</p>
      <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {menu.modes.map((m, i) => {
          const { href: path, when } = items[i];
          const href = path ? `${t.base}${path}` : null;
          const tag = when === "now" ? h.start : when === "next" ? h.next : h.later;
          const enter = "animate-in fade-in slide-in-from-bottom-3 fill-mode-both duration-500 motion-reduce:animate-none";
          const delay = { animationDelay: `${i * 70}ms` };
          return href ? (
            <li key={m.title} className={enter} style={delay}>
              <Link
                href={href}
                className="group flex h-full flex-col rounded-2xl border border-amber/50 bg-surface p-5 transition-[transform,border-color,background-color] duration-200 hover:-translate-y-0.5 hover:border-amber hover:bg-surface-raised active:translate-y-0 active:scale-[0.99] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                <span className="text-xs font-semibold text-correct">{tag}</span>
                <span className="mt-2 flex items-center justify-between font-display text-xl font-semibold">
                  {m.title}
                  <ArrowRight className="size-5 text-amber transition-transform group-hover:translate-x-0.5" />
                </span>
                <span className="mt-1.5 text-sm text-dim">{m.body}</span>
              </Link>
            </li>
          ) : (
            <li key={m.title} className={cn("flex flex-col rounded-2xl border border-line p-5 opacity-70", enter)} style={delay}>
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
    </main>
  );
}
