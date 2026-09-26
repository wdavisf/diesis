import { useCallback, useSyncExternalStore } from "react";
import { decodeStrings, type StringsSettings } from "@/lib/core/strings";

const KEY = "diesis_strings";
const CHANGED = "diesis-strings";

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

/** The strings page's choices (guitar type, scale length, gauges per string count), kept in
 *  this browser only (localStorage `diesis_strings`, never sent). */
export function useStrings() {
  const settings = decodeStrings(useSyncExternalStore(subscribe, read, () => null));
  const set = useCallback((patch: Partial<StringsSettings>) => {
    try {
      window.localStorage.setItem(KEY, JSON.stringify({ ...decodeStrings(read()), ...patch }));
    } catch {
      // Blocked storage: nothing to keep.
    }
    window.dispatchEvent(new Event(CHANGED));
  }, []);
  return { settings, set };
}
