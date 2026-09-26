import type { PitchClass } from "@/lib/core/notes";
import { cn } from "@/lib/utils";

export interface NotePanelProps {
  onPick: (pc: PitchClass) => void;
  disabled: boolean;
  /** Button shown green. */
  correctPick: PitchClass | null;
  /** Button shown red. */
  wrongPick: PitchClass | null;
  label?: string;
  /** Twelve labels from C. */
  names: readonly string[];
  /** Which buttons to show; all twelve unless the round is naturals only. */
  pitchClasses?: readonly PitchClass[];
}

const ALL: PitchClass[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const NATURALS: PitchClass[] = [0, 2, 4, 5, 7, 9, 11];

/**
 * The note buttons as a column right of the board, where the thumb is (Will, 2026-09-26: a row
 * under the board was hard to reach). One row per natural, C at the top, its sharp beside it,
 * like a keyboard turned on its side; naturals only is a single column. Letters or solfège per language.
 */
export function NotePanel({ onPick, disabled, correctPick, wrongPick, label = "Note names", names, pitchClasses = ALL }: NotePanelProps) {
  const shown = new Set(pitchClasses);
  const sharps = NATURALS.some((pc) => shown.has(((pc + 1) % 12) as PitchClass) && !NATURALS.includes(((pc + 1) % 12) as PitchClass));

  const button = (pc: PitchClass) => {
    const state = pc === correctPick ? "correct" : pc === wrongPick ? "wrong" : "idle";
    return (
      <button
        key={pc}
        type="button"
        aria-label={names[pc]}
        disabled={disabled}
        onClick={() => onPick(pc)}
        className={cn(
          "min-h-0 w-14 rounded-xl border border-line bg-surface text-lg font-semibold text-ink transition-[transform,background-color,border-color] duration-150 select-none active:scale-95 motion-reduce:transition-none sm:w-16 sm:text-xl",
          "outline-none focus-visible:ring-3 focus-visible:ring-ring/50 active:bg-surface-raised disabled:cursor-default",
          state === "correct" && "border-correct bg-correct",
          state === "wrong" && "flash-wrong border-wrong bg-wrong",
        )}
      >
        {names[pc]}
      </button>
    );
  };

  return (
    <div className={cn("grid h-full grid-rows-7 gap-1.5", sharps ? "grid-cols-2" : "grid-cols-1")} role="group" aria-label={label}>
      {NATURALS.filter((pc) => shown.has(pc)).flatMap((pc) => {
        const sharp = ((pc + 1) % 12) as PitchClass;
        if (!sharps) return [button(pc)];
        return [button(pc), NATURALS.includes(sharp) || !shown.has(sharp) ? <span key={`gap-${pc}`} aria-hidden /> : button(sharp)];
      })}
    </div>
  );
}
