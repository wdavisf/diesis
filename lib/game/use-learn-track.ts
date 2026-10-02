"use client";

import { useEffect, useSyncExternalStore } from "react";
import type { TrackId } from "@/lib/i18n";

/* Learn opens on the track you were in last (Will picked the design that remembers it, 2026-10-02).
   Kept in localStorage, never sent; "Erase my data" removes it with every other diesis_* key. */
const KEY = "diesis_learn_track";
const EVENT = "diesis:learn-track";
const TRACKS: readonly string[] = ["notes", "reading", "tab"] satisfies TrackId[];

function read(): TrackId | null {
  try {
    const v = window.localStorage.getItem(KEY);
    return v && TRACKS.includes(v) ? (v as TrackId) : null;
  } catch {
    return null;
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/** Where a link to Learn should go: the page of the track opened last, the first track before that (and before the page has loaded). */
export function useLearnPath(base: string): string {
  const id = useSyncExternalStore(subscribe, read, () => null);
  return `${base}/learn/${id ?? "notes"}`;
}

/** Remembers the track whose page is open. */
export function useRememberTrack(id: TrackId) {
  useEffect(() => {
    try {
      window.localStorage.setItem(KEY, id);
    } catch {
      // Storage blocked: Learn opens on the first track, which is fine.
    }
    window.dispatchEvent(new Event(EVENT));
  }, [id]);
}
