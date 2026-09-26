# Diesis design system

Tokens and rules for the site and the app. Values live in `design/tokens.json` and are mirrored by
hand in `app/globals.css` (theme variables) and `components/fretboard.tsx` (board colors). Dark
only: a stage, with the fretboard as the one lit object on it. The landing page uses the same
stage so the app feels like walking through a door, not into a different building.

Built for one situation: phone or laptop in landscape, guitar on the lap, eyes flicking between
the neck on screen and the answer buttons. Every choice serves "see the lit note, tap the name,
know at once if it was right".

## Mark

A lowercase delta, δ, set on five staff lines like a note on a score: the bowl sits on the
fourth line, the top arm rises like a flag. The letter is EB Garamond's δ (SIL Open Font
License), amber #e0a63a; the lines are cream #e9e2cf at 45%, 14 units thick on a 1024 tile,
with a 22% corner radius. Source: `public/favicon.svg`, mirrored in `components/logo.tsx`;
`npm run icons` renders the PNGs. At 24 px the lines fade to a texture and the δ carries it.

## Color

| Token | Value | Used for |
|---|---|---|
| background | #14120f | the stage |
| surface | #23201b | answer buttons, header |
| surfaceRaised | #2e2a24 | pressed button |
| border | #3a352d | hairlines |
| ink | #f3efe6 | text |
| muted | #a39c8e | score, hints, fret numbers |
| accent | #e0a63a | the lit position, primary action |
| accentText | #f0c46a | amber words on dark (7.9:1) |
| correct | #4caf6b | right answer, on the board and the button |
| wrong | #d64545 | wrong button |

Fretboard: wood #5a3a2b with a darker edge #3d271c, frets #8f8a80 (dim nickel, so they never compete with the strings) over a shadow #3d2f26, bone
nut #e9e2cf, plain strings #f4f1e8 and wound strings (4 and lower) #d6b98a with a dashed winding #8a7250, each over a shadow #1f150f at 55%, with gauges from 1.2 (high E) to 3.6 (low E), pearl
inlays #e8e2d3 at 3 5 7 9 12 15 17 19 21 24, doubled at 12 and 24.

Color never carries meaning alone: the lit position is also larger than an inlay and carries a
ring, the right button turns green and the feedback line says the word, the wrong button turns
red and the line says Wrong.

Contrast (WCAG): ink on background 16:1, muted on background 7.1:1, accentText 7.9:1, ink on
correct 4.6:1 (button label), ink on wrong 4.7:1.

## Type

Geist for everything read, Fraunces (variable, optical size) for display headings and the
wordmark: a serif with some warmth for a classical instrument. Semibold for anything read at a
glance (note names, feedback), regular for chrome.

The wordmark reads "δiesis": the D is the mark's own EB Garamond δ, drawn inline as SVG at text
size (`DeltaGlyph` in `components/logo.tsx`), because Fraunces has no Greek and the letter must
match the icon. Its height and a thickening stroke are constants in that file, tuned so the
bowl sits on Fraunces' x-height and the weight reads as semibold. Plain text still says
"Diesis" (page titles, copy, screen readers).

| Style | Size / line | Weight | Where |
|---|---|---|---|
| title | 18 / 22 | semibold | header wordmark "δiesis" |
| noteButton | 22 / 26 | semibold | the twelve answer buttons |
| feedback | 22 / 28 | semibold | Correct / Wrong line |
| score | 15 / 20 | regular, muted | running score |
| fretNumber | 12 / 14 | regular, muted | under the board |
| noteOnBoard | 14 / 16 | bold | note name inside a lit position once answered |

Note names use the sharp symbol ♯ (U+266F), never the hash. Flats ♭ appear only where a setting
asks for them. Sentence case, no full stops on single words.

## Layout (landscape)

Header row 44 high: title left, score right. Fretboard fills the middle, nut on the left, high E
string at the top as in every chord book, fret numbers under it. Answer panel at the bottom: one
row of twelve buttons, 56 high, 8 gap, 12 side margin. Minimum tap target 44 × 44. Feedback line
sits between the board and the panel and keeps its slot when empty so nothing jumps.

A portrait phone shows a rotate gate instead of the game. On a desktop the board fills the
window and the letter keys pick notes; a one-line hint under the panel says so, only on devices
with a fine pointer.

## Motion

Correct: the lit position turns green, the feedback says Correct, 600 ms later the next position
lights. Wrong: the button flashes red for 400 ms, the question stays. No other animation in the
MVP.
