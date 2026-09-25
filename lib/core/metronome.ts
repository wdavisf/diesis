/**
 * Metronome rules, pure: tempo limits, meters and where their accents fall, subdivisions, tap
 * tempo and the tempo marking. The audio engine (lib/audio/metronome-engine.ts) asks this module
 * what each click is; nothing here knows about time passing.
 */

export const BPM_MIN = 20;
export const BPM_MAX = 300;

export interface Meter {
  /** "4/4", "6/8"… also the storage id. */
  id: string;
  /** Clicks per bar at subdivision 1. In /8 meters the beat is the eighth note. */
  beats: number;
  /** Beat groups: each group starts with a secondary accent (6/8 is 3+3, 7/8 is 2+2+3). */
  groups: number[];
}

export const METERS: readonly Meter[] = [
  { id: "2/4", beats: 2, groups: [2] },
  { id: "3/4", beats: 3, groups: [3] },
  { id: "4/4", beats: 4, groups: [4] },
  { id: "5/4", beats: 5, groups: [3, 2] },
  { id: "6/8", beats: 6, groups: [3, 3] },
  { id: "7/8", beats: 7, groups: [2, 2, 3] },
];

/** Clicks per beat: none, eighths, triplets, sixteenths, sextuplets. */
export const SUBDIVISIONS = [1, 2, 3, 4, 6] as const;
export type Subdivision = (typeof SUBDIVISIONS)[number];

export interface MetronomeSettings {
  bpm: number;
  meter: string;
  subdivision: Subdivision;
  /** Accent the first beat of the bar (and the start of each group). Off: every beat alike. */
  accent: boolean;
  /** steady: one tempo, `bpm`. speed: the tempo climbs by the speed plan (lib/core/speed.ts). */
  mode: MetronomeMode;
}

export type MetronomeMode = "steady" | "speed";

export const DEFAULT_METRONOME: MetronomeSettings = { bpm: 80, meter: "4/4", subdivision: 1, accent: true, mode: "steady" };

/** accent: first beat of the bar. group: first beat of a later group. beat: any other beat.
 *  sub: a click between beats. */
export type ClickKind = "accent" | "group" | "beat" | "sub";

export interface Click {
  /** Beat within the bar, from 0. */
  beat: number;
  /** Click within the beat, from 0 (0 is the beat itself). */
  sub: number;
  kind: ClickKind;
}

export function meterOf(id: string): Meter {
  return METERS.find((m) => m.id === id) ?? METERS[2];
}

export function clampBpm(bpm: number): number {
  if (!Number.isFinite(bpm)) return DEFAULT_METRONOME.bpm;
  return Math.min(BPM_MAX, Math.max(BPM_MIN, Math.round(bpm)));
}

export function clicksPerBar(s: MetronomeSettings): number {
  return meterOf(s.meter).beats * s.subdivision;
}

/** Seconds from one click to the next. */
export function secondsPerClick(s: MetronomeSettings): number {
  return 60 / clampBpm(s.bpm) / s.subdivision;
}

/** Beats that open a group: always 0, then the running sums of the groups. */
export function groupStarts(meter: Meter): number[] {
  const starts = [0];
  let at = 0;
  for (const g of meter.groups.slice(0, -1)) starts.push((at += g));
  return starts;
}

/** What the click at `index` (counted from the start of the bar, wrapping) is. */
export function clickAt(index: number, s: MetronomeSettings): Click {
  const meter = meterOf(s.meter);
  const i = ((index % clicksPerBar(s)) + clicksPerBar(s)) % clicksPerBar(s);
  const beat = Math.floor(i / s.subdivision);
  const sub = i % s.subdivision;
  let kind: ClickKind = "beat";
  if (sub > 0) kind = "sub";
  else if (s.accent && beat === 0) kind = "accent";
  else if (s.accent && groupStarts(meter).includes(beat)) kind = "group";
  return { beat, sub, kind };
}

/** Taps further apart than this start a new count. */
export const TAP_RESET_MS = 2000;
const TAP_KEEP = 5;

/**
 * Tap tempo. Give it the taps so far (ms timestamps, oldest first) and the new one; it returns
 * the taps to keep and the tempo they imply, or null until there are two taps.
 */
export function tap(taps: readonly number[], now: number): { taps: number[]; bpm: number | null } {
  const last = taps[taps.length - 1];
  const kept = last !== undefined && now - last <= TAP_RESET_MS && now > last ? [...taps, now].slice(-TAP_KEEP) : [now];
  if (kept.length < 2) return { taps: kept, bpm: null };
  const span = kept[kept.length - 1] - kept[0];
  return { taps: kept, bpm: clampBpm((60000 * (kept.length - 1)) / span) };
}

/** The Italian tempo word for a tempo, as printed on scores. Approximate, like the words. */
export function tempoMarking(bpm: number): string {
  const b = clampBpm(bpm);
  if (b < 40) return "Grave";
  if (b < 60) return "Largo";
  if (b < 66) return "Larghetto";
  if (b < 76) return "Adagio";
  if (b < 108) return "Andante";
  if (b < 120) return "Moderato";
  if (b < 156) return "Allegro";
  if (b < 176) return "Vivace";
  if (b < 200) return "Presto";
  return "Prestissimo";
}

/** Settings from storage, falling back field by field on anything unexpected. */
export function decodeMetronome(raw: string | null): MetronomeSettings {
  if (!raw) return DEFAULT_METRONOME;
  try {
    const v = JSON.parse(raw) as Partial<MetronomeSettings>;
    return {
      bpm: typeof v.bpm === "number" ? clampBpm(v.bpm) : DEFAULT_METRONOME.bpm,
      meter: typeof v.meter === "string" && METERS.some((m) => m.id === v.meter) ? v.meter : DEFAULT_METRONOME.meter,
      subdivision: SUBDIVISIONS.includes(v.subdivision as Subdivision) ? (v.subdivision as Subdivision) : DEFAULT_METRONOME.subdivision,
      accent: typeof v.accent === "boolean" ? v.accent : DEFAULT_METRONOME.accent,
      mode: v.mode === "speed" ? "speed" : "steady",
    };
  } catch {
    return DEFAULT_METRONOME;
  }
}

export function encodeMetronome(s: MetronomeSettings): string {
  return JSON.stringify({ bpm: clampBpm(s.bpm), meter: s.meter, subdivision: s.subdivision, accent: s.accent, mode: s.mode });
}
