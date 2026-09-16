# diesis.app

Marketing site for Diesis. Astro, static output, no client JavaScript except the scroll reveal.
Dark like the app, tokens from `design/tokens.json` mirrored in `src/styles/global.css`.

## Run locally

    npm install
    npm run dev

## Deploy (Vercel from GitHub)

Two Vercel projects, both from `wdavisf/diesis`:

| Project | Root Directory | Build | Domain |
|---|---|---|---|
| `diesis-site` | `site` | detected as Astro (`npm run build`, output `dist`) | `diesis.app`, `www.diesis.app` |
| `diesis-play` | `.` (repo root) | set in project settings: framework Other, `npm run build:web`, output `dist` | `play.diesis.app` |

Do not add a root `vercel.json`: Vercel applies it to the site project too, even with Root
Directory `site`. Every push to `main` redeploys both. On the play project, set **Ignored Build Step** to
`git diff --quiet HEAD^ HEAD -- . ':!site'` so a copy change does not rebuild the game, and the
mirror on the site project (`git diff --quiet HEAD^ HEAD -- site`) so a game change does not
rebuild the site.

DNS at Namecheap (Advanced DNS): `A @ 76.76.21.21`, `CNAME www cname.vercel-dns.com`,
`CNAME play cname.vercel-dns.com`. Vercel shows the exact records when a domain is added.

## Content

- `src/i18n/index.ts` — every word on the site, English and Spanish together. Edit both.
- `src/components/Landing.astro` — the page (hero, how it works, modes, the name, pricing, FAQ).
- `src/components/Screen.astro` — the game screen, drawn in SVG with the app's own fretboard
  geometry, animated through two questions in CSS.
- `src/components/PrivacyPage.astro` — privacy policy. Apple requires this URL for the listing.
- `public/favicon.svg` — the mark (a ♯ on the stage). `npm run icons` regenerates `icon.png`
  and `og.png` from it.

Standing rule: when the game changes (modes, settings, wording, pricing, platforms), update the
site in the same session.
