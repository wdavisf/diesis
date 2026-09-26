"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, RotateCw } from "lucide-react";
import type { Strings } from "@/lib/i18n";
import { cn } from "@/lib/utils";

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

/**
 * The shell every screen of a mode shares: a header with the way back. The setup screen uses it
 * upright, like any page. The play screen asks for `sideways`: on a phone held upright it is then
 * drawn rotated 90° (`.game-sideways` in globals.css) and swings into place as it arrives
 * (`.game-enter`), landscape whatever the rotation lock says; a web page cannot turn the phone
 * itself. Only a narrow desktop window sees the "widen it" gate, and only for play.
 */
export function GameShell({
  t,
  title,
  status,
  sideways = false,
  children,
}: {
  t: Strings["game"];
  title: string;
  status?: ReactNode;
  sideways?: boolean;
  children: ReactNode;
}) {
  const home = usePathname()?.startsWith("/es/") ? "/es/learn" : "/learn";
  return (
    <>
      {sideways ? (
        /* A narrow, tall window on a desktop: the neck needs the long side and there is nothing to rotate. */
        <div className="hidden flex-1 flex-col items-center justify-center gap-3 px-6 text-center max-md:portrait:pointer-fine:flex">
          <RotateCw className="size-10 text-amber" aria-hidden />
          <p className="text-xl font-semibold">{t.rotate}</p>
          <p className="text-sm text-dim">{t.rotateSub}</p>
        </div>
      ) : null}

      <div className={sideways ? "game-sideways game-enter flex flex-1 flex-col max-md:portrait:pointer-fine:hidden" : "flex flex-1 flex-col"}>
        {/* Upright screens are named by the top bar already; the header is for the exercise itself
            (its score or clock) and for the way out when the bar is hidden. */}
        <header className={cn("h-11 shrink-0 items-center justify-between gap-3 px-4", sideways || status ? "flex" : "hidden")}>
          <div className="flex min-w-0 items-center gap-3">
            {/* The top bar covers navigation; mid-exercise, when that bar is hidden, this is the way out. */}
            <Link href={home} className={cn("items-center gap-1 text-sm text-dim hover:text-ink", sideways ? "flex" : "hidden")} aria-label={t.back}>
              <ArrowLeft className="size-4" />
              <span className="hidden sm:inline">{t.back}</span>
            </Link>
            <h1 className="truncate text-base font-semibold">{title}</h1>
          </div>
          <div className="flex shrink-0 items-center gap-3 text-sm text-dim">{status}</div>
        </header>
        {children}
      </div>
    </>
  );
}

export interface GameFrameProps {
  t: Strings["game"];
  title: string;
  /** Right side of the header: score, clock or streak. */
  status: ReactNode;
  /** Draws the board at the measured size. */
  board: (size: { width: number; height: number }) => ReactNode;
  /** Laid over the board: the result card. */
  overlay?: ReactNode;
  /** Everything under the board. */
  children: ReactNode;
  /** A column right of the board, the full height of the screen: the note buttons. */
  aside?: ReactNode;
}

/** The play screen: the board filling the space it has, the controls underneath and, if given, a column on the right. */
export function GameFrame({ t, title, status, board, overlay, children, aside }: GameFrameProps) {
  const { ref, size } = useSize<HTMLDivElement>();
  return (
    <GameShell t={t} title={title} status={status} sideways>
      <div className="flex min-h-0 flex-1">
        <div className="flex min-w-0 flex-1 flex-col">
          <div ref={ref} className="relative mx-3 min-h-0 flex-1">
            {size.width > 0 ? board(size) : null}
            {overlay ? <div className="absolute inset-0 flex items-center justify-center overflow-auto py-1">{overlay}</div> : null}
          </div>
          {children}
        </div>
        {aside ? <div className="flex shrink-0 flex-col pr-3 pb-3 md:pb-4">{aside}</div> : null}
      </div>
    </GameShell>
  );
}
