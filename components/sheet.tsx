"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { primary } from "@/components/challenge-card";
import { cn } from "@/lib/utils";

/**
 * A panel of settings in a native <dialog>: a sheet that rises from the bottom on a phone, a
 * dialog in the middle from `sm`. Closes on Done, Escape or a tap outside it.
 */
export function Sheet({ open, onClose, title, head, done, children }: { open: boolean; onClose: () => void; title: string; head?: ReactNode; done: string; children: ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const id = useId();
  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog
      ref={dialog}
      aria-labelledby={id}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === dialog.current) onClose();
      }}
      className="mx-0 mt-auto mb-0 max-h-[92dvh] w-full max-w-full overflow-y-auto rounded-t-[1.75rem] border border-b-0 border-line bg-surface p-0 text-ink backdrop:bg-black/60 open:animate-in open:fade-in open:slide-in-from-bottom-6 open:duration-200 motion-reduce:animate-none sm:m-auto sm:w-[26rem] sm:rounded-3xl sm:border-b"
    >
      <div className="flex flex-col gap-4 px-5 pt-3 pb-[max(1.75rem,env(safe-area-inset-bottom))] sm:p-6">
        <span className="mx-auto h-1.5 w-10 rounded-full bg-line sm:hidden" aria-hidden />
        <div className="flex items-center justify-between gap-4">
          <h2 id={id} className="font-display text-2xl font-semibold">
            {title}
          </h2>
          {head}
        </div>
        {children}
        <button type="button" onClick={onClose} className={cn(primary, "mt-1 h-14 w-full rounded-2xl")}>
          {done}
        </button>
      </div>
    </dialog>
  );
}
