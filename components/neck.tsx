"use client";

import { useEffect, useMemo, useRef } from "react";
import { createNotePlayer } from "@/lib/audio/note-player";
import { midiAt, namesFor, STRING_COUNT, type PitchClass, type Position } from "@/lib/core/notes";
import { NECK_RANGES, neckNotes, SCALES, scaleOf } from "@/lib/core/scales";
import { useNeck } from "@/lib/game/use-neck";
import { useSettings } from "@/lib/game/use-settings";
import type { Lang, Strings } from "@/lib/i18n";
import { Fretboard, type Mark } from "@/components/fretboard";
import { GameFrame } from "@/components/game-frame";
import { cn } from "@/lib/utils";

const pill = "h-8 shrink-0 whitespace-nowrap rounded-lg border px-2.5 text-xs font-medium outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 sm:text-sm";
const pillOn = "border-amber bg-amber/15 text-amber-text";
const pillOff = "border-line text-dim hover:text-ink";

/** A two-way switch for the header: small, so it fits beside the title on a phone on its side. */
function Pair<T extends string | number>({ value, options, onChange, label }: { value: T; options: { v: T; text: string }[]; onChange: (v: T) => void; label: string }) {
  return (
    <div role="radiogroup" aria-label={label} className="flex rounded-lg border border-line p-0.5">
      {options.map((o) => (
        <button
          key={o.v}
          type="button"
          role="radio"
          aria-checked={value === o.v}
          onClick={() => onChange(o.v)}
          className={cn("h-7 rounded-md px-2 text-xs font-medium outline-none transition-colors", value === o.v ? "bg-amber/15 text-amber-text" : "text-dim hover:text-ink")}
        >
          {o.text}
        </button>
      ))}
    </div>
  );
}

/**
 * The neck: every note on the fretboard, or one scale on a chosen root, the root in amber and
 * the other notes in cream, named by note or by degree. Tap any lit note to hear it. A study
 * screen, not an exercise: nothing is scored. Drawn sideways on a phone like the exercises.
 */
export function Neck({ t, tg, lang }: { t: Strings["neck"]; tg: Strings["game"]; lang: Lang }) {
  const { settings, set } = useNeck();
  const prefs = useSettings(lang === "es" ? "solfege" : "letters");
  const names = namesFor(prefs.names);
  const scale = scaleOf(settings.scale);
  const chromatic = scale.id === "all";

  const player = useMemo(() => createNotePlayer(), []);
  useEffect(() => () => player.dispose(), [player]);
  const ready = useRef(false);
  const pitches = useMemo(() => {
    const out = new Set<number>();
    for (let s = 1; s <= STRING_COUNT; s++) for (let f = 0; f <= settings.maxFret; f++) out.add(midiAt({ string: s, fret: f }));
    return [...out];
  }, [settings.maxFret]);
  useEffect(() => {
    void player.preload(pitches);
  }, [player, pitches]);

  const hear = async (p: Position) => {
    const midi = midiAt(p);
    // The first tap is the gesture that unlocks audio: decode that one note, play it, then the rest.
    if (!ready.current) {
      await player.prepare([midi]);
      ready.current = true;
      void player.prepare(pitches);
    }
    player.play(midi);
  };

  const notes = neckNotes(settings.root as PitchClass, scale, 0, settings.maxFret);
  const marks: Mark[] = notes.map((n) => ({
    position: n.position,
    state: n.root ? "root" : "note",
    label: settings.labels === "degrees" && n.degree ? n.degree : names[n.pc],
  }));
  const lit = new Set(notes.map((n) => `${n.position.string}-${n.position.fret}`));

  const status = (
    <>
      {chromatic ? null : (
        <Pair label={t.names} value={settings.labels} onChange={(v) => set({ labels: v })} options={[{ v: "names", text: t.names }, { v: "degrees", text: t.degrees }]} />
      )}
      <Pair label={t.frets} value={settings.maxFret} onChange={(v) => set({ maxFret: v })} options={NECK_RANGES.map((n) => ({ v: n, text: t.frets.replace("{n}", String(n)) }))} />
    </>
  );

  return (
    <GameFrame
      t={tg}
      title={t.title}
      status={status}
      board={(size) => (
        <Fretboard
          label={chromatic ? t.scales.all : `${t.scales[scale.id]} · ${names[settings.root]}`}
          width={size.width}
          height={size.height}
          minFret={0}
          maxFret={settings.maxFret}
          marks={marks}
          onPick={(p) => {
            if (lit.has(`${p.string}-${p.fret}`)) void hear(p);
          }}
        />
      )}
    >
      <div className="flex shrink-0 flex-col gap-1.5 px-3 pt-2 pb-3">
        <div role="radiogroup" aria-label={t.root} className="grid grid-cols-12 gap-1">
          {names.map((n, pc) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={settings.root === pc}
              onClick={() => set({ root: pc as PitchClass, ...(chromatic ? { scale: "pentaMinor" } : {}) })}
              className={cn("h-8 min-w-0 rounded-lg border px-0.5 text-xs font-semibold outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 sm:text-sm", !chromatic && settings.root === pc ? pillOn : pillOff)}
            >
              {n}
            </button>
          ))}
        </div>
        <div role="radiogroup" aria-label={t.scale} className="flex gap-1 overflow-x-auto [scrollbar-width:none]">
          {SCALES.map((s) => (
            <button key={s.id} type="button" role="radio" aria-checked={settings.scale === s.id} onClick={() => set({ scale: s.id })} className={cn(pill, settings.scale === s.id ? pillOn : pillOff)}>
              {t.scales[s.id]}
            </button>
          ))}
        </div>
        <p className="text-center text-xs text-dim [@media(max-height:26rem)]:hidden">{t.hint}</p>
      </div>
    </GameFrame>
  );
}
