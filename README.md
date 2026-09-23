# Diesis

Guitar trainer: notes on the neck, then scales, then reading music, as games. https://diesis.app

- `CLAUDE.md` — living spec and decisions. Start there.
- `CHANGELOG.md` — what each release does, written for users.
- `docs/design-system.md` and `design/tokens.json` — the design system.
- `app/` routes, `components/` UI, `lib/core` the pure game logic with tests.

## Run locally

```bash
npm install
npm run dev
```

`/` is the landing page, `/app` the trainer. No environment variables.

## Deploy

Vercel, root directory = repo root, framework Next.js. Nothing to configure.
