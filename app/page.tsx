import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo, LogoMark } from "@/components/logo";
import { Screen } from "@/components/screen";
import { Footer } from "@/components/footer";

const steps = [
  {
    title: "A position lights up",
    body: "One spot on the neck turns amber and the note plays. Frets 0 to 12, all six strings, every one of the twelve notes.",
  },
  {
    title: "Name it",
    body: "Twelve buttons along the bottom, C to B, sharps written as ♯. On a laptop, just press the letter.",
  },
  {
    title: "Green or red, then the next one",
    body: "Right: the spot turns green with the name written on it and the next note lights a moment later. Wrong: the button flashes red and the same note waits for you.",
  },
];

type When = "now" | "next" | "later";
const whenLabel: Record<When, string> = { now: "Playable now", next: "Coming next", later: "Later" };
const whenClass: Record<When, string> = {
  now: "bg-correct/15 text-correct",
  next: "bg-amber/15 text-amber-text",
  later: "bg-white/5 text-dim",
};

const tracks: { title: string; lede: string; items: { title: string; body: string; when: When }[] }[] = [
  {
    title: "Notes",
    lede: "Where every note lives on the neck, until you stop having to think about it.",
    items: [
      { title: "Name the note", body: "A position lights, you say which note it is. The one you can play today.", when: "now" },
      { title: "Find the note", body: "You get a name. Tap every place it lives within the fret range, until you have them all.", when: "next" },
      { title: "Hear the note", body: "A note plays with nothing lit. Tap a place on the neck where it could be.", when: "next" },
      { title: "Settings and challenges", body: "Fret range, naturals only, one string at a time, timed rounds, note-count rounds, personal bests.", when: "next" },
    ],
  },
  {
    title: "Scales",
    lede: "Any scale on the whole neck, then the shapes inside it.",
    items: [
      { title: "Explore a scale", body: "Pick a root and a scale and see every position lit, the root in its own color. The study screen, not a quiz.", when: "later" },
      { title: "Build the scale", body: "Given a root and a scale name, tap every note of it within the range. Same game as Find the note, bigger target.", when: "later" },
      { title: "Name the scale, name the degree", body: "A shape lights and you say which scale or mode it is. A note lights inside a scale and you say which degree. Major and its modes, pentatonics, blues, the minors.", when: "later" },
    ],
  },
  {
    title: "Reading music",
    lede: "For classical guitar: the note on the staff, the place on the neck, the same thing.",
    items: [
      { title: "Read the note", body: "A note appears on the treble staff. Name it, or find it on the neck. Guitar clef, guitar range, ledger lines included.", when: "later" },
      { title: "Read the position", body: "A spot lights on the neck and you place it on the staff. The other direction, so both stick.", when: "later" },
      { title: "Rhythm and reading practice", body: "Short passages to read at a click, the way a teacher would hand you a line. Later, once the notes are solid.", when: "later" },
    ],
  },
];

const faq = [
  {
    q: "Do I need an account?",
    a: "Not yet. Diesis is in private preview: you get an access code, type it once, and the browser remembers it. Scores live in your browser and nowhere else.",
  },
  {
    q: "Is there sound?",
    a: "Yes. Tap once to start (browsers require it) and each position plays as it lights. \"Hear again\" repeats it. The sound is a synthesised nylon pluck for now; recordings of a real guitar will replace it.",
  },
  {
    q: "Sharps or flats?",
    a: "Sharps, written as ♯. F♯ and G♭ are the same place on the neck, and the game never asks which spelling you prefer. A flats setting is planned.",
  },
  {
    q: "Which frets?",
    a: "Frets 0 to 12 on all six strings, standard tuning. A range picker (say, frets 5 to 9 only) is one of the next things to arrive.",
  },
  {
    q: "Phone or laptop?",
    a: "Either, in a browser. The neck is long and thin, so on a phone Diesis asks you to turn it sideways. On a laptop it fills the window and the letter keys pick the note.",
  },
  {
    q: "Left-handed?",
    a: "Not yet. The board is drawn the way chord books draw it, nut on the left, high E on top. A mirrored board is on the list.",
  },
  {
    q: "Will there be a mobile app?",
    a: "The web version comes first and works on a phone today. A native app comes if enough people want one.",
  },
];

export default function Landing() {
  return (
    <main className="flex-1">
      <header className="sticky top-0 z-20 border-b border-line/80 bg-stage/80 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" aria-label="Diesis home">
            <Logo />
          </Link>
          <nav className="flex items-center gap-1">
            <Button asChild variant="ghost" size="sm" className="hidden text-dim hover:bg-white/5 hover:text-ink sm:inline-flex">
              <a href="#how">How it works</a>
            </Button>
            <Button asChild variant="ghost" size="sm" className="hidden text-dim hover:bg-white/5 hover:text-ink sm:inline-flex">
              <a href="#learn">What you learn</a>
            </Button>
            <Button asChild variant="ghost" size="sm" className="hidden text-dim hover:bg-white/5 hover:text-ink sm:inline-flex">
              <a href="#faq">FAQ</a>
            </Button>
            <Button asChild size="sm" className="ml-2">
              <Link href="/app">
                Open the app <ArrowRight className="size-4" />
              </Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto grid w-full max-w-6xl items-center gap-12 px-4 pt-14 pb-20 lg:grid-cols-[1.05fr_1fr] lg:pt-24 lg:pb-28">
        <div>
          <p className="text-sm font-medium tracking-wide text-amber-text uppercase">Guitar fretboard trainer</p>
          <h1 className="mt-4 font-display text-5xl leading-[1] font-semibold text-balance sm:text-6xl lg:text-7xl">
            Know every note on the neck.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-pretty text-dim">
            A spot lights up on the fretboard and you hear it. Name it. Right turns green and moves on; wrong stays
            until you get it. A few minutes a day with the guitar on your lap, and the neck stops being a mystery.
            Scales and reading music follow, on the same neck.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="h-11 px-5 text-base">
              <Link href="/app">
                Open the app <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-11 border-line bg-surface px-5 text-base text-ink hover:bg-surface-raised hover:text-ink">
              <a href="#how">How it works</a>
            </Button>
          </div>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-dim">
            {["Free in preview", "No account", "Phone or laptop, in the browser"].map((s) => (
              <li key={s} className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-amber" aria-hidden />
                {s}
              </li>
            ))}
          </ul>
        </div>
        <Screen className="drop-shadow-[0_30px_60px_rgba(0,0,0,0.55)]" />
      </section>

      {/* How it works */}
      <section id="how" className="border-t border-line bg-surface/40">
        <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:py-24">
          <p className="text-sm font-medium tracking-wide text-amber-text uppercase">How it works</p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
            See the note. Name it. Know at once.
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-dim">
            One thing at a time, the way a teacher would do it across the table. Nothing to set up.
          </p>
          <ol className="mt-12 grid gap-6 sm:grid-cols-3">
            {steps.map((s, i) => (
              <li key={s.title} className="flex flex-col rounded-2xl border border-line bg-stage p-6">
                <span className="font-display text-4xl font-semibold text-amber">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 font-display text-xl font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-dim">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* What you learn */}
      <section id="learn" className="mx-auto w-full max-w-6xl px-4 py-20 sm:py-24">
        <p className="text-sm font-medium tracking-wide text-amber-text uppercase">What you learn</p>
        <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
          Notes first. Then scales. Then the page.
        </h2>
        <p className="mt-4 max-w-2xl text-lg text-dim">
          Diesis grows in the order a player learns: first where the notes are, then the shapes built from them, then
          reading them off a score, for anyone heading toward classical guitar.
        </p>
        <div className="mt-12 grid gap-10">
          {tracks.map((t) => (
            <div key={t.title} className="grid gap-6 lg:grid-cols-[260px_1fr]">
              <div>
                <h3 className="font-display text-2xl font-semibold">{t.title}</h3>
                <p className="mt-2 text-sm text-dim">{t.lede}</p>
              </div>
              <ul className="grid gap-4 sm:grid-cols-2">
                {t.items.map((m) => (
                  <li key={m.title} className="rounded-2xl border border-line bg-surface p-5">
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${whenClass[m.when]}`}>
                      {whenLabel[m.when]}
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
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 py-20 sm:py-24 lg:grid-cols-[auto_1fr]">
          <LogoMark size={150} className="rounded-[22%] ring-1 ring-white/10" />
          <div>
            <p className="text-sm font-medium tracking-wide text-amber-text uppercase">The name</p>
            <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-6xl" lang="grc">
              δίεσις
            </h2>
            <p className="mt-5 max-w-2xl text-lg text-dim">
              Diesis is the old Greek word for the smallest step in the scale: the semitone. On a guitar that is one
              fret. In Italian and Spanish the same word still means the sharp sign, ♯.
            </p>
            <p className="mt-3 max-w-2xl text-lg text-dim">
              That is the whole idea. Learn the neck one fret at a time, and the rest follows.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="mx-auto w-full max-w-6xl px-4 py-20 sm:py-24">
        <p className="text-sm font-medium tracking-wide text-amber-text uppercase">Pricing</p>
        <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
          Free while it is in preview.
        </h2>
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="rounded-2xl border border-line bg-surface p-6 sm:p-8">
            <p className="font-display text-5xl font-semibold">Free</p>
            <p className="mt-2 text-dim">The browser version costs nothing and asks for nothing but an access code.</p>
            <ul className="mt-6 grid gap-2 text-sm sm:grid-cols-2">
              {["Every mode that exists", "No account, no sign-up", "Phone or laptop", "No ads, no tracking"].map((s) => (
                <li key={s} className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-correct" aria-hidden />
                  {s}
                </li>
              ))}
            </ul>
            <Button asChild size="lg" className="mt-8 h-11 px-5 text-base">
              <Link href="/app">
                Open the app <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
          <div className="rounded-2xl border border-dashed border-line p-6 sm:p-8">
            <p className="flex items-center gap-2 text-sm font-semibold text-amber-text">
              <span className="size-2 rounded-full bg-amber" aria-hidden />
              Need a code?
            </p>
            <p className="mt-3 text-dim">
              Diesis is being built in the open with a handful of players. Write to{" "}
              <a href="mailto:hello@diesis.app" className="text-ink underline underline-offset-4">
                hello@diesis.app
              </a>{" "}
              and say what you play. Extra fretboards and sounds may become small one-off purchases later; the game
              itself stays free.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t border-line bg-surface/40">
        <div className="mx-auto w-full max-w-3xl px-4 py-20 sm:py-24">
          <p className="text-sm font-medium tracking-wide text-amber-text uppercase">FAQ</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-5xl">Questions</h2>
          <div className="mt-10 divide-y divide-line border-y border-line">
            {faq.map((f) => (
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

      {/* Closing */}
      <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:py-24">
        <div className="rounded-2xl border border-line bg-surface px-6 py-14 sm:px-12">
          <h2 className="max-w-2xl font-display text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
            Guitar on your lap?
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-dim">Play a round. It takes a minute.</p>
          <Button asChild size="lg" className="mt-8 h-11 px-5 text-base">
            <Link href="/app">
              Open the app <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </main>
  );
}
