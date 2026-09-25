"use client";

import { useEffect } from "react";
import { Minus, Play, Plus, Square } from "lucide-react";
import { BPM_MAX, BPM_MIN, groupStarts, meterOf, METERS, SUBDIVISIONS, tempoMarking, type Click } from "@/lib/core/metronome";
import { useMetronome } from "@/lib/game/use-metronome";
import type { Strings } from "@/lib/i18n";
import { GameShell } from "@/components/game-frame";
import { Row } from "@/components/setup-screen";
import { Chip, primary } from "@/components/challenge-card";
import { cn } from "@/lib/utils";

const step =
  "flex h-11 min-w-11 items-center justify-center rounded-xl border border-line px-3 text-sm font-medium text-ink outline-none transition-[background-color,transform] hover:bg-surface active:scale-95 focus-visible:ring-3 focus-visible:ring-ring/50 motion-reduce:active:scale-100";

/** One circle per beat, group starts ringed in amber, and a dot per subdivision underneath. The
 *  beat being heard lights up. */
function Beats({ meterId, subdivision, accent, click }: { meterId: string; subdivision: number; accent: boolean; click: Click | null }) {
  const meter = meterOf(meterId);
  const starts = groupStarts(meter);
  return (
    <div className="flex justify-center gap-2 sm:gap-3" aria-hidden>
      {Array.from({ length: meter.beats }, (_, beat) => {
        const on = click?.beat === beat;
        const strong = accent && starts.includes(beat);
        return (
          <div key={beat} className="flex flex-col items-center gap-1.5">
            <span
              className={cn(
                "flex size-9 items-center justify-center rounded-full border-2 text-sm font-semibold transition-[background-color,border-color,transform] duration-75 sm:size-11",
                strong ? "border-amber" : "border-line",
                on && click?.sub === 0 ? "scale-110 motion-reduce:scale-100" : "",
                on ? (strong && beat === 0 ? "bg-amber text-stage" : "bg-ink text-stage") : "text-dim",
              )}
            >
              {beat + 1}
            </span>
            <span className="flex h-1.5 gap-1">
              {subdivision > 1
                ? Array.from({ length: subdivision }, (_, sub) => (
                    <span key={sub} className={cn("size-1.5 rounded-full", on && click?.sub === sub ? "bg-amber" : "bg-line")} />
                  ))
                : null}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/** The metronome: an upright screen, no neck. Settings apply while it runs. */
export function Metronome({ t, tg }: { t: Strings["metronome"]; tg: Strings["game"] }) {
  const { settings, set, nudge, running, toggle, click, tap } = useMetronome();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const typing = e.target instanceof HTMLInputElement;
      if (e.key === " " && !(e.target instanceof HTMLButtonElement)) {
        e.preventDefault();
        void toggle();
      } else if (!typing && (e.key === "ArrowRight" || e.key === "ArrowUp")) {
        e.preventDefault();
        nudge(e.shiftKey ? 5 : 1);
      } else if (!typing && (e.key === "ArrowLeft" || e.key === "ArrowDown")) {
        e.preventDefault();
        nudge(e.shiftKey ? -5 : -1);
      } else if (e.key === "t" || e.key === "T") {
        tap();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle, nudge, tap]);

  return (
    <GameShell t={tg} title={t.title}>
      <div className="flex min-h-0 flex-1 flex-col overflow-auto px-4 pb-6 animate-in fade-in fill-mode-both duration-300 motion-reduce:animate-none">
        <div className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center gap-7 py-4">
          <Beats meterId={settings.meter} subdivision={settings.subdivision} accent={settings.accent} click={running ? click : null} />

          <section aria-label={t.tempo} className="flex flex-col items-center gap-4">
            <p className="flex flex-col items-center">
              <span className="font-display text-7xl leading-none font-semibold tabular-nums sm:text-8xl" aria-live="polite">
                {settings.bpm}
              </span>
              <span className="mt-2 text-sm text-dim">
                BPM · <span className="text-amber-text">{tempoMarking(settings.bpm)}</span>
              </span>
            </p>
            <div className="flex w-full items-center justify-center gap-2">
              <button type="button" className={step} onClick={() => nudge(-5)} aria-label={`${t.slower} 5`}>
                −5
              </button>
              <button type="button" className={step} onClick={() => nudge(-1)} aria-label={t.slower}>
                <Minus className="size-4" />
              </button>
              <button type="button" className={cn(step, "min-w-20 border-amber/60 text-amber-text")} onClick={tap}>
                {t.tap}
              </button>
              <button type="button" className={step} onClick={() => nudge(1)} aria-label={t.faster}>
                <Plus className="size-4" />
              </button>
              <button type="button" className={step} onClick={() => nudge(5)} aria-label={`${t.faster} 5`}>
                +5
              </button>
            </div>
            <input
              type="range"
              min={BPM_MIN}
              max={BPM_MAX}
              value={settings.bpm}
              onChange={(e) => set({ bpm: Number(e.target.value) })}
              aria-label={t.tempo}
              className="w-full accent-amber"
            />
          </section>

          <div className="flex flex-col gap-4">
            <Row label={t.meter}>
              {METERS.map((m) => (
                <Chip key={m.id} on={settings.meter === m.id} onClick={() => set({ meter: m.id })}>
                  {m.id}
                </Chip>
              ))}
            </Row>
            <Row label={t.subdivision}>
              {SUBDIVISIONS.map((n) => (
                <Chip key={n} on={settings.subdivision === n} onClick={() => set({ subdivision: n })}>
                  {n}
                </Chip>
              ))}
            </Row>
            <Row label={t.accent}>
              <Chip on={settings.accent} onClick={() => set({ accent: true })}>
                {t.accentOn}
              </Chip>
              <Chip on={!settings.accent} onClick={() => set({ accent: false })}>
                {t.accentOff}
              </Chip>
            </Row>
          </div>

          <button type="button" onClick={() => void toggle()} className={cn(primary, "inline-flex w-full items-center justify-center gap-2 py-3")}>
            {running ? <Square className="size-5" aria-hidden /> : <Play className="size-5" aria-hidden />}
            {running ? t.stop : t.start}
          </button>
          <p className="hidden text-center text-xs text-dim pointer-fine:block">{t.keys}</p>
        </div>
      </div>
    </GameShell>
  );
}
