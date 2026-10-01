import { useCallback, useSyncExternalStore } from "react";
import { decodeZone, type ReadZone } from "@/lib/core/reading";

const KEY = "diesis_read_zone";
const CHANGED = "diesis-read-zone";

function read(): string | null {
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener(CHANGED, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGED, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/** The part of the neck the reading exercises ask from, by its highest fret. Kept in this browser only. */
export function useReadZone(): { zone: ReadZone; setZone: (zone: ReadZone) => void } {
  const zone = decodeZone(useSyncExternalStore(subscribe, read, () => null));
  const setZone = useCallback((z: ReadZone) => {
    try {
      window.localStorage.setItem(KEY, String(z));
    } catch {
      // Blocked storage: the choice lasts for this page only.
    }
    window.dispatchEvent(new Event(CHANGED));
  }, []);
  return { zone, setZone };
}
