"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { strings, type Lang } from "@/lib/i18n";

export const GA_ID = "G-HNHYBR8Y13";
const COOKIE = "diesis_consent";

type Answer = "yes" | "no";
type State = Answer | "ask" | "unknown";

const listeners = new Set<() => void>();
function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
function readConsent(): State {
  const m = document.cookie.match(/(?:^|; )diesis_consent=(yes|no)/);
  return m ? (m[1] as Answer) : "ask";
}
function readLang(): Lang {
  return document.cookie.match(/(?:^|; )diesis_lang=(en|es)/)?.[1] === "es" ? "es" : "en";
}
function writeConsent(v: Answer) {
  document.cookie = `${COOKIE}=${v}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`;
  listeners.forEach((l) => l());
}

/** Google Analytics behind a yes/no banner. Nothing from Google loads until the visitor says yes;
 *  the answer is kept in a cookie for a year. Server render shows nothing (state "unknown"). */
export function Consent() {
  const state = useSyncExternalStore(subscribe, readConsent, () => "unknown" as State);
  const cookieLang = useSyncExternalStore(subscribe, readLang, () => "en" as Lang);
  const pathname = usePathname();
  const lang: Lang = pathname === "/es" || pathname.startsWith("/es/") ? "es" : cookieLang;
  const t = strings[lang].consent;
  const privacyHref = `${strings[lang].base}/privacy`;

  return (
    <>
      {state === "yes" ? (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
          </Script>
        </>
      ) : null}
      {state === "ask" ? (
        <div
          role="dialog"
          aria-live="polite"
          className="fixed inset-x-3 bottom-3 z-40 mx-auto flex max-w-xl flex-wrap items-center gap-3 rounded-2xl border border-line bg-surface p-4 text-sm shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
        >
          <p className="min-w-0 flex-1 text-dim">
            {t.text}{" "}
            <Link href={privacyHref} className="text-ink underline underline-offset-4">
              {t.more}
            </Link>
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => writeConsent("no")}
              className="h-9 rounded-lg border border-line px-3 font-medium text-ink hover:bg-surface-raised"
            >
              {t.decline}
            </button>
            <button
              type="button"
              onClick={() => writeConsent("yes")}
              className="h-9 rounded-lg bg-amber px-3 font-semibold text-stage hover:bg-amber-text"
            >
              {t.accept}
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
