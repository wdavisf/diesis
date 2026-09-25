import { useCallback, useSyncExternalStore } from "react";
import { decodeSpeed, encodeSpeed, type SpeedPlan } from "@/lib/core/speed";

const KEY = "diesis_speed";
const CHANGED = "diesis-speed";

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

/** The speed trainer's plan, kept in this browser only (localStorage `diesis_speed`, never sent). */
export function useSpeedPlan() {
  const plan = decodeSpeed(useSyncExternalStore(subscribe, read, () => null));
  const set = useCallback((patch: Partial<SpeedPlan>) => {
    try {
      window.localStorage.setItem(KEY, encodeSpeed({ ...decodeSpeed(read()), ...patch }));
    } catch {
      // Blocked storage: nothing to keep.
    }
    window.dispatchEvent(new Event(CHANGED));
  }, []);
  return { plan, set };
}
