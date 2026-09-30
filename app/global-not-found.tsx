import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { RootDocument, rootViewport } from "@/components/root-document";
import { LANGS, strings } from "@/lib/i18n";

export const metadata: Metadata = { title: "404 · Diesis", icons: { icon: "/favicon.svg" } };
export const viewport = rootViewport;

/** An address that matches nothing. It cannot know the visitor's language (nothing is rendered
 *  for the request), so it says it in both, each with the way back to its landing. */
export default function GlobalNotFound() {
  return (
    <RootDocument lang="en">
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center gap-10 px-4 py-16">
        <Link href="/" aria-label="Diesis" className="self-start">
          <Logo size="lg" />
        </Link>
        {LANGS.map((lang) => {
          const t = strings[lang];
          return (
            <section key={lang} lang={lang}>
              <h1 className="font-display text-3xl font-semibold tracking-tight">{t.notFound.title}</h1>
              <p className="mt-2 text-dim">{t.notFound.body}</p>
              <Link href={t.base || "/"} className="mt-4 inline-block font-semibold text-amber-text underline underline-offset-4">
                {t.notFound.home}
              </Link>
            </section>
          );
        })}
      </main>
    </RootDocument>
  );
}
