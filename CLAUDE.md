# Diesis — project context

Guitar trainer: notes on the neck first, then scales, then reading music (score) for classical
guitar, all as games. A web app first; a native app only if it earns one. Name from Greek δίεσις,
the semitone, one fret. Domain diesis.app (Namecheap, DNS on Vercel). Repo `wdavisf/diesis` on
GitHub (public).

The spec is Will's Todoist project "Diesis" (id `6hWGmFjPwF25mCxM`, sections 0–9): read it through
the Todoist tools before proposing scope. This file records what has been decided and built; the
Todoist project records what is still to do.

## Decisions

- **2026-09-23, rebuilt as a web app, Tabula-style (Will).** One Next.js 16 app at the repo root:
  the landing page at `/`, the trainer under `/app`. The Expo
  shell, the native audio player and the separate Astro site are gone (git history has them). No
  mobile app for now; "we'll see" later. The pure game logic survived the move unchanged.
- **Stack**: Next.js 16 (app router, `proxy.ts` not middleware), React 19, Tailwind v4, shadcn
  (radix-nova, neutral), Geist for text and Fraunces for display. Game logic in `lib/core` is pure
  TypeScript with Vitest, no React imports. Fretboard is plain SVG. Audio is Web Audio.
- **No access gate (Will, 2026-09-23).** The app is open to anyone: `/app` asks for no code,
  account or cookie. The `/login` route, `proxy.ts` and the `DIESIS_ACCESS_CODE` env that gated
  `/app/*` from 0.2.0 to 0.3.0 are gone (git history has them; the shared code `RYUJIN` is dead).
  If access control ever comes back it will be an account, not a shared code.
- **Scope on the landing page** (three tracks): Notes (Name the note playable now; Find the note,
  Hear the note, settings and challenges next), Scales (later: explore, build, name the scale,
  name the degree), Reading music (later, for classical guitar: note on the staff to name or
  neck, neck to staff, short reading passages). Keep the page and the app home in step with what
  exists.
- **Mode A** as built: open `/app/name-the-note`, board in landscape, one position lit and
  played, twelve buttons, "Wrong" keeps the question, "Correct" shows the name on the board and
  moves on. Frets 0–12, six strings, all twelve notes. Desktop keys: C D E F G A B pick a note,
  Shift for the sharp, Space or Enter replays (or starts).
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
- Orientation: portrait phones (under `md`, portrait) see a rotate gate, pure CSS.
- **Analytics (Will, 2026-09-23)**: Google Analytics 4, property `G-HNHYBR8Y13`, loaded by
  `components/consent.tsx` only after the visitor accepts a banner (cookie `diesis_consent`,
  one year). Decline loads nothing from Google. The privacy page describes it in both
  languages; keep it true.
- **Spanish note names**: the Spanish UI uses solfège (Do, Re♯, Sol…) on the buttons, the board
  and the hero animation via `game.noteNames` in `lib/i18n.ts`; English keeps letters. The
  core stays in pitch classes, so this is display only.
- **Spanish copy is written natively, never translated literally** (Will, 2026-09-23, after
  rejecting a literal pass). Spain register: ordenador, móvil, «échate una ronda».
- **Standing rule: when the game changes (modes, settings, wording, pricing, privacy behavior),
  update the landing page, the app home and the privacy page in the same session.** All copy,
  EN and ES, is in `lib/i18n.ts`; edit both languages together. The landing and privacy pages
  have `/es` routes (SEO, hreflang); the mode picker and game read the `diesis_lang`
  cookie, set by `/lang/[code]` (the switcher and the landing CTAs go through it). Values in the
  strings file must be plain data (no functions): they cross into client components.
- **Logo (Will, 2026-09-23)**: a real lowercase delta, δ, set on five staff lines like a note
  on a score. The outline is EB Garamond's δ (SIL Open Font License, extracted with fontTools);
  amber letter, cream lines at 45%, on the stage tile. Will rejected a hand-drawn δ: it must
  look like the letter. Drawing lives in `components/logo.tsx` and `public/favicon.svg`;
  `npm run icons` renders `icon.png` and `og.png` from the SVG. Change both files together.

## Hosting

Vercel project `diesis-site` (team wdavisf-gmailcoms-projects), Git integration from
`wdavisf/diesis` main, framework Next.js at the repo root, no environment variables (the old
`DIESIS_ACCESS_CODE` is no longer read and can be deleted from the project settings). Domains
diesis.app and www (redirects to the apex); DNS at Namecheap. Live since 2026-09-23. The old `diesis-play` project (play.diesis.app, Expo web export) is obsolete and can
be deleted in the dashboard. The repo folder is linked to `diesis-site` (`.vercel/`, ignored), so
`npx vercel deploy --prod` works as well as a push.

## Layout of the repo

- `app/` — routes: `page.tsx` and `es/page.tsx` (landing), `privacy/` and `es/privacy/`,
  `app/` (mode picker), `app/name-the-note/`, `lang/[code]/` (cookie setter).
  `layout.tsx` holds fonts and metadata; `globals.css` the theme tokens.
- `components/` — `landing`, `privacy-page`, `logo`, `screen` (animated hero), `footer`,
  `lang-switch`, `fretboard` (SVG), `note-panel`, `game` (Mode A screen, client), `ui/`.
- `lib/i18n.ts` — every string, EN and ES. `lib/lang.ts` — reads the language cookie.
- `lib/core/` — note model (`notes.ts`), question generator (`quiz.ts`), tests. Pure TS.
- `lib/audio/note-player.ts` — Web Audio sampler. `lib/game/use-mode-a.ts` — Mode A hook.
- `design/tokens.json` and `docs/design-system.md` — design system; tokens before screens.
- `tools/gen-samples.mjs` (`npm run samples`), `tools/icons.mjs` (`npm run icons`, regenerates
  `public/icon.png` and `public/og.png` from `public/favicon.svg`).
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
