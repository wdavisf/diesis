# Diesis — project context

Guitar trainer: notes on the neck first, then scales, then reading music (score) for classical
guitar, and the tools a guitarist practices with: a learning tool, not a game. A web app first; a native app only if it earns one. Name from Greek δίεσις,
the semitone, one fret. Domain diesis.app (Namecheap, DNS on Vercel). Repo `wdavisf/diesis` on
GitHub (public).

Notion page "Diesis" (https://app.notion.com/p/3e645a93be8581a5aeccc6e40ba25f0b, private, created
2026-09-25) is the readable overview for Will, with child pages Roadmap, Releases and Decisions.
Every release: add it to the Releases page too; when a decision or the roadmap changes, update
those pages in the same session.

The spec is Will's Todoist project "Diesis" (id `6hWGmFjPwF25mCxM`, sections 0–9): read it through
the Todoist tools before proposing scope. This file records what has been decided and built; the
Todoist project records what is still to do.

## Decisions

- **Positioning (Will, 2026-09-25): a learning tool, never "a game".** Promise: everything you
  need to master the guitar, to become the best guitarist you can be. No "game", "play",
  "round", «juego», «jugar», «ronda» or «partida» in user-facing copy (playing the guitar is
  fine); say practice, exercise, session, start. The trainer lives at `/learn` (Will disliked
  diesis.app/app); code identifiers like `GameShell` stay.
- **Market (decided 2026-09-25, Claude's call when Will asked):** English is the main market for
  the future premium plan; Spanish is a full second language at `/es`, and Spain is where the
  first users and feedback come from. diesis.app stays the main domain; diesis.es, if bought,
  only redirects to `/es`.
- **Vision (Will, 2026-09-25): the one guitar app you need.** Diesis grows from a fretboard
  trainer into the standalone software a guitarist keeps open, replacing the separate tools Will
  uses today: fretboard games, every scale, reading music, a metronome and a speed trainer
  (rising tempo), an instrument profile (6, 7 or 8 strings, tuning, scale length) that every
  game and tool reads, and setup tools (string gauges and tension, which strings suit your
  guitar, action and intonation after a string change). Todoist sections 10–12 hold these.
  Consequence for code now: do not bake six strings or standard tuning deeper into `lib/core`
  or the fretboard; tuning should become an input. The landing page only promises what exists
  or is next; add the tools there when they are built.

- **2026-09-23, rebuilt as a web app, Tabula-style (Will).** One Next.js 16 app at the repo root:
  the landing page at `/`, the trainer under `/learn` (was `/app` until 0.7.0; `next.config.ts` redirects). The Expo
  shell, the native audio player and the separate Astro site are gone (git history has them). No
  mobile app for now; "we'll see" later. The pure game logic survived the move unchanged.
- **Stack**: Next.js 16 (app router, `proxy.ts` not middleware), React 19, Tailwind v4, shadcn
  (radix-nova, neutral), Geist for text and Fraunces for display. Game logic in `lib/core` is pure
  TypeScript with Vitest, no React imports. Fretboard is plain SVG. Audio is Web Audio.
- **No access gate (Will, 2026-09-23).** The app is open to anyone: `/app` asks for no code,
  account or cookie. The `/login` route, `proxy.ts` and the `DIESIS_ACCESS_CODE` env that gated
  `/app/*` from 0.2.0 to 0.3.0 are gone (git history has them; the shared code `RYUJIN` is dead).
  If access control ever comes back it will be an account, not a shared code.
- **Scope on the landing page** (three tracks): Notes (Name the note, Find the note,
  challenges and the start-card settings playable now; Hear the note, fret range and one string
  at a time next), Scales (later: explore, build, name the scale,
  name the degree), Reading music (later, for classical guitar: note on the staff to name or
  neck, neck to staff, short reading passages). Keep the page and the app home in step with what
  exists.
- **Mode A** as built: open `/learn/name-the-note`, board in landscape, one position lit and
  played, twelve buttons, "Wrong" keeps the question, "Correct" shows the name on the board and
  moves on. Frets 0–12, six strings, all twelve notes. Desktop keys: C D E F G A B pick a note,
  Shift for the sharp, Space or Enter replays (or starts).
- **Mode B, Find the note** (built 2026-09-24): open `/learn/find-the-note`. A note name is
  shown under the board; the player taps every position of that pitch class in frets 0–12,
  six strings. Every tap plays the note tapped. Partial-answer rules (decided when building,
  Will can overrule): a right tap stays green with the name; a wrong tap flashes red with its
  real name for 0.7 s and counts one mistake, the round goes on; the round ends when all are
  found; in Practice a "Show me" button reveals the rest and moves on. Core: `positionsOf`
  and `nextFindRound` in `lib/core/quiz.ts` (never the same note twice in a row).
- **Setup screen (Will, 2026-09-24: the picker over the neck "looks awful").** Every mode
  opens on `components/setup-screen.tsx`, a full screen inside the same `GameShell` (sideways
  on phones): challenge, minutes, notes, names, the stored best for that pick, Start. The
  board only mounts once the round starts; the result card is still an overlay on the board.
  The mode hooks call `player.preload()` on mount so the WAVs download during setup and Start
  only decodes (`lib/audio/note-player.ts` keeps the bytes; decoding gets a copy).
- **Challenges** (Will, 2026-09-24): every mode starts on a picker. Practice (endless),
  Against the clock (1, 2 or 5 min, score = right answers; mistakes counted, do not end it),
  No mistakes (score = right answers before the first mistake). In Find the note each position
  found is one right answer. Pure rules in `lib/core/challenge.ts`; clock and storage in
  `lib/game/use-challenge.ts`. Personal bests in localStorage `diesis_best:<mode>:<challenge>`
  (per browser, never sent; the privacy page says so), last pick in `diesis_challenge`. The
  Todoist "note-count challenge" (fixed number of notes, timed) is not built.
- **Scales after notes**; the engine will model a scale as its full-neck set with boxed
  positions on top. Not yet designed in detail. **Reading music** is a new track (Will,
  2026-09-23): not yet specified beyond the landing-page copy; needs a staff renderer and a
  guitar-range note model (treble clef, sounds an octave lower).
- **Skins**: one skin. When a second arrives, every skin carries an `unlock` field. Any paid
  skin on the web needs an account first.
- Note names use ♯ (U+266F). Sharps by default; a flat spelling exists in the core for a future
  setting. Enharmonics are one pitch class; the quiz never asks for a spelling.
- Fretboard drawing: nut on the left, string 1 (high E) at the top, fret numbers under the
  board, real logarithmic fret spacing scaled to the range, open strings get a zone left of the
  nut. The hero animation in `components/screen.tsx` uses the same geometry.
- Audio: placeholder samples synthesised by `tools/gen-samples.mjs` (Karplus-Strong, one WAV per
  MIDI pitch 40–88) in `public/samples/nylon/`, committed. Real nylon and electric samples with
  clear licensing are a Todoist task. Web Audio unlocks on the "Tap to start" gesture.
- **Orientation (Will, 2026-09-24: "it should open in landscape whatever the user has set").**
  A web page cannot rotate an iPhone, so on a touch device narrower than `md` in portrait the
  play screen (`GameFrame` → `GameShell sideways`) is drawn turned 90° clockwise and sized to
  the viewport's long side (`.game-sideways` in `globals.css`, centered on the viewport and
  turned about its middle): landscape even under rotation lock, right edge of the phone up.
  **The setup screen stays upright** (Will, 2026-09-24) and on Start the play screen arrives
  with `.game-enter`: on phones it grows from 40% and swings 0°→90° into place (`game-turn`,
  0.8 s), elsewhere a short zoom (`game-in`). The consent banner hides while sideways
  (`body:has(.game-sideways)`). The old rotate gate survives only for a narrow desktop window
  (fine pointer), worded "make the window wider", and only on the play screen.
- **Audio on iOS**: `lib/audio/note-player.ts` sets `navigator.audioSession.type = "playback"`
  before creating the AudioContext (Safari 17+), otherwise the silent switch mutes Web Audio;
  `play()` resumes a suspended context. Will reported silence on his phone 2026-09-24.
- **Analytics (Will, 2026-09-23)**: Google Analytics 4, property `G-HNHYBR8Y13`, loaded by
  `components/consent.tsx` only after the visitor accepts a banner (cookie `diesis_consent`,
  one year). Decline loads nothing from Google. The privacy page describes it in both
  languages; keep it true.
- **Note names and naturals are settings (Will, 2026-09-24)**, chosen on the start card of
  every mode (`ChallengePicker`), kept in localStorage by `lib/game/use-settings.ts`
  (`diesis_names`: `solfege` | `letters`; `diesis_naturals`: `yes` | `no`), never sent. Names
  default to solfège in the Spanish UI and letters in English (`namesFor` in `lib/core/notes.ts`
  holds both spellings, sharps as ♯); the landing keeps the language default via
  `game.noteNames`. Naturals only feeds `QuizSettings.naturalsOnly`, shows seven buttons in Mode
  A, ignores Shift on the keyboard, and keeps its own personal bests (`name:naturals`,
  `find:naturals`). The core stays in pitch classes; names are display only.
- **Spanish copy is written natively, never translated literally** (Will, 2026-09-23, after
  rejecting a literal pass). Spain register: ordenador, móvil, «échate una ronda».
- **Standing rule: when the game changes (modes, settings, wording, pricing, privacy behavior),
  update the landing page, the app home and the privacy page in the same session.** All copy,
  EN and ES, is in `lib/i18n.ts`; edit both languages together. The landing and privacy pages
  have `/es` routes (SEO, hreflang); the mode picker and game read the `diesis_lang`
  cookie, set by `/lang/[code]` (the switcher and the landing CTAs go through it). Values in the
  strings file must be plain data (no functions): they cross into client components.
- **Landing on phones (Will, 2026-09-24: "only text").** The hero is a grid: headline, then the
  animated `Screen`, then the lede, CTAs and trust line; from `lg` the screen takes the right
  column against the whole text block. The hero lede stays at three or four short sentences;
  detail goes to "How it works" and "What you learn". Each "How it works" step carries a drawn
  figure (`components/how-figures.tsx`: neck slice, button row, green/red verdict, in the game's
  colors, note names per language). Section padding is `py-14 sm:py-24`.
- **Who makes it (Will, 2026-09-25)**: a landing section (`#maker`, before the closing card)
  in Will's first person, linking willdafer.es and Instagram `@willdafer.es`. Copy in
  `t.maker`; keep it true to what he actually does.
- **Motion and navigation (Will, 2026-09-24: "navigation is clunky, add animations").** No
  React/Next view transitions (not stable here); everything is CSS. `app/learn/template.tsx` fades
  every screen under `/learn` in (opacity only: a transform there would become the containing
  block of the fixed sideways game shell). Mode cards stagger in (`app/learn/page.tsx`), the
  start and result cards zoom in (`challenge-card.tsx`), board marks pop in and ease amber to
  green (`.mark` in `globals.css`), note buttons press (`active:scale-95`), the verdict pops.
  Utilities come from `tw-animate-css`; every animation carries `motion-reduce:animate-none`.
  The landing's "Open the app" is `components/open-app.tsx`: a prefetched `Link` to `/learn`
  that writes the `diesis_lang` cookie on click, instead of the `/lang` redirect hop. The
  language switch itself still goes through `/lang` (a real navigation, on purpose).
- **Logo (Will, 2026-09-23)**: a real lowercase delta, δ, set on five staff lines like a note
  on a score. The outline is EB Garamond's δ (SIL Open Font License, extracted with fontTools);
  amber letter, cream lines at 45%, on the stage tile. Will rejected a hand-drawn δ: it must
  look like the letter. Drawing lives in `components/logo.tsx` and `public/favicon.svg`;
  `npm run icons` renders `icon.png` and `og.png` from the SVG. Change both files together.
  **The wordmark is "δiesis" (Will, 2026-09-24)**: next to the mark, the D of the word is that
  same δ, drawn inline as SVG at text size by `DeltaGlyph` in `components/logo.tsx` (Fraunces has
  no Greek). Only the wordmark; page titles, copy and the `<title>` keep the Latin "Diesis".
- **Link preview (Will, 2026-09-24)**: the card is the game, one per language: "¿Qué nota es?" /
  "Which note is it?", the tagline under it, the wordmark top right, frets 0–7 with C lit on
  string 2, and the seven natural buttons with C green. A page that sets its own `openGraph`
  must repeat `images` (Next replaces the object, it does not merge): `/es` pages use
  `og-es.png`. Bump the `?v=` on the image URLs when the card changes.

## Hosting

Vercel project `diesis-site` (team wdavisf-gmailcoms-projects), Git integration from
`wdavisf/diesis` main, framework Next.js at the repo root, no environment variables (the old
`DIESIS_ACCESS_CODE` is no longer read and can be deleted from the project settings). Domains
diesis.app and www (redirects to the apex); DNS at Namecheap. Live since 2026-09-23. The old `diesis-play` project (play.diesis.app, Expo web export) is obsolete; its Git
integration was disconnected 2026-09-24 (every push had been failing a build there and emailing
Will), and it can be deleted in the dashboard. The repo folder is linked to `diesis-site` (`.vercel/`, ignored), so
`npx vercel deploy --prod` works as well as a push.

**Search (2026-09-25)**: diesis.app is verified in Google Search Console (DNS TXT at Namecheap).
`app/sitemap.ts` lists `/`, `/es` and both privacy pages with hreflang pairs; `app/robots.ts`
points to it and keeps `/lang/` out. Add new public pages to the sitemap.

## Layout of the repo

- `app/` — routes: `page.tsx` and `es/page.tsx` (landing), `privacy/` and `es/privacy/`,
  `learn/` (mode picker), `learn/name-the-note/`, `learn/find-the-note/`, `lang/[code]/` (cookie setter).
  `layout.tsx` holds fonts and metadata; `globals.css` the theme tokens.
- `components/` — `landing`, `privacy-page`, `logo`, `screen` (animated hero), `footer`,
  `lang-switch`, `fretboard` (SVG, marks and tap targets), `note-panel`, `game-frame`
  (`GameShell`: sideways treatment, gate, header; `GameFrame`: the board inside it),
  `setup-screen` (before a round), `challenge-card` (result card, header status, `Chip`),
  `game` (Mode A), `find-game` (Mode B), `how-figures` and `open-app` (landing), `ui/`.
- `lib/i18n.ts` — every string, EN and ES. `lib/lang.ts` — reads the language cookie.
- `lib/core/` — note model (`notes.ts`), question generator (`quiz.ts`), tests. Pure TS.
- `lib/core/challenge.ts` — challenge rules. `lib/audio/note-player.ts` — Web Audio sampler.
  `lib/game/use-mode-a.ts`, `use-mode-b.ts` — mode hooks; `use-challenge.ts` — score and clock;
  `use-settings.ts` — note names and naturals only, in localStorage.
- `design/tokens.json` and `docs/design-system.md` — design system; tokens before screens.
- `tools/gen-samples.mjs` (`npm run samples`), `tools/icons.mjs` (`npm run icons`, regenerates
  `public/icon.png` from `public/favicon.svg` and the link previews `public/og.png` and
  `public/og-es.png` from `tools/og-card.mjs`, drawn with satori via `next/og`, fonts in `tools/fonts`).
- `public/samples/nylon/` — generated WAVs, committed so a clone plays without the script.

## Commands

- `npm run dev` — dev server on 3000 (also `.claude/launch.json` → `diesis-dev`).
- `npm test` — core tests (Vitest). `npm run typecheck` — tsc (run `npm run build` once first so
  Next generates its route types). `npm run lint`. `npm run build` — production build.
- Env: none. A clone runs as is.
- Deploy: push to `main` (Vercel Git integration) or `npx vercel deploy --prod`.
- Every release: bump `version` in `package.json`, write the CHANGELOG entry, commit **and push
  to `main` in the same session, without asking** (Will, 2026-09-24: any change he asks for in
  Diesis goes straight to production; a commit left unpushed once meant the live site kept the
  access gate he had asked to remove). Check the Vercel deploy reached production afterwards.

## Conventions

- Same working style as Akoe and Tabula: this file is the living spec, `CHANGELOG.md` is written
  for users (newest first), design tokens before screens.
- American English in code and docs. UI copy in English and Spanish, both in `lib/i18n.ts`.
- Do not import React under `lib/core`.
- Keep `app/globals.css` and `components/fretboard.tsx` colors in step with `design/tokens.json`.
