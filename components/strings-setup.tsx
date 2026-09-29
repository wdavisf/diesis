"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Sparkles } from "lucide-react";
import { namesFor, pitchClassOf, STRING_COUNTS, tuningsFor } from "@/lib/core/notes";
import {
  feelOf,
  gaugesFor,
  GUITAR_TYPES,
  adjustSetup,
  guitarType,
  LB_TO_KG,
  PLAIN_GAUGES,
  SCALE_MAX,
  SCALE_MIN,
  setsFor,
  SLACK_BELOW,
  suggestGauges,
  tension,
  TIGHT_ABOVE,
  WOUND_GAUGES,
  windingOf,
  type Feel,
} from "@/lib/core/strings";
import { amazonSearch, picksFor, setName } from "@/lib/core/shop";
import { useGuitar } from "@/lib/game/use-guitar";
import { useSettings } from "@/lib/game/use-settings";
import { useStrings } from "@/lib/game/use-strings";
import type { Strings } from "@/lib/i18n";
import { Chip } from "@/components/challenge-card";
import { cn } from "@/lib/utils";

const field =
  "h-11 w-full rounded-xl border border-line bg-stage px-3 text-base text-ink outline-none focus-visible:border-amber focus-visible:ring-3 focus-visible:ring-ring/40";

/** ".010", ".0095", ".046" */
const gaugeLabel = (g: number) => (g / 1000).toFixed(Number.isInteger(g) ? 3 : 4).replace(/^0/, "");
const BAR_MAX = 30;
const feelColor: Record<Feel, string> = { slack: "bg-amber", balanced: "bg-correct", tight: "bg-wrong" };
const feelText: Record<Feel, string> = { slack: "text-amber-text", balanced: "text-correct", tight: "text-wrong" };

function Section({ title, lede, children }: { title: string; lede?: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-line bg-surface/40 p-5 sm:p-6">
      <h2 className="font-display text-xl font-semibold">{title}</h2>
      {lede ? <p className="mt-1 text-sm text-dim">{lede}</p> : null}
      <div className="mt-5">{children}</div>
    </section>
  );
}

/** Picture per entry of `strings.setup.gear`, in the same order (public/gear). */
const GEAR_IMAGES = ["ruler", "feeler", "winder", "tuner"];

/** A product as a card: picture, name, a new tab to Amazon.es. An Amazon.es search link with the affiliate tag: a new tab, marked sponsored. */
function ShopCard({ href, image, children, className }: { href: string; image: string; children: ReactNode; className?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="sponsored noopener"
      className={cn("group flex min-w-0 items-center gap-3 rounded-xl border border-line p-2 pr-3 text-sm font-medium text-ink transition-colors hover:bg-surface-raised", className)}
    >
      <Image src={`/gear/${image}.webp`} alt="" width={480} height={480} sizes="72px" className="size-16 shrink-0 rounded-lg bg-[#1a1a1a] object-cover sm:size-[72px]" />
      <span className="min-w-0 flex-1">{children}</span>
      <ExternalLink className="size-3.5 shrink-0 text-dim" aria-hidden />
    </a>
  );
}

function Figure({ label, mm, sub }: { label: string; mm: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-line bg-stage p-3.5">
      <p className="text-xs text-dim">{label}</p>
      <p className="mt-1 font-display text-2xl font-semibold tabular-nums">{mm}</p>
      {sub ? <p className="text-xs text-dim tabular-nums">{sub}</p> : null}
    </div>
  );
}

/**
 * Strings and setup: pick the guitar type (its scale length and setup numbers), see each
 * string's tension for the profile's tuning with the gauges in use, load a common set or let
 * Diesis suggest a balanced one, then the setup starting points and the steps after a string
 * change. Physics and data in lib/core/strings.ts; choices in localStorage `diesis_strings`;
 * strings and tuning are the profile's (`diesis_guitar`), changed here too.
 */
export function StringsSetup({ t, tp, lang, base }: { t: Strings["setup"]; tp: Strings["profile"]; lang: "en" | "es"; base: string }) {
  const guitar = useGuitar();
  const { settings, set } = useStrings();
  const names = namesFor(useSettings(lang === "es" ? "solfege" : "letters").names);
  const tuning = guitar.preset.notes;
  const count = tuning.length;
  const type = guitarType(settings.type);
  const gauges = gaugesFor(settings, count);
  const scale = settings.scale;

  const setGauges = (list: number[]) => set({ gauges: { ...settings.gauges, [String(count)]: list } });
  const rows = tuning.map((midi, i) => {
    const g = gauges[i];
    const lb = tension(g, midi, scale);
    return { i, midi, g, lb, feel: feelOf(lb), winding: windingOf(g) };
  });
  const total = rows.reduce((sum, r) => sum + r.lb, 0);
  // No octave number: English and Spanish count octaves differently, and the string number already tells them apart.
  const noteName = (midi: number) => names[pitchClassOf(midi)];
  const activeSet = setsFor(count).find((s) => s.gauges.every((g, i) => g === gauges[i]))?.id;
  const picks = picksFor(type.id, !!type.nylon, activeSet ?? null);
  const s = adjustSetup(type.setup, total / count, type.nylon);
  const stringsQuery =
    (type.id === "acoustic" ? t.query.acoustic : t.query.electric).replace("{set}", setName(gauges)) +
    (count > 6 ? t.query.extended.replace("{n}", String(count)) : "");

  const picksList =
    picks.length > 0 ? (
      <div className="mt-5">
        <h3 className="text-sm font-semibold">{t.picksTitle}</h3>
        <p className="mt-0.5 text-xs text-dim">{t.picksNote}</p>
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {picks.map((p) => (
            <ShopCard key={p.name} href={amazonSearch(p.name)} image="strings">
              <span className="block">{p.name}</span>
              <span className="block text-xs font-normal text-dim">{t.picks[p.kind]}</span>
            </ShopCard>
          ))}
        </div>
      </div>
    ) : null;
  const mmIn = (v: number) => `${v.toFixed(1)} mm`;
  // The numbers each step aims for (steps 2, 3 and 4), from the same setup as the cards above.
  const aims: Record<number, string | null> = {
    1: t.aim.relief.replace("{v}", `${s.relief.toFixed(2)} mm`),
    2: t.aim.action.replace("{bass}", mmIn(s.actionBass)).replace("{treble}", mmIn(s.actionTreble)),
    3: s.pickupBass !== null && s.pickupTreble !== null ? t.aim.pickups.replace("{bass}", mmIn(s.pickupBass)).replace("{treble}", mmIn(s.pickupTreble)) : null,
  };
  const inSub = (v: number) => `${(v / 25.4).toFixed(3).replace(/^0/, "")}″`;

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-5 px-4 py-6 sm:py-10">
      <div>
        <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">{t.title}</h1>
        <p className="mt-2 text-dim">{t.lede}</p>
      </div>

      <Section title={t.guitar} lede={t.guitarLede}>
        <p className="text-sm font-medium text-dim">{t.type}</p>
        <div role="radiogroup" aria-label={t.type} className="mt-1.5 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {GUITAR_TYPES.map((g) => {
            const on = g.id === type.id;
            return (
              <button
                key={g.id}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => {
                  set({ type: g.id, scale: g.scale });
                  if (g.strings !== count) guitar.setTuning(tuningsFor(g.strings)[0].id);
                }}
                className={cn(
                  "group relative aspect-[3/2] min-w-0 overflow-hidden rounded-xl border bg-[#1a1a1a] text-left outline-none transition-[border-color,transform] focus-visible:ring-3 focus-visible:ring-ring/50 active:scale-[0.98] motion-reduce:transition-none",
                  on ? "border-amber ring-2 ring-amber/60" : "border-line hover:border-dim",
                )}
              >
                <Image
                  src={`/guitar-types/${g.id}.webp`}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 180px, (min-width: 640px) 33vw, 50vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none"
                />
                <span
                  className={cn(
                    "absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent px-2.5 pb-1.5 pt-6 text-xs font-medium leading-tight",
                    on ? "text-amber-text" : "text-ink",
                  )}
                >
                  {t.types[g.id]}
                </span>
              </button>
            );
          })}
        </div>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <label className="flex flex-col gap-1.5 text-sm font-medium text-dim">
            {t.scale}
            <div className="flex items-center gap-2">
              <input
                key={scale}
                type="number"
                inputMode="decimal"
                min={SCALE_MIN}
                max={SCALE_MAX}
                step={0.05}
                defaultValue={scale}
                onBlur={(e) => {
                  const v = Number(e.target.value);
                  if (v >= SCALE_MIN && v <= SCALE_MAX) set({ scale: v });
                  else e.target.value = String(scale);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") e.currentTarget.blur();
                }}
                className={cn(field, "tabular-nums")}
              />
              <span className="shrink-0 text-sm font-normal text-dim tabular-nums">″ · {(scale * 25.4).toFixed(0)} mm</span>
            </div>
          </label>
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-dim">{tp.strings}</span>
            <div role="radiogroup" aria-label={tp.strings} className="flex gap-2">
              {STRING_COUNTS.map((n) => (
                <Chip key={n} on={count === n} onClick={() => guitar.setTuning(tuningsFor(n)[0].id)}>
                  {n}
                </Chip>
              ))}
            </div>
          </div>
          <label className="flex flex-col gap-1.5 text-sm font-medium text-dim">
            {tp.tuning}
            <select className={field} value={guitar.preset.id} onChange={(e) => guitar.setTuning(e.target.value)}>
              {tuningsFor(count).map((tu) => (
                <option key={tu.id} value={tu.id}>
                  {tp.tunings[tu.id]} · {[...tu.notes].reverse().map((m) => names[pitchClassOf(m)]).join(" ")}
                </option>
              ))}
            </select>
          </label>
        </div>
        <p className="mt-3 text-xs text-dim">
          {t.profileNote}{" "}
          <Link href={`${base}/profile`} className="text-ink underline underline-offset-4">
            {tp.title}
          </Link>
        </p>
      </Section>

      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-2">
      <Section title={t.tension} lede={type.nylon ? undefined : t.tensionLede}>
        {type.nylon ? (
          <>
            <p className="text-dim">{t.nylon}</p>
            {picksList}
            <ShopCard href={amazonSearch(t.query.nylon)} image="strings" className="mt-4 sm:max-w-sm">
              {t.buyNylon}
            </ShopCard>
            <p className="mt-2 text-xs text-dim">{t.affiliate}</p>
          </>
        ) : (
          <>
            <div className="flex flex-wrap items-center gap-2">
              <div role="radiogroup" aria-label={t.sets} className="flex flex-wrap gap-2">
                {setsFor(count).map((st) => (
                  <Chip key={st.id} on={activeSet === st.id} onClick={() => setGauges([...st.gauges])}>
                    {st.id.replace("-", "–")}
                  </Chip>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setGauges(suggestGauges(tuning, scale))}
                className="flex h-9 items-center gap-1.5 rounded-lg border border-amber/60 bg-amber/10 px-3 text-sm font-medium text-amber-text transition-colors hover:bg-amber/20"
              >
                <Sparkles className="size-4" aria-hidden /> {t.suggest}
              </button>
            </div>

            <ul className="mt-5 flex flex-col gap-2">
              {rows.map((r) => (
                <li key={r.i} className="grid grid-cols-[2.25rem_3.25rem_6.5rem_1fr] items-center gap-2 sm:grid-cols-[2.5rem_3.5rem_7rem_1fr_10.5rem] sm:gap-3">
                  <span className="text-sm text-dim tabular-nums">{r.i + 1}</span>
                  <span className="font-semibold tabular-nums">{noteName(r.midi)}</span>
                  <select
                    aria-label={t.gaugeOf.replace("{n}", String(r.i + 1))}
                    className="h-9 rounded-lg border border-line bg-stage px-2 text-sm tabular-nums outline-none focus-visible:border-amber"
                    value={r.g}
                    onChange={(e) => setGauges(gauges.map((g, k) => (k === r.i ? Number(e.target.value) : g)))}
                  >
                    <optgroup label={t.plain}>
                      {PLAIN_GAUGES.filter((g) => g < 21).map((g) => (
                        <option key={`p${g}`} value={g}>
                          {gaugeLabel(g)}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label={t.wound}>
                      {WOUND_GAUGES.filter((g) => g >= 21).map((g) => (
                        <option key={`w${g}`} value={g}>
                          {gaugeLabel(g)}w
                        </option>
                      ))}
                    </optgroup>
                  </select>
                  <div className="relative h-2.5 overflow-hidden rounded-full bg-white/5" aria-hidden>
                    <span className="absolute inset-y-0 border-x border-white/15" style={{ left: `${(SLACK_BELOW / BAR_MAX) * 100}%`, width: `${((TIGHT_ABOVE - SLACK_BELOW) / BAR_MAX) * 100}%` }} />
                    <span
                      className={cn("absolute inset-y-0 left-0 rounded-full transition-[width] duration-300 motion-reduce:transition-none", feelColor[r.feel])}
                      style={{ width: `${Math.min(r.lb / BAR_MAX, 1) * 100}%` }}
                    />
                  </div>
                  <span className="col-span-4 -mt-1 text-right text-sm tabular-nums sm:col-span-1 sm:mt-0">
                    {r.lb.toFixed(1)} lb <span className="text-dim">· {(r.lb * LB_TO_KG).toFixed(1)} kg</span>{" "}
                    <span className={cn("text-xs", feelText[r.feel])}>{t.feel[r.feel]}</span>
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-dim tabular-nums">
              {t.total} <span className="font-semibold text-ink">{total.toFixed(0)} lb</span> · {(total * LB_TO_KG).toFixed(0)} kg
            </p>
            <p className="mt-2 text-xs text-dim">{t.estimate}</p>
            {picksList}
            <ShopCard href={amazonSearch(stringsQuery)} image="strings" className="mt-5 sm:max-w-sm">
              {t.buy.replace("{set}", setName(gauges).replace("-", "–"))}
            </ShopCard>
            <p className="mt-2 text-xs text-dim">{t.affiliate}</p>
          </>
        )}
      </Section>

      <Section title={t.setupTitle} lede={t.setupLede.replace("{type}", t.types[type.id])}>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Figure label={t.actionBass} mm={mmIn(s.actionBass)} sub={inSub(s.actionBass)} />
          <Figure label={t.actionTreble} mm={mmIn(s.actionTreble)} sub={inSub(s.actionTreble)} />
          <Figure label={t.relief} mm={`${s.relief.toFixed(2)} mm`} sub={inSub(s.relief)} />
          <Figure label={t.radius} mm={s.radius ? `${s.radius}″` : t.flat} sub={s.radius ? `${(s.radius * 25.4).toFixed(0)} mm` : undefined} />
          {s.pickupBass !== null && s.pickupTreble !== null ? (
            <>
              <Figure label={t.pickupBass} mm={mmIn(s.pickupBass)} sub={inSub(s.pickupBass)} />
              <Figure label={t.pickupTreble} mm={mmIn(s.pickupTreble)} sub={inSub(s.pickupTreble)} />
            </>
          ) : null}
        </div>
        <p className="mt-3 text-xs text-dim">{t.setupNote}</p>
        <h3 className="mt-6 text-sm font-semibold">{t.gearTitle}</h3>
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {t.gear.map((g, i) => (
            <ShopCard key={g.label} href={amazonSearch(g.query)} image={GEAR_IMAGES[i]}>
              {g.label}
            </ShopCard>
          ))}
        </div>
        <p className="mt-2 text-xs text-dim">{t.affiliate}</p>
      </Section>

      </div>

      <Section title={t.stepsTitle} lede={t.stepsLede}>
        <ol className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {t.steps.map((step, i) => (
            <li key={i} className="flex flex-col gap-3">
              <Image
                src={`/steps/step${i + 1}.webp`}
                alt=""
                width={720}
                height={480}
                sizes="(min-width: 1024px) 380px, (min-width: 640px) 45vw, 90vw"
                className="aspect-[3/2] w-full rounded-xl bg-[#1a1a1a] object-cover"
              />
              <div className="flex gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-amber/15 text-sm font-semibold text-amber-text">{i + 1}</span>
                <div>
                  <p className="text-lg font-medium leading-snug">{step.title}</p>
                  <p className="mt-1 text-sm text-dim">{step.body}</p>
                  {aims[i] ? <p className="mt-2 inline-block rounded-lg border border-amber/40 bg-amber/10 px-2.5 py-1 text-sm font-semibold tabular-nums text-amber-text">{aims[i]}</p> : null}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </Section>
    </main>
  );
}
