# Diesis — project context

Guitar trainer: notes on the neck first, then scales, then reading music (score) for classical
guitar, and the tools a guitarist practices with: a learning tool, not a game. A web app first; a native app only if it earns one. Name from Greek δίεσις,
the semitone, one fret. Domain diesis.app (Namecheap, DNS on Vercel). Repo `wdavisf/diesis` on
GitHub (public).

Notion page "Diesis" (https://app.notion.com/p/3e645a93be8581a5aeccc6e40ba25f0b, private, created
2026-09-25) is the readable overview for Will, with child pages Roadmap, Releases and Decisions.
**Update Notion only when Will asks** (Will, 2026-09-25): never on a release or decision by
default. When he asks, bring Releases, Decisions and Roadmap up to date from CHANGELOG.md and
this file.

The spec is Will's Todoist project "Diesis" (id `6hWGmFjPwF25mCxM`, sections 0–9): read it through
the Todoist tools before proposing scope. This file records what has been decided and built; the
Todoist project records what is still to do.

## Decisions

- **Positioning (Will, 2026-09-25): a learning tool, never "a game".** Promise: everything you
  need to master the guitar, to become the best guitarist you can be. No "game", "play",
  "round", «juego», «jugar», «ronda» or «partida» in user-facing copy (playing the guitar is
  fine); say practice, exercise, session, start. The app opens at `/start` (Will disliked
  diesis.app/app); code identifiers like `GameShell` stay.
- **Learn or Practice (Will, 2026-09-26: "what do you want to do today, learn or practice?").**
  The app has two sides. `/start` (what "Open the app" opens) asks the question with two
  doors. **Learn** (`/learn`): the exercises that teach (Name the note, Find the note; later
  Hear the note, scale exercises, reading music, the glossary). **Practice** (`/practice`): the
  tools you play with (the neck, the metronome; later the tuner, strings and setup). The
  profile is at `/profile`, on neither side. Menus are `components/tool-menu.tsx`
  (`LEARN_ITEMS`/`PRACTICE_ITEMS`, copy in `learnMenu`/`practiceMenu`); all app routes live in
  the route group `app/(app)/`. Old `/practice/neck`, `/practice/metronome`, `/profile` and
  their `/es` twins redirect (`next.config.ts`; redirects run before `proxy.ts`).
- **Market (decided 2026-09-25, Claude's call when Will asked):** English is the main market for
  the future premium plan; Spanish is a full second language at `/es`, and Spain is where the
  first users and feedback come from. diesis.app stays the main domain; diesis.es only redirects to `/es`.
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
  played, twelve buttons in a column right of the board (Will, 2026-09-26: a row under the
  board was hard to reach; `GameFrame`'s `aside`), one row per natural with its sharp beside
  it, C at the top, "Wrong" keeps the question, "Correct" shows the name on the board and
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
- **Metronome** (built 2026-09-25, Will: "empieza con el metrónomo"): open `/practice/metronome`,
  an upright screen (no neck, never sideways). Tempo 20–300 with ±1/±5, a slider and tap tempo
  (average of the last five taps, a 2 s pause starts over); the Italian marking under the
  number; meters 2/4, 3/4, 4/4, 5/4 (3+2), 6/8 (3+3), 7/8 (2+2+3), group starts get a second
  accent; subdivision 1, 2, 3, 4 or 6 (sextuplets, Will 2026-09-25; the beat dots shrink for
  them); accent on the one or none. Keys: Space, ←/→ (Shift ×5), T. Rules in
  `lib/core/metronome.ts` (tests); `lib/audio/metronome-engine.ts` books synthesised clicks
  120 ms ahead on its own AudioContext, woken every 25 ms by a Worker timer so a background tab
  keeps time, and lights the beat on screen by checking the audio clock (a fresh context's
  clock runs slow at first, so a precomputed timer lit beat one early). Settings live in
  localStorage `diesis_metronome` (`lib/game/use-metronome.ts`), which also holds a screen
  wake lock while it runs. Its Speed up mode (below) runs on the same engine.
- **Speed trainer = the metronome's "Speed up" mode (Will, 2026-09-25: "combina el metrónomo y
  el entrenador de velocidad en la misma feature").** One tool at `/practice/metronome`. The climb
  is a section of the settings with an on/off switch, "Speed up" / «Subida de tempo» (Will,
  2026-09-25: "no pongas ir subiendo así, pon simplemente un toggle de la sección de subida"):
  `MetronomeSettings.mode` "steady" | "speed", stored with the rest in `diesis_metronome`. On,
  the section opens with the plan: start, target, step (+1/2/5/10 BPM) every
  1/2/4/8 bars, then stay or start over (the target gets its own bars, then back to the
  start); the plan is in `diesis_speed`. Rules in `lib/core/speed.ts` (tests); the engine asks
  `setPlan`'s function for each bar's tempo as it books the bar's first click, so every bar is
  played at one tempo; `useMetronome(plan)` passes the plan only in Speed up. `/learn/speed-
  trainer` (0.9.x) and `/learn/metronome` (to 0.13.x) redirect here. Start/Stop sits right under the tempo, above the settings
  (Will: above the fold on a phone). **Tempos are typed as well as stepped (Will, 2026-09-25):**
  the big number and the start and target are `BpmInput`s (digits only, applied on Enter or
  blur, clamped 20–300, Escape cancels); in Speed up the big number edits the start while
  stopped and is read-only while running.
- **Profile (Will, 2026-09-25: "a profile page where I can put all the settings… seven string,
  six string… and the achievements, records").** `/profile`, linked from the top bar (an
  icon beside EN/ES, app only). Sections: your guitar (6/7/8 strings and a tuning preset:
  `TUNINGS` in `lib/core/notes.ts`, stored as the preset id in localStorage `diesis_guitar`,
  `lib/game/use-guitar.ts`), note names (the same `diesis_names` setting the start card sets),
  language, records (every `diesis_best:*`, parsed by `lib/core/records.ts`), achievements
  (derived from the records, nine, `ACHIEVEMENTS`), and "Erase my data" (removes every
  `diesis_*` localStorage key; cookies stay). **The guitar is real, not decoration:** the
  exercises (`QuizSettings.tuning`/`strings`), the neck (`neckNotes(…, tuning)`) and the
  fretboard (`strings` prop: gauges and inlays for 7/8) all read it; samples go down to E1
  (MIDI 28, `SAMPLE_LOW`), and `npm run samples` only writes missing files (`--all` redoes all).
  Bests on 7/8 strings are kept apart (`modeKey`: `name:7s:timed:60`); six-string keys are
  unchanged. No account: if one ever comes, this page is where it lives.
- **Top bar (Will, 2026-09-25: "una barra arriba del todo que se mantiene constante entre la
  web y la app, pero que en la app tiene las diferentes modalidades").** One component,
  `components/site-nav.tsx`, on the landing, privacy and every app screen (it lives in
  `app/(app)/layout.tsx`, outside the fading template, so it stays put). Web: sections, EN/ES,
  Open the app. App: Learn and Practice (`nav.areas`), then the tools of the side you are on
  (`nav.learnTools`/`LEARN_HREFS`, `nav.practiceTools`/`PRACTICE_HREFS`) with the current one
  lit; on `/start` and `/profile` only the two sides. On phones they drop to a second row that
  scrolls to the current tool. The logo always goes
  to the landing. The bar hides while an exercise is played sideways on a phone or on a short
  screen (`.site-nav` rules in globals.css); the exercise header keeps its back arrow for that
  case only; it goes back to its side's menu. Upright screens have no header of their own.
  **Every new tool picks a side and gets a place in that side's nav list and hrefs, its menu
  cards, the sitemap and the landing.**
- **The neck (scale explorer), built 2026-09-25** (Will: "see all the notes in the fretboard,
  and then select things like a pentatonic scale, selecting the root note"): `/practice/neck`,
  first tool in the bar. Opens on every note (scale "all"); pick a root (12 buttons) and a
  scale (scrolling chips) and the neck shows that scale, root in amber (`MarkState` "root"),
  other notes cream ("note", `highlightNote` in tokens). Header toggles: names (the player's
  Do Re Mi / C D E setting) or degrees (1, ♭3, ♯4…), frets 0–12 or 0–24. Tapping a lit note
  plays it (the first tap unlocks audio). Picking a root while on "all" jumps to the minor
  pentatonic, so the tap does something. Drawn sideways on phones via `GameFrame`. Scales are
  data in `lib/core/scales.ts` (intervals + degree names; 13: all, pentatonics, blues, major,
  natural/harmonic/melodic minor, the modes), names in `neck.scales` in i18n; choices in
  localStorage `diesis_neck`. Boxed positions (CAGED / 3nps) and the scale exercises are not
  designed yet. **Reading music** is a new track (Will,
  2026-09-23): not yet specified beyond the landing-page copy; needs a staff renderer and a
  guitar-range note model (treble clef, sounds an octave lower).
- **Skins**: one skin. When a second arrives, every skin carries an `unlock` field. Any paid
  skin on the web needs an account first.
- Note names use ♯ (U+266F). Sharps by default; a flat spelling exists in the core for a future
  setting. Enharmonics are one pitch class; the quiz never asks for a spelling.
- Fretboard drawing: nut on the left, string 1 (high E) at the top, fret numbers under the
  board, real logarithmic fret spacing scaled to the range, open strings get a zone left of the
  nut. The landing's `TryIt` and tool cards draw with this same `Fretboard`.
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
  EN and ES, is in `lib/i18n.ts`; edit both languages together. Every page has an `/es`
  twin, the app included (Will, 2026-09-25: a shared app link opened in the wrong language):
  `/learn/…` is English, `/es/learn/…` Spanish (the same for `/start`, `/practice`,
  `/profile`; the matcher in `proxy.ts` lists them). `proxy.ts` rewrites `/es/…` onto the same
  pages with an `x-diesis-lang: es` header (`currentLang` in `lib/lang.ts` reads only that),
  and sends a visitor whose `diesis_lang` cookie says Spanish from an English app address to the `/es`
  twin. The cookie is still set by `/lang/[code]` (the switcher) and by Open the app. App
  links are built from `t.base` (site-nav, the menu cards, the exercise's back arrow reads the
  path). `appMetadata` in `lib/lang.ts` gives app pages their title, hreflang and a link
  preview in their language (og-es.png for Spanish). Values in the strings file must be plain
  data (no functions): they cross into client components.
- **Landing on phones (Will, 2026-09-24: "only text").** The hero is a grid: headline, then the
  playable `TryIt`, then the lede, CTAs and trust line; from `lg` the screen takes the right
  column against the whole text block. The hero lede stays at three or four short sentences;
  detail goes to "How it works" and "What you learn". Each "How it works" step carries a drawn
  figure (`components/how-figures.tsx`: neck slice, button row, green/red verdict, in the game's
  colors, note names per language). Section padding is `py-14 sm:py-24`.
- **Landing made playable (Will, 2026-09-26: "more exciting for first visitors").** The hero's
  looping animation (`components/screen.tsx`, gone) is now `components/try-it.tsx`: a real Name
  the note in first position (frets 0–5, naturals, seven buttons in a row under the board, the
  first question fixed on C so server and client agree), sound on the first tap, five dots for a
  streak, and at five a card that links to the full exercise. Under the hero, `#tools`
  (`components/tool-showcase.tsx`, copy in `t.tools`): one card per built tool with a still of
  it, linking straight into it; add a card (and its `HREFS` entry) when a tool is built.
- **Backing tracks (Will, 2026-09-26: "a section in the app with backing tracks with embedded
  youtube videos").** Practice side, `/practice/backing-tracks`. Data in
  `lib/core/backing-tracks.ts` (video id, title, channel, style, key, a fitting scale from
  `scales.ts` with its root, optional BPM; tests); every id was checked embeddable through
  YouTube oEmbed when added, do the same for new ones. Style chips filter. A card shows YouTube's
  thumbnail (i.ytimg.com) and loads the youtube-nocookie.com player only on play, one at a time;
  "Show on the neck" writes root and scale into `diesis_neck` and opens the neck. The privacy page
  has a "Backing tracks" section saying so; keep it true.
- **Contact and price, only what is true (Will, 2026-09-26).** Diesis is made by Will alone:
  never "we", "a team" or "a group of players". There is no working email: hello@diesis.app
  does not exist, so contact is Instagram @diesis.app (landing pricing box, privacy page,
  footer). Diesis will be paid at some point: say "free while in preview", never "stays free".
- **Who makes it (Will, 2026-09-25)**: a landing section (`#maker`, before the closing card)
  in Will's first person, linking willdafer.es and Instagram `@willdafer.es`. Copy in
  `t.maker`; keep it true to what he actually does.
- **Motion and navigation (Will, 2026-09-24: "navigation is clunky, add animations").** No
  React/Next view transitions (not stable here); everything is CSS. `app/(app)/template.tsx` fades
  every app screen in (opacity only: a transform there would become the containing
  block of the fixed sideways game shell). Menu cards stagger in (`components/tool-menu.tsx`), the
  start and result cards zoom in (`challenge-card.tsx`), board marks pop in and ease amber to
  green (`.mark` in `globals.css`), note buttons press (`active:scale-95`), the verdict pops.
  Utilities come from `tw-animate-css`; every animation carries `motion-reduce:animate-none`.
  The landing's "Open the app" is `components/open-app.tsx`: a prefetched `Link` to `/start`
  that writes the `diesis_lang` cookie on click, instead of the `/lang` redirect hop. The
  language switch itself still goes through `/lang` (a real navigation, on purpose).
- **Instagram @diesis.app (Will, 2026-09-25)**: linked in the footer. Profile picture is
  `design/social/instagram-profile.png` (1080², from `design/social/profile.svg`: the favicon
  full-bleed with the mark at 80% so the circular crop keeps it whole).
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

- **Private roadmap page (Will, 2026-09-26)**: `/roadmap` (Will asked for exactly that path), a visual roadmap plus
  the monetization and go-to-market plan, Spanish, for Will only. Unlisted by choice (Will picked
  "no password"; the path is guessable, he knows): no links to it, not in the sitemap or robots.txt, `noindex`. The
  repo is public, so the page must hold nothing that cannot be public. Update it when the
  roadmap moves and Will asks.

## Hosting

Vercel project `diesis-site` (team wdavisf-gmailcoms-projects), Git integration from
`wdavisf/diesis` main, framework Next.js at the repo root, no environment variables (the old
`DIESIS_ACCESS_CODE` is no longer read and can be deleted from the project settings). Domains
diesis.app and www (redirects to the apex); DNS at Namecheap. Live since 2026-09-23. diesis.es and www.diesis.es
(registered 2026-09-25 at dominios.es by Will, nameservers ns1/ns2.vercel-dns.com) are on the
same project and redirect (307, `next.config.ts`) to the Spanish twin of the same path:
diesis.es/practice/metronome → diesis.app/es/practice/metronome (Will, 2026-09-26). Share diesis.es in Spanish (chat apps link `.es`, often not `.app`) and
`www.diesis.app` in English. The old `diesis-play` project (play.diesis.app, Expo web export) is obsolete; its Git
integration was disconnected 2026-09-24 (every push had been failing a build there and emailing
Will), and it can be deleted in the dashboard. The repo folder is linked to `diesis-site` (`.vercel/`, ignored), so
`npx vercel deploy --prod` works as well as a push.

**Search (2026-09-25)**: diesis.app is verified in Google Search Console (DNS TXT at Namecheap).
`app/sitemap.ts` lists the landing, the app menu and tools and the privacy page, each with its `/es` twin (hreflang pairs); `app/robots.ts`
points to it and keeps `/lang/` out. Add new public pages to the sitemap.

## Layout of the repo

- `app/` — routes: `page.tsx` and `es/page.tsx` (landing), `privacy/` and `es/privacy/`,
  `(app)/` (route group, the app: `layout.tsx` with the top bar, `template.tsx`, `start/`,
  `learn/` with `name-the-note/` and `find-the-note/`, `practice/` with `neck/`,
  `metronome/` and `backing-tracks/`, `profile/`), `lang/[code]/` (cookie setter).
  `layout.tsx` holds fonts and metadata; `globals.css` the theme tokens.
- `components/` — `landing`, `privacy-page`, `logo`, `footer`,
  `lang-switch`, `fretboard` (SVG, marks and tap targets), `note-panel`, `game-frame`
  (`GameShell`: sideways treatment, gate, header; `GameFrame`: the board inside it),
  `setup-screen` (before a round), `challenge-card` (result card, header status, `Chip`),
  `game` (Mode A), `find-game` (Mode B), `metronome` (both modes), `neck` (scale explorer), `backing-tracks`, `profile`, `site-nav` (the top bar), `try-it`, `tool-showcase`, `how-figures` and `open-app` (landing), `ui/`.
- `lib/i18n.ts` — every string, EN and ES. `lib/lang.ts` — reads the language cookie.
- `lib/core/` — note model (`notes.ts`), question generator (`quiz.ts`), tests. Pure TS.
- `lib/core/challenge.ts` — challenge rules. `lib/audio/note-player.ts` — Web Audio sampler.
  `lib/game/use-mode-a.ts`, `use-mode-b.ts` — mode hooks; `use-challenge.ts` — score and clock;
  `use-settings.ts` — note names and naturals only, in localStorage; `use-guitar.ts`,
  `use-records.ts` — the profile.
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
