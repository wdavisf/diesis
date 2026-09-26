/* A small drawing of each guitar type for the Strings and setup picker
   (components/strings-setup.tsx): the guitar lying face up, body on the left, headstock on the
   right. Generic shapes that say "offset double cut", "single cut", "dreadnought", never a
   maker's logo or exact outline. Ids match GUITAR_TYPES in lib/core/strings.ts. */

type Head = "inline" | "threeByThree" | "slotted";
type Pickup = "single" | "humbucker";

interface Art {
  body: string;
  /** Where the neck leaves the body (x). */
  joint: number;
  /** Neck end (x) where the headstock starts; longer for baritones. */
  nut: number;
  head: Head;
  strings: number;
  fill: string;
  pickups: { x: number; kind: Pickup }[];
  soundhole?: boolean;
  /** Bridge position (x). */
  bridge: number;
}

// Bodies, drawn in a 250 × 90 box around the neck's centre line (y = 45).
const OFFSET = "M84 38 C92 30 104 18 100 12 C96 6 84 10 76 14 C66 19 56 8 36 8 C16 8 6 24 6 45 C6 68 18 84 40 84 C58 84 66 74 76 76 C86 78 94 76 94 70 C94 64 88 56 84 52 Z";
const TELE = "M84 38 C80 22 70 10 48 10 C22 10 6 24 6 46 C6 68 20 84 44 84 C62 84 72 80 84 78 C92 77 94 72 92 68 C90 62 86 56 84 52 Z";
const SINGLECUT = "M84 38 C82 24 72 14 58 16 C48 17 44 8 30 8 C12 8 4 26 6 46 C8 68 18 84 38 84 C52 84 58 78 70 78 C80 78 90 74 92 66 C93 60 88 55 84 52 Z";
const DOUBLECUT = "M84 38 C90 30 98 22 96 16 C93 10 82 12 74 16 C64 20 56 8 36 8 C16 8 6 24 6 45 C6 66 16 82 36 82 C56 82 64 72 74 74 C84 76 94 78 96 72 C98 66 90 58 84 52 Z";
const SUPER = "M84 38 C92 28 110 14 106 8 C102 3 88 8 78 13 C68 18 58 8 38 8 C16 8 6 24 6 45 C6 68 18 84 40 84 C60 84 70 74 80 76 C92 78 104 80 102 72 C100 64 90 56 84 52 Z";
const DREAD = "M100 36 C100 18 88 10 74 12 C64 14 60 22 54 22 C48 22 42 3 22 5 C6 7 2 26 2 45 C2 64 6 83 22 85 C42 87 48 68 54 68 C60 68 64 76 74 78 C88 80 100 72 100 54 Z";
const CLASSICAL = "M96 37 C96 22 86 15 74 16 C65 17 61 24 55 24 C49 24 44 9 27 10 C12 11 8 28 8 45 C8 62 12 79 27 80 C44 81 49 66 55 66 C61 66 65 73 74 74 C86 75 96 68 96 53 Z";

const WOOD = "#7a4f32";
const DARK = "#3a3530";
const SPRUCE = "#caa46c";
const CEDAR = "#b9844f";

const ARTS: Record<string, Art> = {
  strat: { body: OFFSET, joint: 84, nut: 205, head: "inline", strings: 6, fill: WOOD, bridge: 22, pickups: [{ x: 44, kind: "single" }, { x: 57, kind: "single" }, { x: 70, kind: "single" }] },
  tele: { body: TELE, joint: 84, nut: 205, head: "inline", strings: 6, fill: SPRUCE, bridge: 24, pickups: [{ x: 32, kind: "single" }, { x: 72, kind: "single" }] },
  lesPaul: { body: SINGLECUT, joint: 84, nut: 200, head: "threeByThree", strings: 6, fill: "#9a5a2a", bridge: 30, pickups: [{ x: 42, kind: "humbucker" }, { x: 70, kind: "humbucker" }] },
  prs: { body: DOUBLECUT, joint: 84, nut: 203, head: "threeByThree", strings: 6, fill: "#6d3f5c", bridge: 26, pickups: [{ x: 42, kind: "humbucker" }, { x: 70, kind: "humbucker" }] },
  superstrat: { body: SUPER, joint: 84, nut: 205, head: "inline", strings: 6, fill: DARK, bridge: 24, pickups: [{ x: 42, kind: "humbucker" }, { x: 58, kind: "single" }, { x: 74, kind: "humbucker" }] },
  baritone: { body: OFFSET, joint: 84, nut: 214, head: "inline", strings: 6, fill: WOOD, bridge: 22, pickups: [{ x: 44, kind: "humbucker" }, { x: 70, kind: "humbucker" }] },
  seven: { body: SUPER, joint: 84, nut: 205, head: "inline", strings: 7, fill: DARK, bridge: 24, pickups: [{ x: 42, kind: "humbucker" }, { x: 74, kind: "humbucker" }] },
  sevenLong: { body: SUPER, joint: 84, nut: 212, head: "inline", strings: 7, fill: "#3a4a5a", bridge: 24, pickups: [{ x: 42, kind: "humbucker" }, { x: 74, kind: "humbucker" }] },
  eight: { body: SUPER, joint: 84, nut: 214, head: "inline", strings: 8, fill: DARK, bridge: 24, pickups: [{ x: 42, kind: "humbucker" }, { x: 74, kind: "humbucker" }] },
  acoustic: { body: DREAD, joint: 100, nut: 208, head: "threeByThree", strings: 6, fill: SPRUCE, bridge: 30, pickups: [], soundhole: true },
  classical: { body: CLASSICAL, joint: 96, nut: 204, head: "slotted", strings: 6, fill: CEDAR, bridge: 30, pickups: [], soundhole: true },
};

export function GuitarArt({ type, className }: { type: string; className?: string }) {
  const a = ARTS[type] ?? ARTS.strat;
  const half = 3.4 + a.strings * 0.55; // neck half-width grows with the string count
  const top = 45 - half;
  const bottom = 45 + half;
  const spread = (i: number, width: number) => 45 - width + ((2 * width) / (a.strings - 1)) * i;
  const headLen = a.head === "inline" ? 34 : 30;
  const end = a.nut + headLen;

  const head =
    a.head === "inline" ? (
      <path d={`M${a.nut} ${top} L${a.nut + 6} ${top - 7} C${a.nut + 18} ${top - 10} ${end - 4} ${top - 6} ${end} ${top - 2} L${end} ${bottom - 2} C${end - 8} ${bottom + 1} ${a.nut + 10} ${bottom} ${a.nut} ${bottom} Z`} fill="#3d271c" />
    ) : (
      <path d={`M${a.nut} ${top} L${a.nut + 4} ${top - 5} L${end} ${top - 6} L${end} ${bottom + 6} L${a.nut + 4} ${bottom + 5} L${a.nut} ${bottom} Z`} fill="#3d271c" />
    );
  const tuners =
    a.head === "inline"
      ? Array.from({ length: a.strings }, (_, i) => <circle key={i} cx={a.nut + 7 + i * ((headLen - 10) / Math.max(a.strings - 1, 1))} cy={top - 4} r={1.6} fill="#c9c6bd" />)
      : Array.from({ length: 6 }, (_, i) => (
          <circle key={i} cx={a.nut + 9 + (i % 3) * 8} cy={i < 3 ? top - 8 : bottom + 8} r={1.8} fill="#c9c6bd" />
        ));

  return (
    <svg viewBox="0 0 252 90" className={className} aria-hidden>
      {/* Neck and fretboard */}
      <rect x={a.joint - 6} y={top} width={a.nut - a.joint + 6} height={bottom - top} fill="#5a3a2b" />
      {Array.from({ length: 21 }, (_, i) => {
        // Real fret spacing, fret 21 at the body joint.
        const scale = (a.nut - a.joint) / (1 - Math.pow(2, -21 / 12));
        const x = a.nut - scale * (1 - Math.pow(2, -(i + 1) / 12));
        return <line key={i} x1={x} x2={x} y1={top} y2={bottom} stroke="#8f8a80" strokeWidth={0.7} />;
      })}
      {head}
      {tuners}
      <path d={a.body} fill={a.fill} stroke="#6b6158" strokeWidth={1.2} />
      {a.soundhole ? (
        <>
          <circle cx={a.joint - 26} cy={45} r={a.head === "slotted" ? 9 : 10} fill="#14120f" />
          <circle cx={a.joint - 26} cy={45} r={a.head === "slotted" ? 11.5 : 12} fill="none" stroke="#3d271c" strokeWidth={1.6} />
        </>
      ) : null}
      {a.pickups.map((p) =>
        p.kind === "humbucker" ? (
          <rect key={p.x} x={p.x - 4.5} y={45 - half - 2} width={9} height={(half + 2) * 2} rx={1.5} fill="#14120f" stroke="#c9c6bd" strokeWidth={0.6} />
        ) : (
          <rect key={p.x} x={p.x - 2.2} y={45 - half - 1.5} width={4.4} height={(half + 1.5) * 2} rx={2} fill="#efe9dc" />
        ),
      )}
      <rect x={a.bridge - 3} y={45 - half - 2} width={a.soundhole ? 8 : 6} height={(half + 2) * 2} rx={1.2} fill={a.soundhole ? "#3d271c" : "#c9c6bd"} />
      {/* Strings, from the bridge to the nut; the low (wound) ones on top, bass side up */}
      {Array.from({ length: a.strings }, (_, i) => (
        <line key={i} x1={a.bridge} x2={a.nut} y1={spread(i, half - 1.2)} y2={spread(i, half - 1.2)} stroke={i < a.strings - 3 ? "#d6b98a" : "#f4f1e8"} strokeWidth={1 - (i / a.strings) * 0.5} />
      ))}
      <rect x={a.nut - 1} y={top} width={2} height={bottom - top} fill="#e9e2cf" />
    </svg>
  );
}
