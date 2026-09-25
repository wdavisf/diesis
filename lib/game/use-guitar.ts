import { useCallback, useSyncExternalStore } from "react";
import { stringsOf, tuningPreset, type TuningPreset } from "@/lib/core/notes";

const KEY = "diesis_guitar";
const CHANGED = "diesis-guitar";

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

export interface Guitar {
  preset: TuningPreset;
  /** String numbers 1…n. */
  strings: number[];
  setTuning: (id: string) => void;
}

/**
 * The player's guitar from the profile: the tuning preset, which also fixes the string count
 * (6, 7 or 8). Kept in this browser only (localStorage `diesis_guitar`, the preset id; never
 * sent). The exercises and the neck read it.
 */
export function useGuitar(): Guitar {
  const preset = tuningPreset(useSyncExternalStore(subscribe, read, () => null));
  const setTuning = useCallback((id: string) => {
    try {
      window.localStorage.setItem(KEY, id);
    } catch {
      // Blocked storage: the choice lasts for this page only.
    }
    window.dispatchEvent(new Event(CHANGED));
  }, []);
  return { preset, strings: stringsOf(preset.notes), setTuning };
}
