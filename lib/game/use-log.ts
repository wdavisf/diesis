import { useCallback, useMemo, useSyncExternalStore } from "react";
import { decodeLog, encodeLog, localDay, withEntry, withGoal, type Day, type LogGoal, type PracticeLog } from "@/lib/core/log";

const KEY = "diesis_log";
const CHANGED = "diesis-log";

/** With storage blocked (a private window), the log still works until the page is left. */
let unsaved: string | null = null;

function read(): string | null {
  if (unsaved !== null) return unsaved;
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

function write(log: PracticeLog) {
  const raw = encodeLog(log);
  try {
    window.localStorage.setItem(KEY, raw);
    unsaved = null;
  } catch {
    unsaved = raw;
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

/** The practice log: the goal and what was written each day, kept in this browser only
 *  (localStorage `diesis_log`, never sent). Every change is saved as it is made. */
export function usePracticeLog() {
  const raw = useSyncExternalStore(subscribe, read, () => null);
  const log = useMemo(() => decodeLog(raw), [raw]);
  const setEntry = useCallback((day: Day, text: string) => write(withEntry(decodeLog(read()), day, text)), []);
  const setGoal = useCallback((goal: LogGoal | null) => write(withGoal(decodeLog(read()), goal)), []);
  return { log, setEntry, setGoal };
}

function subscribeToday(onChange: () => void) {
  const timer = window.setInterval(onChange, 60_000);
  document.addEventListener("visibilitychange", onChange);
  return () => {
    window.clearInterval(timer);
    document.removeEventListener("visibilitychange", onChange);
  };
}
const today = () => localDay(new Date());

/** Today where the player is, null on the server (which does not know): it changes at midnight
 *  and when the tab comes back after one. */
export function useToday(): Day | null {
  return useSyncExternalStore(subscribeToday, today, () => null);
}
