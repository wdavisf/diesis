import { useEffect, useState, useSyncExternalStore } from "react";

const REDUCED = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const query = window.matchMedia(REDUCED);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/**
 * A counter that goes up every `ms` while `active`, to move the picture of an exercise on its
 * setup screen. Null under Reduce Motion: the caller shows a still instead.
 */
export function useDemoTick(ms: number, active: boolean): number | null {
  const reduced = useSyncExternalStore(subscribe, () => window.matchMedia(REDUCED).matches, () => true);
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (reduced || !active) return;
    const id = setInterval(() => setTick((t) => t + 1), ms);
    return () => clearInterval(id);
  }, [reduced, active, ms]);
  return reduced ? null : tick;
}
