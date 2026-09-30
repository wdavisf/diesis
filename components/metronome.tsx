"use client";

import { useEffect, useId, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { ChevronDown, Minus, Pause, Play, Plus, Square } from "lucide-react";
import { beatNotes, BPM_MAX, BPM_MIN, clampBpm, countdownAt, groupStarts, meterOf, METERS, SUBDIVISIONS, tempoMarking, type BeatNotes, type Click } from "@/lib/core/metronome";
import { barInStep, progress, secondsToTarget, SPEED_EVERY, SPEED_STEPS } from "@/lib/core/speed";
import { useMetronome } from "@/lib/game/use-metronome";
import { useSpeedPlan } from "@/lib/game/use-speed-plan";
import type { Strings } from "@/lib/i18n";
import { GameShell } from "@/components/game-frame";
import { primary } from "@/components/challenge-card";
import { cn } from "@/lib/utils";

const smallStep =
  "flex h-9 min-w-9 items-center justify-center rounded-lg border border-line px-2 text-xs font-medium text-ink outline-none transition-[background-color,transform] hover:bg-surface active:scale-95 focus-visible:ring-3 focus-visible:ring-ring/50 sm:text-sm motion-reduce:active:scale-100";
/** The button beside the main one: Tap tempo, or Stop while a climb runs. */
const secondary =
  "h-14 shrink-0 rounded-2xl border border-amber/60 px-5 text-base font-semibold text-amber-text outline-none transition-[background-color,transform] hover:bg-surface active:scale-95 focus-visible:ring-3 focus-visible:ring-ring/50 motion-reduce:active:scale-100";
/** A choice inside a panel: amber when it is the one picked. */
const pick = (on: boolean) =>
  cn(
    "rounded-xl border outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50",
    on ? "border-amber bg-amber/15 text-amber-text" : "border-line bg-stage text-dim hover:text-ink",
  );

/** One dot per beat, group starts ringed in amber, and under each a small dot per subdivision.
 *  The beat being heard lights up, and so does the click within it. */
function Beats({ meterId, subdivision, accent, click }: { meterId: string; subdivision: number; accent: boolean; click: Click | null }) {
  const meter = meterOf(meterId);
  const starts = groupStarts(meter);
  return (
    <div className={cn("flex justify-center", subdivision > 1 ? "gap-2.5" : "gap-3.5")} aria-hidden>
      {Array.from({ length: meter.beats }, (_, beat) => {
        const on = click?.beat === beat;
        const strong = accent && starts.includes(beat);
        return (
          <div key={beat} className="flex flex-col items-center gap-2">
            <span
              className={cn(
                "size-3.5 rounded-full transition-[background-color,transform] duration-75 sm:size-4",
                on ? (strong ? "bg-amber" : "bg-ink") : strong ? "ring-2 ring-amber ring-inset" : "bg-line",
                on && click?.sub === 0 && "scale-125 motion-reduce:scale-100",
              )}
            />
            {/* Sextuplets: six smaller dots, so a 7/8 bar still fits a phone. The row keeps its
                height with no subdivision, so the screen does not jump when one is picked. */}
            <span className={cn("flex h-1.5 items-center", subdivision > 4 ? "gap-0.5" : "gap-1")}>
              {subdivision > 1
                ? Array.from({ length: subdivision }, (_, sub) => (
                    <span key={sub} className={cn("rounded-full", subdivision > 4 ? "size-1" : "size-1.5", on && click?.sub === sub ? "bg-amber" : "bg-line")} />
                  ))
                : null}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/**
 * A tempo you can type. Tap it, write the number, and it applies on Enter or when you leave the
 * field, clamped to 20–300; Escape puts the old value back. Digits only, three at most.
 */
export function BpmInput({ value, onCommit, label, className, readOnly = false }: { value: number; onCommit: (bpm: number) => void; label: string; className?: string; readOnly?: boolean }) {
  const [draft, setDraft] = useState<string | null>(null);
  const cancelled = useRef(false);
  return (
    <input
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      enterKeyHint="done"
      aria-label={label}
      readOnly={readOnly}
      value={draft ?? String(value)}
      onFocus={(e) => {
        if (readOnly) return;
        cancelled.current = false;
        setDraft(String(value));
        e.currentTarget.select();
      }}
      onChange={(e) => setDraft(e.target.value.replace(/\D/g, "").slice(0, 3))}
      onBlur={() => {
        const n = draft === null ? NaN : parseInt(draft, 10);
        if (!cancelled.current && Number.isFinite(n)) onCommit(clampBpm(n));
        setDraft(null);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") e.currentTarget.blur();
        if (e.key === "Escape") {
          cancelled.current = true;
          e.currentTarget.blur();
        }
      }}
      className={cn(
        "min-w-0 rounded-lg border border-transparent bg-transparent text-center font-display font-semibold tabular-nums outline-none transition-colors",
        readOnly ? "cursor-default" : "hover:border-line focus:border-amber focus:bg-surface",
        className,
      )}
    />
  );
}

/** −5 −1 [typed tempo] +1 +5: a tempo set in steps (the finger exercise uses it). */
export function Stepper({ value, onChange, label, t }: { value: number; onChange: (v: number) => void; label: string; t: Strings["metronome"] }) {
  return (
    <>
      <button type="button" className={smallStep} onClick={() => onChange(clampBpm(value - 5))} aria-label={`${label}: ${t.slower} 5`}>
        −5
      </button>
      <button type="button" className={smallStep} onClick={() => onChange(clampBpm(value - 1))} aria-label={`${label}: ${t.slower}`}>
        <Minus className="size-4" />
      </button>
      <BpmInput value={value} onCommit={onChange} label={label} className="h-10 w-16 flex-1 text-2xl" />
      <button type="button" className={smallStep} onClick={() => onChange(clampBpm(value + 1))} aria-label={`${label}: ${t.faster}`}>
        <Plus className="size-4" />
      </button>
      <button type="button" className={smallStep} onClick={() => onChange(clampBpm(value + 5))} aria-label={`${label}: ${t.faster} 5`}>
        +5
      </button>
    </>
  );
}

const RULER_H = 84;
const RULER_PAD = 24;

/**
 * The tempo ruler: a tape with one tick per BPM that slides under a fixed needle. Drag it (left
 * is faster) and the tempo under the needle is the tempo; when the tempo changes some other way
 * (typed, tapped, the keys, a climb in Speed up) the tape glides there. `disabled` keeps it
 * moving but not draggable.
 */
function TempoRuler({ value, onChange, label, disabled = false }: { value: number; onChange: (bpm: number) => void; label: string; disabled?: boolean }) {
  const box = useRef<HTMLDivElement>(null);
  // `settled` turns true a frame after a measure, so the tape glides to a new tempo but does not
  // slide about while it is only being laid out (first measure, a resize).
  const [{ width, settled }, setSize] = useState({ width: 0, settled: false });
  // While dragging: where the pointer went down, the tempo then, and the (fractional) tempo now under the needle.
  const [drag, setDrag] = useState<{ x: number; from: number; at: number } | null>(null);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setSize({ width: entry.contentRect.width, settled: false });
      requestAnimationFrame(() => setSize((s) => ({ ...s, settled: true })));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Pixels per BPM: finger-sized on a phone, roomier on a wide screen.
  const px = width >= 560 ? 12 : 9;
  const ticks = useMemo(
    () =>
      Array.from({ length: BPM_MAX - BPM_MIN + 1 }, (_, i) => {
        const bpm = BPM_MIN + i;
        const x = RULER_PAD + i * px;
        const ten = bpm % 10 === 0;
        return (
          <g key={bpm}>
            <line x1={x} y1={18} x2={x} y2={ten ? 46 : bpm % 5 === 0 ? 38 : 30} stroke="var(--color-dim)" strokeOpacity={ten ? 1 : 0.4} strokeWidth={2} strokeLinecap="round" />
            {ten ? (
              <text x={x} y={68} textAnchor="middle" fontSize={13} fill="var(--color-dim)">
                {bpm}
              </text>
            ) : null}
          </g>
        );
      }),
    [px],
  );

  const center = drag ? drag.at : value;
  return (
    <div
      ref={box}
      role="slider"
      tabIndex={0}
      aria-label={label}
      aria-valuemin={BPM_MIN}
      aria-valuemax={BPM_MAX}
      aria-valuenow={value}
      aria-disabled={disabled}
      onPointerDown={(e) => {
        if (disabled) return;
        e.currentTarget.setPointerCapture(e.pointerId);
        setDrag({ x: e.clientX, from: value, at: value });
      }}
      onPointerMove={(e) => {
        if (!drag) return;
        const at = Math.min(BPM_MAX, Math.max(BPM_MIN, drag.from - (e.clientX - drag.x) / px));
        setDrag({ ...drag, at });
        if (Math.round(at) !== value) onChange(Math.round(at));
      }}
      onPointerUp={() => setDrag(null)}
      onPointerCancel={() => setDrag(null)}
      style={{ height: RULER_H }}
      className={cn(
        "relative w-full max-w-[52rem] touch-pan-y overflow-hidden outline-none select-none [mask-image:linear-gradient(90deg,transparent,#000_22%,#000_78%,transparent)] focus-visible:[&_.needle]:bg-amber-text",
        disabled ? "cursor-default" : drag ? "cursor-grabbing" : "cursor-grab",
      )}
    >
      <svg
        width={RULER_PAD * 2 + (BPM_MAX - BPM_MIN) * px}
        height={RULER_H}
        aria-hidden
        style={{ transform: `translateX(${width / 2 - RULER_PAD - (center - BPM_MIN) * px}px)` }}
        className={cn("absolute top-0 left-0 tabular-nums", width === 0 && "invisible", !drag && settled && "transition-transform duration-200 ease-out motion-reduce:transition-none")}
      >
        {ticks}
      </svg>
      <svg width={14} height={9} viewBox="0 0 14 9" aria-hidden className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 fill-amber">
        <path d="M0 0h14l-7 9z" />
      </svg>
      <span aria-hidden className="needle pointer-events-none absolute top-1.5 left-1/2 h-12 w-1 -translate-x-1/2 rounded-full bg-amber" />
    </div>
  );
}

/** One beat's notes as they are written: heads, stems, beams (a flag on a lone note) and the
 *  number over a triplet or sextuplet. */
export function BeatGlyph({ notes, className }: { notes: BeatNotes; className?: string }) {
  const DX = 15;
  const HEAD = 38;
  const TOP = 16;
  const n = notes.count;
  const stem = (i: number) => 9.6 + i * DX;
  const w = (n - 1) * DX + 17 + (n === 1 && notes.beams > 0 ? 7 : 0);
  return (
    <svg viewBox={`0 0 ${w} 44`} fill="currentColor" aria-hidden className={cn("h-11 w-auto shrink-0", className)}>
      {Array.from({ length: n }, (_, i) => (
        <g key={i}>
          <ellipse cx={6 + i * DX} cy={HEAD} rx={5.4} ry={3.8} transform={`rotate(-22 ${6 + i * DX} ${HEAD})`} />
          <rect x={stem(i)} y={TOP} width={1.7} height={HEAD - TOP - 1} />
        </g>
      ))}
      {Array.from({ length: notes.beams }, (_, b) =>
        n > 1 ? (
          <rect key={b} x={stem(0)} y={TOP + b * 6} width={stem(n - 1) + 1.7 - stem(0)} height={3.8} />
        ) : (
          <path key={b} d={`M${stem(0) + 1.7} ${TOP + b * 6}c.6 5.5 7.6 6.6 6 14.5-.4-4.6-3.4-6.6-6-7.2z`} />
        ),
      )}
      {notes.tuplet ? (
        <text x={(stem(0) + stem(n - 1) + 1.7) / 2} y={11} textAnchor="middle" fontSize={12} fontWeight={700} fontStyle="italic" fontFamily="Georgia, serif">
          {notes.tuplet}
        </text>
      ) : null}
    </svg>
  );
}

function Switch({ on, onChange, label }: { on: boolean; onChange: (on: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className={cn("relative h-7 w-12 shrink-0 rounded-full outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50", on ? "bg-amber" : "bg-line")}
    >
      <span className={cn("absolute top-1 left-1 size-5 rounded-full bg-ink transition-transform motion-reduce:transition-none", on ? "translate-x-5" : "translate-x-0")} />
    </button>
  );
}

/** A setting on the main screen: what it is, its value now, and a panel behind it. */
function Setting({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-haspopup="dialog"
      onClick={onClick}
      className="flex h-[3.875rem] min-w-0 flex-col justify-center rounded-2xl border border-line bg-surface px-2.5 text-left outline-none transition-colors hover:bg-surface-raised focus-visible:ring-3 focus-visible:ring-ring/50 sm:h-[4.125rem] sm:px-4"
    >
      <span className="truncate text-[0.6875rem] text-dim sm:text-xs">{label}</span>
      <span className="mt-0.5 flex items-center justify-between gap-1 text-[0.9375rem] font-semibold tabular-nums sm:text-[1.0625rem]">
        <span className="flex min-w-0 items-center gap-2 whitespace-nowrap">{children}</span>
        <ChevronDown className="size-3.5 shrink-0 text-dim" aria-hidden />
      </span>
    </button>
  );
}

/**
 * The Speed up card (Will, 2026-09-30: on and off "sin tener que abrir el modal"). Tapping the
 * card is the switch: it turns the climb on or off, and the card shows which. The chevron at its
 * edge, set apart by a rule, opens the panel with the plan. A switch inside the card would not
 * fit beside "60 → 132" on a phone.
 */
function SpeedSetting({ label, on, value, onToggle, onOpen, openLabel }: { label: string; on: boolean; value: ReactNode; onToggle: () => void; onOpen: () => void; openLabel: string }) {
  return (
    <div className={cn("flex h-[3.875rem] min-w-0 overflow-hidden rounded-2xl border bg-surface transition-colors sm:h-[4.125rem]", on ? "border-amber/60" : "border-line")}>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        onClick={onToggle}
        className="flex min-w-0 flex-1 flex-col justify-center pl-2.5 text-left outline-none transition-colors hover:bg-surface-raised focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-inset sm:pl-4"
      >
        <span className="truncate text-[0.6875rem] text-dim sm:text-xs">{label}</span>
        <span className={cn("mt-0.5 truncate text-[0.9375rem] font-semibold tabular-nums sm:text-[1.0625rem]", on && "text-amber-text")}>{value}</span>
      </button>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-label={openLabel}
        onClick={onOpen}
        className={cn("flex w-7 shrink-0 items-center justify-center border-l outline-none transition-colors hover:bg-surface-raised focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-inset sm:w-10", on ? "border-amber/40" : "border-line")}
      >
        <ChevronDown className="size-3.5 text-dim" aria-hidden />
      </button>
    </div>
  );
}

/**
 * A panel of settings in a native <dialog>: a sheet that rises from the bottom on a phone, a
 * dialog in the middle from `sm`. Closes on Done, Escape or a tap outside it.
 */
function Sheet({ open, onClose, title, head, done, children }: { open: boolean; onClose: () => void; title: string; head?: ReactNode; done: string; children: ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const id = useId();
  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog
      ref={dialog}
      aria-labelledby={id}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === dialog.current) onClose();
      }}
      className="mx-0 mt-auto mb-0 max-h-[92dvh] w-full max-w-full overflow-y-auto rounded-t-[1.75rem] border border-b-0 border-line bg-surface p-0 text-ink backdrop:bg-black/60 open:animate-in open:fade-in open:slide-in-from-bottom-6 open:duration-200 motion-reduce:animate-none sm:m-auto sm:w-[26rem] sm:rounded-3xl sm:border-b"
    >
      <div className="flex flex-col gap-4 px-5 pt-3 pb-[max(1.75rem,env(safe-area-inset-bottom))] sm:p-6">
        <span className="mx-auto h-1.5 w-10 rounded-full bg-line sm:hidden" aria-hidden />
        <div className="flex items-center justify-between gap-4">
          <h2 id={id} className="font-display text-2xl font-semibold">
            {title}
          </h2>
          {head}
        </div>
        {children}
        <button type="button" onClick={onClose} className={cn(primary, "mt-1 h-14 w-full rounded-2xl")}>
          {done}
        </button>
      </div>
    </dialog>
  );
}

/** A labelled row of choices inside a panel. */
function Choices({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="text-sm text-dim">{label}</p>
      <div role="radiogroup" aria-label={label} className="mt-2 flex gap-1.5">
        {children}
      </div>
    </div>
  );
}

function Choice({ on, onClick, children }: { on: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" role="radio" aria-checked={on} onClick={onClick} className={cn(pick(on), "h-10 flex-1 text-sm font-semibold whitespace-nowrap")}>
      {children}
    </button>
  );
}

/** A tempo in the Speed up panel: its name, the number (typed if you like) and a slider. */
function TempoField({ label, value, onChange }: { label: string; value: number; onChange: (bpm: number) => void }) {
  return (
    <div>
      <div className="flex items-end justify-between">
        <span className="text-sm text-dim">{label}</span>
        <BpmInput value={value} onCommit={onChange} label={label} className="h-9 w-20 text-right text-[1.625rem]" />
      </div>
      <input
        type="range"
        min={BPM_MIN}
        max={BPM_MAX}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
        className="tempo-range"
        style={{ "--fill": `${((value - BPM_MIN) / (BPM_MAX - BPM_MIN)) * 100}%` } as CSSProperties}
      />
    </div>
  );
}

/** "1 min 25 s", to the nearest five seconds: the climb is a plan, not a stopwatch. */
function roughly(seconds: number): string {
  const s = Math.max(5, Math.round(seconds / 5) * 5);
  const min = Math.floor(s / 60);
  return min ? (s % 60 ? `${min} min ${s % 60} s` : `${min} min`) : `${s} s`;
}

/** What a split beat is called: none, eighth notes, triplets… */
function notesName(t: Strings["metronome"], notes: BeatNotes): string {
  if (notes.count === 1) return t.subNone;
  if (notes.tuplet === 3) return t.noteValues.triplet;
  if (notes.tuplet === 6) return t.noteValues.sextuplet;
  return notes.beams === 1 ? t.noteValues.eighth : notes.beams === 2 ? t.noteValues.sixteenth : t.noteValues.thirtySecond;
}

type Panel = "meter" | "subdivision" | "speed";

/**
 * The metronome: a bare screen with the beat dots, the tempo (typed, or slid on the ruler under
 * it), Tap tempo and Start. Everything else sits behind three buttons that say what they hold:
 * time signature (and the accent), subdivision, and Speed up, the climb from a start tempo to a
 * target (the speed trainer). Each opens a panel. Upright screen, no neck; settings apply while
 * it runs, a new plan from the next bar. Every start counts in a bar: the big number counts the
 * beats down (4 3 2 1) and the tempo takes its place. A climb has Pause beside Stop: paused, it
 * keeps its bar and tempo on screen, and Resume counts in again from there.
 */
export function Metronome({ t, ts, tg }: { t: Strings["metronome"]; ts: Strings["speed"]; tg: Strings["game"] }) {
  const { plan, set: setPlan } = useSpeedPlan();
  // The engine follows the plan only in climbing mode (the hook checks settings.mode).
  const { settings, set, nudge, running, paused, toggle, stop, click, beat, tap } = useMetronome(plan);
  const [panel, setPanel] = useState<Panel | null>(null);
  const speedOn = settings.mode === "speed";
  // A climb under way, playing or held: its start is not for changing.
  const climbing = speedOn && (running || paused);
  const countingIn = running && beat !== null && beat.countIn && click !== null;

  const live = speedOn ? ((running || paused) && beat ? beat.bpm : plan.from) : settings.bpm;
  const atTarget = speedOn && live >= plan.to;
  const meter = meterOf(settings.meter);
  const notes = beatNotes(settings.meter, settings.subdivision);
  const eta = secondsToTarget(plan, meter.beats);

  const setFrom = (v: number) => setPlan({ from: v, to: Math.max(v, plan.to) });
  // The tempo on the main screen: the steady tempo, or the start of the climb.
  const setTempo = (v: number) => (speedOn ? setFrom(v) : set({ bpm: v }));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (panel || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.target instanceof HTMLInputElement) return;
      const by = e.key === "ArrowRight" || e.key === "ArrowUp" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowDown" ? -1 : 0;
      if (e.key === " " && !(e.target instanceof HTMLButtonElement)) {
        e.preventDefault();
        void toggle();
      } else if (e.key === "Escape" && climbing) {
        stop();
      } else if (by) {
        e.preventDefault();
        if (climbing) return;
        const step = by * (e.shiftKey ? 5 : 1);
        if (speedOn) {
          const from = clampBpm(plan.from + step);
          setPlan({ from, to: Math.max(from, plan.to) });
        } else nudge(step);
      } else if ((e.key === "t" || e.key === "T") && !speedOn) {
        tap();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle, stop, nudge, tap, speedOn, climbing, panel, plan.from, plan.to, setPlan]);

  return (
    <GameShell t={tg} title={t.title}>
      <div className="flex min-h-0 flex-1 flex-col items-center gap-5 overflow-x-hidden overflow-y-auto pt-4 pb-6 animate-in fade-in fill-mode-both duration-300 motion-reduce:animate-none sm:justify-center sm:gap-6">
        <div className="flex-1 sm:hidden" />
        <Beats meterId={settings.meter} subdivision={settings.subdivision} accent={settings.accent} click={running ? click : null} />

        <p className="flex flex-col items-center">
          {countingIn ? (
            // The count-in takes the tempo's place: the beats left, big enough to read from the
            // music stand, each one popping in as it is heard.
            <span
              key={countdownAt(click, settings)}
              aria-live="polite"
              className="flex h-[1.05em] items-center justify-center font-display text-[clamp(6.5rem,18dvh,8.75rem)] leading-none font-semibold text-amber-text tabular-nums animate-in zoom-in-75 fade-in duration-150 motion-reduce:animate-none sm:text-[clamp(6.5rem,22dvh,13rem)]"
            >
              {countdownAt(click, settings)}
            </span>
          ) : (
            <BpmInput
              value={live}
              label={speedOn ? ts.from : t.tempo}
              readOnly={climbing}
              onCommit={setTempo}
              className="h-[1.05em] w-[2.4em] max-w-full text-[clamp(6.5rem,18dvh,8.75rem)] leading-none sm:text-[clamp(6.5rem,22dvh,13rem)]"
            />
          )}
          <span className="mt-2 text-sm text-dim sm:text-base">
            {countingIn ? (
              <>
                <span className="text-amber-text">{t.countIn}</span> · {live} BPM
              </>
            ) : (
              <>
                BPM · <span className="text-amber-text">{tempoMarking(live)}</span>
              </>
            )}
            {climbing && beat && !countingIn ? (
              <span className={atTarget && plan.atTarget === "hold" ? "text-correct" : ""}>
                {" · "}
                {atTarget && plan.atTarget === "hold" ? ts.reached : ts.barOf.replace("{b}", String(barInStep(plan, beat.bar))).replace("{e}", String(plan.every))}
              </span>
            ) : null}
            {paused ? <span className="text-amber-text"> · {t.paused}</span> : null}
          </span>
        </p>

        <TempoRuler value={live} onChange={setTempo} label={speedOn ? ts.from : t.tempo} disabled={climbing} />

        {speedOn ? (
          <div className="flex w-full max-w-md items-center gap-2.5 px-4 text-sm text-dim tabular-nums">
            <span>{plan.from}</span>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
              <div
                className={cn("h-full rounded-full transition-[width] duration-300 motion-reduce:transition-none", atTarget && climbing ? "bg-correct" : "bg-amber")}
                style={{ width: `${(climbing ? progress(plan, live) : 0) * 100}%` }}
              />
            </div>
            <span>{plan.to}</span>
          </div>
        ) : null}

        <div className="flex w-full max-w-md gap-3 px-4">
          {speedOn ? null : (
            <button type="button" onClick={tap} className={secondary}>
              {t.tapTempo}
            </button>
          )}
          {/* The main button: Start, then Stop; in a climb, Pause and Resume, with Stop beside. */}
          <button type="button" onClick={() => void toggle()} className={cn(primary, "inline-flex h-14 flex-1 items-center justify-center gap-2 rounded-2xl")}>
            {running ? climbing ? <Pause className="size-5" aria-hidden /> : <Square className="size-5" aria-hidden /> : <Play className="size-5" aria-hidden />}
            {running ? (climbing ? t.pause : t.stop) : paused ? t.resume : t.start}
          </button>
          {climbing ? (
            <button type="button" onClick={stop} className={cn(secondary, "inline-flex items-center gap-2")}>
              <Square className="size-4" aria-hidden />
              {t.stop}
            </button>
          ) : null}
        </div>

        <div className="flex-1 sm:hidden" />

        {/* On a phone the Speed up card is wider: its caption and "60 → 132" plus the chevron column need it. */}
        <div className="grid w-full max-w-[40rem] grid-cols-[1fr_1fr_1.4fr] gap-2 px-4 sm:grid-cols-3 sm:gap-3">
          <Setting label={t.meter} onClick={() => setPanel("meter")}>
            {settings.meter}
          </Setting>
          <Setting label={t.subdivision} onClick={() => setPanel("subdivision")}>
            <BeatGlyph notes={notes} className="-mt-1.5 h-6" />
            <span className="max-sm:hidden">{settings.subdivision === 1 ? t.subNone : t.perBeat.replace("{n}", String(settings.subdivision))}</span>
          </Setting>
          <SpeedSetting label={t.speed} on={speedOn} value={speedOn ? `${plan.from} → ${plan.to}` : t.off} onToggle={() => set({ mode: speedOn ? "steady" : "speed" })} onOpen={() => setPanel("speed")} openLabel={t.speedSettings} />
        </div>

        <p className="hidden px-4 text-center text-xs text-dim pointer-fine:block">{speedOn ? ts.keys : t.keys}</p>
      </div>

      <Sheet open={panel === "meter"} onClose={() => setPanel(null)} title={t.meter} done={t.done}>
        <p className="-mt-2 text-sm text-dim">{t.meterHint}</p>
        <div role="radiogroup" aria-label={t.meter} className="grid grid-cols-3 gap-2">
          {METERS.map((m) => (
            <button key={m.id} type="button" role="radio" aria-checked={settings.meter === m.id} onClick={() => set({ meter: m.id })} className={cn(pick(settings.meter === m.id), "h-13 text-lg font-semibold")}>
              {m.id}
            </button>
          ))}
        </div>
        <div className="flex items-center justify-between gap-4 pt-1">
          <p>
            <span className="font-semibold">{t.accentFirst}</span>
            <span className="block text-sm text-dim">{t.accentHint}</span>
          </p>
          <Switch on={settings.accent} onChange={(accent) => set({ accent })} label={t.accentFirst} />
        </div>
      </Sheet>

      <Sheet open={panel === "subdivision"} onClose={() => setPanel(null)} title={t.subdivision} done={t.done}>
        <p className="-mt-2 text-sm text-dim">{t.subHint}</p>
        <div role="radiogroup" aria-label={t.subdivision} className="flex flex-col gap-2">
          {SUBDIVISIONS.map((n) => {
            const on = settings.subdivision === n;
            const written = beatNotes(settings.meter, n);
            return (
              <button key={n} type="button" role="radio" aria-checked={on} onClick={() => set({ subdivision: n })} className={cn(pick(on), "flex h-16 items-center gap-3.5 px-4 text-left", !on && "text-ink")}>
                <span className="flex w-24 shrink-0 justify-center">
                  <BeatGlyph notes={written} />
                </span>
                <span>
                  <span className="block font-semibold">{notesName(t, written)}</span>
                  <span className="block text-xs text-dim">{n === 1 ? t.subOne : t.perBeat.replace("{n}", String(n))}</span>
                </span>
              </button>
            );
          })}
        </div>
      </Sheet>

      <Sheet
        open={panel === "speed"}
        onClose={() => setPanel(null)}
        title={t.speed}
        done={t.done}
        head={<Switch on={speedOn} onChange={(on) => set({ mode: on ? "speed" : "steady" })} label={t.speed} />}
      >
        {speedOn ? (
          <>
            <TempoField label={ts.from} value={plan.from} onChange={setFrom} />
            <TempoField label={ts.to} value={plan.to} onChange={(v) => setPlan({ to: v, from: Math.min(v, plan.from) })} />
            <Choices label={ts.step}>
              {SPEED_STEPS.map((n) => (
                <Choice key={n} on={plan.step === n} onClick={() => setPlan({ step: n })}>
                  +{n}
                </Choice>
              ))}
            </Choices>
            <Choices label={ts.every}>
              {SPEED_EVERY.map((n) => (
                <Choice key={n} on={plan.every === n} onClick={() => setPlan({ every: n })}>
                  {n === 1 ? ts.bar : ts.bars.replace("{n}", String(n))}
                </Choice>
              ))}
            </Choices>
            <Choices label={ts.atTarget}>
              <Choice on={plan.atTarget === "hold"} onClick={() => setPlan({ atTarget: "hold" })}>
                {ts.hold}
              </Choice>
              <Choice on={plan.atTarget === "restart"} onClick={() => setPlan({ atTarget: "restart" })}>
                {ts.restart}
              </Choice>
            </Choices>
            {eta > 0 ? <p className="text-center text-sm text-dim">{ts.eta.replace("{to}", String(plan.to)).replace("{time}", roughly(eta))}</p> : null}
          </>
        ) : (
          <p className="-mt-2 text-sm text-dim">{t.speedHint}</p>
        )}
      </Sheet>
    </GameShell>
  );
}
