// The link-preview card (1200×630): the game itself. A question, the neck with one spot lit,
// the seven natural-note buttons with the right one green, and the wordmark in the corner.
// Rendered by tools/icons.mjs through next/og (satori). Fonts in tools/fonts are Fraunces and
// Geist, both SIL Open Font License, as static TTFs (satori takes no woff2 or variable fonts).
// Colors mirror design/tokens.json; the neck geometry mirrors components/fretboard.tsx.
import { ImageResponse } from 'next/og.js';
import { createElement as h } from 'react';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const fontDir = join(dirname(fileURLToPath(import.meta.url)), 'fonts');
const font = (name, file, weight) => ({ name, data: readFileSync(join(fontDir, file)), weight });
const fonts = [font('Fraunces', 'Fraunces-600.ttf', 600), font('Geist', 'Geist-400.ttf', 400), font('Geist', 'Geist-600.ttf', 600)];

const c = {
  bg: '#14120f', raised: '#2e2a24', border: '#3a352d', ink: '#f3efe6', muted: '#a39c8e', accent: '#e0a63a',
  correct: '#4caf6b', wood: '#5a3a2b', woodEdge: '#3d271c', fret: '#c9c6bd', fretShadow: '#7d7a72',
  nut: '#e9e2cf', string: '#d8d4c8', stringShadow: '#6b6558', inlay: '#e8e2d3', markInk: '#14120f',
};

const copy = {
  en: { question: 'Which note is it?', tagline: 'Everything you need to master the guitar.', names: ['C', 'D', 'E', 'F', 'G', 'A', 'B'] },
  es: { question: '¿Qué nota es?', tagline: 'Todo lo que necesitas para dominar la guitarra.', names: ['Do', 'Re', 'Mi', 'Fa', 'Sol', 'La', 'Si'] },
};

function mark(size, delta) {
  return h('svg', { width: size, height: size, viewBox: '0 0 1024 1024' },
    h('rect', { width: 1024, height: 1024, rx: 230, fill: c.bg, stroke: '#ffffff22', strokeWidth: 8 }),
    h('g', { stroke: '#e9e2cf', strokeWidth: 14, strokeLinecap: 'round', opacity: 0.45 },
      ...[132, 322, 512, 702, 892].map((y) => h('line', { key: y, x1: 120, x2: 904, y1: y, y2: y }))),
    h('path', { transform: 'translate(322.1 834.2) scale(0.8403 -0.8403)', d: delta, fill: c.accent }));
}

/** "δiesis", the δ drawn as the logo's glyph, as components/logo.tsx does. */
function wordmark(size, delta) {
  const gh = size * 0.8;
  return h('div', { style: { display: 'flex', alignItems: 'flex-end', fontFamily: 'Fraunces', fontWeight: 600, fontSize: size, color: c.ink, lineHeight: 1 } },
    h('svg', { width: (gh * 452) / 714, height: gh, viewBox: '0 -700 452 714', style: { marginBottom: size * 0.2 } },
      h('path', { transform: 'scale(1 -1)', d: delta, fill: c.ink, stroke: c.ink, strokeWidth: 24, strokeLinejoin: 'round' })),
    h('span', { style: { lineHeight: 1.2 } }, 'iesis'));
}

const fretDistance = (n) => 1 - Math.pow(2, -n / 12);

/** Frets 0–maxFret, string 1 at the top, one amber spot at the asked position. */
function neck(w, ht, maxFret, asked) {
  const inset = ht * 0.12, gap = (ht - inset * 2) / 5, openZone = 56;
  const scale = (w - openZone) / fretDistance(maxFret);
  const fx = (n) => openZone + fretDistance(n) * scale;
  const cx = (n) => (n === 0 ? openZone / 2 : (fx(n - 1) + fx(n)) / 2);
  const sy = (s) => inset + (s - 1) * gap;
  const gauges = [1.2, 1.5, 1.9, 2.4, 3.0, 3.6].map((g) => g * 1.8);
  const kids = [h('rect', { x: openZone, y: 0, width: w - openZone, height: ht, fill: c.wood, stroke: c.woodEdge, strokeWidth: 2, rx: 3 })];
  for (const n of [3, 5, 7]) if (n <= maxFret) kids.push(h('circle', { cx: cx(n), cy: (sy(3) + sy(4)) / 2, r: gap * 0.26, fill: c.inlay, opacity: 0.9 }));
  kids.push(h('rect', { x: openZone - 5, y: -2, width: 12, height: ht + 4, fill: c.nut, rx: 2 }));
  for (let n = 1; n <= maxFret; n++) {
    kids.push(h('line', { x1: fx(n) + 1.5, y1: 0, x2: fx(n) + 1.5, y2: ht, stroke: c.fretShadow, strokeWidth: 3.4 }));
    kids.push(h('line', { x1: fx(n), y1: 0, x2: fx(n), y2: ht, stroke: c.fret, strokeWidth: 4.5 }));
  }
  for (let s = 1; s <= 6; s++) {
    const g = gauges[s - 1];
    kids.push(h('line', { x1: 0, y1: sy(s) + g * 0.6, x2: w, y2: sy(s) + g * 0.6, stroke: c.stringShadow, strokeWidth: g }));
    kids.push(h('line', { x1: 0, y1: sy(s), x2: w, y2: sy(s), stroke: c.string, strokeWidth: g }));
  }
  const r = 28, ring = 7;
  return h('div', { style: { position: 'relative', display: 'flex', width: w, height: ht } },
    h('svg', { width: w, height: ht, viewBox: `0 0 ${w} ${ht}` }, ...kids),
    h('div', { style: {
      position: 'absolute', left: cx(asked.fret) - r - ring, top: sy(asked.string) - r - ring, width: (r + ring) * 2, height: (r + ring) * 2,
      borderRadius: 999, border: `3px solid ${c.accent}99`, display: 'flex', alignItems: 'center', justifyContent: 'center' } },
      h('div', { style: { width: r * 2, height: r * 2, borderRadius: 999, background: c.accent } })));
}

function card(lang, delta) {
  const t = copy[lang];
  return h('div', { style: { width: 1200, height: 630, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '50px 64px 54px', background: c.bg, color: c.ink, fontFamily: 'Geist' } },
    h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' } },
      h('div', { style: { display: 'flex', flexDirection: 'column' } },
        h('div', { style: { fontFamily: 'Fraunces', fontWeight: 600, fontSize: 64, lineHeight: 1.1 } }, t.question),
        // No-break spaces: satori spaces some Geist words unevenly with plain ones.
        h('div', { style: { fontSize: 32, color: c.muted, marginTop: 8 } }, t.tagline.replaceAll(' ', '\u00a0'))),
      h('div', { style: { display: 'flex', alignItems: 'center', gap: 14, marginTop: 10 } }, mark(52, delta), wordmark(44, delta))),
    h('div', { style: { display: 'flex' } }, neck(1072, 250, 7, { string: 2, fret: 1 })),
    h('div', { style: { display: 'flex', gap: 14 } },
      ...t.names.map((n, i) => h('div', { key: n, style: {
        flex: 1, height: 92, borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, fontWeight: 600,
        background: i === 0 ? c.correct : c.raised, color: i === 0 ? c.markInk : c.ink, border: `2px solid ${i === 0 ? c.correct : c.border}` } }, n))));
}

/** PNG bytes of the card in one language. `delta` is the δ outline from public/favicon.svg. */
export async function ogCard(lang, delta) {
  const res = new ImageResponse(card(lang, delta), { width: 1200, height: 630, fonts });
  return Buffer.from(await res.arrayBuffer());
}
