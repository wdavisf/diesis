# Diesis design system

Tokens and rules for the site and the app. Values live in `design/tokens.json` and are mirrored by
hand in `app/globals.css` (theme variables) and `components/fretboard.tsx` (board colors). Dark
only: a stage, with the fretboard as the one lit object on it. The landing page uses the same
stage so the app feels like walking through a door, not into a different building.

Built for one situation: phone or laptop in landscape, guitar on the lap, eyes flicking between
the neck on screen and the answer buttons. Every choice serves "see the lit note, tap the name,
know at once if it was right".

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

Fretboard: wood #5a3a2b with a darker edge #3d271c, frets #c9c6bd over a shadow #7d7a72, bone
nut #e9e2cf, strings #d8d4c8 over #6b6558 with gauges from 1.2 (high E) to 3.6 (low E), pearl
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

| Style | Size / line | Weight | Where |
|---|---|---|---|
| title | 18 / 22 | semibold | header word "Diesis" |
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
