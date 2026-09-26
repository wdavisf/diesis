"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, RotateCcw, Volume2 } from "lucide-react";
import { Fretboard, type Mark } from "@/components/fretboard";
import { Button } from "@/components/ui/button";
import { createNotePlayer, type NotePlayer } from "@/lib/audio/note-player";
import { midiAt, NATURAL_PITCH_CLASSES, type PitchClass } from "@/lib/core/notes";
import { candidatePositions, isCorrect, nextQuestion, type Question, type QuizSettings } from "@/lib/core/quiz";
import type { Strings } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/* The landing's hero: Name the note, playable on the page, before the visitor opens anything.
   First position only (frets 0–5) and naturals only, so a beginner gets them and a phone held
   upright can still read the neck. The first question is fixed (C, string 2 fret 1) so the server
   and the browser draw the same board; the rest are random. Five right in a row ends the taste. */

const SETTINGS: QuizSettings = {
  minFret: 0,
  maxFret: 5,
  strings: [1, 2, 3, 4, 5, 6],
  tuning: [64, 59, 55, 50, 45, 40],
  naturalsOnly: true,
};
const FIRST: Question = { position: { string: 2, fret: 1 }, answer: 0 };
const GOAL = 5;
const W = 560;
const H = 220;

export function TryIt({ t, className }: { t: Strings; className?: string }) {
  const names = t.game.noteNames;
  const [question, setQuestion] = useState<Question>(FIRST);
  const [state, setState] = useState<"asking" | "correct">("asking");
  const [wrong, setWrong] = useState<PitchClass | null>(null);
  const [streak, setStreak] = useState(0);
  const [done, setDone] = useState(false);
  const player = useRef<NotePlayer | null>(null);
  const ready = useRef<Promise<void> | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const pitches = useMemo(() => Array.from(new Set(candidatePositions(SETTINGS).map((p) => midiAt(p)))), []);

  useEffect(() => {
    const p = createNotePlayer();
    player.current = p;
    void p.preload(pitches);
    const pending = timers.current;
    return () => {
      pending.forEach(clearTimeout);
      p.dispose();
    };
  }, [pitches]);

  /** Audio can only start from a tap; the first tap on the card unlocks it. */
  const unlock = () => {
    if (!ready.current && player.current) ready.current = player.current.prepare(pitches).catch(() => undefined);
    return ready.current ?? Promise.resolve();
  };
  const play = async (q: Question) => {
    await unlock();
    player.current?.play(midiAt(q.position));
  };

  const pick = (pc: PitchClass) => {
    if (state !== "asking" || done) return;
    if (isCorrect(question, pc)) {
      void play(question);
      setState("correct");
      setWrong(null);
      const next = streak + 1;
      setStreak(next);
      timers.current.push(
        setTimeout(() => {
          if (next >= GOAL) {
            setDone(true);
            return;
          }
          const q = nextQuestion(SETTINGS, question.position);
          setQuestion(q);
          setState("asking");
          void play(q);
        }, 700),
      );
    } else {
      void unlock();
      setWrong(pc);
      setStreak(0);
      timers.current.push(setTimeout(() => setWrong(null), 400));
    }
  };

  const again = () => {
    const q = nextQuestion(SETTINGS, question.position);
    setDone(false);
    setStreak(0);
    setQuestion(q);
    setState("asking");
    void play(q);
  };

  const marks: Mark[] = [
    {
      position: question.position,
      state,
      label: state === "correct" ? names[question.answer] : undefined,
    },
  ];

  return (
    <div className={cn("relative overflow-hidden rounded-[22px] border border-line bg-[#14120f] p-3 sm:p-4", className)}>
      <div className="flex items-center justify-between gap-3 px-1">
        <p className="font-display text-lg font-semibold sm:text-xl">{t.tryIt.prompt}</p>
        <div className="flex shrink-0 items-center gap-1.5" aria-label={t.tryIt.streak.replace("{n}", String(streak))} role="status">
          {Array.from({ length: GOAL }, (_, i) => (
            <span
              key={i}
              className={cn("size-2.5 rounded-full transition-colors duration-200", i < streak ? "bg-correct" : "bg-white/10")}
              aria-hidden
            />
          ))}
        </div>
      </div>

      <div className="mt-3 [&>svg]:h-auto [&>svg]:w-full">
        <Fretboard width={W} height={H} minFret={0} maxFret={5} marks={marks} label={t.game.board} />
      </div>

      <div className="mt-3 grid grid-cols-7 gap-1.5" role="group" aria-label={t.game.notes}>
        {NATURAL_PITCH_CLASSES.map((pc) => (
          <button
            key={pc}
            type="button"
            onClick={() => pick(pc)}
            className={cn(
              "h-12 rounded-xl border border-line bg-surface text-base font-semibold text-ink transition-[transform,background-color,border-color] duration-150 select-none active:scale-95 motion-reduce:transition-none sm:text-lg",
              "outline-none focus-visible:ring-3 focus-visible:ring-ring/50 hover:bg-surface-raised",
              state === "correct" && pc === question.answer && "border-correct bg-correct text-stage hover:bg-correct",
              wrong === pc && "flash-wrong border-wrong bg-wrong hover:bg-wrong",
            )}
          >
            {names[pc]}
          </button>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 px-1 text-sm text-dim">
        <span className="flex items-center gap-1.5">
          <Volume2 className="size-4" aria-hidden /> {t.tryIt.hint}
        </span>
        <button type="button" onClick={() => void play(question)} className="shrink-0 whitespace-nowrap text-amber-text underline-offset-4 hover:underline">
          {t.game.hearAgain}
        </button>
      </div>

      {done ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-stage/92 p-6 text-center backdrop-blur-sm animate-in fade-in zoom-in-95 duration-300 motion-reduce:animate-none">
          <p className="font-display text-3xl font-semibold sm:text-4xl">{t.tryIt.doneTitle}</p>
          <p className="mt-3 max-w-sm text-dim">{t.tryIt.doneBody}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="h-11 px-5 text-base">
              <Link href={`${t.base}/learn/name-the-note`}>
                {t.tryIt.doneCta} <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" onClick={again} className="h-11 border-line bg-surface px-5 text-base text-ink hover:bg-surface-raised hover:text-ink">
              <RotateCcw className="size-4" /> {t.tryIt.again}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
