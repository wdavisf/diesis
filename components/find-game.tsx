"use client";

import { useEffect, useMemo } from "react";
import { createNotePlayer } from "@/lib/audio/note-player";
import { namesFor, pitchClassAt, samePosition } from "@/lib/core/notes";
import { DEFAULT_SETTINGS } from "@/lib/core/quiz";
import { useChallenge } from "@/lib/game/use-challenge";
import { useModeB } from "@/lib/game/use-mode-b";
import { useSettings } from "@/lib/game/use-settings";
import { ChallengePicker, ChallengeResult, ChallengeStatus } from "@/components/challenge-card";
import { Fretboard, type Mark } from "@/components/fretboard";
import { GameFrame } from "@/components/game-frame";
import { cn } from "@/lib/utils";
import type { Lang, Strings } from "@/lib/i18n";

/** Mode B, Find the note. */
export function FindGame({
  t,
  tf,
  tc,
  ts,
  lang,
}: {
  t: Strings["game"];
  tf: Strings["find"];
  tc: Strings["challenge"];
  ts: Strings["settings"];
  lang: Lang;
}) {
  const player = useMemo(() => createNotePlayer(), []);
  useEffect(() => () => player.dispose(), [player]);
  const prefs = useSettings(lang === "es" ? "solfege" : "letters");
  const names = namesFor(prefs.names);
  const naturalsOnly = prefs.naturalsOnly;
  const settings = useMemo(() => ({ ...DEFAULT_SETTINGS, naturalsOnly }), [naturalsOnly]);
  const run = useChallenge(naturalsOnly ? "find:naturals" : "find");
  const game = useModeB(settings, player, { onRight: run.right, onWrong: run.wrong, locked: run.tally.over });

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
      if ((e.key === " " || e.key === "Enter") && (game.phase === "idle" || over)) {
        e.preventDefault();
        void begin();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const round = game.round;
  const marks: Mark[] = [];
  if (round) {
    for (const p of round.positions) {
      const isFound = game.found.some((f) => samePosition(f, p));
      if (isFound) marks.push({ position: p, state: "correct", label: names[round.target] });
      else if (game.revealed || over) marks.push({ position: p, state: "asking", label: names[round.target] });
    }
    if (game.wrongTap) {
      marks.push({ position: game.wrongTap, state: "wrong", label: names[pitchClassAt(game.wrongTap)] });
    }
  }

  const score = t.score.replace("{r}", String(run.tally.right)).replace("{w}", String(run.tally.wrong));
  const allFound = round !== null && game.found.length === round.positions.length;

  return (
    <GameFrame
      t={t}
      title={tf.title}
      status={picking ? null : <ChallengeStatus t={tc} score={score} state={run} onStop={over ? undefined : change} />}
      board={(size) => (
        <Fretboard
          label={t.board}
          width={size.width}
          height={size.height}
          minFret={DEFAULT_SETTINGS.minFret}
          maxFret={DEFAULT_SETTINGS.maxFret}
          marks={marks}
          onPick={picking || over ? undefined : game.tap}
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
            hint={tf.startSub}
          />
        ) : over ? (
          <ChallengeResult t={tc} state={run} onAgain={() => void begin()} onChange={change} />
        ) : null
      }
    >
      <div className="relative flex h-20 items-center justify-center gap-4 px-4">
        {round && !picking ? (
          <>
            <p className="font-display text-3xl font-semibold sm:text-4xl" aria-live="polite">
              {tf.prompt.replace("{n}", names[round.target])}
            </p>
            <p
              className={cn("text-lg tabular-nums", allFound ? "font-semibold text-correct" : game.wrongTap ? "text-wrong" : "text-dim")}
              aria-live="polite"
            >
              {allFound ? tf.done : tf.progress.replace("{f}", String(game.found.length)).replace("{t}", String(round.positions.length))}
            </p>
            {run.challenge.kind === "practice" && game.phase === "asking" ? (
              <button
                type="button"
                onClick={game.reveal}
                className="absolute right-4 rounded-full border border-line px-3 py-1 text-sm text-amber-text hover:bg-surface"
              >
                {tf.showRest}
              </button>
            ) : null}
          </>
        ) : null}
      </div>
      <p className="hidden h-8 items-center justify-center text-xs text-dim pointer-fine:md:flex">{tf.keys}</p>
      <div className="h-3 md:h-1" />
    </GameFrame>
  );
}
