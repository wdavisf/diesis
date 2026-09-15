// Mirrors design/tokens.json. Keep the two in step.
export const color = {
  background: '#14120f',
  surface: '#23201b',
  surfaceRaised: '#2e2a24',
  border: '#3a352d',
  ink: '#f3efe6',
  muted: '#a39c8e',
  accent: '#e0a63a',
  accentText: '#f0c46a',
  correct: '#4caf6b',
  wrong: '#d64545',
} as const;

export const board = {
  wood: '#5a3a2b',
  woodEdge: '#3d271c',
  fret: '#c9c6bd',
  fretShadow: '#7d7a72',
  nut: '#e9e2cf',
  string: '#d8d4c8',
  stringShadow: '#6b6558',
  inlay: '#e8e2d3',
  fretNumber: '#a39c8e',
  highlight: '#e0a63a',
  highlightCorrect: '#4caf6b',
  highlightInk: '#14120f',
  stringGauges: [1.2, 1.5, 1.9, 2.4, 3.0, 3.6],
  inlayFrets: [3, 5, 7, 9, 12, 15, 17, 19, 21, 24],
  doubleInlayFrets: [12, 24],
} as const;

export const type = {
  title: { fontSize: 18, lineHeight: 22, fontWeight: '600' as const },
  noteButton: { fontSize: 22, lineHeight: 26, fontWeight: '600' as const },
  feedback: { fontSize: 22, lineHeight: 28, fontWeight: '600' as const },
  score: { fontSize: 15, lineHeight: 20, fontWeight: '400' as const },
  fretNumber: { fontSize: 12, lineHeight: 14, fontWeight: '400' as const },
} as const;

export const space = { xs: 4, s: 8, m: 12, l: 16, xl: 24 } as const;
export const radius = { s: 8, m: 12, pill: 999 } as const;
