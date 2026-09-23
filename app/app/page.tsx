import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";
import { Logo } from "@/components/logo";
import { LangSwitch } from "@/components/lang-switch";
import { currentStrings } from "@/lib/lang";

const hrefs = ["/app/name-the-note", null, null, null, null] as const;
const tags = ["play", "next", "next", "later", "later"] as const;

export default async function AppHome() {
  const t = await currentStrings();
  const h = t.home;
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 py-6 sm:py-10">
      <header className="flex items-center justify-between">
        <Link href={t.base || "/"} aria-label="Diesis">
          <Logo />
        </Link>
        <div className="flex items-center gap-3">
          <Link href={t.base || "/"} className="text-sm text-dim hover:text-ink">
            {h.about}
          </Link>
          <LangSwitch t={t} next="/app" />
        </div>
      </header>
      <h1 className="mt-10 font-display text-3xl font-semibold tracking-tight sm:text-4xl">{h.h1}</h1>
      <p className="mt-2 text-dim">{h.lede}</p>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {h.modes.map((m, i) => {
          const href = hrefs[i];
          const tag = tags[i] === "play" ? h.play : tags[i] === "next" ? h.next : h.later;
          return href ? (
            <li key={m.title}>
              <Link
                href={href}
                className="group flex h-full flex-col rounded-2xl border border-amber/50 bg-surface p-5 transition-colors hover:border-amber hover:bg-surface-raised"
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
            <li key={m.title} className="flex flex-col rounded-2xl border border-line p-5 opacity-70">
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
