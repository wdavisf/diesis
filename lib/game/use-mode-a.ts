import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { NotePlayer } from "@/lib/audio/note-player";
import { midiAt, type PitchClass } from "@/lib/core/notes";
import { candidatePositions, isCorrect, nextQuestion, type Question, type QuizSettings } from "@/lib/core/quiz";

export type Phase = "idle" | "loading" | "asking" | "correct";

export interface ModeAState {
  phase: Phase;
  question: Question | null;
  wrongPick: PitchClass | null;
  /** Freezes the board where it is: no next question after a run ends. */
  halt: () => void;
  /** Back to the start screen. */
  stop: () => void;
  /** First tap: unlocks audio, loads the samples and asks the first question. */
  start: () => Promise<void>;
  pick: (pc: PitchClass) => void;
  replay: () => void;
}

export interface ModeAEvents {
  onRight: () => void;
  onWrong: () => void;
  /** When true, picks are ignored (a challenge has ended). */
  locked: boolean;
}

const NEXT_DELAY_MS = 600;
const WRONG_FLASH_MS = 400;

/**
 * Mode A: a position lights up and sounds, the player names it. A wrong pick flashes and keeps the
 * same question; a right pick shows green and moves on after a short beat. Scoring lives in the
 * challenge; this hook only reports right and wrong.
 */
export function useModeA(settings: QuizSettings, player: NotePlayer, events: ModeAEvents): ModeAState {
  const [phase, setPhase] = useState<Phase>("idle");
  const [question, setQuestion] = useState<Question | null>(null);
  const [wrongPick, setWrongPick] = useState<PitchClass | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const pitches = useMemo(
    () => Array.from(new Set(candidatePositions(settings).map((p) => midiAt(p)))),
    [settings],
  );

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => clearTimers, []);

  // Fetch the samples while the player is still on the setup screen; Start only decodes them.
  useEffect(() => {
    void player.preload(pitches);
  }, [player, pitches]);

  const halt = useCallback(() => clearTimers(), []);
  const stop = useCallback(() => {
    clearTimers();
    setPhase("idle");
    setQuestion(null);
      setWrongPick(null);
  }, []);

  const ask = useCallback(
    (previous: Question | null) => {
      const q = nextQuestion(settings, previous?.position ?? null);
      setQuestion(q);
      setWrongPick(null);
      setPhase("asking");
      player.play(midiAt(q.position));
    },
    [settings, player],
  );

  const start = useCallback(async () => {
    clearTimers();
    setPhase("loading");
    await player.prepare(pitches);
    ask(null);
  }, [player, pitches, ask]);

  const { onRight, onWrong, locked } = events;

  const pick = useCallback(
    (pc: PitchClass) => {
      if (phase !== "asking" || !question || locked) return;
      if (isCorrect(question, pc)) {
        setPhase("correct");
        setWrongPick(null);
        onRight();
        timers.current.push(setTimeout(() => ask(question), NEXT_DELAY_MS));
      } else {
        setWrongPick(pc);
        onWrong();
        timers.current.push(setTimeout(() => setWrongPick(null), WRONG_FLASH_MS));
      }
    },
    [phase, question, locked, ask, onRight, onWrong],
  );

  const replay = useCallback(() => {
    if (question) player.play(midiAt(question.position));
  }, [question, player]);

  return { phase, halt, stop, question, wrongPick, start, pick, replay };
}
