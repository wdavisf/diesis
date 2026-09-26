import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, GraduationCap, Timer } from "lucide-react";
import { appMetadata, currentStrings } from "@/lib/lang";

export async function generateMetadata(): Promise<Metadata> {
  const t = await currentStrings();
  return appMetadata("/start", t.home.title);
}

/** The app's front door (Will, 2026-09-26): "What do you want to do today?", Learn or Practice. */
export default async function Start() {
  const t = await currentStrings();
  const h = t.home;
  const doors = [
    { href: `${t.base}/learn`, title: t.nav.areas.learn, body: h.learn, tools: t.nav.learnTools, Icon: GraduationCap },
    { href: `${t.base}/practice`, title: t.nav.areas.practice, body: h.practice, tools: t.nav.practiceTools, Icon: Timer },
  ];
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 py-6 sm:py-10">
      <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-5xl">{h.h1}</h1>
      <p className="mt-2 text-dim">{h.lede}</p>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {doors.map(({ href, title, body, tools, Icon }, i) => (
          <li
            key={href}
            className="animate-in fade-in slide-in-from-bottom-3 fill-mode-both duration-500 motion-reduce:animate-none"
            style={{ animationDelay: `${i * 90}ms` }}
          >
            <Link
              href={href}
              className="group flex h-full flex-col rounded-3xl border border-amber/50 bg-surface p-6 transition-[transform,border-color,background-color] duration-200 hover:-translate-y-0.5 hover:border-amber hover:bg-surface-raised active:translate-y-0 active:scale-[0.99] motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:p-8"
            >
              <Icon className="size-8 text-amber" aria-hidden />
              <span className="mt-4 flex items-center justify-between font-display text-3xl font-semibold sm:text-4xl">
                {title}
                <ArrowRight className="size-6 text-amber transition-transform group-hover:translate-x-1" />
              </span>
              <span className="mt-2 text-dim">{body}</span>
              <span className="mt-5 flex flex-wrap gap-1.5">
                {tools.map((tool) => (
                  <span key={tool} className="rounded-full border border-line px-2.5 py-0.5 text-xs text-dim">
                    {tool}
                  </span>
                ))}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
