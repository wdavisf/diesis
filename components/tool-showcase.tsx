"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Fretboard, type Mark } from "@/components/fretboard";
import { positionsOf, DEFAULT_SETTINGS } from "@/lib/core/quiz";
import { neckNotes, scaleOf } from "@/lib/core/scales";
import type { PitchClass } from "@/lib/core/notes";
import type { Strings } from "@/lib/i18n";

/* The landing's "Open a tool" cards: each draws a still of the tool as it looks when you open it,
   and links straight into it. Hrefs in the order of `t.tools.items`. */

const HREFS = ["/learn/name-the-note", "/learn/find-the-note", "/practice/neck", "/practice/metronome", "/practice/backing-tracks"];
const W = 520;
const H = 190;

function Board({ marks, maxFret = 12 }: { marks: Mark[]; maxFret?: number }) {
  return (
    <div className="[&>svg]:h-auto [&>svg]:w-full">
      <Fretboard width={W} height={H} minFret={0} maxFret={maxFret} marks={marks} label="" />
    </div>
  );
}

function Figure({ i, t }: { i: number; t: Strings }) {
  const names = t.game.noteNames;
  if (i === 0) {
    return <Board maxFret={7} marks={[{ position: { string: 3, fret: 5 }, state: "asking" }]} />;
  }
  if (i === 1) {
    // Find the note: every A in frets 0–12, most found, one still to go.
    const all = positionsOf(9 as PitchClass, DEFAULT_SETTINGS);
    return <Board marks={all.slice(0, -1).map((position) => ({ position, state: "correct", label: names[9] }))} />;
  }
  if (i === 2) {
    // The neck: A minor pentatonic, the root in amber.
    const notes = neckNotes(9 as PitchClass, scaleOf("pentaMinor"), 0, 12);
    return <Board marks={notes.map((n) => ({ position: n.position, state: n.root ? "root" : "note", label: names[n.pc] }))} />;
  }
  if (i === 3) {
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

export function ToolShowcase({ t }: { t: Strings }) {
  return (
    <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {t.tools.items.map((tool, i) => (
        <li key={tool.title} className={i === 0 ? "sm:col-span-2 lg:col-span-1" : undefined}>
          <Link
            href={`${t.base}${HREFS[i]}`}
            className="group flex h-full flex-col rounded-2xl border border-line bg-stage p-4 transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-amber/60 motion-reduce:transition-none sm:p-5"
          >
            <Figure i={i} t={t} />
            <span className="mt-4 text-xs font-semibold tracking-wide text-amber-text uppercase">{tool.side}</span>
            <span className="mt-1 font-display text-xl font-semibold">{tool.title}</span>
            <span className="mt-1.5 flex-1 text-sm text-dim">{tool.body}</span>
            <span className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-ink">
              {t.tools.open} <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
