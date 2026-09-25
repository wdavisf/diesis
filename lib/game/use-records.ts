import { useSyncExternalStore } from "react";
import { parseBest, sortBests, type Best } from "@/lib/core/records";

const PREFIX = "diesis_best:";

/** Every stored best as one string, so the snapshot is stable between renders. */
function snapshot(): string {
  try {
    const out: string[] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (k?.startsWith(PREFIX)) out.push(`${k.slice(PREFIX.length)}=${window.localStorage.getItem(k)}`);
    }
    return out.sort().join("\n");
  } catch {
    return "";
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

/** The personal bests kept in this browser (written by use-challenge), parsed and sorted. */
export function useRecords(): Best[] {
  const raw = useSyncExternalStore(subscribe, snapshot, () => "");
  const bests = raw
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const i = line.indexOf("=");
      return parseBest(line.slice(0, i), line.slice(i + 1));
    })
    .filter((b): b is Best => b !== null);
  return sortBests(bests);
}

/** Removes everything Diesis keeps in this browser's storage (bests, settings, the guitar). The
 *  language and consent cookies stay: they belong to the site, not to the player's data. */
export function eraseLocalData() {
  try {
    const keys: string[] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (k?.startsWith("diesis_")) keys.push(k);
    }
    keys.forEach((k) => window.localStorage.removeItem(k));
  } catch {
    // Nothing stored, or storage blocked: nothing to erase.
  }
}
