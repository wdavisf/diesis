import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";
import { Logo } from "@/components/logo";

const modes = [
  { title: "Name the note", body: "A position lights and plays. Say which note it is.", href: "/app/name-the-note", tag: "Play" },
  { title: "Find the note", body: "You get a name. Tap every place it lives.", tag: "Coming next" },
  { title: "Hear the note", body: "A note plays with nothing lit. Find it on the neck.", tag: "Coming next" },
  { title: "Scales", body: "Explore, build, name the scale, name the degree.", tag: "Later" },
  { title: "Reading music", body: "The note on the staff, the place on the neck.", tag: "Later" },
];

export default function AppHome() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 py-6 sm:py-10">
      <header className="flex items-center justify-between">
        <Link href="/" aria-label="Diesis home">
          <Logo />
        </Link>
        <Link href="/" className="text-sm text-dim hover:text-ink">
          About Diesis
        </Link>
      </header>
      <h1 className="mt-10 font-display text-3xl font-semibold tracking-tight sm:text-4xl">Pick a mode</h1>
      <p className="mt-2 text-dim">Guitar on your lap, screen sideways if it is a phone.</p>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {modes.map((m) =>
          m.href ? (
            <li key={m.title}>
              <Link
                href={m.href}
                className="group flex h-full flex-col rounded-2xl border border-amber/50 bg-surface p-5 transition-colors hover:border-amber hover:bg-surface-raised"
              >
                <span className="text-xs font-semibold text-correct">{m.tag}</span>
                <span className="mt-2 flex items-center justify-between font-display text-xl font-semibold">
                  {m.title}
                  <ArrowRight className="size-5 text-amber transition-transform group-hover:translate-x-0.5" />
                </span>
                <span className="mt-1.5 text-sm text-dim">{m.body}</span>
              </Link>
            </li>
          ) : (
            <li key={m.title} className="flex flex-col rounded-2xl border border-line p-5 opacity-70">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-dim">
                <Lock className="size-3" aria-hidden />
                {m.tag}
              </span>
              <span className="mt-2 font-display text-xl font-semibold">{m.title}</span>
              <span className="mt-1.5 text-sm text-dim">{m.body}</span>
            </li>
          ),
        )}
      </ul>
    </main>
  );
}
