# Diesis — project context

Guitar fretboard trainer: notes on the neck and, later, scales, as games. Web and native from one
codebase. Name from Greek δίεσις, the semitone, one fret. Store title "Diesis: Guitar Notes &
Scales". Domain diesis.app (registered at Namecheap 2026-09-15). Repo `wdavisf/diesis` on GitHub (public).

The full spec is Will's Todoist project "Diesis" (id `6hWGmFjPwF25mCxM`, 43 tasks, sections 0–9):
read it through the Todoist tools before proposing scope. This file records what has been decided
and built; the Todoist project records what is still to do.

## Decisions (2026-09-15)

- **Stack: Expo** (React Native + react-native-web), one codebase, one UI. The game logic lives in
  `src/core` as pure TypeScript with no React Native imports, tested with Vitest, so the shell could
  be swapped without touching the maths. Only three seams are per platform: audio, storage (not yet
  built), orientation.
- **MVP is Mode A alone** (Will, 2026-09-15): open the app, fretboard in landscape, one position
  lit and its note played, twelve buttons, "Wrong" keeps the question, "Correct" shows the name on
  the board and moves on. Frets 0–12, all six strings, all twelve notes. No settings, no stats, no
  home screen yet.
- **Scales come after v1** (v1.1). The engine will model a scale as its full-neck set; boxed
  positions (three-notes-per-string generated, CAGED as data) sit on top later. Not yet decided
  with Will in detail; revisit when scales start.
- **Skins**: v1 has one skin. When a second arrives, every skin carries an `unlock` field so paid
  skins (€0.99 on iOS through StoreKit, later) need no restructuring. Web purchases only once there
  is an account.
- **Website and game share one domain (Will, 2026-09-16)**: diesis.app shows the landing page,
  the visitor logs in, then plays the game at the same domain. No separate play subdomain in the
  end. How the landing page, login and game share the domain is not yet decided (one Expo app
  with a landing route, the Astro site with the game under a path, or a Vercel rewrite). The
  marketing site is built in `site/` (Astro 7, static, dark, EN and ES, same layout as akoe.app).
  Hosting state on 2026-09-16, left as is: Vercel project `diesis-play` (repo root, framework
  Other, `npm run build:web`, output `dist`) builds and serves play.diesis.app; project
  `diesis-site` (Root Directory `site`, Astro) fails at "Building static entrypoints", not yet
  diagnosed; diesis.app and www are attached to `diesis-site`. DNS at Namecheap. No root
  `vercel.json`: Vercel applies one even with Root Directory `site`. No analytics, no cookies;
  the privacy page says so. Contact address on the site is hello@diesis.app (needs a forward at
  Namecheap). A login means an account, which v1 did not plan; revisit with storage.
- **Standing rule (Will, as for Akoe): when the game changes (modes, settings, wording, pricing,
  platforms, privacy behavior), update the site in the same session.** All copy, EN and ES, is
  in `site/src/i18n/index.ts`; edit both languages together. Page structure is
  `site/src/components/Landing.astro`; the animated game screen is `Screen.astro`.
- Note names use ♯ (U+266F). Sharps by default; a flat spelling exists in the core for a future
  setting. Enharmonics are one pitch class; the quiz never asks for a spelling.
- Fretboard drawing convention: nut on the left, string 1 (high E) at the top, fret numbers under
  the board, real logarithmic fret spacing scaled to the selected range, open strings get a short
  zone left of the nut.
- Audio: placeholder samples synthesised by `tools/gen-samples.mjs` (Karplus-Strong, one WAV per
  MIDI pitch 40–88, 3.4 MB). Real nylon and electric samples with clear licensing are a Todoist
  task. Web plays through Web Audio, unlocked by the "Tap to start" gesture; native through
  expo-audio with `playsInSilentMode`, so the app sounds with the ringer switch off.
- Orientation: native locked to landscape in `app.json` and at runtime; web shows a rotate gate on
  portrait phones under 700 px wide.

## Layout of the repo

- `src/core/` — note model (`notes.ts`), question generator (`quiz.ts`), tests. Pure TS.
- `src/audio/` — `NotePlayer` interface; `createNotePlayer.web.ts` (Web Audio) and
  `createNotePlayer.ts` (expo-audio); `samples.generated.ts` is written by the sample script.
- `src/game/useModeA.ts` — the Mode A state machine as a hook.
- `src/ui/` — `Fretboard` (react-native-svg), `NotePanel`, `Game` screen, `RotateGate`,
  `theme.ts` (hand mirror of `design/tokens.json`).
- `design/tokens.json` and `docs/design-system.md` — design system; tokens before screens.
- `tools/gen-samples.mjs` — placeholder sample generator (`npm run samples`).
- `assets/samples/nylon/` — generated WAVs, committed so a clone plays without running the script.
- `site/` — the diesis.app marketing site (Astro). Its own `package.json`; see `site/README.md`.

## Commands

- `npm test` — core tests (Vitest). `npm run typecheck` — tsc.
- `npm run web` — dev server on 8081 (also `.claude/launch.json` → `diesis-web`).
- `npm run build:web` — static export to `dist/` for play.diesis.app.
- `cd site && npm run dev` — the marketing site on 4321 (also `.claude/launch.json` →
  `diesis-site`); `npm run build` there before committing site changes; `npm run icons`
  regenerates `icon.png` and `og.png` from `public/favicon.svg`.
- `npm run ios:device` — build to a cable-connected iPhone through Xcode (needs CocoaPods; not
  yet installed on Will's Mac as of 2026-09-15). Expo Go on the simulator is the quick check.
- Every build Will installs: bump `version`/`buildNumber` in `app.json`, write the CHANGELOG entry,
  commit.

## Conventions

- Same working style as Akoe: this file is the living spec, `CHANGELOG.md` is written for users
  (newest first), design tokens before screens, every installed build committed.
- American English in code and docs. UI copy in English for now; Spanish later.
- Do not import `react-native` under `src/core`.
- Keep `src/ui/theme.ts` in step with `design/tokens.json` when a token changes.
