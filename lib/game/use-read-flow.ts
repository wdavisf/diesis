import { useCallback, useEffect, useRef, useState } from "react";
import type { NotePlayer } from "@/lib/audio/note-player";
import type { PitchClass } from "@/lib/core/notes";
import { nextRead, paceAfter, type ReadNote } from "@/lib/core/reading";

export type FlowPhase = "idle" | "loading" | "running";
export type FlyState = "live" | "correct" | "missed";

export interface Flying {
  id: number;
  note: ReadNote;
  born: number;
  state: FlyState;
}

/** Where along the staff the "now" line is, and where notes come in (just off the right end). */
export const NOW_AT = 0.2;
const ENTER_AT = 1.06;
const GONE_AT = -0.08;
/** After crossing the line a note stays answerable this long before it counts as missed. */
const GRACE_MS = 450;
const FIRST_DELAY_MS = 500;
const WRONG_FLASH_MS = 400;

export interface Frame {
  now: number;
  flying: Flying[];
  /** How long a note takes from entering to the "now" line, at the current pace. */
  travel: number;
}

/** Where a note is along the staff at `now`: it crosses the "now" line `travel` ms after it was born. */
export function atOf(note: Flying, now: number, travel: number): number {
  return ENTER_AT - ((now - note.born) / travel) * (ENTER_AT - NOW_AT);
}

export interface ReadFlowState {
  phase: FlowPhase;
  frame: Frame;
  wrongPick: PitchClass | null;
  /** The note being asked: the oldest one not yet answered or missed. */
  target: Flying | null;
  start: () => Promise<void>;
  stop: () => void;
  pick: (pc: PitchClass) => void;
}

export interface ReadFlowEvents {
  onRight: () => void;
  onWrong: () => void;
  /** When true the notes stop coming and picks are ignored (a challenge has ended). */
  locked: boolean;
}

/**
 * The scrolling exercise: notes come in from the right along the staff and the player names the
 * oldest one before it has passed the "now" line (a little after it, with grace). A note let
 * through counts as a mistake. The pace quickens with every right answer (lib/core/reading.ts).
 */
export function useReadFlow(pool: readonly ReadNote[], player: NotePlayer, events: ReadFlowEvents): ReadFlowState {
  const [phase, setPhase] = useState<FlowPhase>("idle");
  const [frame, setFrame] = useState<Frame>({ now: 0, flying: [], travel: paceAfter(0).travel });
  const [wrongPick, setWrongPick] = useState<PitchClass | null>(null);
  const flying = useRef<Flying[]>([]);
  const rights = useRef(0);
  const nextAt = useRef(0);
  const nextId = useRef(0);
  const last = useRef<ReadNote | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const live = useRef(events);
  useEffect(() => {
    live.current = events;
  });

  const pitches = pool.map((n) => n.midi);
  const key = pitches.join(",");
  useEffect(() => {
    void player.preload(key.split(",").map(Number));
  }, [player, key]);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  useEffect(() => {
    if (phase !== "running" || events.locked) return;
    let raf = 0;
    const loop = () => {
      const now = performance.now();
      const pace = paceAfter(rights.current);
      if (now >= nextAt.current) {
        const note = nextRead(pool, last.current);
        last.current = note;
        flying.current.push({ id: nextId.current++, note, born: now, state: "live" });
        nextAt.current = now + pace.gap;
      }
      for (const f of flying.current) {
        if (f.state === "live" && now > f.born + pace.travel + GRACE_MS) {
          f.state = "missed";
          live.current.onWrong();
        }
      }
      flying.current = flying.current.filter((f) => atOf(f, now, pace.travel) > GONE_AT);
      setFrame({ now, flying: [...flying.current], travel: pace.travel });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [phase, events.locked, pool]);

  const start = useCallback(async () => {
    setPhase("loading");
    await player.prepare(pitches);
    flying.current = [];
    rights.current = 0;
    last.current = null;
    nextId.current = 0;
    nextAt.current = performance.now() + FIRST_DELAY_MS;
    setFrame({ now: performance.now(), flying: [], travel: paceAfter(0).travel });
    setPhase("running");
  }, [player, pitches]);

  const stop = useCallback(() => {
    flying.current = [];
    setFrame({ now: 0, flying: [], travel: paceAfter(0).travel });
    setWrongPick(null);
    setPhase("idle");
  }, []);

  const target = frame.flying.find((f) => f.state === "live") ?? null;

  const pick = useCallback(
    (pc: PitchClass) => {
      if (phase !== "running" || live.current.locked) return;
      const t = flying.current.find((f) => f.state === "live");
      if (!t) return;
      if (t.note.pc === pc) {
        t.state = "correct";
        rights.current += 1;
        setWrongPick(null);
        live.current.onRight();
        player.play(t.note.midi);
      } else {
        setWrongPick(pc);
        live.current.onWrong();
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => setWrongPick(null), WRONG_FLASH_MS);
      }
    },
    [phase, player],
  );

  return { phase, frame, wrongPick, target, start, stop, pick };
}
