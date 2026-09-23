"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, RotateCw } from "lucide-react";
import { createNotePlayer } from "@/lib/audio/note-player";
import { noteName, type PitchClass } from "@/lib/core/notes";
import { DEFAULT_SETTINGS } from "@/lib/core/quiz";
import { useModeA } from "@/lib/game/use-mode-a";
import { Fretboard } from "@/components/fretboard";
import { NotePanel } from "@/components/note-panel";
import { cn } from "@/lib/utils";
import type { Strings } from "@/lib/i18n";

/** Letter keys pick a natural; hold Shift for the sharp. Space or Enter replays the note. */
const KEY_TO_PC: Record<string, PitchClass> = { c: 0, d: 2, e: 4, f: 5, g: 7, a: 9, b: 11 };

function useSize<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width: Math.floor(width), height: Math.floor(height) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return { ref, size };
}

export function Game({ t }: { t: Strings["game"] }) {
  const player = useMemo(() => createNotePlayer(), []);
  useEffect(() => () => player.dispose(), [player]);
  const game = useModeA(DEFAULT_SETTINGS, player);
  const { ref, size } = useSize<HTMLDivElement>();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const key = e.key.toLowerCase();
      if (game.phase === "idle" && (key === " " || key === "enter")) {
        e.preventDefault();
        void game.start();
        return;
      }
      if (key === " " || key === "enter") {
        e.preventDefault();
        game.replay();
        return;
      }
      const pc = KEY_TO_PC[key];
      if (pc === undefined) return;
      e.preventDefault();
      game.pick(e.shiftKey ? (((pc + 1) % 12) as PitchClass) : pc);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [game]);

  const feedback = game.phase === "correct" ? t.correct : game.wrongPick !== null ? t.wrong : "";

  return (
    <>
      {/* Portrait phones: the neck needs the long side. */}
      <div className="hidden flex-1 flex-col items-center justify-center gap-3 px-6 text-center max-md:portrait:flex">
        <RotateCw className="size-10 text-amber" aria-hidden />
        <p className="text-xl font-semibold">{t.rotate}</p>
        <p className="text-sm text-dim">{t.rotateSub}</p>
      </div>

      <div className="flex flex-1 flex-col max-md:portrait:hidden">
        <header className="flex h-11 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Link href="/app" className="flex items-center gap-1 text-sm text-dim hover:text-ink" aria-label={t.back}>
              <ArrowLeft className="size-4" />
              <span className="hidden sm:inline">{t.back}</span>
            </Link>
            <h1 className="text-base font-semibold">{t.title}</h1>
          </div>
          <p className="text-sm text-dim" aria-live="polite">
            {t.score.replace("{r}", String(game.correctCount)).replace("{w}", String(game.wrongCount))}
          </p>
        </header>

        <div ref={ref} className="relative mx-3 min-h-0 flex-1">
          {size.width > 0 ? (
            <Fretboard
              label={t.board}
              width={size.width}
              height={size.height}
              minFret={DEFAULT_SETTINGS.minFret}
              maxFret={DEFAULT_SETTINGS.maxFret}
              highlight={game.question?.position ?? null}
              highlightState={game.phase === "correct" ? "correct" : "asking"}
              highlightLabel={game.phase === "correct" && game.question ? noteName(game.question.answer) : undefined}
            />
          ) : null}
          {game.phase === "idle" || game.phase === "loading" ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                type="button"
                onClick={() => void game.start()}
                disabled={game.phase === "loading"}
                className="rounded-xl bg-amber px-8 py-4 text-center text-stage shadow-[0_20px_50px_rgba(0,0,0,0.5)] outline-none transition-colors hover:bg-amber-text focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-70"
              >
                <span className="block text-2xl font-semibold">{game.phase === "loading" ? t.loading : t.start}</span>
                <span className="mt-1 block text-sm opacity-80">{t.startSub}</span>
              </button>
            </div>
          ) : null}
        </div>

        <div className="relative flex h-11 items-center justify-center">
          <p
            className={cn("text-xl font-semibold", game.phase === "correct" ? "text-correct" : "text-wrong")}
            aria-live="assertive"
          >
            {feedback}
          </p>
          {game.phase !== "idle" && game.phase !== "loading" ? (
            <button
              type="button"
              onClick={game.replay}
              className="absolute right-4 rounded-full border border-line px-3 py-1 text-sm text-amber-text hover:bg-surface"
              aria-label={t.hearAgain}
            >
              {t.hearAgain}
            </button>
          ) : null}
        </div>

        <NotePanel
          label={t.notes}
          onPick={game.pick}
          disabled={game.phase !== "asking"}
          correctPick={game.phase === "correct" && game.question ? game.question.answer : null}
          wrongPick={game.wrongPick}
        />
        <p className="hidden h-8 items-center justify-center text-xs text-dim pointer-fine:md:flex">
          {t.keys}
        </p>
        <div className="h-3 md:h-1" />
      </div>
    </>
  );
}
