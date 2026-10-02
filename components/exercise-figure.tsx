"use client";

import type { ReactNode } from "react";
import { ArrowRight, Volume2 } from "lucide-react";
import { Fretboard, type Mark } from "@/components/fretboard";
import { Staff, type StaffNote } from "@/components/staff";
import { positionsOf, DEFAULT_SETTINGS } from "@/lib/core/quiz";
import type { PitchClass } from "@/lib/core/notes";

/* A still of each Learn exercise at the top of its card (Will, 2026-10-02: "agrega alguna imagen
   dentro para diferenciar los tipos de ejercicios"): the neck, the staff or tab, or the two side by
   side with an arrow when the exercise goes from one to the other. Drawn with the exercises' own pieces. */

export type ExerciseFigureId = "name" | "find" | "hear" | "read" | "staffNeck" | "bar" | "sight" | "tabNeck" | "neckTab" | "riff" | "symbols";

const W = 520;
const H = 190;
/** Steps on the staff these stills use, so every staff is drawn at the same size. */
const RANGE = [-2, 9] as const;

function Board({ marks, maxFret = 12, width = W, children }: { marks: Mark[]; maxFret?: number; width?: number; children?: ReactNode }) {
  return (
    <div className="relative">
      <Fretboard width={width} height={H} minFret={0} maxFret={maxFret} marks={marks} label="" />
      {children}
    </div>
  );
}

function StaffStill({ notes, width = W, nowLine, barLines }: { notes: StaffNote[]; width?: number; nowLine?: number; barLines?: number[] }) {
  return <Staff width={width} height={H} notes={notes} range={RANGE} label="" nowLine={nowLine} barLines={barLines} className="mx-auto" />;
}

type TabMark = { at: number; line: number; text: string; state?: "asking" | "correct" | "idle" };

const TAB_COLOR = { asking: "var(--color-amber)", correct: "var(--color-correct)", idle: "var(--color-ink)" };

/** Six lines of tab (string 1 on top), TAB down the left, fret numbers sitting on the lines. */
function TabStill({ marks, width = W }: { marks: TabMark[]; width?: number }) {
  const gap = H / 7.4;
  const top = (H - gap * 5) / 2;
  const y = (line: number) => top + (line - 1) * gap;
  const x0 = 20;
  const start = 74;
  const end = width - 24;
  const size = gap * 0.95;
  return (
    <svg viewBox={`0 0 ${width} ${H}`} width={width} height={H} aria-hidden className="mx-auto block max-w-full">
      {[1, 2, 3, 4, 5, 6].map((l) => (
        <line key={l} x1={x0} x2={width - 12} y1={y(l)} y2={y(l)} stroke="var(--color-ink)" strokeOpacity={0.45} strokeWidth={1.5} />
      ))}
      {["T", "A", "B"].map((c, k) => (
        <text key={c} x={x0 + 18} y={y(1.6 + k * 1.4)} fontSize={gap * 0.95} fontWeight={700} fill="var(--color-dim)" textAnchor="middle" dominantBaseline="central">
          {c}
        </text>
      ))}
      {marks.map((m, k) => {
        const x = start + (end - start) * m.at;
        const w = m.text.length * size * 0.62 + size * 0.5;
        return (
          <g key={k}>
            <rect x={x - w / 2} y={y(m.line) - size * 0.6} width={w} height={size * 1.2} fill="var(--color-stage)" />
            <text x={x} y={y(m.line)} fontSize={size} fontWeight={600} fill={TAB_COLOR[m.state ?? "idle"]} textAnchor="middle" dominantBaseline="central">
              {m.text}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/** Two drawings side by side, the first leading to the second: what you are shown, then where you answer. */
function Pair({ from, to }: { from: (w: number) => ReactNode; to: (w: number) => ReactNode }) {
  return (
    <div className="flex items-center gap-1 px-2">
      <div className="w-[46%] shrink-0">{from(250)}</div>
      <ArrowRight className="!h-auto !w-[7%] shrink-0 text-dim" strokeWidth={1.75} />
      <div className="min-w-0 flex-1">{to(240)}</div>
    </div>
  );
}

export function ExerciseFigure({ id, names }: { id: ExerciseFigureId; names: readonly string[] }) {
  let figure: ReactNode;
  switch (id) {
    case "name":
      figure = <Board maxFret={7} marks={[{ position: { string: 3, fret: 5 }, state: "asking" }]} />;
      break;
    case "find": {
      // Every A in frets 0–12, all found but one.
      const all = positionsOf(9 as PitchClass, DEFAULT_SETTINGS);
      figure = <Board marks={all.slice(0, -1).map((position) => ({ position, state: "correct", label: names[9] }))} />;
      break;
    }
    case "hear":
      figure = (
        <Board maxFret={7} marks={[]}>
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex size-14 items-center justify-center rounded-full border-2 border-amber bg-stage/90 text-amber">
              <Volume2 className="size-7" aria-hidden />
            </span>
          </span>
        </Board>
      );
      break;
    case "read":
      figure = <StaffStill notes={[{ id: 0, step: 3, state: "asking" }]} />;
      break;
    case "staffNeck":
      // A written G above the open strings: the open 3rd string.
      figure = (
        <Pair
          from={(w) => <StaffStill width={w} notes={[{ id: 0, step: 2, state: "asking" }]} />}
          to={(w) => <Board width={w} maxFret={4} marks={[{ position: { string: 3, fret: 0 }, state: "correct" }]} />}
        />
      );
      break;
    case "bar":
      figure = (
        <StaffStill
          barLines={[1]}
          notes={[
            { id: 0, step: 2, at: 0.08, state: "correct" },
            { id: 1, step: 5, at: 0.36, state: "correct" },
            { id: 2, step: 3, at: 0.64, state: "asking" },
            { id: 3, step: 7, at: 0.92, state: "idle" },
          ]}
        />
      );
      break;
    case "sight":
      figure = (
        <StaffStill
          nowLine={0.22}
          notes={[
            { id: 0, step: 4, at: 0.05, state: "correct" },
            { id: 1, step: 1, at: 0.3, state: "asking" },
            { id: 2, step: 6, at: 0.58, state: "pending" },
            { id: 3, step: 3, at: 0.86, state: "pending" },
          ]}
        />
      );
      break;
    case "tabNeck":
      // A 3 on the 5th line: the 5th string at the 3rd fret.
      figure = (
        <Pair
          from={(w) => <TabStill width={w} marks={[{ at: 0.5, line: 5, text: "3", state: "asking" }]} />}
          to={(w) => <Board width={w} maxFret={4} marks={[{ position: { string: 5, fret: 3 }, state: "correct" }]} />}
        />
      );
      break;
    case "neckTab":
      figure = (
        <Pair
          from={(w) => <Board width={w} maxFret={4} marks={[{ position: { string: 2, fret: 1 }, state: "asking" }]} />}
          to={(w) => <TabStill width={w} marks={[{ at: 0.5, line: 2, text: "1", state: "correct" }]} />}
        />
      );
      break;
    case "riff":
      figure = (
        <TabStill
          marks={[
            { at: 0, line: 6, text: "0", state: "correct" },
            { at: 0.16, line: 6, text: "3", state: "correct" },
            { at: 0.32, line: 5, text: "0", state: "correct" },
            { at: 0.48, line: 5, text: "2", state: "asking" },
            { at: 0.64, line: 4, text: "0" },
            { at: 0.8, line: 4, text: "2" },
            { at: 0.96, line: 5, text: "2" },
          ]}
        />
      );
      break;
    case "symbols":
      figure = (
        <TabStill
          marks={[
            { at: 0.04, line: 3, text: "5h7", state: "asking" },
            { at: 0.32, line: 2, text: "8b10" },
            { at: 0.6, line: 1, text: "7~~" },
            { at: 0.86, line: 6, text: "x x" },
          ]}
        />
      );
      break;
  }
  return (
    // min-w-0 and max-w-full: Safari sizes a grid column by an SVG's width attribute (520 px)
    // unless told the cell may shrink.
    <div className="flex aspect-[520/190] min-w-0 flex-col justify-center overflow-hidden rounded-lg bg-stage [&_svg]:h-auto [&_svg]:w-full [&_svg]:max-w-full" aria-hidden>
      {figure}
    </div>
  );
}
