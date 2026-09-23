import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Privacy",
  description: "What Diesis does with your data. Short version: nothing. No account, no analytics, nothing leaves your browser.",
};

const sections = [
  {
    h: "The game",
    p: [
      "Diesis runs entirely in your browser. It does not ask who you are, does not create an account, and does not send anything you do in the game to us or to anyone else.",
      "Scores for the current session are held in memory and disappear when you close the tab. When settings and personal bests arrive, they will be stored in your browser only.",
    ],
  },
  {
    h: "The access code",
    p: [
      "While Diesis is in private preview, the app sits behind an access code. Typing it sets one cookie in your browser so you are not asked again for six months. The cookie holds the code and nothing about you.",
    ],
  },
  {
    h: "This website",
    p: [
      "diesis.app is hosted by Vercel, which keeps standard server logs (IP address, browser, pages requested) for a short time to run the service and keep it safe. We add no analytics, tracking pixels or advertising.",
    ],
  },
  { h: "Children", p: ["Diesis collects no personal data from anyone, of any age."] },
  { h: "Changes", p: ["If this policy changes, the new version is published here with a new date. It will never quietly start collecting data."] },
];

export default function PrivacyPage() {
  return (
    <main className="flex-1">
      <header className="mx-auto flex w-full max-w-3xl items-center justify-between px-4 py-4">
        <Link href="/" aria-label="Diesis home">
          <Logo />
        </Link>
      </header>
      <article className="mx-auto w-full max-w-3xl px-4 py-12">
        <p className="text-sm font-medium tracking-wide text-amber-text uppercase">Privacy</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">Privacy policy</h1>
        <p className="mt-2 text-sm text-dim">Last updated 23 September 2026</p>
        <p className="mt-6 text-lg">
          Diesis collects nothing. There is no account, no analytics, no advertising, and nothing you do in the game
          leaves your browser.
        </p>
        {sections.map((s) => (
          <section key={s.h} className="mt-10">
            <h2 className="font-display text-2xl font-semibold">{s.h}</h2>
            {s.p.map((p) => (
              <p key={p} className="mt-3 text-dim">
                {p}
              </p>
            ))}
          </section>
        ))}
        <section className="mt-10">
          <h2 className="font-display text-2xl font-semibold">Contact</h2>
          <p className="mt-3 text-dim">
            Questions about privacy, or about Diesis in general:{" "}
            <a href="mailto:hello@diesis.app" className="text-ink underline underline-offset-4">
              hello@diesis.app
            </a>
          </p>
        </section>
      </article>
      <Footer />
    </main>
  );
}
