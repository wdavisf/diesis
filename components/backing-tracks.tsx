"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Play } from "lucide-react";
import { BACKING_TRACKS, stylesPresent, tracksOf, type BackingTrack, type Style } from "@/lib/core/backing-tracks";
import { namesFor } from "@/lib/core/notes";
import { useNeck } from "@/lib/game/use-neck";
import { useSettings } from "@/lib/game/use-settings";
import type { Lang, Strings } from "@/lib/i18n";
import { Chip } from "@/components/challenge-card";

const MODES = new Set(["dorian", "phrygian", "lydian", "mixolydian", "locrian"]);

/**
 * Backing tracks: YouTube videos to jam over, filtered by style, each with its key and a scale
 * that fits. Until the visitor presses play only the thumbnail shows (from i.ytimg.com); the
 * player itself (youtube-nocookie.com) loads on that tap, and one plays at a time. "Show on the
 * neck" stores the scale in the neck's settings and opens it.
 */
export function BackingTracks({ t, neck, base, lang }: { t: Strings["backing"]; neck: Strings["neck"]; base: string; lang: Lang }) {
  const [style, setStyle] = useState<Style | "all">("all");
  const [playing, setPlaying] = useState<string | null>(null);
  const names = namesFor(useSettings(lang === "es" ? "solfege" : "letters").names);
  const { set } = useNeck();
  const router = useRouter();

  const keyName = (tr: BackingTrack) => {
    const n = names[tr.key.tonic];
    return tr.key.quality ? t[tr.key.quality].replace("{n}", n) : n;
  };
  // "A minor pentatonic", but "D Dorian": in English only the modes keep their capital.
  const scaleName = (tr: BackingTrack) => {
    const name = neck.scales[tr.scale.id] ?? tr.scale.id;
    const cased = lang === "en" && !MODES.has(tr.scale.id) ? name.toLowerCase() : name;
    return t.scaleOn.replace("{root}", names[tr.scale.root]).replace("{scale}", cased);
  };

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-6 sm:py-10">
      <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">{t.title}</h1>
      <p className="mt-2 max-w-2xl text-dim">{t.lede}</p>

      <div className="-mx-4 mt-6 flex gap-2 overflow-x-auto px-4 pb-1" role="radiogroup" aria-label={t.style}>
        <Chip on={style === "all"} onClick={() => setStyle("all")}>
          {t.all}
        </Chip>
        {stylesPresent(BACKING_TRACKS).map((s) => (
          <Chip key={s} on={style === s} onClick={() => setStyle(s)}>
            {t.styles[s]}
          </Chip>
        ))}
      </div>

      <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {tracksOf(style).map((tr, i) => (
          <li
            key={tr.id}
            className="flex flex-col overflow-hidden rounded-2xl border border-line bg-surface animate-in fade-in slide-in-from-bottom-2 fill-mode-both duration-400 motion-reduce:animate-none"
            style={{ animationDelay: `${Math.min(i, 8) * 50}ms` }}
          >
            <div className="relative aspect-video bg-stage">
              {playing === tr.id ? (
                <iframe
                  className="absolute inset-0 size-full"
                  src={`https://www.youtube-nocookie.com/embed/${tr.id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                  title={tr.title}
                  allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                  allowFullScreen
                />
              ) : (
                <button type="button" onClick={() => setPlaying(tr.id)} className="group absolute inset-0 size-full" aria-label={t.play.replace("{t}", tr.title)}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- YouTube's own thumbnail, not worth routing through next/image */}
                  <img src={`https://i.ytimg.com/vi/${tr.id}/hqdefault.jpg`} alt="" loading="lazy" className="size-full object-cover opacity-80 transition-opacity group-hover:opacity-100" />
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="flex size-14 items-center justify-center rounded-full bg-amber text-stage shadow-lg transition-transform group-hover:scale-110 group-active:scale-95 motion-reduce:transition-none">
                      <Play className="size-6 translate-x-0.5 fill-current" />
                    </span>
                  </span>
                </button>
              )}
            </div>
            <div className="flex flex-1 flex-col p-4">
              <p className="text-xs font-semibold tracking-wide text-amber-text uppercase">
                {t.styles[tr.style]}
                {tr.bpm ? <span className="text-dim"> · {tr.bpm} BPM</span> : null}
              </p>
              <p className="mt-1.5 font-display text-xl font-semibold">{keyName(tr)}</p>
              <p className="mt-1 text-sm text-dim">
                {t.playOver} <span className="text-ink">{scaleName(tr)}</span>
              </p>
              <p className="mt-1 flex-1 text-xs text-dim">{t.by.replace("{c}", tr.channel)}</p>
              <button
                type="button"
                onClick={() => {
                  set({ root: tr.scale.root, scale: tr.scale.id });
                  router.push(`${base}/practice/neck`);
                }}
                className="mt-4 self-start rounded-lg border border-line px-3 py-2 text-sm font-medium text-ink transition-colors hover:bg-surface-raised"
              >
                {t.onNeck}
              </button>
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-8 text-xs text-dim">{t.note}</p>
    </main>
  );
}
