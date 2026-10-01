import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { NotePlayer } from "@/lib/audio/note-player";
import { midiAt, type PitchClass, type Position, type Tuning } from "@/lib/core/notes";
import { isRightPosition, nextRead, phrase, readPool, type ReadNote, type ReadZone } from "@/lib/core/reading";

export type ReadMode = "note" | "neck" | "bar";
export type Phase = "idle" | "loading" | "asking" | "correct";

export const BAR_LENGTH = 4;

export interface ReadState {
  phase: Phase;
  /** The notes of the round: one, or the four of a bar. */
  notes: ReadNote[];
  /** Which of them is being asked (a bar goes through them in order). */
  index: number;
  wrongPc: PitchClass | null;
  /** Staff to neck: the place tapped wrongly, and the right one once found. */
  wrongPos: Position | null;
  rightPos: Position | null;
  halt: () => void;
  stop: () => void;
  start: () => Promise<void>;
  pickPc: (pc: PitchClass) => void;
  pickPos: (p: Position) => void;
}

export interface ReadEvents {
  onRight: () => void;
  onWrong: () => void;
  /** When true, picks are ignored (a challenge has ended). */
  locked: boolean;
}

const NEXT_DELAY_MS = 650;
const BAR_DELAY_MS = 900;
const WRONG_FLASH_MS = 450;

/**
 * Three of the reading exercises, one flow: a note (or four) is written on the staff and the
 * player names it (`note`, `bar`) or taps where it is on the neck (`neck`). A wrong answer
 * flashes and keeps the question; a right one sounds the note, goes green and moves on. Scoring
 * lives in the challenge; this hook only reports right and wrong.
 */
export function useRead(mode: ReadMode, zone: ReadZone, tuning: Tuning, player: NotePlayer, events: ReadEvents): ReadState {
  const [phase, setPhase] = useState<Phase>("idle");
  const [notes, setNotes] = useState<ReadNote[]>([]);
  const [index, setIndex] = useState(0);
  const [wrongPc, setWrongPc] = useState<PitchClass | null>(null);
  const [wrongPos, setWrongPos] = useState<Position | null>(null);
  const [rightPos, setRightPos] = useState<Position | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const pool = useMemo(() => readPool(zone, tuning), [zone, tuning]);
  // On the neck any place can be tapped, so every pitch of the zone is loaded.
  const pitches = useMemo(() => {
    if (mode !== "neck") return pool.map((n) => n.midi);
    const all = new Set<number>();
    tuning.forEach((open) => {
      for (let fret = 0; fret <= Math.max(zone, 5); fret++) all.add(open + fret);
    });
    return [...all];
  }, [mode, pool, tuning, zone]);

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
    setNotes([]);
    setIndex(0);
    setWrongPc(null);
    setWrongPos(null);
    setRightPos(null);
  }, []);

  const ask = useCallback(
    (previous: ReadNote | null) => {
      setNotes(mode === "bar" ? phrase(pool, BAR_LENGTH) : [nextRead(pool, previous)]);
      setIndex(0);
      setWrongPc(null);
      setWrongPos(null);
      setRightPos(null);
      setPhase("asking");
    },
    [mode, pool],
  );

  const start = useCallback(async () => {
    clearTimers();
    setPhase("loading");
    await player.prepare(pitches);
    ask(null);
  }, [player, pitches, ask]);

  const { onRight, onWrong, locked } = events;
  const current = notes[index] ?? null;

  const finishRound = useCallback(
    (last: ReadNote, delay: number) => {
      setPhase("correct");
      timers.current.push(setTimeout(() => ask(last), delay));
    },
    [ask],
  );

  const pickPc = useCallback(
    (pc: PitchClass) => {
      if (phase !== "asking" || !current || locked || mode === "neck") return;
      if (pc === current.pc) {
        setWrongPc(null);
        onRight();
        player.play(current.midi);
        if (index + 1 < notes.length) setIndex(index + 1);
        else finishRound(current, mode === "bar" ? BAR_DELAY_MS : NEXT_DELAY_MS);
      } else {
        setWrongPc(pc);
        onWrong();
        timers.current.push(setTimeout(() => setWrongPc(null), WRONG_FLASH_MS));
      }
    },
    [phase, current, locked, mode, index, notes.length, onRight, onWrong, player, finishRound],
  );

  const pickPos = useCallback(
    (p: Position) => {
      if (phase !== "asking" || !current || locked || mode !== "neck") return;
      player.play(midiAt(p, tuning));
      if (isRightPosition(current, p, tuning)) {
        setWrongPos(null);
        setRightPos(p);
        onRight();
        finishRound(current, NEXT_DELAY_MS + 200);
      } else {
        setWrongPos(p);
        onWrong();
        timers.current.push(setTimeout(() => setWrongPos(null), WRONG_FLASH_MS + 200));
      }
    },
    [phase, current, locked, mode, tuning, player, onRight, onWrong, finishRound],
  );

  return { phase, notes, index, wrongPc, wrongPos, rightPos, halt, stop, start, pickPc, pickPos };
}
