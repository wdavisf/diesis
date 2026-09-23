import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { NotePlayer } from "@/lib/audio/note-player";
import { midiAt, type PitchClass } from "@/lib/core/notes";
import { candidatePositions, isCorrect, nextQuestion, type Question, type QuizSettings } from "@/lib/core/quiz";

export type Phase = "idle" | "loading" | "asking" | "correct";

export interface ModeAState {
  phase: Phase;
  question: Question | null;
  wrongPick: PitchClass | null;
  correctCount: number;
  wrongCount: number;
  /** First tap: unlocks audio, loads the samples and asks the first question. */
  start: () => Promise<void>;
  pick: (pc: PitchClass) => void;
  replay: () => void;
}

const NEXT_DELAY_MS = 600;
const WRONG_FLASH_MS = 400;

/**
 * Mode A: a position lights up and sounds, the player names it. A wrong pick flashes and keeps the
 * same question; a right pick shows green and moves on after a short beat.
 */
export function useModeA(settings: QuizSettings, player: NotePlayer): ModeAState {
  const [phase, setPhase] = useState<Phase>("idle");
  const [question, setQuestion] = useState<Question | null>(null);
  const [wrongPick, setWrongPick] = useState<PitchClass | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const pitches = useMemo(
    () => Array.from(new Set(candidatePositions(settings).map((p) => midiAt(p)))),
    [settings],
  );

  useEffect(() => {
    const t = timers.current;
    return () => t.forEach(clearTimeout);
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
    setPhase("loading");
    await player.prepare(pitches);
    ask(null);
  }, [player, pitches, ask]);

  const pick = useCallback(
    (pc: PitchClass) => {
      if (phase !== "asking" || !question) return;
      if (isCorrect(question, pc)) {
        setPhase("correct");
        setWrongPick(null);
        setCorrectCount((n) => n + 1);
        timers.current.push(setTimeout(() => ask(question), NEXT_DELAY_MS));
      } else {
        setWrongPick(pc);
        setWrongCount((n) => n + 1);
        timers.current.push(setTimeout(() => setWrongPick(null), WRONG_FLASH_MS));
      }
    },
    [phase, question, ask],
  );

  const replay = useCallback(() => {
    if (question) player.play(midiAt(question.position));
  }, [question, player]);

  return { phase, question, wrongPick, correctCount, wrongCount, start, pick, replay };
}
