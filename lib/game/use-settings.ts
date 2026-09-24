import { useCallback, useSyncExternalStore } from "react";
import type { NameStyle } from "@/lib/core/notes";

const NAMES_KEY = "diesis_names";
const NATURALS_KEY = "diesis_naturals";
const CHANGED = "diesis-settings";

function read(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Private windows and blocked storage: the choice lasts for this page only.
  }
  window.dispatchEvent(new Event(CHANGED));
}

function subscribe(onChange: () => void) {
  window.addEventListener(CHANGED, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGED, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export interface Settings {
  /** Letters (C D E) or solfège (Do Re Mi) on the buttons, the board and the prompts. */
  names: NameStyle;
  setNames: (style: NameStyle) => void;
  /** Ask only C D E F G A B positions. */
  naturalsOnly: boolean;
  setNaturalsOnly: (on: boolean) => void;
}

/**
 * The settings picked on the start card, kept in this browser only (localStorage, never sent).
 * Note names default to solfège in the Spanish UI and to letters in English until changed.
 */
export function useSettings(defaultNames: NameStyle): Settings {
  const namesRaw = useSyncExternalStore(subscribe, () => read(NAMES_KEY), () => null);
  const naturalsRaw = useSyncExternalStore(subscribe, () => read(NATURALS_KEY), () => null);
  const names: NameStyle = namesRaw === "solfege" || namesRaw === "letters" ? namesRaw : defaultNames;
  const naturalsOnly = naturalsRaw === "yes";
  const setNames = useCallback((style: NameStyle) => write(NAMES_KEY, style), []);
  const setNaturalsOnly = useCallback((on: boolean) => write(NATURALS_KEY, on ? "yes" : "no"), []);
  return { names, setNames, naturalsOnly, setNaturalsOnly };
}
