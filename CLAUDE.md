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
  the route group `app/(en)/(app)/` (re-exported for Spanish, see the two root layouts below). Old `/practice/neck`, `/practice/metronome`, `/profile` and
  their `/es` twins redirect (`next.config.ts`; redirects run before `proxy.ts`).
- **A third side, Setup (Will, 2026-09-26: strings and setup "no es practicar, es otra cosa";
  "guitar setup en inglés").** `/setup`, «Ajuste» in Spanish: the guitar itself (strings,
  tension, setup). `/start` shows three doors; the app's navigation three sides (`nav.areas.setup`,
  `nav.setupTools`, `SIDES` in `components/app-nav.tsx`, `SETUP_ITEMS`, `setupMenu`). When a tool arrives, ask which of
  the three sides it belongs to rather than defaulting to Practice.
  Upcoming Setup tools, shown as cards (Will, 2026-09-26): tuner and intonation, my guitars
  (next); changing tuning, why does it buzz, string log, care and humidity (later). The tuner
  moved here from Practice.
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
- **Scope on the landing page**: what exists, as cards under its side, and what is coming to
  each side as chips read from the app's menus (`LEARN_ITEMS`/`SETUP_ITEMS` and the menu titles
  in `components/tool-menu.tsx` and lib/i18n.ts), so the landing and the app home cannot drift:
  Hear the note next; scale exercises, reading music (for classical guitar) and the glossary
  later; the Setup tools as listed in the Setup point. Change what is coming in the menus.
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
- **Setup screen (redesigned 2026-10-01, 0.31.0; Will: "this empty state sucks").** Every mode
  opens on `components/setup-screen.tsx`, upright inside the same `GameShell`. Will chose it from
  mockups in the chat, in three picks: the title in Fraunces with the one-line hint (a phone's top
  bar already names the tool, so there only the hint); **a still of the exercise on the neck**
  (`Preview`: the player's own strings, frets 0–12, never under 150 px tall so a dot holds a
  note's name on a phone too). **It moves (Will, 2026-10-01: "can you animate them"; 0.32.1):**
  Name the note lights a position, turns it green with its name, then lights another; Find the
  note finds every place of a note one by one up the neck, holds, then takes the next note (A,
  C, E, G, D). The modes build the marks from `useDemoTick` (`lib/game/use-demo.ts`), which only
  ticks on the setup screen and gives null under Reduce Motion, when they show a still. No sound;
  **the three challenges as cards** (icon, name, a short line, and the best kept for it: "Your
  best: 34", "No best yet", or "No score kept" for Practice; the minutes are chips inside the
  Against the clock card and stay as last picked; the whole card is the radio); **Notes and Note
  names as tiles that spell out what you get** ("All twelve" with the twelve names written in
  full, never cut short; "Do Re Mi" over "Fa Sol La Si"); then the picked challenge's sentence
  and Start. Bests for all challenges come from `bestOf` in `use-challenge.ts`. The layout uses
  container queries (three columns from `@2xl`). The first version (2026-09-24, a form of chip
  rows in the middle of an empty screen) and a picker laid over the neck before that are both
  rejected; so were plain chip pairs for notes and names ("shit"). The board for the round still
  only mounts on Start; the result card is still an overlay on the board. The mode hooks call
  `player.preload()` on mount so the WAVs download during setup and Start only decodes
  (`lib/audio/note-player.ts` keeps the bytes; decoding gets a copy).
- **On a phone the main button is always in sight, right above the tab bar (Will, 2026-10-01:
  "all CTAs should always be visible right above the bottom row").** `.cta-pin` in globals.css
  (below `md`: sticky above the tab bar, with the stage behind it and a rule on top, pushed to
  the foot of a short screen). It sticks to the window, so the screen must scroll with the page:
  no `overflow-auto` on an ancestor. Used by the setup screen and the finger exercise's setup.
  The metronome keeps the layout Will picked (Start under the tempo, the three setting buttons
  at the foot), where Start is always in sight already. A new screen with a main button uses
  `.cta-pin`.
- **Challenges** (Will, 2026-09-24): every mode starts on a picker. Practice (endless),
  Against the clock (1, 2 or 5 min, score = right answers; mistakes counted, do not end it),
  No mistakes (score = right answers before the first mistake). In Find the note each position
  found is one right answer. Pure rules in `lib/core/challenge.ts`; clock and storage in
  `lib/game/use-challenge.ts`. Personal bests in localStorage `diesis_best:<mode>:<challenge>`
  (per browser, never sent; the privacy page says so), last pick in `diesis_challenge`. The
  Todoist "note-count challenge" (fixed number of notes, timed) is not built.
- **Metronome** (built 2026-09-25, Will: "empieza con el metrónomo"): open `/practice/metronome`,
  an upright screen (no neck, never sideways). Tempo 20–300 on the tempo ruler, typed, or by tap tempo
  (average of the last five taps, a 2 s pause starts over); the Italian marking under the
  number; meters 2/4, 3/4, 4/4, 5/4 (3+2), 6/8 (3+3), 7/8 (2+2+3), group starts get a second
  accent; subdivision 1, 2, 3, 4 or 6 (sextuplets, Will 2026-09-25); accent on the one or
  none. Keys: Space, ←/→ (Shift ×5), T. The layout is the next entry. Rules in
  `lib/core/metronome.ts` (tests); `lib/audio/metronome-engine.ts` books synthesised clicks
  120 ms ahead on its own AudioContext, woken every 25 ms by a Worker timer so a background tab
  keeps time, and lights the beat on screen by checking the audio clock (a fresh context's
  clock runs slow at first, so a precomputed timer lit beat one early). Settings live in
  localStorage `diesis_metronome` (`lib/game/use-metronome.ts`), which also holds a screen
  wake lock while it runs. Its Speed up mode (below) runs on the same engine.
- **Metronome layout: a bare screen and three buttons (Will, 2026-09-30: "there are a lot of
  things going on. It could be simpler"; he picked it from five mockups, kept in
  `design/metronome-options/`, untracked).** The screen shows only the beat dots (with a small dot per subdivision under each, the click being heard lit: Will asked for them back the same day, 0.26.1), the tempo
  (typed by tapping it), the **tempo ruler** (`TempoRuler`: a tape with one tick per BPM that
  slides under a fixed needle; drag it, left is faster; it glides there when the tempo changes
  any other way, and by itself during a climb), Tap tempo and Start. The ±1/±5 buttons, the
  plain slider and the chip rows are gone. Everything else sits behind three buttons that each
  show a caption and the current value (Will did not understand icon buttons with vague
  labels: every button says what it holds): **Time signature** (its panel also has the
  "Accent the first beat" switch), **Subdivision**, **Speed up** ("Off" or "60 → 140"). Each
  opens a panel (`Sheet`, a native `<dialog>`: a sheet from the bottom on a phone, a centered
  dialog from `sm`). On a phone the three buttons sit at the bottom of the screen; on a computer
  right under Start, with the keys line below. **Subdivision shows the notes as written, not
  only numbers (Will, 2026-09-30)**: `BeatGlyph` draws what `beatNotes(meter, subdivision)` in
  the core says (a quarter, two eighths, a triplet, four sixteenths, a sextuplet; one value
  shorter in 6/8 and 7/8, where the beat is the eighth), with the name and "n per beat". The
  Speed up panel has a slider and a typed number for start and target, the step, the bars, what
  happens at the target and "Reaches 140 in about 1 min 30 s" (`secondsToTarget`). In Speed up
  the ruler and ←/→ set the start while stopped; Tap tempo hides. `Stepper` stays for the
  finger exercise. **The Speed up card is itself the on/off switch (Will, 2026-09-30: "un botón
  para encender/apagar la subida de tempo sin tener que abrir el modal"; 0.30.0)**: tapping it
  toggles the mode (`SpeedSetting`, `role="switch"`), and a chevron column at its edge, set apart
  by a rule, opens the panel (which keeps its switch too). A switch inside the card does not fit
  beside "60 → 132" on a phone, so on phones the card's column is wider (`1.4fr`) instead.
- **Count-in and pause (Will, 2026-09-30: "a countdown, like a full bar", and a pause "especially
  when it's increasing, because if I stop it, then I have to start from scratch"; 0.30.0).**
  Every start counts one bar in (`COUNT_IN_BARS` in `use-metronome.ts`): the engine's `start`
  takes `{ from, countIn }` and reports count-in clicks with `Beat.countIn` (their `bar` is the
  one they lead into, played at its tempo); the screen replaces the big number with the beats
  left, 4 3 2 1 (`countdownAt` in the core), amber, with "Count-in · 80 BPM" under it. In steady
  mode the count-in is audibly just the first bar, so it costs nothing. **Pause exists only in
  Speed up** (a steady tempo has no place to hold, so there Stop is the pause): the hook's
  `pause` stops the engine and keeps the bar of the last click heard, the screen keeps showing
  that bar and tempo with "Paused", `resume` starts the engine again from that bar with a
  count-in at its tempo, `stop` forgets it. Buttons: Start; then Pause + Stop; then Resume +
  Stop. Space is the main button, Esc stops. Fingers uses the engine with no count-in of its
  own from the engine (it counts its own four clicks).
- **Speed trainer = the metronome's "Speed up" mode (Will, 2026-09-25: "combina el metrónomo y
  el entrenador de velocidad en la misma feature").** One tool at `/practice/metronome`. The climb
  has an on/off switch (since 0.26.0 in its own panel), "Speed up" / «Subida de tempo» (Will,
  2026-09-25: "no pongas ir subiendo así, pon simplemente un toggle de la sección de subida"):
  `MetronomeSettings.mode` "steady" | "speed", stored with the rest in `diesis_metronome`. On,
  the panel shows the plan: start, target, step (+1/2/5/10 BPM) every
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
  six string… and the achievements, records").** `/profile`, linked from the app's navigation (the
  sidebar's last row, a tab on phones). Sections: your guitar (6/7/8 strings and a tuning preset:
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
- **Navigation (Will, 2026-09-30: a left sidebar "like Toggl, but properly done", and on phones
  "a bottom bar like there would be in an iPhone app, like what we did for Tabula"; built
  0.27.0).** The top bar of 2026-09-25 (`components/site-nav.tsx`) is now for the web pages only
  (landing, privacy): sections, EN/ES, Open the app. The app's navigation is
  `components/app-nav.tsx`, mounted in `app/(en)/(app)/layout.tsx` outside the fading template so it
  stays put. **From `md`: `AppSidebar`**, design A of the canvas "Diesis sidebar options"
  (https://claude.ai/artifact/Ba5v7kLBmZbpXDmHseZbWn): every tool under its side (the side's
  name links to its menu), the current one lit, the tools coming next dimmed with "Soon"
  (`nav.learnSoon`/`setupSoon`); feedback, profile and EN/ES at the bottom. It collapses to a
  rail of icons with the names as tooltips: by its button or the `[` key from `lg`, remembered
  in localStorage `diesis_sidebar` and put on `<html>` as `data-sidebar` by an inline script in
  the document (`components/root-document.tsx`) before the first paint; between `md` and `lg` it is always the rail. The
  Tailwind variant `rail:` (globals.css) styles both cases. **On phones: `AppTopBar`** (the
  logo, or inside a tool the way back to its side and the tool's name; feedback, EN/ES) **and
  `TabBar`** fixed at the bottom: Learn, Practice, Setup, Log, Profile; a side's tools are
  reached from its menu. **Inside the app the logo goes to `/start`** (Will, 2026-09-30, 0.28.2; it went
  to the landing before), in the sidebar and in the phone's top bar; the app has no link back
  to the landing. On the web pages (`SiteNav`, footer) the logo still goes to the landing.
  All three carry `.app-nav` and hide while an exercise is played sideways on a phone or on a
  short screen (globals.css); the exercise header keeps its back arrow for that case only.
  **Every new tool picks a side and gets a line in `SIDES` (app-nav.tsx) with an icon, its name
  in that side's nav list, its menu cards, the sitemap, the landing and a link-preview card
  (`PREVIEWS` in `lib/lang.ts`).** Screens now sit beside the sidebar: a layout that depends on
  the room it has should use container queries (`@container`, as `/start` does), not window
  breakpoints. Designs B (sides on a rail) and C (the goal on top) were not chosen.
- **The neck (scale explorer), built 2026-09-25** (Will: "see all the notes in the fretboard,
  and then select things like a pentatonic scale, selecting the root note"): `/practice/neck`,
  first Practice tool. Opens on every note (scale "all"); pick a root (12 buttons) and a
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
- Fretboard drawing (strings restyled 2026-09-26, Will: "the strings kind of look like the frets"):
  plain strings near white, wound strings (4 and lower) warm #d6b98a with a dashed winding
  texture, a shadow on the wood; frets a dim nickel #8f8a80 so they recede. Nut on the left, string 1 (high E) at the top, fret numbers under the
  board, real logarithmic fret spacing scaled to the range, open strings get a zone left of the
  nut. The landing's `TryIt` and tool cards draw with this same `Fretboard`.
  **The note being asked glows (Will, 2026-10-01: "the highlighted note should glow in all games
  and landing pages where it is visible"; 0.32.2):** an "asking" mark gets a halo behind it, a
  radial gradient in amber that breathes (`.mark-halo` in globals.css, steady under Reduce
  Motion). A gradient, not a CSS `filter`, which Safari does not reliably apply inside an SVG.
  The step figures on Name the note's page (`how-figures.tsx`) use the same class. Green, red and
  the neck explorer's notes do not glow.
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
- **Analytics (Will, 2026-09-23; PostHog added 2026-09-30, "to check usage and stuff")**: Google
  Analytics 4, property `G-HNHYBR8Y13`, and PostHog (EU cloud, `posthog-js`, imported only after
  a yes; project key and host at the top of `components/consent.tsx`, public by design like the
  GA id), both loaded by `components/consent.tsx` only after the visitor accepts a banner (cookie
  `diesis_consent`, one year; the accepted value is `yes2` since PostHog joined, so an older
  `yes`, given to a banner that named only Google, is asked again). Decline loads nothing from
  either. PostHog gets page views, page leaves and web vitals only (every tool is a page): autocapture,
  heatmaps, dead clicks and session recordings are switched off in code whatever the PostHog
  project says, events are anonymous, its id sits in localStorage, not a cookie. The privacy
  page describes all of it in both languages; keep it true: turning any of those on, or adding
  named events, means rewriting the privacy page in the same change.
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
- **Two root layouts, one per language (2026-09-30, 0.28.1; Will: "fix the language tag on the
  spanish pages and add structured data").** The server must send `<html lang="es">` on Spanish
  pages (it used to say `en` everywhere and patch it in the browser, and never on the app's
  Spanish screens). A single root layout would have to read the request to know the language,
  which makes every page dynamic, so there are two: `app/(en)/layout.tsx` and
  `app/(es)/layout.tsx`, both drawing `RootDocument` (`components/root-document.tsx`: fonts,
  theme, consent banner, the sidebar script). The landing, the tool pages and privacy stay
  static. The app's Spanish screens are one-line re-exports of the English ones under
  `app/(es)/es/(app)/` (**a new app screen needs its re-export there**); `proxy.ts` no longer
  rewrites, it only sets the language header. Moving between the two root layouts is a full
  page load (the language switch already was one); inside a language, navigation stays on the
  client, "Open the app" included. With two roots there is no layout for a 404, so
  `app/global-not-found.tsx` (experimental `globalNotFound` in `next.config.ts`) brings its own
  document and says it in both languages.
- **Structured data (2026-09-30, 0.28.1).** `lib/structured-data.ts` builds schema.org JSON-LD,
  `components/json-ld.tsx` puts it in the page: the landing describes the site, the app
  (`WebApplication`, free) and Will as its maker; each tool's public page describes the tool,
  its breadcrumb and its questions (`FAQPage`, from the same `faq` the page shows). Only what
  the page says: no ratings or reviews, none exist. The offer says price 0; change it when
  pricing does. The app screens carry none.
- **Standing rule: when the game changes (modes, settings, wording, pricing, privacy behavior),
  update the landing page, the app home and the privacy page in the same session.** All copy,
  EN and ES, is in `lib/i18n.ts`; edit both languages together. Every page has an `/es`
  twin, the app included (Will, 2026-09-25: a shared app link opened in the wrong language):
  `/learn/…` is English, `/es/learn/…` Spanish (the same for `/start`, `/practice`,
  `/profile`; the matcher in `proxy.ts` lists them). The Spanish app addresses are the same
  screens re-exported (next point); `proxy.ts` marks them with an `x-diesis-lang: es` header
  (`currentLang` in `lib/lang.ts` reads only that),
  and sends a visitor whose `diesis_lang` cookie says Spanish from an English app address to the `/es`
  twin. The cookie is still set by `/lang/[code]` (the switcher) and by Open the app. App
  links are built from `t.base` (site-nav, the menu cards, the exercise's back arrow reads the
  path). `appMetadata` in `lib/lang.ts` gives app pages their title, hreflang and a link
  preview in their language (og-es.jpg for Spanish). Values in the strings file must be plain
  data (no functions): they cross into client components.
- **The hero is a video of a metal guitarist (Will, 2026-09-30: "generate a video of a metal
  guitarist to show on the diesis lp", then "shouldn't it be above the fold?"; built 0.29.0).**
  `components/stage-video.tsx` plays `public/video/stage.mp4` (6.7 s loop, no sound, 1.2 MB,
  poster `stage.jpg`): a modern-metal guitarist on a black stage with amber backlights, short
  hair, black tee, tattoos, a matte white guitar. Will picked this look from three takes and asked
  for it in the words "like Bad Omens or Bring Me the Horizon"; the prompts describe clothes,
  guitar and light and never name a band or a player, and the man is nobody real (an
  illustration, like the guitar pictures). From `lg` the video fills the hero (the section takes
  the video's wide shape, `lg:aspect-[2.2/1]`, so the player stays right of the text); below
  `lg` it is a frame on top and the text rises over its faded foot; on a phone that frame is 4:3
  and cropped toward the right (`object-[96%_50%]`) so the player sits in the middle of it
  (Will, 2026-09-30: on the phone he looked "a bit too much to the right"). It runs only while on screen,
  has one button (pause/play, `reel.pause`/`reel.play`), and under Reduce Motion stays on the
  poster until asked. **The headline is three sentences, one per side of the app** (`hero.h1`,
  an array): "Know the neck. Lock in the tempo. Dial in your guitar." / «Domina el mástil. Clava
  el tempo. Pon a punto tu guitarra.» **Will does not want "Everything you need to master the
  guitar" as the headline** (2026-09-30; "you can use that below the fold"): it now heads
  `#tools`, and stays in the page title, the footer and the link-preview card. Each line must
  fit on one line from `sm` up (`sm:whitespace-nowrap`): check both languages at 1024 and 1440
  when the words change, the Spanish ones are longer.
  **Made by `tools/gen-video.mjs`** in three steps: a still with OpenAI `gpt-image-2` (check it
  before paying for video: hands, six strings, no logo), a take with Runway image-to-video
  (`gen4.5`, 8 s at 1584:672, 96 credits; `RUNWAY_API_KEY` in `.env.local` or Akoe's
  `app/Secrets.xcconfig`; 91 credits were left on 2026-09-30, one short of another take), and
  the cut with ffmpeg (not installed on Will's Mac: `FFMPEG=` a copy from npm's `ffmpeg-static`),
  which loops between the two moments of the take that look most alike. OpenAI's own video API
  (Sora) closed on 2026-09-24. Raw stills and takes stay in `design/video/` (ignored by git; the
  two takes not chosen, long hair and a hood, are there as `longhair.*` and `hood.*`).
- **Landing on phones (Will, 2026-09-24: "only text").** The phone gets the picture first: the
  video frame, then the headline, the lede (one sentence), CTAs and trust line, all on the first
  screen. Detail goes to each tool's own page (below). Section padding is `py-14 sm:py-24`.
- **Landing made playable (Will, 2026-09-26: "more exciting for first visitors").**
  `components/try-it.tsx`: a real Name the note in first position (frets 0–5, naturals, seven
  buttons in a row under the board, the first question fixed on C so server and client agree),
  sound on the first tap, five dots for a streak, and at five a card that links to the full
  exercise. It was the hero's right column until 0.29.0, when the video took the hero; since
  0.29.1 it is its own section (`#try`, copy in `taste`) **after `#tools`, where Will put it
  (2026-09-30: "put this below the everything you need section")**. `#tools` comes right under
  the hero, with no rule between them (the video fades into it): one card per built tool with a
  still of it (`components/tool-figure.tsx`), see the next point.
- **A public page per tool, and the landing as their hub (Will, 2026-09-30: "landing pages per
  feature" with "a link to send them to the full version", then "redo the main landing page with
  all of this into account"; built 0.28.0).** Will's thinking behind it: the web (landing and
  tool pages) is the public face and the app is the full version; he expects the app to need a
  sign-up at some point, **but there is no sign-up yet and none is built** (the account question
  stays open in Todoist section 13). Each built tool has a page: `/name-the-note`,
  `/find-the-note`, `/fretboard`, `/metronome`, `/backing-tracks`, `/finger-independence`,
  `/strings`, and in Spanish with translated slugs, `/es/nombra-la-nota`,
  `/es/encuentra-la-nota`, `/es/mastil`, `/es/metronomo`, `/es/backing-tracks`,
  `/es/independencia-de-dedos`, `/es/cuerdas`. Routes `app/(en)/[feature]/` and `app/(es)/es/[feature]/`
  (static, only those slugs; anything else is a 404), drawn by `components/feature-page.tsx`:
  hero with the tool's still (Name the note carries the playable `TryIt`) and the button into
  the tool, "What it does" (four points), "How to use it" (three steps; Name the note's keep
  their drawn figures, `components/how-figures.tsx`), the questions people search, a closing
  card, and links to the other tools. Copy in `features.pages` (lib/i18n.ts), titles and
  descriptions written for search; ids, tool addresses and link-preview cards in
  `lib/features.ts`; metadata with the hreflang pair in `lib/feature-metadata.ts`. Because the
  slug changes with the language, `SiteNav` takes the twin's address (`other`), and
  `next.config.ts` redirects an English slug under `/es` and a Spanish one without it (the slug
  list is mirrored there by hand). **The landing** is now: hero (the video), `#tools` (the three sides, each
  with its tools as cards that lead to the tool's page, with an "Open" button straight into the
  tool, and beside each side what is coming to it, read from the app's menus:
  `components/feature-cards.tsx`), the playable exercise (`#try`), who makes it, the name, pricing, FAQ, closing. Its old "How
  it works" and "What you learn" sections are gone (`how` and `learn` in the strings too): what
  a tool does lives on its page. The footer lists the tool pages. **A new tool gets a line in
  `FEATURES`/`FEATURE_TOOL`, an item in `tools.items`, a page in `features.pages` (both
  languages), a drawing in `ToolFigure` and its slug pair in `next.config.ts`.** Keep every
  claim on these pages true to the tool; when a tool changes, its page changes in the same
  session.
- **Backing tracks (Will, 2026-09-26: "a section in the app with backing tracks with embedded
  youtube videos").** Practice side, `/practice/backing-tracks`. Data in
  `lib/core/backing-tracks.ts` (video id, title, channel, style, key, a fitting scale from
  `scales.ts` with its root, optional BPM; tests); every id was checked embeddable through
  YouTube oEmbed when added, do the same for new ones. Style chips filter. A card shows YouTube's
  thumbnail (i.ytimg.com) and loads the youtube-nocookie.com player only on play, one at a time;
  "Show on the neck" writes root and scale into `diesis_neck` and opens the neck. The privacy page
  has a "Backing tracks" section saying so; keep it true.
- **Finger independence (Will, 2026-09-27/28; built 2026-09-28, Practice side, screen and
  keyboard input, both his picks).** `/practice/fingers`, nav «Dedos» / "Fingers". Four pads, one per
  finger, laid out as the hand lies (left hand 4 3 2 1 from left to right, keys A S D F; right
  hand 1 2 3 4, keys J K L ;/Ñ by `KeyboardEvent.code`). One bar of count-in, then one target per
  click in 4/4. **Notes fall onto the pads, rhythm-game style (Will, 2026-09-29: the lit pad was
  "super confusing", "just like in guitar hero").** Each target is a note that drops down its
  finger's column and reaches the pad's centre exactly as the click is heard; the pad glows as it
  arrives. Lead time `leadMs`: two beats, never under 1.2 s (`LEAD_BEATS`, `LEAD_MIN_MS`; position
  by `drop()` in the core, `Run.lead`). The `Lane` in `components/fingers.tsx` writes transforms
  straight to the DOM on every animation frame from the hook's `getRun()` (no React render per
  frame), measuring pad centres with a ResizeObserver. A tapped note freezes where it was tapped
  and bursts green/red for 320 ms; a missed one keeps falling and fades red. The count-in shows
  4 3 2 1 behind the first notes. The link-preview card draws the same scene. **Sideways on a
  phone while running (Will, 2026-09-29: "should be forced to be landscape on phone")**:
  `GameShell sideways={phase === "running"}`, pads along the long edge, notes from the far
  side; the setup screen and the result stay upright; Stop sits in the header beside the score.
  The lane measures pad centres with `offsetLeft`/`offsetTop` up to the stage, never client
  rects, because the shell is rotated with a CSS transform on a phone. Orders:
  random (never the same finger twice in a row), 1234, 4321, 1324, 2413, 1423; 16/32/64 notes;
  tempo 20–300. A tap belongs to the nearest click within half a gap; the first tap decides it;
  on time within min(100 ms, a quarter of the gap); verdicts good/off/wrong/missed with the
  offset. Taps are timed on `performance.now()` against when each click is heard: the metronome
  engine now reports `count` and `heardAt` (via `getOutputTimestamp`) and takes an `onBook`
  callback at booking time. Record: the fastest clean run (≥ 90% on time) per order and length,
  localStorage `diesis_fingers_best` (outside `diesis_best:*`, so not yet in the profile's
  records); settings in `diesis_fingers`. Core `lib/core/fingers.ts` (tests), hook
  `lib/game/use-fingers.ts`, screen `components/fingers.tsx`. Not built yet (Todoist section
  14): comparing scores with others, a latency calibration for Bluetooth audio or slow touch
  screens.
- **Practice log (Will, 2026-10-01; first version 0.32.0).** `/log`, «Diario de práctica», on
  none of the three sides: the top row of the sidebar and a fifth tab on phones ("Log" /
  «Diario»). **Its purpose**: get the player from "I want to play this by that date" (Will's
  example: a solo for a concert in two weeks) to playing it. **The first version is a record, not
  a guide** (Will: "why not just set a goal and then let the user write or dictate what they
  did"). The design is Will's, arrived at over several rounds of mockups: **a week in one line
  at the top, like a calendar app's header** (he sent a screenshot: month and week number,
  Today, arrows, seven days with today marked), then the goal as one quiet line with the days
  left, then the selected day as a page to write on. He rejected boxed cards under the week ("I
  don't like what's under it") and every heavier idea: tools suggested by rules (nobody good
  suggests them: it would need Will's own method per kind of goal, written by him), Diesis
  noting by itself what was used in each tool, a tempo chart, a streak count. **"Tidy up", a
  model that cleans a dictated entry, is designed but not built** ("maybe we can start without
  the tidy up thing"): it needs a model key in Vercel, a limit per IP and a privacy section,
  since the entry would leave the browser; build it as a button, never automatic, with undo.
  As built: one goal (a name and a date from today on; quick picks one week, two weeks, a
  month) in a panel like the metronome's; a dashed "Set a goal" row while there is none; one
  entry per day, saved on every key with no Save button; past days can be written, days to come
  cannot; a green dot on days with something written, a flag on the goal's date; dictation is
  the phone keyboard's own microphone, nothing of ours. The empty state is the same screen,
  empty: no intro. Core `lib/core/log.ts` (days are `YYYY-MM-DD` strings, weeks start on Monday
  and are numbered as in ISO 8601 and named after their Thursday's month; tests), storage
  `diesis_log` (`lib/game/use-log.ts`; kept in memory for the page when storage is blocked),
  screen `components/practice-log.tsx`. The server does not know the player's day, so the screen
  is drawn once the browser does. Its goal panel repeats the classes of the metronome's `Sheet`:
  make one shared sheet when a third panel appears. A new app root like `/log` needs its two
  lines in `proxy.ts`'s matcher and its re-export under `app/(es)/es/(app)/`. **Not done, to ask
  Will:** the landing and a public page for the log (the landing is laid out by the three sides,
  and the log is on none), and a line for an open goal on `/start`.
- **Contact and price, only what is true (Will, 2026-09-26).** Diesis is made by Will alone:
  never "we", "a team" or "a group of players". There is no working email: hello@diesis.app
  does not exist, so contact is Instagram @diesis.app (landing pricing box, privacy page,
  footer). Diesis will be paid at some point: say "free while in preview", never "stays free".
- **Strings and setup (Will, 2026-09-26: "mete el calculador de cuerdas y tal").** Setup
  side, `/setup/strings` (opened in Practice in 0.17.0; `/practice/strings` redirects); covers the three Todoist tasks of section 12 in one screen. Guitar
  type (Strat, Tele, Les Paul/SG, PRS, superstrat, baritone, 7 at 25.5/26.5, 8 at 27, acoustic,
  classical) sets the scale length (editable, 22–30″) and the setup numbers; strings and tuning
  are the profile's `diesis_guitar`, changeable here. Tension per string from physics, not a
  maker's table (no licensing question): plain = steel density × cross-section, wound = 0.84 ×
  that, within 5% of published 10–46 figures (tests). Feel bands: slack < 12 lb, tight > 21 lb.
  Common sets as chips, "Suggest a balanced set" (`suggestGauges`: 16 lb on top rising to 18 lb
  on the lowest, plain on the top three). Nylon is not modelled (sold by tension). Setup numbers
  are typical factory starting points moved by `adjustSetup` for the average string tension (tighter: more relief; slacker: more action; nylon untouched), said so on the page; then six steps after a string change.
  Core `lib/core/strings.ts`, storage `diesis_strings` (`lib/game/use-strings.ts`). No octave
  numbers on note names (EN and ES count octaves differently). The guitar type is picked from
  text cards (name, scale, strings). Hand-drawn SVG silhouettes were tried and rejected by Will
  (2026-09-26, "qué basura"): do not draw guitars in code. Pictures (2026-09-29, Will: "generate pics using the OpenAI
  connector for each guitar"; redone 2026-09-29, Will: "redo the images of the guitar so this looks sexy"):
  `public/guitar-shots/<id>.webp`, 4:5 like the cards (generated 2:3, cropped to 4:5 by the script,
  so the card shows the whole picture), dramatic low-key body shots: the body fills the frame, the
  neck leaves it at the top, headstock out of frame, black background, rim light and glossy
  reflections, one prompt for all so the row reads as one shoot. Made with OpenAI
  `gpt-image-2` by `tools/gen-images.mjs` (key from `.env.local` or Akoe's `app/Secrets.xcconfig`;
  writes only missing files, `--all` or ids to redo), prompts describe shapes with no maker names.
  AI pictures can miscount strings (the 7 and 8 string ones had to be redone, 2026-09-29): count the strings over the pickups on any new one. The folder was renamed (`guitars/`, `guitar-types/`, `guitar-cards/`, now `guitar-shots/`) whenever the pictures changed shape so Next's image cache could not serve old copies. Illustrations, not real instruments; real photos can replace them. A new type needs an entry in
  the script's `GUITARS`. The same script makes the gear pictures (`public/gear/`, one per Amazon link, in the
  order of `strings.setup.gear`), the six step pictures (`public/steps/stepN.webp`, plus `step5-saddle` for
  acoustics and classicals) and one pack illustration per suggested set (`public/picks/<id>.webp`, ids in
  `lib/core/shop.ts`; Will 2026-09-29: "add their product image"). The packs are unbranded, in colours of
  our own, and the page says they are illustrations: real product photos would need Amazon's Product
  Advertising API, which opens only after three qualifying sales, so swap them in then.
  **The steps after a string change follow the guitar type** (`stepVariants` in i18n, 2026-09-29): an
  acoustic drops the pickup step, sets action by sanding or shimming the saddle and has nothing to move for
  intonation (its own picture); a classical also stretches nylon for days, checks relief between the 1st
  and 12th fret with no truss rod, and settles over a week. Electrics keep the six original steps.
  **A baritone is B standard (a friend's correction, 2026-09-30: "B to B, not E to E").** `GuitarType.baritone`:
  picking it sets `BARITONE_TUNING` (`bStandard`, B E A D F♯ B; `dropA` is its drop tuning), offers only the
  baritone sets (`setsFor(6, true)`: 13–62 and 14–68, gauges checked against D'Addario EXL158/EXL157, which
  are its picks) and stores its gauges under `gauges.baritone`, apart from the six-string ones; leaving it
  goes back to E standard. `suggestGauges` takes a wound third string when the nearest plain one is more
  than 1.5 lb off the target.
- **Amazon affiliate links (Will, 2026-09-26; store id `willdafer-21`, Amazon.es).** Search
  links, not product links (`amazonSearch` in `lib/core/shop.ts`): no per-product codes, never
  stale. Today only in Setup → Strings and setup: "Find {set} strings on Amazon.es" for the
  gauges in use (or classical strings), and the setup gear (action ruler, feeler gauges, winder,
  clip-on tuner). `rel="sponsored"`, new tab. Named string sets (`picksFor` in `lib/core/shop.ts`, Will 2026-09-29: "suggest actual strings") show under the tension bars
  when the gauges match a common set, each linking to an Amazon.es search for that product name; only sets we are
  sure of are listed, so add one only after checking its gauges. Amazon's required disclosure sits under every
  group of links and in the footer; the privacy page has "Links to Amazon". Amazon.es only:
  English visitors abroad would need Will to join their marketplace (OneLink). Any new shop link
  goes through `amazonSearch` and carries the disclosure.
- **Feedback form (Will, 2026-09-26: "muy sencillo y que me llegue al correo como con
  jeremy.es").** `components/feedback.tsx`: "Feedback" / «Sugerencias», a row in the app's
  sidebar (an icon button in the phone's top bar) and a link in the footer, opening a native `<dialog>`: name, what do you need
  (required), email (optional, becomes Reply-To). Page, language and the `diesis_guitar` preset go
  as hidden fields. `app/actions/feedback.ts` emails it through Resend (same pattern as jeremy.es:
  honeypot `website`, 5 per hour per IP per instance, values echoed back on failure); nothing is
  stored. Env `RESEND_API_KEY`, `FEEDBACK_FROM_EMAIL`, `FEEDBACK_TO_EMAIL` (see `.env.example`);
  without them the form says it failed and points to Instagram. The privacy page has a
  "Feedback" section; keep it true.
- **Will's photo (Will, 2026-09-26: "dale más visibilidad").** `public/will.jpg` (1200², from
  `~/Downloads/WDF.png`) leads the "Who makes it" section, which now sits right after the tool
  cards and has a link in the landing's top bar (`#maker`, from `lg`).
- **Who makes it (Will, 2026-09-25)**: a landing section (`#maker`, before the closing card)
  in Will's first person, linking willdafer.es and Instagram `@willdafer.es`. Copy in
  `t.maker`; keep it true to what he actually does.
- **Motion and navigation (Will, 2026-09-24: "navigation is clunky, add animations").** No
  React/Next view transitions (not stable here); everything is CSS. `app/(en)/(app)/template.tsx` fades
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
  `npm run icons` renders `icon.png` and the cards' mark from the SVG. Change both files together.
  **The wordmark is "δiesis" (Will, 2026-09-24)**: next to the mark, the D of the word is that
  same δ, drawn inline as SVG at text size by `DeltaGlyph` in `components/logo.tsx` (Fraunces has
  no Greek). Only the wordmark; page titles, copy and the `<title>` keep the Latin "Diesis".
- **Link preview: the card is the hero (Will, 2026-09-30, asked whether the WhatsApp card should
  change with the landing: "FUCKING YES"; 0.29.3).** One per language, `public/og.jpg` and
  `public/og-es.jpg`: the video's guitarist (`tools/og-stage.jpg`, cut from the video's still by
  `tools/gen-video.mjs`, `--card` redoes it), the hero's eyebrow and three-line headline on the
  left, mark and wordmark on top, diesis.app at the foot. JPEG because it is a photo (as PNG it
  weighed 680 KB; chat apps want far less). The card from 2026-09-24, the exercise itself ("¿Qué
  nota es?" / "Which note is it?", frets 0–7 with C lit on string 2, the seven natural buttons
  with C green), is now Name the note's own card, `og/name-the-note-<lang>.png`. The page title
  next to the card is unchanged ("Diesis — everything you need to master the guitar"): Will was
  asked and did not say, and it is also what Google shows. A page that sets its own `openGraph`
  must repeat `images` (Next replaces the object, it does not merge): `/es` pages use
  `og-es.jpg`. Bump `CARD_VERSION` in `lib/lang.ts` (the `?v=` on every card) when a card changes.
  **A card per tool (Will, 2026-09-29: a shared /setup/strings link showed the landing card and
  text on WhatsApp).** `public/og/<tool>-<lang>.png`, drawn by `tools/og-card.mjs` (`npm run
  icons`) in one frame (tool name, one line, wordmark) over a drawing of the tool; `PREVIEWS` in
  `lib/lang.ts` maps each app path to its card and its description (the menu card's body). The
  menus, `/start` and `/profile` use the landing's card. Chat composers show a compact
  row with a square center crop of the card, so keep what matters near its middle. A new tool
  gets a drawing in og-card.mjs, a `PREVIEWS` line and a run of `npm run icons`.

- **Private roadmap page (Will, 2026-09-26)**: `/roadmap` (Will asked for exactly that path), a visual roadmap plus
  the monetization and go-to-market plan, Spanish, for Will only. Unlisted by choice (Will picked
  "no password"; the path is guessable, he knows): no links to it, not in the sitemap or robots.txt, `noindex`. The
  repo is public, so the page must hold nothing that cannot be public. Update it when the
  roadmap moves and Will asks.

## Hosting

Vercel project `diesis-site` (team wdavisf-gmailcoms-projects), Git integration from
`wdavisf/diesis` main, framework Next.js at the repo root. Environment variables: only the
feedback form's three (`RESEND_API_KEY`, `FEEDBACK_FROM_EMAIL`, `FEEDBACK_TO_EMAIL`); the old
`DIESIS_ACCESS_CODE` is no longer read and can be deleted from the project settings. Domains
diesis.app and www (redirects to the apex); DNS at Namecheap. Live since 2026-09-23. diesis.es and www.diesis.es
(registered 2026-09-25 at dominios.es by Will, nameservers ns1/ns2.vercel-dns.com) are on the
same project and redirect (307, `next.config.ts`) to the Spanish twin of the same path:
diesis.es/practice/metronome → diesis.app/es/practice/metronome (Will, 2026-09-26). Share diesis.es in Spanish (chat apps link `.es`, often not `.app`) and
`www.diesis.app` in English. The old `diesis-play` project (play.diesis.app, Expo web export) is obsolete; its Git
integration was disconnected 2026-09-24 (every push had been failing a build there and emailing
Will), and it can be deleted in the dashboard. The repo folder is linked to `diesis-site` (`.vercel/`, ignored), so
`npx vercel deploy --prod` works as well as a push.

**Search (2026-09-25)**: diesis.app is verified in Google Search Console (DNS TXT at Namecheap).
`app/sitemap.ts` lists the landing, each tool's public page, the app menu and tools and the privacy page, each with its Spanish twin (hreflang pairs); `app/robots.ts`
points to it and keeps `/lang/` out. Add new public pages to the sitemap.

## Layout of the repo

- `app/` — routes, under two root layouts. `(en)/`: `layout.tsx` (lang en), `page.tsx` (landing),
  `privacy/`, `[feature]/` (each tool's public page), `(app)/` (the app: `layout.tsx` with the
  app's navigation, `template.tsx`, `start/`, `learn/` with `name-the-note/` and `find-the-note/`,
  `practice/` with `neck/`, `metronome/`, `backing-tracks/` and `fingers/`, `setup/` with
  `strings/`, `log/`, `profile/`). `(es)/`: `layout.tsx` (lang es), `es/` with the same pages in Spanish
  (`es/(app)/` only re-exports the English app screens) and `roadmap/`. Outside both:
  `lang/[code]/` (cookie setter), `global-not-found.tsx` (the 404 page), `sitemap.ts`,
  `robots.ts`, `actions/`, `globals.css` (the theme tokens). Fonts, metadata defaults and the
  consent banner are in `components/root-document.tsx`.
- `components/` — `landing`, `privacy-page`, `logo`, `footer`,
  `lang-switch`, `fretboard` (SVG, marks and tap targets), `note-panel`, `game-frame`
  (`GameShell`: sideways treatment, gate, header; `GameFrame`: the board inside it),
  `setup-screen` (before a round), `challenge-card` (result card, header status, `Chip`),
  `game` (Mode A), `find-game` (Mode B), `metronome` (both modes), `neck` (scale explorer), `backing-tracks`, `practice-log`, `profile`, `site-nav` (the web pages' top bar), `app-nav` (the app's sidebar, phone top bar and tab bar), `stage-video`, `try-it`, `feature-cards`, `tool-figure` and `open-app` (landing), `feature-page` and `how-figures` (each tool's public page), `ui/`.
- `lib/i18n.ts` — every string, EN and ES. `lib/lang.ts` — reads the language cookie.
- `lib/core/` — note model (`notes.ts`), question generator (`quiz.ts`), tests. Pure TS.
- `lib/core/challenge.ts` — challenge rules. `lib/audio/note-player.ts` — Web Audio sampler.
  `lib/game/use-mode-a.ts`, `use-mode-b.ts` — mode hooks; `use-challenge.ts` — score and clock;
  `use-settings.ts` — note names and naturals only, in localStorage; `use-guitar.ts`,
  `use-records.ts` — the profile.
- `design/tokens.json` and `docs/design-system.md` — design system; tokens before screens.
- `tools/gen-samples.mjs` (`npm run samples`), `tools/icons.mjs` (`npm run icons`, regenerates
  `public/icon.png` from `public/favicon.svg` and the link previews `public/og.jpg`,
  `public/og-es.jpg` and `public/og/` from `tools/og-card.mjs`, drawn with satori via `next/og`, fonts in `tools/fonts`).
- `tools/gen-images.mjs` (the illustrations) and `tools/gen-video.mjs` (the hero's video,
  `public/video/`): see their entries under Decisions.
- `public/samples/nylon/` — generated WAVs, committed so a clone plays without the script.

## Commands

- `npm run dev` — dev server on 3000 (also `.claude/launch.json` → `diesis-dev`).
- `npm test` — core tests (Vitest). `npm run typecheck` — tsc (run `npm run build` once first so
  Next generates its route types). `npm run lint`. `npm run build` — production build.
- Env: none needed to run. The feedback form sends only with the Resend variables in `.env.local` (`.env.example`).
- Deploy: push to `main` (Vercel Git integration) or `npx vercel deploy --prod`.
- Every release: bump `version` in `package.json`, write the CHANGELOG entry, commit **and push
  to `main` in the same session, without asking** (Will, 2026-09-24: any change he asks for in
  Diesis goes straight to production; a commit left unpushed once meant the live site kept the
  access gate he had asked to remove). Check the Vercel deploy reached production afterwards.

## Conventions

- Same working style as Akoe and Tabula: this file is the living spec, `CHANGELOG.md` is written
  for users (newest first), design tokens before screens.
- **Grids always name their mobile column: `grid grid-cols-1 sm:grid-cols-2…`**, never a bare
  `grid` with only `sm:`/`lg:` columns. Without it the implicit column takes the content's
  min-content width, and iOS Safari reads an SVG's `width` attribute (the fretboards are 520 px)
  as that, pushing cards off the screen (Will's iPhone, 0.19.1). Chrome does not show it.
- American English in code and docs. UI copy in English and Spanish, both in `lib/i18n.ts`.
- Do not import React under `lib/core`.
- Keep `app/globals.css` and `components/fretboard.tsx` colors in step with `design/tokens.json`.
