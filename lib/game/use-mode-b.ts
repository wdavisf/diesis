import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { NotePlayer } from "@/lib/audio/note-player";
import { midiAt, pitchClassAt, samePosition, type Position } from "@/lib/core/notes";
import { candidatePositions, nextFindRound, type FindRound, type QuizSettings } from "@/lib/core/quiz";

export type FindPhase = "idle" | "loading" | "asking" | "done";

export interface ModeBState {
  phase: FindPhase;
  round: FindRound | null;
  found: Position[];
  /** The last wrong tap, shown red with its real name for a moment. */
  wrongTap: Position | null;
  /** True when the player asked to see the rest of the round. */
  revealed: boolean;
  /** Freezes the board where it is: no next round after a run ends. */
  halt: () => void;
  /** Back to the start screen. */
  stop: () => void;
  start: () => Promise<void>;
  tap: (p: Position) => void;
  reveal: () => void;
}

export interface ModeBEvents {
  onRight: () => void;
  onWrong: () => void;
  /** When true, taps are ignored (a challenge has ended). */
  locked: boolean;
}

const NEXT_DELAY_MS = 900;
const REVEAL_DELAY_MS = 2200;
const WRONG_FLASH_MS = 700;

/**
 * Mode B, Find the note: a note name is given, the player taps every place it lives within the
 * range. Each tap plays the note under the finger. A right tap stays green; a wrong one flashes
 * red with its real name and counts as a mistake. The round ends when every place is found.
 */
export function useModeB(settings: QuizSettings, player: NotePlayer, events: ModeBEvents): ModeBState {
  const [phase, setPhase] = useState<FindPhase>("idle");
  const [round, setRound] = useState<FindRound | null>(null);
  const [found, setFound] = useState<Position[]>([]);
  const [wrongTap, setWrongTap] = useState<Position | null>(null);
  const [revealed, setRevealed] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const pitches = useMemo(
    () => Array.from(new Set(candidatePositions(settings).map((p) => midiAt(p, settings.tuning)))),
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
    setRound(null);
      setFound([]);
      setWrongTap(null);
      setRevealed(false);
  }, []);

  const next = useCallback(
    (previous: FindRound | null) => {
      setRound(nextFindRound(settings, previous?.target ?? null));
      setFound([]);
      setWrongTap(null);
      setRevealed(false);
      setPhase("asking");
    },
    [settings],
  );

  const start = useCallback(async () => {
    clearTimers();
    setPhase("loading");
    await player.prepare(pitches);
    next(null);
  }, [player, pitches, next]);

  const { onRight, onWrong, locked } = events;

  const tap = useCallback(
    (p: Position) => {
      if (phase !== "asking" || !round || locked) return;
      player.play(midiAt(p, settings.tuning));
      if (found.some((f) => samePosition(f, p))) return;
      if (pitchClassAt(p, settings.tuning) === round.target) {
        const now = [...found, p];
        setFound(now);
        setWrongTap(null);
        onRight();
        if (now.length === round.positions.length) {
          setPhase("done");
          timers.current.push(setTimeout(() => next(round), NEXT_DELAY_MS));
        }
      } else {
        setWrongTap(p);
        onWrong();
        timers.current.push(setTimeout(() => setWrongTap((w) => (w === p ? null : w)), WRONG_FLASH_MS));
      }
    },
    [phase, round, found, locked, player, next, onRight, onWrong, settings.tuning],
  );

  const reveal = useCallback(() => {
    if (phase !== "asking" || !round) return;
    setRevealed(true);
    setPhase("done");
    timers.current.push(setTimeout(() => next(round), REVEAL_DELAY_MS));
  }, [phase, round, next]);

  return { phase, halt, stop, round, found, wrongTap, revealed, start, tap, reveal };
}
