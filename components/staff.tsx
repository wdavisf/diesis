"use client";

import { cn } from "@/lib/utils";

/**
 * The treble clef: the outline of U+1D11E from Noto Music (SIL Open Font License), in font units
 * (1000 to the em, y up). The font puts the G line at y = 0 and a staff space at 250 units, so
 * the glyph is drawn scaled to the staff and flipped.
 */
const CLEF = "M314 801Q300 854 291.0 906.0Q282 958 282 1012Q282 1059 288.5 1100.5Q295 1142 307 1177Q320 1217 341.0 1252.5Q362 1288 385.5 1311.0Q409 1334 427 1334Q451 1334 493 1249Q514 1206 524.0 1156.0Q534 1106 534 1049Q534 978 515.0 907.5Q496 837 459.5 775.0Q423 713 372 666L407 498Q422 500 432.0 501.0Q442 502 447 502Q508 502 556.0 467.5Q604 433 632.5 377.0Q661 321 661 254Q661 177 621.5 115.5Q582 54 503 25Q508 8 532 -117Q538 -147 541.0 -164.5Q544 -182 545.0 -195.0Q546 -208 546 -225Q546 -275 521.5 -314.5Q497 -354 455.5 -376.0Q414 -398 363 -398Q311 -398 271.0 -378.5Q231 -359 208.0 -324.5Q185 -290 185 -245Q185 -197 211.5 -165.0Q238 -133 287 -133Q329 -133 355.5 -163.5Q382 -194 382 -236Q382 -272 357.0 -299.0Q332 -326 292 -326H282Q308 -365 364 -365Q433 -365 472.0 -320.0Q511 -275 511 -205Q511 -188 507.0 -159.5Q503 -131 493 -91Q483 -51 477.5 -25.0Q472 1 470 12Q436 2 390 2Q304 2 222 52Q142 102 96.0 184.0Q50 266 50 361Q50 451 91 530Q132 609 192.5 675.0Q253 741 314 801ZM341 826Q364 838 390.0 870.5Q416 903 440.0 945.0Q464 987 479.0 1029.5Q494 1072 494 1106Q494 1142 483.0 1163.0Q472 1184 445 1184Q421 1184 398.5 1162.0Q376 1140 358.5 1103.5Q341 1067 331.0 1022.0Q321 977 321 930Q321 898 327.5 872.0Q334 846 341 826ZM398 379Q371 373 347.0 353.5Q323 334 308.5 306.5Q294 279 294 248Q294 223 307.0 196.5Q320 170 339 154Q352 142 365 136Q380 129 380 123Q380 120 370 117Q332 126 301.5 151.0Q271 176 253.5 211.5Q236 247 236 287Q236 330 253.5 370.0Q271 410 302.5 442.0Q334 474 374 490L345 641Q229 547 174.5 456.5Q120 366 120 277Q120 212 154.0 156.0Q188 100 247.0 65.5Q306 31 380 31Q400 31 420.5 35.0Q441 39 464 45ZM495 55Q593 97 593 227Q593 270 571.0 305.5Q549 341 512.0 362.0Q475 383 429 383Z";
const CLEF_LEFT = 50;
const CLEF_WIDTH = 611;
const UNIT = 250;

export type StaffNoteState = "asking" | "correct" | "wrong" | "idle" | "pending";

export interface StaffNote {
  id: string | number;
  /** Half spaces above the bottom line (lib/core/reading.ts). */
  step: number;
  state: StaffNoteState;
  /** Where along the staff, 0 (just after the clef) to 1 (the right end). A single note sits in the middle. */
  at?: number;
  /** A name written under the staff, in the note's color. */
  label?: string;
}

const fill: Record<StaffNoteState, string> = {
  asking: "var(--color-amber)",
  correct: "var(--color-correct)",
  wrong: "var(--color-wrong)",
  idle: "var(--color-ink)",
  pending: "var(--color-dim)",
};

export interface StaffProps {
  width: number;
  height: number;
  notes: readonly StaffNote[];
  /** The lowest and highest steps the exercise can ask, so the staff leaves room for their ledger lines. */
  range: readonly [number, number];
  /** Accessible name of the drawing. */
  label: string;
  /** A line drawn across the staff at this share of its length (the scrolling exercise's "now"). */
  nowLine?: number;
  /** Bar lines at these shares of the length. */
  barLines?: readonly number[];
  className?: string;
}

/**
 * A staff in the treble clef with notes on it, drawn at the size it is given. The staff scales so
 * the whole range (ledger lines included) fits the height, and the clef always has its room.
 */
export function Staff({ width, height, notes, range, label, nowLine, barLines, className }: StaffProps) {
  const top = Math.max(TOP_STEPS, range[1] + 2);
  const bottom = Math.min(BOTTOM_STEPS, range[0] - 2);
  const labelRoom = notes.some((n) => n.label) ? 1.6 : 0.4;
  const sp = Math.max(6, Math.min(36, height / ((top - bottom) / 2 + labelRoom), width / 18));
  // y of a step: the bottom line (step 0) sits at `base`.
  const base = (top / 2) * sp + (height - ((top - bottom) / 2 + labelRoom) * sp) / 2;
  const y = (step: number) => base - (step * sp) / 2;
  const clefW = (CLEF_WIDTH / UNIT) * sp;
  const x0 = sp * 0.6;
  const startX = x0 + clefW + sp * 1.6;
  const endX = width - sp * 1.2;
  const xAt = (at: number) => startX + (endX - startX) * at;
  const head = { rx: sp * 0.66, ry: sp * 0.46 };

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} role="img" aria-label={label} className={cn("block max-w-full", className)}>
      {[0, 2, 4, 6, 8].map((s) => (
        <line key={s} x1={x0} x2={endX + sp * 0.6} y1={y(s)} y2={y(s)} stroke="var(--color-ink)" strokeOpacity={0.55} strokeWidth={Math.max(1, sp / 12)} />
      ))}
      <path d={CLEF} fill="var(--color-ink)" transform={`translate(${x0 - (CLEF_LEFT / UNIT) * sp} ${y(2)}) scale(${sp / UNIT} ${-sp / UNIT})`} />
      {barLines?.map((at) => (
        <line key={at} x1={xAt(at)} x2={xAt(at)} y1={y(0)} y2={y(8)} stroke="var(--color-ink)" strokeOpacity={0.7} strokeWidth={Math.max(1, sp / 10)} />
      ))}
      {nowLine !== undefined ? (
        <line x1={xAt(nowLine)} x2={xAt(nowLine)} y1={y(8) - sp * 1.6} y2={y(0) + sp * 1.6} stroke="var(--color-amber)" strokeOpacity={0.6} strokeDasharray={`${sp * 0.3} ${sp * 0.3}`} />
      ) : null}
      {notes.map((n) => {
        const cx = xAt(n.at ?? 0.5);
        const cy = y(n.step);
        const color = fill[n.state];
        const up = n.step < 4;
        const ledgers: number[] = [];
        for (let s = -2; s >= n.step; s -= 2) ledgers.push(s);
        for (let s = 10; s <= n.step; s += 2) ledgers.push(s);
        return (
          <g key={n.id}>
            {ledgers.map((s) => (
              <line key={s} x1={cx - sp * 1.05} x2={cx + sp * 1.05} y1={y(s)} y2={y(s)} stroke="var(--color-ink)" strokeOpacity={0.7} strokeWidth={Math.max(1, sp / 12)} />
            ))}
            {n.state === "asking" ? (
              <circle cx={cx} cy={cy} r={sp * 1.2} fill="none" stroke="var(--color-amber)" strokeOpacity={0.55} strokeWidth={Math.max(1.5, sp / 9)} />
            ) : null}
            <ellipse cx={cx} cy={cy} rx={head.rx} ry={head.ry} fill={color} transform={`rotate(-20 ${cx} ${cy})`} />
            <line
              x1={up ? cx + head.rx * 0.9 : cx - head.rx * 0.9}
              x2={up ? cx + head.rx * 0.9 : cx - head.rx * 0.9}
              y1={cy}
              y2={up ? cy - sp * 3.3 : cy + sp * 3.3}
              stroke={color}
              strokeWidth={Math.max(1.2, sp / 9)}
            />
            {n.label ? (
              <text x={cx} y={y(bottom) + sp * 1.2} textAnchor="middle" fontSize={sp * 1.15} fontWeight={600} fill={color}>
                {n.label}
              </text>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}

/** The staff's own height in steps, with the clef's room above and below. */
const TOP_STEPS = 13;
const BOTTOM_STEPS = -2;
