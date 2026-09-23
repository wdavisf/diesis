# Diesis changelog

Written for the people using it, not for the code. Newest first. Version matches
`package.json`.

## 0.2.0 — 23 September 2026, Diesis becomes a web app

Diesis now lives at diesis.app: a page that explains it, an access code, and the game.

- diesis.app opens on a landing page: what Diesis is, how a round works, and what is coming
  (notes now, scales next, reading music for classical guitar after that).
- "Open the app" asks for an access code once; the browser remembers it for six months.
- Inside, pick a mode. "Name the note" is playable; the others are listed and locked for now.
- On a laptop the letter keys C to B pick a note, Shift adds the sharp, Space plays the note again.
- The board fills the window on a desktop; on a phone, hold it sideways as before.
- The iPhone build and the separate play.diesis.app address are retired. Nothing you could do
  before is gone; it just moved.

## 0.1.0 (1) — 15 September 2026, first web build

The first thing you can play: name the note.

- Open Diesis and the guitar neck is already sideways, frets 0 to 12, nut on the left.
- Tap to start. One position lights up in amber and you hear it. Twelve buttons along the bottom,
  C to B, sharps as ♯.
- Tap the right name and the spot turns green with the note written on it, "Correct" appears,
  and the next note lights a moment later.
- Tap a wrong name and the button flashes red with "Wrong"; the same note stays until you get it.
- "Hear again" replays the note. The header counts right and wrong answers for the session.
- The sound is a synthesised nylon pluck for now; real recordings will replace it.
- On a phone browser held upright, Diesis asks you to turn the phone.
