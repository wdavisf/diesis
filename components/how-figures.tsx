/* Three small drawings for the "How it works" steps, in the game's own colors and geometry:
   a position lighting up, the row of note buttons, and the green-or-red verdict. Decorative
   SVG scaled by the card; the note names follow the language (letters or solfège). */

import type { Strings } from "@/lib/i18n";

const W = 320;
const H = 120;

const wood = "#5a3a2b";
const woodEdge = "#3d271c";
const fretColor = "#8f8a80";
const fretShadow = "#3d2f26";
const stringColor = "#f4f1e8";
const stringWound = "#d6b98a";
const stringWinding = "#8a7250";
const stringShadow = "#1f150f";
const inlay = "#e8e2d3";
const amber = "#e0a63a";
const amberLight = "#f0c46a";
const green = "#4caf6b";
const red = "#d64545";
const ink = "#14120f";
const cream = "#f3efe6";
const surface = "#23201b";
const surfaceRaised = "#2e2a24";
const line = "#3a352d";
const dim = "#a39c8e";

const fretDistance = (n: number) => 1 - Math.pow(2, -n / 12);

interface BoardMark {
  string: number;
  fret: number;
  fill: string;
  label?: string;
  glow?: boolean;
}

/** A slice of the neck, cells `from` to `to`, drawn like components/fretboard.tsx. */
function Board({ x, y, w, h, from, to, marks }: { x: number; y: number; w: number; h: number; from: number; to: number; marks: BoardMark[] }) {
  const first = from - 1;
  const span = fretDistance(to) - fretDistance(first);
  const fx = (n: number) => x + ((fretDistance(n) - fretDistance(first)) / span) * w;
  const cx = (n: number) => (fx(n - 1) + fx(n)) / 2;
  const inset = h * 0.12;
  const gap = (h - inset * 2) / 5;
  const sy = (s: number) => y + inset + (s - 1) * gap;
  const gauges = [1, 1.2, 1.5, 1.9, 2.4, 2.9];
  const cells: number[] = [];
  for (let n = from; n <= to; n++) cells.push(n);
  const r = Math.min(gap * 0.46, 11);
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={wood} stroke={woodEdge} strokeWidth="1.5" rx="2" />
      {[3, 5, 7, 9].filter((n) => n >= from && n <= to).map((n) => (
        <circle key={n} cx={cx(n)} cy={(sy(3) + sy(4)) / 2} r={Math.min(gap * 0.28, 5)} fill={inlay} opacity="0.9" />
      ))}
      {cells.slice(0, -1).map((n) => (
        <g key={n}>
          <line x1={fx(n) + 1} x2={fx(n) + 1} y1={y} y2={y + h} stroke={fretShadow} strokeWidth="1.5" />
          <line x1={fx(n)} x2={fx(n)} y1={y} y2={y + h} stroke={fretColor} strokeWidth="2" />
        </g>
      ))}
      {gauges.map((g, i) => (
        <g key={i}>
          <line x1={x} x2={x + w} y1={sy(i + 1) + g * 0.8} y2={sy(i + 1) + g * 0.8} stroke={stringShadow} strokeWidth={g} opacity={0.55} />
          <line x1={x} x2={x + w} y1={sy(i + 1)} y2={sy(i + 1)} stroke={i >= 3 ? stringWound : stringColor} strokeWidth={g} />
          {i >= 3 ? <line x1={x} x2={x + w} y1={sy(i + 1)} y2={sy(i + 1)} stroke={stringWinding} strokeWidth={g * 0.9} strokeDasharray="0.9 1.6" /> : null}
        </g>
      ))}
      {cells.map((n) => (
        <text key={n} x={cx(n)} y={y + h + 11} fontSize="8" fill={dim} textAnchor="middle">
          {n}
        </text>
      ))}
      {marks.map((m, i) => (
        <g key={i}>
          {m.glow ? <circle cx={cx(m.fret)} cy={sy(m.string)} r={r * 2.2} fill={m.fill} opacity="0.18" /> : null}
          <circle cx={cx(m.fret)} cy={sy(m.string)} r={r} fill={m.fill} stroke={m.fill === amber ? amberLight : "none"} strokeWidth="1.5" />
          {m.label ? (
            <text x={cx(m.fret)} y={sy(m.string) + 3.5} fontSize="10" fontWeight="700" fill={ink} textAnchor="middle">
              {m.label}
            </text>
          ) : null}
        </g>
      ))}
    </g>
  );
}

type ButtonState = "idle" | "amber" | "green" | "red";

/** A row of note buttons like components/note-panel.tsx. */
function Buttons({ x, y, w, h, labels, states }: { x: number; y: number; w: number; h: number; labels: readonly string[]; states: ButtonState[] }) {
  const gap = 4;
  const bw = (w - gap * (labels.length - 1)) / labels.length;
  const fill: Record<ButtonState, string> = { idle: surfaceRaised, amber: "#3d3222", green, red };
  const stroke: Record<ButtonState, string> = { idle: line, amber, green, red };
  const text: Record<ButtonState, string> = { idle: cream, amber: amberLight, green: ink, red: cream };
  return (
    <g>
      {labels.map((label, i) => {
        const bx = x + i * (bw + gap);
        const s = states[i] ?? "idle";
        return (
          <g key={i}>
            <rect x={bx} y={y} width={bw} height={h} rx="6" fill={fill[s]} stroke={stroke[s]} strokeWidth={s === "idle" ? 1 : 1.5} />
            <text x={bx + bw / 2} y={y + h / 2 + 3.5} fontSize={label.length > 3 ? 8 : 10} fontWeight="600" fill={text[s]} textAnchor="middle">
              {label}
            </text>
          </g>
        );
      })}
    </g>
  );
}

/** Step 0: a position lights up. Step 1: the buttons, the answer picked. Step 2: green, and red. */
export function HowFigure({ step, t, className }: { step: number; t: Strings; className?: string }) {
  const n = t.game.noteNames;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={className} aria-hidden="true" focusable="false">
      <rect width={W} height={H} rx="12" fill={surface} />
      {step === 0 ? <Board x={10} y={14} w={300} h={80} from={3} to={8} marks={[{ string: 3, fret: 5, fill: amber, glow: true }]} /> : null}
      {step === 1 ? (
        <>
          <Board x={10} y={10} w={300} h={44} from={3} to={8} marks={[{ string: 3, fret: 5, fill: amber, glow: true }]} />
          <Buttons x={10} y={74} w={300} h={32} labels={n} states={n.map((_, i) => (i === 0 ? "amber" : "idle"))} />
        </>
      ) : null}
      {step === 2 ? (
        <>
          <Board x={10} y={10} w={300} h={44} from={3} to={8} marks={[{ string: 3, fret: 5, fill: green, label: n[0] }]} />
          <Buttons x={38} y={74} w={244} h={32} labels={[n[11], n[0], n[1], n[2], n[3]]} states={["idle", "green", "idle", "red", "idle"]} />
        </>
      ) : null}
    </svg>
  );
}
