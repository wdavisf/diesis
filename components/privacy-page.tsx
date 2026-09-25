import { Footer } from "@/components/footer";
import { SiteNav } from "@/components/site-nav";
import type { Strings } from "@/lib/i18n";

export function PrivacyPage({ t }: { t: Strings }) {
  const p = t.privacy;
  return (
    <main className="flex-1">
      <SiteNav t={t} area="site" />
      <article className="mx-auto w-full max-w-3xl px-4 py-12">
        <p className="text-sm font-medium tracking-wide text-amber-text uppercase">{p.eyebrow}</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">{p.h1}</h1>
        <p className="mt-2 text-sm text-dim">{p.updated}</p>
        <p className="mt-6 text-lg">{p.summary}</p>
        {p.sections.map((s) => (
          <section key={s.h} className="mt-10">
            <h2 className="font-display text-2xl font-semibold">{s.h}</h2>
            {s.p.map((para) => (
              <p key={para} className="mt-3 text-dim">
                {para}
              </p>
            ))}
          </section>
        ))}
        <section className="mt-10">
          <h2 className="font-display text-2xl font-semibold">{p.contactHeading}</h2>
          <p className="mt-3 text-dim">
            {p.contact}{" "}
            <a href="mailto:hello@diesis.app" className="text-ink underline underline-offset-4">
              hello@diesis.app
            </a>
          </p>
        </section>
      </article>
      <Footer t={t} />
    </main>
  );
}
