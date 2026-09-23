import { SHARP_NAMES, type PitchClass } from "@/lib/core/notes";
import { cn } from "@/lib/utils";

export interface NotePanelProps {
  onPick: (pc: PitchClass) => void;
  disabled: boolean;
  /** Button shown green. */
  correctPick: PitchClass | null;
  /** Button shown red. */
  wrongPick: PitchClass | null;
}

const ALL: PitchClass[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

/** One row of the twelve chromatic notes, sharps spelled with ♯. */
export function NotePanel({ onPick, disabled, correctPick, wrongPick }: NotePanelProps) {
  return (
    <div className="flex gap-2 px-3 sm:gap-2.5" role="group" aria-label="Note names">
      {ALL.map((pc) => {
        const state = pc === correctPick ? "correct" : pc === wrongPick ? "wrong" : "idle";
        return (
          <button
            key={pc}
            type="button"
            aria-label={SHARP_NAMES[pc]}
            disabled={disabled}
            onClick={() => onPick(pc)}
            className={cn(
              "h-14 min-w-11 flex-1 rounded-xl border border-line bg-surface text-xl font-semibold text-ink transition-colors select-none sm:h-16 sm:text-2xl",
              "outline-none focus-visible:ring-3 focus-visible:ring-ring/50 active:bg-surface-raised disabled:cursor-default",
              state === "correct" && "border-correct bg-correct",
              state === "wrong" && "flash-wrong border-wrong bg-wrong",
            )}
          >
            {SHARP_NAMES[pc]}
          </button>
        );
      })}
    </div>
  );
}
