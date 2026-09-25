import { useMemo } from "react";
import type { Position } from "@/lib/core/notes";
import { STRING_COUNT } from "@/lib/core/notes";

/** asking/correct/wrong: the exercises. root/note: the neck explorer (a scale's root and its
 *  other notes). */
export type MarkState = "asking" | "correct" | "wrong" | "root" | "note";

/** A lit spot on the neck, optionally with a note name written in it. */
export interface Mark {
  position: Position;
  state: MarkState;
  label?: string;
}

export interface FretboardProps {
  width: number;
  height: number;
  minFret: number;
  maxFret: number;
  marks: readonly Mark[];
  /** When set, every string-and-fret cell in range is a tap target. */
  onPick?: (p: Position) => void;
  /** Accessible name of the drawing. */
  label?: string;
}

// Mirrors design/tokens.json → color.fretboard. Keep in step.
const board = {
  wood: "#5a3a2b",
  woodEdge: "#3d271c",
  fret: "#c9c6bd",
  fretShadow: "#7d7a72",
  nut: "#e9e2cf",
  string: "#d8d4c8",
  stringShadow: "#6b6558",
  inlay: "#e8e2d3",
  fretNumber: "#a39c8e",
  highlight: "#e0a63a",
  highlightCorrect: "#4caf6b",
  highlightWrong: "#d64545",
  highlightNote: "#efe9dc",
  highlightInk: "#14120f",
  stringGauges: [1.2, 1.5, 1.9, 2.4, 3.0, 3.6],
  inlayFrets: [3, 5, 7, 9, 12, 15, 17, 19, 21, 24],
  doubleInlayFrets: [12, 24],
};

/** Distance of fret n from the nut on a neck of scale length 1 (equal temperament). */
function fretDistance(n: number): number {
  return 1 - Math.pow(2, -n / 12);
}

/**
 * The neck, drawn with the nut on the left and string 1 (high E) at the top. Fret spacing is the
 * real logarithmic one, scaled so the selected range fills the width. Fret 0 (open string) gets a
 * short zone left of the nut so an open-string question has somewhere to light.
 */
const markFill: Record<MarkState, string> = {
  asking: board.highlight,
  correct: board.highlightCorrect,
  wrong: board.highlightWrong,
  root: board.highlight,
  note: board.highlightNote,
};

export function Fretboard({ width, height, minFret, maxFret, marks, onPick, label = "Guitar fretboard" }: FretboardProps) {
  const layout = useMemo(() => {
    const numbersBand = 20;
    const boardTop = 6;
    const boardBottom = height - numbersBand;
    const boardHeight = boardBottom - boardTop;
    const stringInset = boardHeight * 0.12;
    const stringGap = (boardHeight - stringInset * 2) / (STRING_COUNT - 1);

    const showsOpen = minFret === 0;
    const openZone = showsOpen ? Math.max(40, width * 0.06) : 0;
    const firstDrawnFret = Math.max(minFret - 1, 0);
    const left = openZone;
    const right = width - 4;
    const span = fretDistance(maxFret) - fretDistance(firstDrawnFret);
    const scale = (right - left) / span;

    const fretX = (n: number) => left + (fretDistance(n) - fretDistance(firstDrawnFret)) * scale;
    const cellCenter = (n: number) => (n === 0 ? openZone / 2 : (fretX(n - 1) + fretX(n)) / 2);
    const stringY = (s: number) => boardTop + stringInset + (s - 1) * stringGap;

    /** Horizontal extent of the tap target for a fret. */
    const cellSpan = (n: number): [number, number] => (n === 0 ? [0, openZone] : [fretX(n - 1), fretX(n)]);

    return { boardTop, boardBottom, boardHeight, left, right, showsOpen, fretX, cellCenter, cellSpan, stringY, stringGap, firstDrawnFret };
  }, [width, height, minFret, maxFret]);

  const fretsToDraw: number[] = [];
  for (let n = Math.max(layout.firstDrawnFret, 1); n <= maxFret; n++) fretsToDraw.push(n);
  const cells: number[] = [];
  for (let n = Math.max(minFret, 1); n <= maxFret; n++) cells.push(n);

  const highlightR = Math.min(layout.stringGap * 0.46, 26);
  const labelSize = Math.max(12, Math.min(highlightR * 0.95, 20));
  // Longer names ("Sol", "Do♯", "Sol♯") shrink to stay inside the dot.
  const labelFit = (s: string) => Math.max(9, Math.min(labelSize, (highlightR * 1.8) / (s.length * 0.62)));

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-label={label}>
      <rect
        x={layout.left}
        y={layout.boardTop}
        width={layout.right - layout.left}
        height={layout.boardHeight}
        fill={board.wood}
        stroke={board.woodEdge}
        strokeWidth={2}
        rx={3}
      />

      {cells
        .filter((n) => board.inlayFrets.includes(n))
        .map((n) => {
          const cx = layout.cellCenter(n);
          const r = Math.min(layout.stringGap * 0.28, 10);
          if (board.doubleInlayFrets.includes(n)) {
            return (
              <g key={`inlay-${n}`}>
                <circle cx={cx} cy={(layout.stringY(2) + layout.stringY(3)) / 2} r={r} fill={board.inlay} opacity={0.9} />
                <circle cx={cx} cy={(layout.stringY(4) + layout.stringY(5)) / 2} r={r} fill={board.inlay} opacity={0.9} />
              </g>
            );
          }
          return <circle key={`inlay-${n}`} cx={cx} cy={(layout.stringY(3) + layout.stringY(4)) / 2} r={r} fill={board.inlay} opacity={0.9} />;
        })}

      {layout.showsOpen ? (
        <rect x={layout.left - 3} y={layout.boardTop - 2} width={7} height={layout.boardHeight + 4} fill={board.nut} rx={1.5} />
      ) : null}

      {fretsToDraw.map((n) => {
        const x = layout.fretX(n);
        return (
          <g key={`fret-${n}`}>
            <line x1={x + 1} y1={layout.boardTop} x2={x + 1} y2={layout.boardBottom} stroke={board.fretShadow} strokeWidth={2} />
            <line x1={x} y1={layout.boardTop} x2={x} y2={layout.boardBottom} stroke={board.fret} strokeWidth={2.5} />
          </g>
        );
      })}

      {Array.from({ length: STRING_COUNT }, (_, i) => i + 1).map((s) => {
        const y = layout.stringY(s);
        const gauge = board.stringGauges[s - 1];
        return (
          <g key={`string-${s}`}>
            <line x1={0} y1={y + gauge * 0.6} x2={width} y2={y + gauge * 0.6} stroke={board.stringShadow} strokeWidth={gauge} />
            <line x1={0} y1={y} x2={width} y2={y} stroke={board.string} strokeWidth={gauge} />
          </g>
        );
      })}

      {cells.map((n) => (
        <text key={`num-${n}`} x={layout.cellCenter(n)} y={height - 5} fontSize={12} fill={board.fretNumber} textAnchor="middle">
          {n}
        </text>
      ))}

      {marks.map((m) => {
        const cx = layout.cellCenter(m.position.fret);
        const cy = layout.stringY(m.position.string);
        const fill = markFill[m.state];
        return (
          <g key={`mark-${m.position.string}-${m.position.fret}`} className={m.state === "wrong" ? "mark flash-wrong" : "mark"}>
            {m.state === "note" ? null : <circle cx={cx} cy={cy} r={highlightR + 4} fill="none" stroke={fill} strokeWidth={2} opacity={0.55} />}
            <circle cx={cx} cy={cy} r={highlightR} fill={fill} />
            {m.label ? (
              <text x={cx} y={cy + labelFit(m.label) * 0.36} fontSize={labelFit(m.label)} fontWeight={700} fill={board.highlightInk} textAnchor="middle">
                {m.label}
              </text>
            ) : null}
          </g>
        );
      })}

      {onPick
        ? Array.from({ length: STRING_COUNT }, (_, i) => i + 1).flatMap((s) =>
            (minFret === 0 ? [0, ...cells] : cells).map((n) => {
              const [x0, x1] = layout.cellSpan(n);
              return (
                <rect
                  key={`hit-${s}-${n}`}
                  x={x0}
                  y={layout.stringY(s) - layout.stringGap / 2}
                  width={x1 - x0}
                  height={layout.stringGap}
                  fill="transparent"
                  className="cursor-pointer"
                  onPointerDown={(e) => {
                    e.preventDefault();
                    onPick({ string: s, fret: n });
                  }}
                />
              );
            }),
          )
        : null}
    </svg>
  );
}
