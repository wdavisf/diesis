"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";

const REDUCE = "(prefers-reduced-motion: reduce)";
function subscribeReduce(notify: () => void) {
  const query = matchMedia(REDUCE);
  query.addEventListener("change", notify);
  return () => query.removeEventListener("change", notify);
}

/**
 * The landing's hero picture: a guitarist on a dark stage (public/video/stage.mp4, made by
 * tools/gen-video.mjs; an illustration, nobody real), shaded so it melts into the page and the
 * text beside it stays readable. Decoration, so it has no sound and no controls but one: a button
 * that stops it. It only runs while it is on screen, and under Reduce Motion it stays on its
 * poster until the visitor presses play. The caller sizes it with `className`.
 */
export function StageVideo({ pause, play, className }: { pause: string; play: string; className?: string }) {
  const video = useRef<HTMLVideoElement>(null);
  const reduce = useSyncExternalStore(subscribeReduce, () => matchMedia(REDUCE).matches, () => false);
  const [choice, setChoice] = useState<boolean | null>(null); // what the visitor asked for with the button
  const [playing, setPlaying] = useState(false);
  const wanted = choice ?? !reduce;

  useEffect(() => {
    const el = video.current;
    if (!el) return;
    if (!wanted) {
      el.pause();
      return;
    }
    const seen = new IntersectionObserver(
      ([entry]) => {
        // play() is refused in a phone's low power mode: the poster stays, which is fine.
        if (entry.isIntersecting) el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.2 },
    );
    seen.observe(el);
    return () => seen.disconnect();
  }, [wanted]);

  return (
    <div className={cn("relative", className)}>
      <video
        ref={video}
        src="/video/stage.mp4"
        poster="/video/stage.jpg"
        muted
        loop
        playsInline
        preload="none"
        aria-hidden
        tabIndex={-1}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        className="block size-full bg-black object-cover object-[96%_50%] sm:object-[88%_50%]"
      />
      {/* Down into the page (a pixel past the edge, which may fall on half a pixel), and from lg toward the text on the left. */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -bottom-px bg-gradient-to-b from-stage/50 via-transparent via-45% to-stage" />
      <div aria-hidden className="pointer-events-none absolute inset-0 hidden bg-gradient-to-r from-stage/90 via-stage/35 to-transparent lg:block" />
      <button
        type="button"
        onClick={() => setChoice(!playing)}
        aria-label={playing ? pause : play}
        title={playing ? pause : play}
        className="absolute top-3 right-3 z-10 grid size-9 place-items-center rounded-full bg-stage/60 text-ink/80 ring-1 ring-white/15 backdrop-blur-sm transition-colors outline-none hover:bg-stage/80 hover:text-ink focus-visible:ring-3 focus-visible:ring-ring/50 lg:top-auto lg:right-5 lg:bottom-5"
      >
        {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
      </button>
    </div>
  );
}
