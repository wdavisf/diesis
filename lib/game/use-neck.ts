import { useCallback, useSyncExternalStore } from "react";
import { decodeNeck, encodeNeck, type NeckSettings } from "@/lib/core/scales";

const KEY = "diesis_neck";
const CHANGED = "diesis-neck";

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

/** The neck explorer's choices (root, scale, labels, frets), kept in this browser only
 *  (localStorage `diesis_neck`, never sent). */
export function useNeck() {
  const settings = decodeNeck(useSyncExternalStore(subscribe, read, () => null));
  const set = useCallback((patch: Partial<NeckSettings>) => {
    try {
      window.localStorage.setItem(KEY, encodeNeck({ ...decodeNeck(read()), ...patch }));
    } catch {
      // Blocked storage: nothing to keep.
    }
    window.dispatchEvent(new Event(CHANGED));
  }, []);
  return { settings, set };
}
