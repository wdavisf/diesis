import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/footer";
import { HowFigure } from "@/components/how-figures";
import { JsonLd } from "@/components/json-ld";
import { SiteNav } from "@/components/site-nav";
import { ToolFigure } from "@/components/tool-figure";
import { TryIt } from "@/components/try-it";
import { FEATURES, FEATURE_TOOL, featurePath } from "@/lib/features";
import { strings, type FeatureId, type Strings } from "@/lib/i18n";
import { featureData } from "@/lib/structured-data";

const eyebrow = "text-sm font-medium tracking-wide text-amber-text uppercase";
const h2 = "max-w-2xl font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl";

/**
 * The public page of one tool (Will, 2026-09-30: "landing pages per feature" with a link to the
 * full version): what it does, how to use it, the questions people search, and the way into the
 * tool in the app. Copy in `features.pages` (lib/i18n.ts); the still at the top is the landing
 * card's, except Name the note, whose page carries the playable exercise from the landing's hero.
 */
export function FeaturePage({ t, id }: { t: Strings; id: FeatureId }) {
  const f = t.features;
  const page = f.pages[id];
  const tool = FEATURE_TOOL[id];
  const toolHref = `${t.base}${tool.href}`;
  const home = t.base || "/";
  const open = (
    <Button asChild size="lg" className="h-11 px-5 text-base">
      <Link href={toolHref}>
        {page.cta} <ArrowRight className="size-4" />
      </Link>
    </Button>
  );

  return (
    <main className="flex-1">
      <JsonLd data={featureData(t, id, t.tools.items[FEATURES.indexOf(id)].title)} />
      <SiteNav t={t} other={featurePath(strings[t.otherLang], id)} />

      <section className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-x-12 gap-y-8 px-4 pt-10 pb-16 lg:grid-cols-[1.05fr_1fr] lg:pt-20 lg:pb-24">
        <div>
          <p className={eyebrow}>{t.nav.areas[tool.side]} · Diesis</p>
          <h1 className="mt-4 font-display text-4xl leading-[1.05] font-semibold text-balance sm:text-5xl lg:text-6xl">{page.h1}</h1>
          <p className="mt-5 max-w-xl text-lg text-pretty text-dim">{page.lede}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {open}
            <Button asChild size="lg" variant="outline" className="h-11 border-line bg-surface px-5 text-base text-ink hover:bg-surface-raised hover:text-ink">
              <Link href={`${home}#tools`}>{f.all}</Link>
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
        {id === "name" ? (
          <TryIt t={t} className="shadow-[0_30px_60px_rgba(0,0,0,0.55)] ring-1 ring-amber/20" />
        ) : (
          <div className="min-w-0 rounded-[22px] border border-line bg-stage p-4 shadow-[0_30px_60px_rgba(0,0,0,0.55)] ring-1 ring-amber/20 sm:p-6">
            <ToolFigure id={id} t={t} />
          </div>
        )}
      </section>

      <section className="border-t border-line">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:py-20">
          <p className={eyebrow}>{t.tools.items[FEATURES.indexOf(id)].title}</p>
          <h2 className={`mt-3 ${h2}`}>{f.what}</h2>
          <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {page.points.map((p) => (
              <li key={p.title} className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
                <h3 className="font-display text-xl font-semibold">{p.title}</h3>
                <p className="mt-2 text-dim">{p.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-line bg-surface/40">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:py-20">
          <h2 className={h2}>{f.how}</h2>
          <ol className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {page.steps.map((s, i) => (
              <li key={s.title} className="flex flex-col rounded-2xl border border-line bg-stage p-5 sm:p-6">
                {id === "name" ? <HowFigure step={i} t={t} className="mb-5 h-auto w-full" /> : null}
                <span className="font-display text-4xl font-semibold text-amber">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 font-display text-xl font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-dim">{s.body}</p>
              </li>
            ))}
          </ol>
          <div className="mt-10">{open}</div>
        </div>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto w-full max-w-3xl px-4 py-14 sm:py-20">
          <h2 className={h2}>{f.faq}</h2>
          <div className="mt-8 divide-y divide-line border-y border-line">
            {page.faq.map((q) => (
              <details key={q.q} className="group py-4" open>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold [&::-webkit-details-marker]:hidden">
                  {q.q}
                  <span className="text-dim transition-transform group-open:rotate-45" aria-hidden>
                    +
                  </span>
                </summary>
                <p className="mt-3 text-dim">{q.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-14 sm:pb-20">
        <div className="rounded-2xl border border-line bg-surface px-6 py-12 sm:px-12">
          <h2 className="max-w-2xl font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl">{t.closing.h2}</h2>
          <p className="mt-3 max-w-2xl text-lg text-dim">{f.closing}</p>
          <div className="mt-7">{open}</div>
        </div>
      </section>

      <section className="border-t border-line bg-surface/40">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:py-20">
          <h2 className={h2}>{f.others}</h2>
          <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((other, i) =>
              other === id ? null : (
                <li key={other} className="min-w-0">
                  <Link
                    href={featurePath(t, other)}
                    className="group flex h-full flex-col rounded-2xl border border-line bg-stage p-5 transition-colors hover:border-amber/60"
                  >
                    <span className="text-xs font-semibold tracking-wide text-amber-text uppercase">{t.tools.items[i].side}</span>
                    <span className="mt-1 flex items-center justify-between gap-3 font-display text-xl font-semibold">
                      {t.tools.items[i].title}
                      <ArrowRight className="size-4 shrink-0 text-amber transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
                    </span>
                    <span className="mt-1.5 text-sm text-dim">{t.tools.items[i].body}</span>
                  </Link>
                </li>
              ),
            )}
          </ul>
        </div>
      </section>

      <Footer t={t} />
    </main>
  );
}
