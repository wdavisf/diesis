"use client";

import { useActionState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { MessageSquare, X } from "lucide-react";
import { sendFeedback, type FeedbackState } from "@/app/actions/feedback";
import { Button } from "@/components/ui/button";
import type { Strings } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const input =
  "w-full rounded-xl border border-line bg-stage px-3 py-2.5 text-base text-ink placeholder:text-dim/70 outline-none focus-visible:border-amber focus-visible:ring-3 focus-visible:ring-ring/40";

function guitarSetting() {
  try {
    return window.localStorage.getItem("diesis_guitar") ?? "";
  } catch {
    return "";
  }
}

/**
 * "Feedback": a button that opens a short form in a native <dialog> (name, what you need, an
 * optional email to be answered). The page, language and guitar go along as hidden fields.
 * `sendFeedback` emails it to Will through Resend; nothing is stored. `variant` picks the look:
 * an icon button in the app's top bar, a plain link in the footer.
 */
export function Feedback({ t, variant }: { t: Strings; variant: "bar" | "link" }) {
  const f = t.feedback;
  const dialog = useRef<HTMLDialogElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const guitar = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const [state, action, pending] = useActionState<FeedbackState, FormData>(sendFeedback, { status: "idle" });

  useEffect(() => {
    if (state.status === "sent") form.current?.reset();
  }, [state]);

  const open = () => dialog.current?.showModal();

  return (
    <>
      {variant === "bar" ? (
        <button
          type="button"
          onClick={open}
          aria-label={f.open}
          className="flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-sm text-dim outline-none transition-colors hover:bg-white/5 hover:text-ink focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <MessageSquare className="size-4" aria-hidden />
          <span className="hidden lg:inline">{f.open}</span>
        </button>
      ) : (
        <button type="button" onClick={open} className="hover:text-ink">
          {f.open}
        </button>
      )}

      <dialog
        ref={dialog}
        aria-labelledby="feedback-title"
        onClick={(e) => {
          if (e.target === dialog.current) dialog.current.close();
        }}
        className="m-auto w-[min(32rem,calc(100vw-2rem))] rounded-2xl border border-line bg-surface p-0 text-ink backdrop:bg-black/60 backdrop:backdrop-blur-sm"
      >
        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <h2 id="feedback-title" className="font-display text-2xl font-semibold">
              {state.status === "sent" ? f.sentTitle : f.title}
            </h2>
            <button type="button" onClick={() => dialog.current?.close()} aria-label={f.close} className="-m-1 rounded-lg p-1 text-dim hover:text-ink">
              <X className="size-5" />
            </button>
          </div>

          {state.status === "sent" ? (
            <>
              <p className="mt-3 text-dim">{f.sent}</p>
              <Button type="button" className="mt-6 h-11 px-5 text-base" onClick={() => dialog.current?.close()}>
                {f.close}
              </Button>
            </>
          ) : (
            <form ref={form} key={state.attempt ?? 0}
              action={action}
              onSubmit={() => {
                if (guitar.current) guitar.current.value = guitarSetting();
              }}
              className="mt-3"
            >
              <p className="text-dim">{f.lede}</p>
              <label className="mt-5 block text-sm font-medium">
                {f.name}
                <input name="name" defaultValue={state.values?.name} autoComplete="given-name" maxLength={100} className={cn(input, "mt-1.5")} />
              </label>
              <label className="mt-4 block text-sm font-medium">
                {f.message}
                <textarea name="message" defaultValue={state.values?.message} required rows={4} maxLength={4000} placeholder={f.messageHint} className={cn(input, "mt-1.5 resize-y")} />
              </label>
              <label className="mt-4 block text-sm font-medium">
                {f.contact} <span className="font-normal text-dim">{f.optional}</span>
                <input name="contact" defaultValue={state.values?.contact} type="email" autoComplete="email" maxLength={200} className={cn(input, "mt-1.5")} />
              </label>
              {/* Honeypot: hidden from people, filled in by bots. */}
              <input name="website" tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] size-px opacity-0" />
              <input type="hidden" name="page" value={pathname} />
              <input type="hidden" name="lang" value={t.code} />
              <input type="hidden" name="guitar" ref={guitar} />

              {state.status === "error" ? <p className="mt-4 text-sm text-wrong" role="alert">{f.error}</p> : null}
              {state.status === "empty" ? <p className="mt-4 text-sm text-wrong" role="alert">{f.empty}</p> : null}

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Button type="submit" disabled={pending} className="h-11 px-5 text-base">
                  {pending ? f.sending : f.send}
                </Button>
                <span className="text-xs text-dim">{f.privacy}</span>
              </div>
            </form>
          )}
        </div>
      </dialog>
    </>
  );
}
