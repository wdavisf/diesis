"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, RotateCw } from "lucide-react";
import type { Strings } from "@/lib/i18n";

function useSize<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width: Math.floor(width), height: Math.floor(height) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return { ref, size };
}

export interface GameFrameProps {
  t: Strings["game"];
  title: string;
  /** Right side of the header: score, clock or streak. */
  status: ReactNode;
  /** Draws the board at the measured size. */
  board: (size: { width: number; height: number }) => ReactNode;
  /** Laid over the board: start card, result card. */
  overlay?: ReactNode;
  /** Everything under the board. */
  children: ReactNode;
}

/**
 * The shell every game screen shares: a header with the way back, the board filling the space it
 * has, and the controls underneath. On a phone held upright the whole shell is drawn rotated 90°
 * (`.game-sideways` in globals.css), so the game is landscape whatever the rotation lock says; a
 * web page cannot turn the phone itself. Only a narrow desktop window sees the "widen it" gate.
 */
export function GameFrame({ t, title, status, board, overlay, children }: GameFrameProps) {
  const { ref, size } = useSize<HTMLDivElement>();
  return (
    <>
      {/* A narrow, tall window on a desktop: the neck needs the long side and there is nothing to rotate. */}
      <div className="hidden flex-1 flex-col items-center justify-center gap-3 px-6 text-center max-md:portrait:pointer-fine:flex">
        <RotateCw className="size-10 text-amber" aria-hidden />
        <p className="text-xl font-semibold">{t.rotate}</p>
        <p className="text-sm text-dim">{t.rotateSub}</p>
      </div>

      <div className="game-sideways flex flex-1 flex-col max-md:portrait:pointer-fine:hidden">
        <header className="flex h-11 items-center justify-between gap-3 px-4">
          <div className="flex min-w-0 items-center gap-3">
            <Link href="/app" className="flex items-center gap-1 text-sm text-dim hover:text-ink" aria-label={t.back}>
              <ArrowLeft className="size-4" />
              <span className="hidden sm:inline">{t.back}</span>
            </Link>
            <h1 className="truncate text-base font-semibold">{title}</h1>
          </div>
          <div className="flex shrink-0 items-center gap-3 text-sm text-dim">{status}</div>
        </header>

        <div ref={ref} className="relative mx-3 min-h-0 flex-1">
          {size.width > 0 ? board(size) : null}
          {overlay ? (
            <div className="absolute inset-0 flex items-center justify-center overflow-auto py-1">{overlay}</div>
          ) : null}
        </div>

        {children}
      </div>
    </>
  );
}
