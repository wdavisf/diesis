"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState, type FormEvent } from "react";
import { ChevronLeft, ChevronRight, Flag, Pencil, X } from "lucide-react";
import {
  addDays,
  dateOf,
  daysBetween,
  ENTRY_MAX,
  GOAL_NAME_MAX,
  goalError,
  hasEntry,
  isDay,
  isoWeek,
  weekOf,
  weekThursday,
  type Day,
  type GoalError,
  type LogGoal,
  type PracticeLog as Log,
} from "@/lib/core/log";
import { usePracticeLog, useToday } from "@/lib/game/use-log";
import type { Strings } from "@/lib/i18n";
import { primary } from "@/components/challenge-card";
import { cn } from "@/lib/utils";

type L = Strings["log"];

const capital = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** A day written out in the page's language. Days carry no time zone, so they are formatted in UTC. */
function format(t: Strings, day: Day, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat(t.code === "es" ? "es-ES" : "en-US", { timeZone: "UTC", ...options }).format(dateOf(day));
}
const longDate = (t: Strings, day: Day) => capital(format(t, day, { weekday: "long", day: "numeric", month: "long" }));
const shortDate = (t: Strings, day: Day) => format(t, day, { weekday: "short", day: "numeric", month: "short" });

const field =
  "w-full rounded-xl border border-line bg-stage px-3 py-2.5 text-base text-ink placeholder:text-dim/70 outline-none focus-visible:border-amber focus-visible:ring-3 focus-visible:ring-ring/40";
const step =
  "flex h-9 items-center justify-center rounded-lg border border-line text-sm text-ink outline-none transition-colors hover:bg-surface focus-visible:ring-3 focus-visible:ring-ring/50";

/**
 * The practice log (Will, 2026-10-01: "set a goal and then let the user write or dictate what
 * they did"). A week in one line on top, like a calendar's, with a dot on the days that have
 * something written and a flag on the goal's date; under it the goal as one line, and the
 * selected day as a page to write on. Everything is saved as it is typed, in this browser only.
 */
export function PracticeLog({ t }: { t: Strings }) {
  const l = t.log;
  const today = useToday();
  const { log, setEntry, setGoal } = usePracticeLog();
  const [picked, setPicked] = useState<Day | null>(null);
  const [editing, setEditing] = useState(false);

  // The server does not know the player's day: the screen is drawn once the browser does.
  if (!today) return <main className="flex-1" aria-busy />;

  const day = picked ?? today;
  const thursday = weekThursday(day);

  return (
    <main className="flex w-full flex-1 flex-col">
      <h1 className="sr-only">{l.title}</h1>
      <header className="flex items-center gap-3 px-4 pt-5 sm:px-6 sm:pt-8">
        <div className="flex min-w-0 flex-col sm:flex-row sm:items-baseline sm:gap-2.5">
          <p className="truncate font-display text-xl font-semibold tracking-tight sm:text-3xl">{capital(format(t, thursday, { month: "long", year: "numeric" }))}</p>
          <p className="shrink-0 text-xs text-dim sm:text-sm">{l.week.replace("{n}", String(isoWeek(day)))}</p>
        </div>
        <div className="ml-auto flex shrink-0 items-center gap-1.5">
          <button type="button" onClick={() => setPicked(null)} className={cn(step, "px-3")}>
            {l.today}
          </button>
          <button type="button" onClick={() => setPicked(addDays(day, -7))} aria-label={l.prev} className={cn(step, "w-9 text-dim hover:text-ink")}>
            <ChevronLeft className="size-5" aria-hidden />
          </button>
          <button type="button" onClick={() => setPicked(addDays(day, 7))} aria-label={l.next} className={cn(step, "w-9 text-dim hover:text-ink")}>
            <ChevronRight className="size-5" aria-hidden />
          </button>
        </div>
      </header>

      <WeekStrip t={t} log={log} day={day} today={today} onPick={setPicked} />

      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 pt-4 sm:px-6">
        <GoalLine l={l} goal={log.goal} today={today} onEdit={() => setEditing(true)} />
        <Page key={day} t={t} day={day} today={today} goal={log.goal} text={log.entries[day] ?? ""} onChange={(text) => setEntry(day, text)} />
      </div>

      {editing ? (
        <GoalSheet
          t={t}
          today={today}
          goal={log.goal}
          onClose={() => setEditing(false)}
          onSave={(goal) => {
            setGoal(goal);
            setEditing(false);
          }}
        />
      ) : null}
    </main>
  );
}

/** The week of the selected day, Monday first: today's number on amber, a dot where something is written, a flag on the goal's date. */
function WeekStrip({ t, log, day, today, onPick }: { t: Strings; log: Log; day: Day; today: Day; onPick: (day: Day) => void }) {
  const l = t.log;
  return (
    <div className="mt-4 grid grid-cols-7 border-y border-line">
      {weekOf(day).map((d, i) => {
        const written = hasEntry(log, d);
        const flagged = log.goal?.date === d;
        return (
          <button
            key={d}
            type="button"
            aria-pressed={d === day}
            aria-label={[longDate(t, d), written ? l.hasEntry : null, flagged ? l.goalDay : null].filter(Boolean).join(", ")}
            onClick={() => onPick(d)}
            className={cn(
              "flex min-w-0 flex-col items-center gap-1 border-l border-line pt-2 pb-1.5 outline-none transition-colors first:border-l-0 focus-visible:bg-white/10",
              d === day ? "bg-surface text-ink" : "text-dim hover:bg-white/[0.03] hover:text-ink",
            )}
          >
            <span className="flex flex-col items-center gap-0.5 sm:flex-row sm:gap-1.5">
              <span className="text-xs sm:text-sm">{l.days[i]}</span>
              <span className={cn("min-w-6 rounded-md px-1 text-center text-sm tabular-nums sm:text-base", d === today && "bg-amber font-semibold text-stage")}>{Number(d.slice(8))}</span>
            </span>
            <span className="flex h-3.5 items-center gap-1" aria-hidden>
              {flagged ? <Flag className="size-3.5 text-amber-text" /> : null}
              {written ? <span className="size-1.5 rounded-full bg-correct" /> : null}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/** The goal in one line with the days left, or the way to set one. Either opens the goal's panel. */
function GoalLine({ l, goal, today, onEdit }: { l: L; goal: LogGoal | null; today: Day; onEdit: () => void }) {
  if (!goal) {
    return (
      <button
        type="button"
        onClick={onEdit}
        className="flex w-full items-center gap-3 rounded-xl border border-dashed border-amber/60 px-3.5 py-2.5 text-left outline-none transition-colors hover:bg-amber/5 focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <Flag className="size-5 shrink-0 text-amber-text" aria-hidden />
        <span className="min-w-0 flex-1">
          <span className="block font-medium text-amber-text">{l.setGoal}</span>
          <span className="block text-sm text-dim">{l.setGoalSub}</span>
        </span>
        <ChevronRight className="size-5 shrink-0 text-amber-text" aria-hidden />
      </button>
    );
  }
  const n = daysBetween(today, goal.date);
  const left = n < 0 ? l.overdue : n === 0 ? l.dueToday : n === 1 ? l.leftOne : l.left.replace("{n}", String(n));
  return (
    <button
      type="button"
      onClick={onEdit}
      className="group flex w-full items-center gap-2 rounded-lg py-1 text-left text-sm text-dim outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <Flag className="size-4 shrink-0 text-amber-text" aria-hidden />
      <span className="truncate text-ink">{goal.name}</span>
      <span className="shrink-0">· {left}</span>
      <span className="sr-only">. {l.editGoal}</span>
      <Pencil className="ml-auto size-4 shrink-0 transition-colors group-hover:text-ink" aria-hidden />
    </button>
  );
}

/** The selected day as a page: written or dictated, saved on every key. A day still to come cannot be written. */
function Page({ t, day, today, goal, text, onChange }: { t: Strings; day: Day; today: Day; goal: LogGoal | null; text: string; onChange: (text: string) => void }) {
  const l = t.log;
  const area = useRef<HTMLTextAreaElement>(null);
  const ahead = daysBetween(today, day) > 0;

  // The page grows with what is written on it instead of scrolling inside itself.
  useLayoutEffect(() => {
    const fit = () => {
      const el = area.current;
      if (!el) return;
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [text]);

  const ask = day === today ? l.askToday : l.askPast;
  return (
    <section className="group mt-6 flex flex-1 flex-col pb-8">
      {day === today ? <p className="text-xs font-semibold tracking-[0.08em] text-amber-text uppercase">{l.today}</p> : null}
      <h2 className="font-display text-2xl font-semibold tracking-tight">{longDate(t, day)}</h2>
      {ahead ? (
        goal?.date === day ? (
          <p className="mt-3 flex items-center gap-2 text-base text-amber-text">
            <Flag className="size-4 shrink-0" aria-hidden />
            {goal.name}
          </p>
        ) : (
          <p className="mt-3 text-base text-dim">{l.future}</p>
        )
      ) : (
        <>
          <textarea
            ref={area}
            value={text}
            onChange={(e) => onChange(e.target.value)}
            maxLength={ENTRY_MAX}
            rows={6}
            aria-label={ask}
            placeholder={`${ask} ${l.dictate}`}
            className="mt-3 w-full resize-none overflow-hidden bg-transparent text-base leading-relaxed text-ink outline-none placeholder:text-dim/70"
          />
          <p className="mt-3 border-t border-line pt-3 text-xs text-dim transition-colors group-focus-within:border-amber/60">{text.trim() ? l.saved : l.stays}</p>
        </>
      )}
    </section>
  );
}

const QUICK_DAYS = [7, 14, 30];

/** The goal's panel: what, and by when. A sheet from the bottom on a phone, a dialog from `sm`, like the metronome's panels. */
function GoalSheet({ t, today, goal, onSave, onClose }: { t: Strings; today: Day; goal: LogGoal | null; onSave: (goal: LogGoal | null) => void; onClose: () => void }) {
  const l = t.log;
  const dialog = useRef<HTMLDialogElement>(null);
  const id = useId();
  const [name, setName] = useState(goal?.name ?? "");
  const [date, setDate] = useState(goal?.date ?? "");
  const [error, setError] = useState<GoalError | null>(null);

  useEffect(() => {
    const d = dialog.current;
    if (d && !d.open) d.showModal();
  }, []);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const wrong = goalError(name, date, today);
    if (wrong) setError(wrong);
    else onSave({ name, date });
  };

  const ahead = isDay(date) ? daysBetween(today, date) : -1;
  const when =
    ahead < 0
      ? l.pickDate
      : (ahead === 0 ? l.onToday : ahead === 1 ? l.tomorrow : l.fromToday.replace("{n}", String(ahead))).replace("{date}", shortDate(t, date));

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
      <form onSubmit={submit} noValidate className="flex flex-col gap-4 px-5 pt-3 pb-[max(1.75rem,env(safe-area-inset-bottom))] sm:p-6">
        <span className="mx-auto h-1.5 w-10 rounded-full bg-line sm:hidden" aria-hidden />
        <div className="flex items-center justify-between gap-4">
          <h2 id={id} className="font-display text-2xl font-semibold">
            {l.goalTitle}
          </h2>
          <button type="button" onClick={onClose} aria-label={l.close} className="-m-1 rounded-lg p-1 text-dim outline-none hover:text-ink focus-visible:ring-3 focus-visible:ring-ring/50">
            <X className="size-5" aria-hidden />
          </button>
        </div>

        <label className="flex flex-col gap-1.5 text-sm text-dim">
          {l.goalName}
          <input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError(null);
            }}
            maxLength={GOAL_NAME_MAX}
            placeholder={l.goalNameHint}
            autoFocus={!goal}
            autoComplete="off"
            className={field}
          />
        </label>

        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${id}-date`} className="text-sm text-dim">
            {l.goalDate}
          </label>
          <div className="flex gap-1.5">
            {QUICK_DAYS.map((n, i) => {
              const on = date === addDays(today, n);
              return (
                <button
                  key={n}
                  type="button"
                  aria-pressed={on}
                  onClick={() => {
                    setDate(addDays(today, n));
                    setError(null);
                  }}
                  className={cn(
                    "h-9 flex-1 rounded-lg border px-2 text-sm font-medium whitespace-nowrap outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50",
                    on ? "border-amber bg-amber/15 text-amber-text" : "border-line text-dim hover:text-ink",
                  )}
                >
                  {l.quick[i]}
                </button>
              );
            })}
          </div>
          <input
            id={`${id}-date`}
            type="date"
            min={today}
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              setError(null);
            }}
            className={field}
          />
          <p className="text-sm text-dim">{when}</p>
        </div>

        <p role="alert" className="min-h-5 text-sm text-wrong">
          {error ? l.errors[error] : null}
        </p>

        <button type="submit" className={cn(primary, "h-14 w-full rounded-2xl")}>
          {l.save}
        </button>
        {goal ? (
          <button type="button" onClick={() => onSave(null)} className="self-center rounded-lg px-3 py-1 text-sm text-dim outline-none hover:text-ink focus-visible:ring-3 focus-visible:ring-ring/50">
            {l.remove}
          </button>
        ) : null}
      </form>
    </dialog>
  );
}
