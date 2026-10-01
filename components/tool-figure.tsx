"use client";

import { Fretboard, type Mark } from "@/components/fretboard";
import { positionsOf, DEFAULT_SETTINGS } from "@/lib/core/quiz";
import { neckNotes, scaleOf } from "@/lib/core/scales";
import type { PitchClass } from "@/lib/core/notes";
import type { FeatureId, Strings } from "@/lib/i18n";

/* A still of each tool as it looks when you open it: on the landing's cards and at the top of the
   tool's own public page. */

const W = 520;
const H = 190;

function Board({ marks, maxFret = 12 }: { marks: Mark[]; maxFret?: number }) {
  return (
    // min-w-0 and max-w-full: Safari sizes a grid column by the SVG's width attribute (520 px)
    // unless told the cell may shrink, which pushed the cards off the side of an iPhone.
    <div className="min-w-0 [&>svg]:h-auto [&>svg]:w-full [&>svg]:max-w-full">
      <Fretboard width={W} height={H} minFret={0} maxFret={maxFret} marks={marks} label="" />
    </div>
  );
}

export function ToolFigure({ id, t }: { id: FeatureId; t: Strings }) {
  const names = t.game.noteNames;
  if (id === "name") {
    return <Board maxFret={7} marks={[{ position: { string: 3, fret: 5 }, state: "asking" }]} />;
  }
  if (id === "find") {
    // Find the note: every A in frets 0–12, most found, one still to go.
    const all = positionsOf(9 as PitchClass, DEFAULT_SETTINGS);
    return <Board marks={all.slice(0, -1).map((position) => ({ position, state: "correct", label: names[9] }))} />;
  }
  if (id === "neck") {
    // The neck: A minor pentatonic, the root in amber.
    const notes = neckNotes(9 as PitchClass, scaleOf("pentaMinor"), 0, 12);
    return <Board marks={notes.map((n) => ({ position: n.position, state: n.root ? "root" : "note", label: names[n.pc] }))} />;
  }
  if (id === "metronome") {
    return (
      <div className="flex aspect-[520/190] flex-col items-center justify-center gap-4 rounded-lg bg-stage">
        <p className="font-display text-5xl font-semibold tabular-nums sm:text-6xl">
          120 <span className="text-base font-normal text-dim">BPM</span>
        </p>
        <div className="flex gap-3" aria-hidden>
          {[0, 1, 2, 3].map((b) => (
            <span key={b} className="beat size-4 rounded-full bg-white/10" style={{ animationDelay: `${b * 0.5}s` }} data-one={b === 0 || undefined} />
          ))}
        </div>
      </div>
    );
  }
  if (id === "fingers") {
    // Finger independence: four dots, the ring finger's lit, the one before it just hit on time.
    return (
      <div className="flex aspect-[520/190] items-center justify-center gap-3 rounded-lg bg-stage sm:gap-4" aria-hidden>
        {[4, 3, 2, 1].map((f) => (
          <span
            key={f}
            className={`flex size-12 items-center justify-center rounded-full border-2 font-display text-xl font-semibold sm:size-14 ${f === 3 ? "border-amber bg-amber text-stage" : f === 2 ? "border-correct text-correct" : "border-line text-dim"}`}
          >
            {f}
          </span>
        ))}
      </div>
    );
  }
  if (id === "tuner") {
    // Tuner: the note, and the tape under its needle with the string a little flat.
    return (
      <div className="flex aspect-[520/190] flex-col items-center justify-center gap-2 rounded-lg bg-stage" aria-hidden>
        <span className="font-display text-6xl leading-none font-semibold">{names[4]}</span>
        <span className="flex items-start gap-[5px]">
          {Array.from({ length: 31 }, (_, i) => {
            const k = i - 15;
            const big = k % 5 === 0;
            return <span key={i} className={`w-[2px] rounded-full ${k === 0 ? "h-6 w-[3px] bg-correct" : big ? "h-6 bg-ink" : "mt-2 h-3.5 bg-ink/40"}`} />;
          })}
        </span>
        <span className="h-0 w-0 border-x-[7px] border-b-[12px] border-x-transparent border-b-amber" />
      </div>
    );
  }
  if (id === "strings") {
    // Strings: six tension bars, 10–46 in standard at 25.5", one string slack in amber.
    const bars = [16.2, 15.4, 16.6, 18.4, 19.5, 10.8];
    return (
      <div className="flex aspect-[520/190] flex-col justify-center gap-2 rounded-lg bg-stage px-6" aria-hidden>
        {bars.map((lb, k) => (
          <div key={k} className="flex items-center gap-3">
            <span className="w-8 text-right text-xs text-dim tabular-nums">{[".010", ".013", ".017", ".026", ".036", ".036"][k]}</span>
            <span className="h-2 flex-1 overflow-hidden rounded-full bg-white/5">
              <span className={`block h-full rounded-full ${lb < 12 ? "bg-amber" : "bg-correct"}`} style={{ width: `${(lb / 25) * 100}%` }} />
            </span>
          </div>
        ))}
      </div>
    );
  }
  // Backing tracks: a band playing.
  return (
    <div className="relative flex aspect-[520/190] items-center justify-center overflow-hidden rounded-lg bg-[radial-gradient(circle_at_30%_40%,#3a2a1c,#14120f_70%)]">
      <div className="flex items-end gap-1" aria-hidden>
        {[0.5, 0.8, 0.35, 1, 0.6, 0.9, 0.45, 0.75, 0.55, 0.95, 0.4, 0.7].map((h, k) => (
          <span key={k} className="eq w-2.5 rounded-sm bg-amber/80" style={{ height: `${h * 64}px`, animationDelay: `${k * 0.11}s` }} />
        ))}
      </div>
    </div>
  );
}
