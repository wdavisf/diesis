// The link-preview cards (1200×630). The default card is the landing's hero: the guitarist of
// its video (tools/og-stage.jpg, cut from the video's first frame by tools/gen-video.mjs) with the
// three-line headline, the mark and the address. Every tool has its own card in one frame (its
// name, one line, the wordmark) over a drawing of the tool, so a shared /practice/metronome link
// previews the metronome; Name the note's is the exercise itself: the question, the neck with
// one spot lit and the seven natural-note buttons with the right one green.
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
const stage = `data:image/jpeg;base64,${readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'og-stage.jpg')).toString('base64')}`;

const c = {
  bg: '#14120f', raised: '#2e2a24', border: '#3a352d', ink: '#f3efe6', muted: '#a39c8e', accent: '#e0a63a', accentText: '#f0c46a',
  correct: '#4caf6b', note: '#efe9dc', wood: '#5a3a2b', woodEdge: '#3d271c', fret: '#8f8a80', fretShadow: '#3d2f26',
  nut: '#e9e2cf', string: '#f4f1e8', stringWound: '#d6b98a', stringShadow: '#1f150f', inlay: '#e8e2d3', markInk: '#14120f',
};

// No-break spaces: satori spaces some Geist words unevenly with plain ones.
const nb = (s) => s.replaceAll(' ', ' ');

/** The default card's words (the hero's eyebrow and headline, lib/i18n.ts; `size` fits the longest line left of the player), and the tool cards' name and one line, which mirror lib/i18n.ts too. */
const copy = {
  en: {
    eyebrow: 'THE GUITAR PRACTICE APP', lines: ['Know the neck.', 'Lock in the tempo.', 'Dial in your guitar.'], size: 64, eyebrowSize: 22,
    question: 'Which note is it?', questionLine: 'A position lights and plays. Say which note it is.', names: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
    strings: ['E', 'B', 'G', 'D', 'A', 'E'], root: 'A', scale: 'Minor pentatonic', speed: 'Speed up', onTime: 'On time', keys: ['A', 'S', 'D', 'F'],
    tracks: [['Blues in A', 'A blues scale'], ['Rock in E minor', 'E minor pentatonic'], ['Funk in E', 'E dorian']],
    tools: {
      'find-the-note': ['Find the note', 'You get a name. Tap every place it lives.'],
      neck: ['The neck', 'Any scale on any root, across the whole fretboard.'],
      metronome: ['Metronome', '20 to 300 BPM, odd meters, tap tempo, Speed up.'],
      'backing-tracks': ['Backing tracks', 'Jam over tracks in every style, key and scale shown.'],
      fingers: ['Finger independence', 'Notes fall onto four pads, one per finger. Hit each on the click.'],
      strings: ['Strings and setup', 'Tension per string, a balanced set, your setup numbers.'],
      tuner: ['Tuner', 'Play a string and see which way to turn the peg.'],
    },
  },
  es: {
    eyebrow: 'LA APP PARA PRACTICAR GUITARRA', lines: ['Domina el mástil.', 'Clava el tempo.', 'Pon a punto tu guitarra.'], size: 54, eyebrowSize: 22,
    question: '¿Qué nota es?', questionLine: 'Se ilumina una posición y suena. Di qué nota es.', names: ['Do', 'Re', 'Mi', 'Fa', 'Sol', 'La', 'Si'],
    strings: ['Mi', 'Si', 'Sol', 'Re', 'La', 'Mi'], root: 'La', scale: 'Pentatónica menor', speed: 'Subida de tempo', onTime: 'A tiempo', keys: ['A', 'S', 'D', 'F'],
    tracks: [['Blues en La', 'escala de blues de La'], ['Rock en La menor', 'pentatónica menor de La'], ['Funk en Mi', 'Mi dórico']],
    tools: {
      'find-the-note': ['Encuentra la nota', 'Te dan una nota. Tócala en todos los sitios donde esté.'],
      neck: ['El mástil', 'Cualquier escala sobre cualquier tónica, por todo el mástil.'],
      metronome: ['Metrónomo', 'De 20 a 300 BPM, amalgamas, tap tempo y subida de tempo.'],
      'backing-tracks': ['Backing tracks', 'Bases de todos los estilos, con su tonalidad y su escala.'],
      fingers: ['Independencia de dedos', 'Caen notas sobre cuatro botones, uno por dedo. Púlsalos en el clic.'],
      strings: ['Cuerdas y ajuste', 'La tensión de cada cuerda, un juego equilibrado y tu ajuste.'],
      tuner: ['Afinador', 'Puntea una cuerda y mira hacia dónde girar la clavija.'],
    },
  },
};

/** The cards besides the default one, by name: `public/og/<name>-<lang>.png`. */
export const TOOL_CARDS = ['name-the-note', ...Object.keys(copy.en.tools)];

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

/** The card's top: a title and one line on the left, the mark and wordmark on the right. */
function header(title, line, delta) {
  return h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' } },
    h('div', { style: { display: 'flex', flexDirection: 'column' } },
      h('div', { style: { fontFamily: 'Fraunces', fontWeight: 600, fontSize: 64, lineHeight: 1.1 } }, title),
      h('div', { style: { fontSize: 30, color: c.muted, marginTop: 8 } }, nb(line))),
    h('div', { style: { display: 'flex', alignItems: 'center', gap: 14, marginTop: 10 } }, mark(52, delta), wordmark(44, delta)));
}

const page = (...rows) => h('div', { style: { width: 1200, height: 630, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '50px 64px 54px', background: c.bg, color: c.ink, fontFamily: 'Geist' } }, ...rows);

const chip = (text, { fill = c.raised, ink = c.ink, border = c.border, size = 30 } = {}) =>
  h('div', { style: { display: 'flex', alignItems: 'center', height: size * 1.9, padding: `0 ${size * 0.8}px`, borderRadius: 999, background: fill, color: ink, border: `2px solid ${border}`, fontSize: size, fontWeight: 600 } }, nb(text));

const fretDistance = (n) => 1 - Math.pow(2, -n / 12);
/** Standard tuning, string 1 to 6, as MIDI. */
const OPEN = [64, 59, 55, 50, 45, 40];
/** Every place of a pitch class in frets 0–maxFret. */
const positions = (pc, maxFret) =>
  OPEN.flatMap((open, i) => Array.from({ length: maxFret + 1 }, (_, fret) => fret).filter((fret) => (open + fret) % 12 === pc).map((fret) => ({ string: i + 1, fret })));

/**
 * Frets 0–maxFret, string 1 at the top, with marks: `{ string, fret, state, label? }`, state
 * "asking" (amber, ringed), "correct" (green, ringed), "root" (amber) or "note" (cream).
 */
function neck(w, ht, maxFret, marks, spot) {
  const inset = ht * 0.12, gap = (ht - inset * 2) / 5, openZone = 56;
  const scale = (w - openZone) / fretDistance(maxFret);
  const fx = (n) => openZone + fretDistance(n) * scale;
  const cx = (n) => (n === 0 ? openZone / 2 : (fx(n - 1) + fx(n)) / 2);
  const sy = (s) => inset + (s - 1) * gap;
  const gauges = [1.2, 1.5, 1.9, 2.4, 3.0, 3.6].map((g) => g * 1.8);
  const kids = [h('rect', { x: openZone, y: 0, width: w - openZone, height: ht, fill: c.wood, stroke: c.woodEdge, strokeWidth: 2, rx: 3 })];
  for (const n of [3, 5, 7, 9]) if (n <= maxFret) kids.push(h('circle', { cx: cx(n), cy: (sy(3) + sy(4)) / 2, r: gap * 0.26, fill: c.inlay, opacity: 0.9 }));
  if (maxFret >= 12) for (const s of [2, 5]) kids.push(h('circle', { cx: cx(12), cy: (sy(s) + sy(s + 1)) / 2, r: gap * 0.26, fill: c.inlay, opacity: 0.9 }));
  kids.push(h('rect', { x: openZone - 5, y: -2, width: 12, height: ht + 4, fill: c.nut, rx: 2 }));
  for (let n = 1; n <= maxFret; n++) {
    kids.push(h('line', { x1: fx(n) + 1.5, y1: 0, x2: fx(n) + 1.5, y2: ht, stroke: c.fretShadow, strokeWidth: 3.4 }));
    kids.push(h('line', { x1: fx(n), y1: 0, x2: fx(n), y2: ht, stroke: c.fret, strokeWidth: 4.5 }));
  }
  for (let s = 1; s <= 6; s++) {
    const g = gauges[s - 1];
    kids.push(h('line', { x1: 0, y1: sy(s) + g * 0.6, x2: w, y2: sy(s) + g * 0.6, stroke: c.stringShadow, strokeWidth: g }));
    kids.push(h('line', { x1: 0, y1: sy(s), x2: w, y2: sy(s), stroke: s >= 4 ? c.stringWound : c.string, strokeWidth: g }));
  }
  // Spots shrink on a long neck so they stay inside the last fret; `spot` sets their radius outright.
  const r = spot ?? Math.min(ht * 0.112, (fx(maxFret) - fx(maxFret - 1)) * 0.42), ring = r / 4;
  const spots = marks.map((m) => {
    const fill = m.state === 'correct' ? c.correct : m.state === 'note' ? c.note : c.accent;
    const ringed = m.state === 'asking' || m.state === 'correct';
    return h('div', { key: `${m.string}-${m.fret}`, style: {
      position: 'absolute', left: cx(m.fret) - r - ring, top: sy(m.string) - r - ring, width: (r + ring) * 2, height: (r + ring) * 2,
      borderRadius: 999, border: `3px solid ${ringed ? fill + '99' : 'transparent'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' } },
      h('div', { style: { width: r * 2, height: r * 2, borderRadius: 999, background: fill, display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.markInk, fontSize: r * 1.05, fontWeight: 600 } },
        ...(m.label ? [m.label] : [])));
  });
  return h('div', { style: { position: 'relative', display: 'flex', width: w, height: ht } },
    h('svg', { width: w, height: ht, viewBox: `0 0 ${w} ${ht}` }, ...kids), ...spots);
}

/** The default card: Name the note, first position. */
/** The default card: the hero. The photo fills it, darkened toward the left, where the words are. */
function stageCard(t, delta) {
  const layer = (style, ...kids) => h('div', { style: { position: 'absolute', left: 0, top: 0, width: 1200, height: 630, display: 'flex', ...style } }, ...kids);
  return h('div', { style: { position: 'relative', display: 'flex', width: 1200, height: 630, background: c.bg, color: c.ink, fontFamily: 'Geist' } },
    h('img', { src: stage, width: 1200, height: 630, style: { position: 'absolute', left: 0, top: 0 } }),
    layer({ background: 'linear-gradient(90deg, rgba(20,18,15,0.94) 0%, rgba(20,18,15,0.72) 38%, rgba(20,18,15,0) 62%)' }),
    layer({ background: 'linear-gradient(180deg, rgba(20,18,15,0.35) 0%, rgba(20,18,15,0) 30%, rgba(20,18,15,0) 70%, rgba(20,18,15,0.6) 100%)' }),
    layer({ flexDirection: 'column', justifyContent: 'space-between', padding: '56px 64px 52px' },
      h('div', { style: { display: 'flex', alignItems: 'center', gap: 16 } }, mark(60, delta), wordmark(46, delta)),
      h('div', { style: { display: 'flex', flexDirection: 'column' } },
        h('div', { style: { fontSize: t.eyebrowSize, fontWeight: 600, letterSpacing: 1.5, color: c.accentText } }, nb(t.eyebrow)),
        h('div', { style: { display: 'flex', flexDirection: 'column', marginTop: 18, fontFamily: 'Fraunces', fontWeight: 600, fontSize: t.size, lineHeight: 1.08, letterSpacing: -1 } },
          ...t.lines.map((line) => h('div', { key: line }, line)))),
      h('div', { style: { fontSize: 28, color: c.muted } }, 'diesis.app')));
}

/** Name the note: the question, first position with one spot lit, and the answer in green. */
function nameTheNote(t, delta) {
  return page(
    header(t.question, t.questionLine, delta),
    h('div', { style: { display: 'flex' } }, neck(1072, 250, 7, [{ string: 2, fret: 1, state: 'asking' }])),
    h('div', { style: { display: 'flex', gap: 14 } },
      ...t.names.map((n, i) => h('div', { key: n, style: {
        flex: 1, height: 92, borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, fontWeight: 600,
        background: i === 0 ? c.correct : c.raised, color: i === 0 ? c.markInk : c.ink, border: `2px solid ${i === 0 ? c.correct : c.border}` } }, n))));
}

/** Find the note: every C in frets 0–12, found. */
function findTheNote(t) {
  const marks = positions(0, 12).map((p) => ({ ...p, state: 'correct', label: t.names[0] }));
  return h('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22 } },
    neck(1072, 270, 12, marks, 22),
    h('div', { style: { display: 'flex', gap: 14 } },
      ...t.names.map((n, i) => chip(n, i === 0 ? { fill: c.correct, ink: c.markInk, border: c.correct, size: 28 } : { size: 28 }))));
}

/** The neck: A minor pentatonic over frets 0–12, root in amber. */
function theNeck(t) {
  const marks = [[9, 'root'], [0, 'note'], [2, 'note'], [4, 'note'], [7, 'note']].flatMap(([pc, state]) => positions(pc, 12).map((p) => ({ ...p, state })));
  return h('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22 } },
    neck(1072, 270, 12, marks, 15),
    h('div', { style: { display: 'flex', gap: 14 } }, chip(t.root, { fill: c.accent, ink: c.markInk, border: c.accent, size: 28 }), chip(t.scale, { size: 28 })));
}

/** Metronome: the tempo, its marking, the beat dots with the one lit, and the chips. */
function metronome(t) {
  const dot = (lit) => h('div', { style: { width: 44, height: 44, borderRadius: 999, background: lit ? c.accent : c.raised, border: `2px solid ${lit ? c.accent : c.border}` } });
  return h('div', { style: { display: 'flex', alignItems: 'center', gap: 72 } },
    h('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center' } },
      h('div', { style: { display: 'flex', alignItems: 'baseline', gap: 16 } },
        h('div', { style: { fontFamily: 'Fraunces', fontWeight: 600, fontSize: 210, lineHeight: 1 } }, '120'),
        h('div', { style: { fontSize: 36, color: c.muted, fontWeight: 600 } }, 'BPM')),
      h('div', { style: { fontSize: 36, color: c.muted, marginTop: 4 } }, 'Allegro')),
    h('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 30 } },
      h('div', { style: { display: 'flex', gap: 22 } }, dot(true), dot(false), dot(false), dot(false)),
      h('div', { style: { display: 'flex', gap: 14 } }, chip('4/4', { size: 28 }), chip(t.speed, { fill: c.accent, ink: c.markInk, border: c.accent, size: 28 }))));
}

/** Backing tracks: three players, style and key on each. */
function backingTracks(t) {
  const player = ([name, scale]) => h('div', { key: name, style: { display: 'flex', flexDirection: 'column', width: 336, borderRadius: 22, background: c.raised, border: `2px solid ${c.border}`, overflow: 'hidden' } },
    h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'center', height: 190, background: '#1f1b16' } },
      h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: 84, height: 84, borderRadius: 999, background: c.accent } },
        h('svg', { width: 34, height: 38, viewBox: '0 0 34 38' }, h('path', { d: 'M3 2 L32 19 L3 36 Z', fill: c.markInk })))),
    h('div', { style: { display: 'flex', flexDirection: 'column', padding: '16px 22px 18px' } },
      h('div', { style: { fontSize: 30, fontWeight: 600 } }, nb(name)),
      h('div', { style: { fontSize: 24, color: c.muted, marginTop: 2 } }, nb(scale))));
  return h('div', { style: { display: 'flex', gap: 32 } }, ...t.tracks.map(player));
}

/** Finger independence: four pads as the hand lies, notes falling down their columns, the one on
 *  pad 3 landing now, the last tap on time. */
function fingers(t) {
  const W = 190, GAP = 28, H = 320, PAD = 150;
  const note = (n, y, fill) => h('div', { style: { position: 'absolute', left: (W - 76) / 2, top: y, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 76, height: 76, borderRadius: 999, background: fill ?? c.accent, color: c.markInk, fontFamily: 'Fraunces', fontWeight: 600, fontSize: 40, boxShadow: `0 0 26px ${c.accent}66` } }, String(n));
  const column = (n, i, notes) => h('div', { key: n, style: { position: 'relative', display: 'flex', width: W, height: H } },
    h('div', { style: { position: 'absolute', left: W / 2, top: 0, width: 2, height: H - PAD, background: c.border } }),
    h('div', { style: { position: 'absolute', left: 0, top: H - PAD, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, width: W, height: PAD, borderRadius: 26, background: n === 3 ? '#3a3020' : c.raised, border: `3px solid ${n === 3 ? c.accent : c.border}`, color: c.ink } },
      h('div', { style: { fontFamily: 'Fraunces', fontWeight: 600, fontSize: 64, lineHeight: 1 } }, String(n)),
      h('div', { style: { fontSize: 24, color: c.muted, fontWeight: 600 } }, t.keys[i])),
    ...notes.map(([y, fill]) => note(n, y, fill)));
  return h('div', { style: { display: 'flex', alignItems: 'center', gap: 56 } },
    h('div', { style: { display: 'flex', gap: GAP } },
      column(4, 0, [[14]]),
      column(3, 1, [[H - PAD + (PAD - 76) / 2 - 12]]),
      column(2, 2, [[66]]),
      column(1, 3, [[-16]])),
    chip(t.onTime, { fill: c.correct, ink: c.markInk, border: c.correct, size: 30 }));
}

/** Strings and setup: a 10–46 set at 25.5″ in E standard, tension per string. */
function stringsAndSetup(t) {
  const set = [[10, 16.3], [13, 15.5], [17, 16.6], [26, 18.4], [36, 19.5], [46, 17.5]];
  const row = ([g, lb], i) => h('div', { key: g, style: { display: 'flex', alignItems: 'center', gap: 22, height: 50 } },
    h('div', { style: { width: 56, fontSize: 28, fontWeight: 600, color: c.muted } }, t.strings[i]),
    h('div', { style: { width: 110, fontSize: 28, fontWeight: 600 } }, `.0${g}${i >= 3 ? 'w' : ''}`),
    h('div', { style: { width: (lb / 21) * 660, height: 26, borderRadius: 999, background: i >= 3 ? c.stringWound : c.accent } }),
    h('div', { style: { fontSize: 28, color: c.muted } }, `${lb.toFixed(1)} lb`));
  return h('div', { style: { display: 'flex', flexDirection: 'column', width: 1072 } }, ...set.map(row));
}

/** Tuner: the note, and the tape under its needle with the string a little flat. */
function tuner(t) {
  const ticks = Array.from({ length: 41 }, (_, i) => {
    const k = i - 20;
    const big = k % 5 === 0;
    return h('div', { key: i, style: { width: k === 0 ? 6 : 3, height: big ? 70 : 38, marginTop: big ? 0 : 32, borderRadius: 3, background: k === 0 ? c.correct : c.ink, opacity: k === 0 || big ? 1 : 0.4 } });
  });
  return h('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: 1072 } },
    h('div', { style: { fontSize: 190, fontWeight: 600, lineHeight: 1, color: c.ink } }, t.strings[5]),
    h('div', { style: { display: 'flex', gap: 14, marginTop: 28, marginLeft: 70, alignItems: 'flex-start' } }, ...ticks),
    h('div', { style: { width: 0, height: 0, marginTop: 14, marginLeft: 0, borderLeft: '16px solid transparent', borderRight: '16px solid transparent', borderBottom: `32px solid ${c.accent}` } }));
}

const drawings = { tuner,  'find-the-note': findTheNote, neck: theNeck, metronome, 'backing-tracks': backingTracks, fingers, strings: stringsAndSetup };

/** A tool card: the tool's name and line over its drawing. */
function toolCard(t, delta, tool) {
  if (tool === 'name-the-note') return nameTheNote(t, delta);
  const [title, line] = t.tools[tool];
  return page(
    header(title, line, delta),
    h('div', { style: { display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 24 } }, drawings[tool](t)));
}

/** PNG bytes of a card in one language: the default (no tool) or one of `TOOL_CARDS`. `delta` is the δ outline from public/favicon.svg. */
export async function ogCard(lang, delta, tool) {
  const t = copy[lang];
  const res = new ImageResponse(tool ? toolCard(t, delta, tool) : stageCard(t, delta), { width: 1200, height: 630, fonts });
  return Buffer.from(await res.arrayBuffer());
}
