"use client";

import { useEffect, useMemo } from "react";
import { createNotePlayer } from "@/lib/audio/note-player";
import { namesFor, NATURAL_PITCH_CLASSES, type PitchClass } from "@/lib/core/notes";
import { DEFAULT_SETTINGS } from "@/lib/core/quiz";
import { useChallenge } from "@/lib/game/use-challenge";
import { useModeA } from "@/lib/game/use-mode-a";
import { useSettings } from "@/lib/game/use-settings";
import { ChallengePicker, ChallengeResult, ChallengeStatus } from "@/components/challenge-card";
import { Fretboard } from "@/components/fretboard";
import { GameFrame } from "@/components/game-frame";
import { NotePanel } from "@/components/note-panel";
import { cn } from "@/lib/utils";
import type { Lang, Strings } from "@/lib/i18n";

/** Letter keys pick a natural; hold Shift for the sharp. Space or Enter replays the note. */
const KEY_TO_PC: Record<string, PitchClass> = { c: 0, d: 2, e: 4, f: 5, g: 7, a: 9, b: 11 };

/** Mode A, Name the note. */
export function Game({ t, tc, ts, lang }: { t: Strings["game"]; tc: Strings["challenge"]; ts: Strings["settings"]; lang: Lang }) {
  const player = useMemo(() => createNotePlayer(), []);
  useEffect(() => () => player.dispose(), [player]);
  const prefs = useSettings(lang === "es" ? "solfege" : "letters");
  const names = namesFor(prefs.names);
  const naturalsOnly = prefs.naturalsOnly;
  const settings = useMemo(() => ({ ...DEFAULT_SETTINGS, naturalsOnly }), [naturalsOnly]);
  const run = useChallenge(naturalsOnly ? "name:naturals" : "name");
  const game = useModeA(settings, player, { onRight: run.right, onWrong: run.wrong, locked: run.tally.over });

  const over = run.tally.over;
  const picking = game.phase === "idle" || game.phase === "loading";
  const { halt } = game;
  useEffect(() => {
    if (over) halt();
  }, [over, halt]);

  const begin = async () => {
    await game.start();
    run.begin();
  };
  const change = () => {
    game.stop();
    run.reset();
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.target instanceof HTMLButtonElement) return;
      const key = e.key.toLowerCase();
      if (key === " " || key === "enter") {
        e.preventDefault();
        if (game.phase === "idle" || over) void begin();
        else game.replay();
        return;
      }
      const pc = KEY_TO_PC[key];
      if (pc === undefined) return;
      e.preventDefault();
      game.pick(e.shiftKey && !naturalsOnly ? (((pc + 1) % 12) as PitchClass) : pc);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const feedback = over ? "" : game.phase === "correct" ? t.correct : game.wrongPick !== null ? t.wrong : "";
  const score = t.score.replace("{r}", String(run.tally.right)).replace("{w}", String(run.tally.wrong));

  return (
    <GameFrame
      t={t}
      title={t.title}
      status={picking ? null : <ChallengeStatus t={tc} score={score} state={run} onStop={over ? undefined : change} />}
      board={(size) => (
        <Fretboard
          label={t.board}
          width={size.width}
          height={size.height}
          minFret={DEFAULT_SETTINGS.minFret}
          maxFret={DEFAULT_SETTINGS.maxFret}
          marks={
            game.question
              ? [
                  {
                    position: game.question.position,
                    state: game.phase === "correct" ? "correct" : "asking",
                    label: game.phase === "correct" || over ? names[game.question.answer] : undefined,
                  },
                ]
              : []
          }
        />
      )}
      overlay={
        picking ? (
          <ChallengePicker
            t={tc}
            ts={ts}
            value={run.challenge}
            onChange={run.setChallenge}
            settings={prefs}
            onStart={() => void begin()}
            loading={game.phase === "loading"}
            loadingLabel={t.loading}
            hint={t.startSub}
          />
        ) : over ? (
          <ChallengeResult t={tc} state={run} onAgain={() => void begin()} onChange={change} />
        ) : null
      }
    >
      <div className="relative flex h-11 items-center justify-center">
        <p className={cn("text-xl font-semibold", game.phase === "correct" ? "text-correct" : "text-wrong")} aria-live="assertive">
          {feedback ? (
            <span key={`${game.phase}-${feedback}`} className="inline-block animate-in fade-in zoom-in-90 fill-mode-both duration-200 motion-reduce:animate-none">
              {feedback}
            </span>
          ) : null}
        </p>
        {!picking && !over ? (
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
        names={names}
        pitchClasses={naturalsOnly ? NATURAL_PITCH_CLASSES : undefined}
        onPick={game.pick}
        disabled={game.phase !== "asking" || over}
        correctPick={game.phase === "correct" && game.question ? game.question.answer : null}
        wrongPick={game.wrongPick}
      />
      <p className="hidden h-8 items-center justify-center text-xs text-dim pointer-fine:md:flex">{t.keys}</p>
      <div className="h-3 md:h-1" />
    </GameFrame>
  );
}
