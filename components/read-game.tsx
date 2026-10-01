"use client";

import { useEffect, useMemo, type ReactNode } from "react";
import { createNotePlayer } from "@/lib/audio/note-player";
import { namesFor, NATURAL_PITCH_CLASSES, type PitchClass } from "@/lib/core/notes";
import { modeKey, type Exercise } from "@/lib/core/records";
import { poolRange, readPool, READ_ZONES, type ReadNote } from "@/lib/core/reading";
import { useChallenge } from "@/lib/game/use-challenge";
import { useDemoTick } from "@/lib/game/use-demo";
import { useGuitar } from "@/lib/game/use-guitar";
import { BAR_LENGTH, useRead, type ReadMode } from "@/lib/game/use-read";
import { atOf, NOW_AT, useReadFlow } from "@/lib/game/use-read-flow";
import { useReadZone } from "@/lib/game/use-read-zone";
import { useSettings } from "@/lib/game/use-settings";
import type { Lang, Strings } from "@/lib/i18n";
import { ChallengeResult, ChallengeStatus } from "@/components/challenge-card";
import { Fretboard, type Mark } from "@/components/fretboard";
import { GameFrame, GameShell, useSize } from "@/components/game-frame";
import { NotePanel } from "@/components/note-panel";
import { SetupScreen, Tile, Tiles } from "@/components/setup-screen";
import { Staff, type StaffNote } from "@/components/staff";
import { cn } from "@/lib/utils";

/** Letter keys pick the natural. */
const KEY_TO_PC: Record<string, PitchClass> = { c: 0, d: 2, e: 4, f: 5, g: 7, a: 9, b: 11 };

/** Where the four notes of a bar sit along the staff. */
const BAR_AT = [0.08, 0.34, 0.6, 0.86];

const fill = (text: string, values: Record<string, string | number>) => text.replace(/\{(\w+)\}/g, (_, k) => String(values[k] ?? ""));

type Props = { t: Strings["game"]; tc: Strings["challenge"]; ts: Strings["settings"]; tr: Strings["read"]; lang: Lang };

/** What every reading exercise shares: the player's names, guitar and part of the neck, and the staff's room. */
function useReadSetup(lang: Lang) {
  const player = useMemo(() => createNotePlayer(), []);
  useEffect(() => () => player.dispose(), [player]);
  const prefs = useSettings(lang === "es" ? "solfege" : "letters");
  const names = namesFor(prefs.names);
  const tuning = useGuitar().preset.notes;
  const { zone, setZone } = useReadZone();
  const pool = useMemo(() => readPool(zone, tuning), [zone, tuning]);
  const range = useMemo(() => poolRange(pool), [pool]);
  return { player, prefs, names, tuning, zone, setZone, pool, range };
}

/** The setup screen's picture: the staff as it will look, moving, drawn at the width it has. */
function StaffPreview({ notes, range, label, nowLine }: { notes: StaffNote[]; range: readonly [number, number]; label: string; nowLine?: number }) {
  const { ref, size } = useSize<HTMLDivElement>();
  const height = Math.round(Math.min(230, Math.max(150, size.width * 0.26)));
  return (
    <div ref={ref} className="min-w-0 [@media(max-height:30rem)]:hidden" style={{ height }}>
      {size.width > 0 ? <Staff width={size.width} height={height} notes={notes} range={range} label={label} nowLine={nowLine} barLines={nowLine === undefined && notes.length > 1 ? [1] : undefined} /> : null}
    </div>
  );
}

/** The part of the neck, and how guitar music is written, above the note names on the setup screen. */
function ZoneExtra({ tr, zone, setZone }: { tr: Strings["read"]; zone: number; setZone: (z: (typeof READ_ZONES)[number]) => void }) {
  return (
    <div className="flex flex-col gap-2">
      <Tiles label={tr.zone} columns={3}>
        {READ_ZONES.map((z, i) => (
          <Tile key={z} name={tr.zones[i].name} detail={tr.zones[i].detail} on={zone === z} onClick={() => setZone(z)} />
        ))}
      </Tiles>
      <p className="text-xs text-dim">{tr.written}</p>
    </div>
  );
}

function Feedback({ text, good }: { text: string; good: boolean }) {
  return (
    <div className="relative flex h-11 items-center justify-center">
      <p className={cn("text-xl font-semibold", good ? "text-correct" : "text-wrong")} aria-live="assertive">
        {text ? (
          <span key={text} className="inline-block animate-in fade-in zoom-in-90 fill-mode-both duration-200 motion-reduce:animate-none">
            {text}
          </span>
        ) : null}
      </p>
    </div>
  );
}

const EXERCISE: Record<ReadMode, Exercise> = { note: "read", neck: "staffneck", bar: "bar" };

/** Read the note, Staff to neck and Read a bar: the exercises that ask one question at a time. */
export function ReadGame({ mode, t, tc, ts, tr, lang }: Props & { mode: ReadMode }) {
  const { player, prefs, names, tuning, zone, setZone, pool, range } = useReadSetup(lang);
  const copy = tr[mode];
  const run = useChallenge(modeKey(EXERCISE[mode], true, tuning.length, zone));
  const game = useRead(mode, zone, tuning, player, { onRight: run.right, onWrong: run.wrong, locked: run.tally.over });

  const over = run.tally.over;
  const picking = game.phase === "idle" || game.phase === "loading";
  const tick = useDemoTick(650, picking);
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
    if (mode === "neck") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.target instanceof HTMLButtonElement) return;
      const key = e.key.toLowerCase();
      if (key === " " || key === "enter") {
        e.preventDefault();
        if (game.phase === "idle" || over) void begin();
        return;
      }
      const pc = KEY_TO_PC[key];
      if (pc === undefined) return;
      e.preventDefault();
      game.pickPc(pc);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const score = t.score.replace("{r}", String(run.tally.right)).replace("{w}", String(run.tally.wrong));
  const wrong = game.wrongPc !== null || game.wrongPos !== null;
  const feedback = over ? "" : game.phase === "correct" ? t.correct : wrong ? t.wrong : "";

  if (picking) {
    // The picture on the setup screen, moving: a note is written, turns green with its name,
    // then the next one. A still of the first one under Reduce Motion.
    const k = tick ?? 0;
    const step = Math.floor(k / 4);
    const named = k % 4 >= 2;
    const at = (i: number) => pool[(step * 5 + i * 3 + 2) % pool.length];
    const demo: StaffNote[] =
      mode === "bar"
        ? BAR_AT.map((x, i) => {
            const n = at(i);
            const done = named ? i <= (step % 3) + 1 : i <= step % 3;
            const now = i === (named ? (step % 3) + 2 : (step % 3) + 1);
            return { id: i, step: n.step, at: x, state: done ? "correct" : now ? "asking" : "pending", label: done ? names[n.pc] : undefined };
          })
        : [{ id: "demo", step: at(0).step, at: 0.5, state: named ? "correct" : "asking", label: named ? names[at(0).pc] : undefined }];
    return (
      <GameShell t={t} title={copy.title}>
        <SetupScreen
          title={copy.title}
          tc={tc}
          ts={ts}
          hint={copy.startSub}
          preview={<StaffPreview notes={demo} range={range} label={tr.staff} />}
          showNotes={false}
          extra={<ZoneExtra tr={tr} zone={zone} setZone={setZone} />}
          value={run.challenge}
          onChange={run.setChallenge}
          settings={prefs}
          bestOf={run.bestOf}
          onStart={() => void begin()}
          loading={game.phase === "loading"}
          loadingLabel={t.loading}
        />
      </GameShell>
    );
  }

  const done = game.phase === "correct" || over;
  const staffNotes: StaffNote[] =
    mode === "bar"
      ? game.notes.map((n, i) => ({
          id: `${n.midi}-${i}`,
          step: n.step,
          at: BAR_AT[i],
          state: done || i < game.index ? "correct" : i === game.index ? "asking" : "pending",
          label: done || i < game.index ? names[n.pc] : undefined,
        }))
      : game.notes.map((n) => ({ id: n.midi, step: n.step, at: 0.5, state: done ? "correct" : "asking", label: done ? names[n.pc] : undefined }));

  const marks: Mark[] = [];
  if (game.rightPos) marks.push({ position: game.rightPos, state: "correct", label: game.notes[0] ? names[game.notes[0].pc] : undefined });
  if (game.wrongPos) marks.push({ position: game.wrongPos, state: "wrong" });

  const board = (size: { width: number; height: number }): ReactNode => {
    if (mode !== "neck") return <Staff width={size.width} height={size.height} notes={staffNotes} range={range} label={tr.staff} barLines={mode === "bar" ? [1] : undefined} className="mx-auto" />;
    const staffH = Math.round(size.height * 0.4);
    return (
      <div className="flex h-full flex-col">
        <Staff width={size.width} height={staffH} notes={staffNotes} range={range} label={tr.staff} className="mx-auto" />
        <Fretboard label={t.board} width={size.width} height={size.height - staffH} minFret={0} maxFret={Math.max(zone, 5)} strings={tuning.length} marks={marks} onPick={game.pickPos} />
      </div>
    );
  };

  return (
    <GameFrame
      t={t}
      title={copy.title}
      status={<ChallengeStatus t={tc} score={score} state={run} onStop={over ? undefined : change} />}
      board={board}
      overlay={over ? <ChallengeResult t={tc} state={run} onAgain={() => void begin()} onChange={change} /> : null}
      aside={
        mode === "neck" ? undefined : (
          <NotePanel
            label={t.notes}
            names={names}
            pitchClasses={NATURAL_PITCH_CLASSES}
            onPick={game.pickPc}
            disabled={game.phase !== "asking" || over}
            correctPick={null}
            wrongPick={game.wrongPc}
          />
        )
      }
    >
      <Feedback text={feedback} good={game.phase === "correct"} />
      <p className="hidden h-8 items-center justify-center text-xs text-dim pointer-fine:md:flex">
        {mode === "neck" ? tr.neck.prompt : mode === "bar" && !over ? fill(tr.bar.progress, { n: Math.min(game.index + 1, BAR_LENGTH) }) : tr.keys}
      </p>
      <div className="h-3 md:h-1" />
    </GameFrame>
  );
}

/** Sight reading: notes scroll along the staff and the player names the oldest before it passes. */
export function ReadFlow({ t, tc, ts, tr, lang }: Props) {
  const { player, prefs, names, tuning, zone, setZone, pool, range } = useReadSetup(lang);
  const run = useChallenge(modeKey("flow", true, tuning.length, zone));
  const over = run.tally.over;
  const game = useReadFlow(pool, player, { onRight: run.right, onWrong: run.wrong, locked: over });

  const picking = game.phase !== "running";
  const tick = useDemoTick(650, picking);
  const { stop } = game;

  const begin = async () => {
    await game.start();
    run.begin();
  };
  const change = () => {
    stop();
    run.reset();
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.target instanceof HTMLButtonElement) return;
      const key = e.key.toLowerCase();
      if (key === " " || key === "enter") {
        e.preventDefault();
        if (game.phase === "idle" || over) void begin();
        return;
      }
      const pc = KEY_TO_PC[key];
      if (pc === undefined) return;
      e.preventDefault();
      game.pick(pc);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const score = t.score.replace("{r}", String(run.tally.right)).replace("{w}", String(run.tally.wrong));

  if (picking) {
    // Notes drifting along toward the line: three at once, shifting one place every few ticks.
    const k = tick ?? 0;
    const shift = (k % 4) / 4;
    const base = Math.floor(k / 4);
    const demo: StaffNote[] = [0, 1, 2, 3].map((i) => {
      const n = pool[(base * 3 + i * 5 + 1) % pool.length];
      const at = NOW_AT + 0.22 + (i - shift) * 0.24;
      return { id: `${base}-${i}`, step: n.step, at, state: i === 0 ? "asking" : "idle" };
    });
    return (
      <GameShell t={t} title={tr.flow.title}>
        <SetupScreen
          title={tr.flow.title}
          tc={tc}
          ts={ts}
          hint={tr.flow.startSub}
          preview={<StaffPreview notes={demo.filter((n) => (n.at ?? 0) >= 0)} range={range} label={tr.staff} nowLine={NOW_AT} />}
          showNotes={false}
          extra={<ZoneExtra tr={tr} zone={zone} setZone={setZone} />}
          value={run.challenge}
          onChange={run.setChallenge}
          settings={prefs}
          bestOf={run.bestOf}
          onStart={() => void begin()}
          loading={game.phase === "loading"}
          loadingLabel={t.loading}
        />
      </GameShell>
    );
  }

  const { frame, target } = game;
  const flying: StaffNote[] = frame.flying
    .map((f) => ({ f, at: atOf(f, frame.now, frame.travel) }))
    .filter(({ at }) => at >= 0)
    .map(({ f, at }) => ({
      id: f.id,
      step: f.note.step,
      at,
      state: f.state === "correct" ? "correct" : f.state === "missed" ? "wrong" : f.id === target?.id ? "asking" : "idle",
      label: f.state === "live" ? undefined : names[f.note.pc],
    }));
  const justMissed = frame.flying.some((f) => f.state === "missed" && frame.now - (f.born + frame.travel) < 1100);
  const feedback = over ? "" : game.wrongPick !== null ? t.wrong : justMissed ? tr.flow.missed : "";

  return (
    <GameFrame
      t={t}
      title={tr.flow.title}
      status={<ChallengeStatus t={tc} score={score} state={run} onStop={over ? undefined : change} />}
      board={(size) => <Staff width={size.width} height={size.height} notes={flying} range={range} label={tr.staff} nowLine={NOW_AT} className="mx-auto" />}
      overlay={over ? <ChallengeResult t={tc} state={run} onAgain={() => void begin()} onChange={change} /> : null}
      aside={<NotePanel label={t.notes} names={names} pitchClasses={NATURAL_PITCH_CLASSES} onPick={game.pick} disabled={over} correctPick={null} wrongPick={game.wrongPick} />}
    >
      <Feedback text={feedback} good={false} />
      <p className="hidden h-8 items-center justify-center text-xs text-dim pointer-fine:md:flex">{tr.keys}</p>
      <div className="h-3 md:h-1" />
    </GameFrame>
  );
}

export type { ReadNote };
