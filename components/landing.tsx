import { ArrowRight, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/logo";
import { TryIt } from "@/components/try-it";
import { ToolShowcase } from "@/components/tool-showcase";
import { Footer } from "@/components/footer";
import { SiteNav } from "@/components/site-nav";
import { HowFigure } from "@/components/how-figures";
import { OpenApp } from "@/components/open-app";
import type { Strings, When } from "@/lib/i18n";

const whenClass: Record<When, string> = {
  now: "bg-correct/15 text-correct",
  next: "bg-amber/15 text-amber-text",
  later: "bg-white/5 text-dim",
};

export function Landing({ t }: { t: Strings }) {
  return (
    <main className="flex-1">
      <SiteNav t={t} area="site" />

      {/* Hero. On a phone the playable neck sits right under the headline, before any paragraph;
          from lg up it takes the right column against the whole text block. */}
      <section className="mx-auto grid w-full max-w-6xl gap-x-12 gap-y-7 px-4 pt-10 pb-16 lg:grid-cols-[1.05fr_1fr] lg:grid-rows-[auto_auto] lg:items-center lg:gap-y-6 lg:pt-24 lg:pb-28">
        <div className="lg:col-start-1 lg:row-start-1 lg:self-end">
          <p className="text-sm font-medium tracking-wide text-amber-text uppercase">{t.hero.eyebrow}</p>
          <h1 className="mt-4 font-display text-[2.6rem] leading-[1.02] font-semibold text-balance sm:text-6xl lg:text-7xl">
            {t.hero.h1}
          </h1>
        </div>
        <TryIt t={t} className="lg:col-start-2 lg:row-span-2 lg:row-start-1 shadow-[0_30px_60px_rgba(0,0,0,0.55)] ring-1 ring-amber/20" />
        <div className="lg:col-start-1 lg:row-start-2 lg:self-start">
          <p className="max-w-xl text-lg text-pretty text-dim">
            {t.hero.lede}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild size="lg" className="h-11 px-5 text-base">
              <OpenApp lang={t.code}>
                {t.hero.cta} <ArrowRight className="size-4" />
              </OpenApp>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-11 border-line bg-surface px-5 text-base text-ink hover:bg-surface-raised hover:text-ink">
              <a href="#tools">{t.hero.secondary}</a>
            </Button>
          </div>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-dim">
            {t.hero.trust.map((s) => (
              <li key={s} className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-amber" aria-hidden />
                {s}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* The tools, each card opening its tool */}
      <section id="tools" className="border-t border-line">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:py-24">
          <p className="text-sm font-medium tracking-wide text-amber-text uppercase">{t.tools.eyebrow}</p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
            {t.tools.h2}
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-dim">{t.tools.lede}</p>
          <ToolShowcase t={t} />
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="border-t border-line bg-surface/40">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:py-24">
          <p className="text-sm font-medium tracking-wide text-amber-text uppercase">{t.how.eyebrow}</p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
            {t.how.h2}
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-dim">{t.how.lede}</p>
          <ol className="mt-12 grid gap-6 sm:grid-cols-3">
            {t.how.steps.map((s, i) => (
              <li key={s.title} className="flex flex-col rounded-2xl border border-line bg-stage p-5 sm:p-6">
                <HowFigure step={i} t={t} className="mb-5 h-auto w-full" />
                <span className="font-display text-4xl font-semibold text-amber">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 font-display text-xl font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-dim">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* What you learn */}
      <section id="learn" className="mx-auto w-full max-w-6xl px-4 py-14 sm:py-24">
        <p className="text-sm font-medium tracking-wide text-amber-text uppercase">{t.learn.eyebrow}</p>
        <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
          {t.learn.h2}
        </h2>
        <p className="mt-4 max-w-2xl text-lg text-dim">{t.learn.lede}</p>
        <div className="mt-12 grid gap-10">
          {t.learn.tracks.map((tr) => (
            <div key={tr.title} className="grid gap-6 lg:grid-cols-[260px_1fr]">
              <div>
                <h3 className="font-display text-2xl font-semibold">{tr.title}</h3>
                <p className="mt-2 text-sm text-dim">{tr.lede}</p>
              </div>
              <ul className="grid gap-4 sm:grid-cols-2">
                {tr.items.map((m) => (
                  <li key={m.title} className="rounded-2xl border border-line bg-surface p-5">
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${whenClass[m.when]}`}>
                      {t.learn.when[m.when]}
                    </span>
                    <h4 className="mt-3 font-semibold">{m.title}</h4>
                    <p className="mt-1.5 text-sm text-dim">{m.body}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* The name */}
      <section className="border-y border-line bg-surface/40">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 py-14 sm:py-24 lg:grid-cols-[auto_1fr]">
          <LogoMark size={150} className="rounded-[22%] ring-1 ring-white/10" />
          <div>
            <p className="text-sm font-medium tracking-wide text-amber-text uppercase">{t.name.eyebrow}</p>
            <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-6xl" lang="grc">
              δίεσις
            </h2>
            {t.name.p.map((p, i) => (
              <p key={i} className={i === 0 ? "mt-5 max-w-2xl text-lg text-dim" : "mt-3 max-w-2xl text-lg text-dim"}>
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="mx-auto w-full max-w-6xl px-4 py-14 sm:py-24">
        <p className="text-sm font-medium tracking-wide text-amber-text uppercase">{t.pricing.eyebrow}</p>
        <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
          {t.pricing.h2}
        </h2>
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="rounded-2xl border border-line bg-surface p-6 sm:p-8">
            <p className="font-display text-5xl font-semibold">{t.pricing.price}</p>
            <p className="mt-2 text-dim">{t.pricing.sub}</p>
            <ul className="mt-6 grid gap-2 text-sm sm:grid-cols-2">
              {t.pricing.list.map((s) => (
                <li key={s} className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-correct" aria-hidden />
                  {s}
                </li>
              ))}
            </ul>
            <Button asChild size="lg" className="mt-8 h-11 px-5 text-base">
              <OpenApp lang={t.code}>
                {t.nav.cta} <ArrowRight className="size-4" />
              </OpenApp>
            </Button>
          </div>
          <div className="rounded-2xl border border-dashed border-line p-6 sm:p-8">
            <p className="flex items-center gap-2 text-sm font-semibold text-amber-text">
              <span className="size-2 rounded-full bg-amber" aria-hidden />
              {t.pricing.contactTitle}
            </p>
            <p className="mt-3 text-dim">
              {t.pricing.contact}{" "}
              <a href="mailto:hello@diesis.app" className="text-ink underline underline-offset-4">
                hello@diesis.app
              </a>{" "}
              {t.pricing.contactAfter}
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t border-line bg-surface/40">
        <div className="mx-auto w-full max-w-3xl px-4 py-14 sm:py-24">
          <p className="text-sm font-medium tracking-wide text-amber-text uppercase">{t.faq.eyebrow}</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-5xl">{t.faq.h2}</h2>
          <div className="mt-10 divide-y divide-line border-y border-line">
            {t.faq.items.map((f) => (
              <details key={f.q} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span className="text-dim transition-transform group-open:rotate-45" aria-hidden>
                    +
                  </span>
                </summary>
                <p className="mt-3 text-dim">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Who makes it */}
      <section id="maker" className="mx-auto grid w-full max-w-6xl gap-6 px-4 pt-14 sm:pt-24 lg:grid-cols-[1fr_1.2fr] lg:gap-12">
        <div>
          <p className="text-sm font-medium tracking-wide text-amber-text uppercase">{t.maker.eyebrow}</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-balance sm:text-5xl">{t.maker.h2}</h2>
        </div>
        <div>
          {t.maker.p.map((p, i) => (
            <p key={i} className={i === 0 ? "text-lg text-dim lg:mt-2" : "mt-3 text-lg text-dim"}>
              {p}
            </p>
          ))}
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild variant="outline" className="border-line bg-surface text-ink hover:bg-surface-raised hover:text-ink">
              <a href="https://willdafer.es" target="_blank" rel="noopener">
                <Globe className="size-4" /> {t.maker.site}
              </a>
            </Button>
            <Button asChild variant="outline" className="border-line bg-surface text-ink hover:bg-surface-raised hover:text-ink">
              <a href="https://instagram.com/willdafer.es" target="_blank" rel="noopener">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="size-4" aria-hidden>
                  <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
                  <circle cx="12" cy="12" r="4.2" />
                  <circle cx="17.6" cy="6.4" r="1" fill="currentColor" stroke="none" />
                </svg>
                {t.maker.instagram}
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:py-24">
        <div className="rounded-2xl border border-line bg-surface px-6 py-14 sm:px-12">
          <h2 className="max-w-2xl font-display text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
            {t.closing.h2}
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-dim">{t.closing.lede}</p>
          <Button asChild size="lg" className="mt-8 h-11 px-5 text-base">
            <OpenApp lang={t.code}>
              {t.nav.cta} <ArrowRight className="size-4" />
            </OpenApp>
          </Button>
        </div>
      </section>

      <Footer t={t} />
    </main>
  );
}
