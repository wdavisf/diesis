"use client";

import { useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { strings, type Lang } from "@/lib/i18n";

export const GA_ID = "G-HNHYBR8Y13";
// PostHog project key and region. The key is public by design (it ships in the page), like the
// GA id. Empty: PostHog is never loaded.
const POSTHOG_KEY = "phc_km9vkzJTUSRa845ErLb9ZkYvAYwAZssQrDGMLEpwZi4Y";
const POSTHOG_HOST = "https://eu.i.posthog.com";
const COOKIE = "diesis_consent";
// A plain "yes" answered the banner that named only Google (to 0.26.x): it no longer counts, so
// those visitors are asked again now that PostHog is in it. A "no" still stands.
const YES = "yes2";

type Answer = "yes" | "no";
type State = Answer | "ask" | "unknown";

const listeners = new Set<() => void>();
function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
function readConsent(): State {
  const m = document.cookie.match(/(?:^|; )diesis_consent=(yes2|no)(?:;|$)/);
  return m ? (m[1] === YES ? "yes" : "no") : "ask";
}
function readLang(): Lang {
  return document.cookie.match(/(?:^|; )diesis_lang=(en|es)/)?.[1] === "es" ? "es" : "en";
}
function writeConsent(v: Answer) {
  document.cookie = `${COOKIE}=${v === "yes" ? YES : v}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`;
  listeners.forEach((l) => l());
}

/** Google Analytics and PostHog behind a yes/no banner. Nothing from either loads until the
 *  visitor says yes; the answer is kept in a cookie for a year. Server render shows nothing
 *  (state "unknown"). */
export function Consent() {
  const state = useSyncExternalStore(subscribe, readConsent, () => "unknown" as State);
  const cookieLang = useSyncExternalStore(subscribe, readLang, () => "en" as Lang);
  const pathname = usePathname();

  // PostHog: page views (every tool is a page), how long they last and how fast they load
  // (web vitals), to see which tools get used. The library itself is only downloaded after a yes. Anonymous (no person profiles), its
  // id in local storage rather than a cookie. Clicks, heatmaps and session recordings are off
  // here whatever the PostHog project's settings say: the privacy page promises exactly this, so
  // change the two together.
  useEffect(() => {
    if (state !== "yes" || !POSTHOG_KEY) return;
    void import("posthog-js").then(({ default: posthog }) => {
      if (posthog.__loaded) return;
      posthog.init(POSTHOG_KEY, {
        api_host: POSTHOG_HOST,
        defaults: "2026-08-30",
        person_profiles: "identified_only",
        persistence: "localStorage",
        autocapture: false,
        capture_heatmaps: false,
        capture_dead_clicks: false,
        disable_session_recording: true,
      });
    });
  }, [state]);

  const lang: Lang = pathname === "/es" || pathname.startsWith("/es/") ? "es" : cookieLang;
  const t = strings[lang].consent;
  const privacyHref = `${strings[lang].base}/privacy`;
  // On the exercise and tool screens the controls sit low, so the banner goes to the top there.
  const inGame = /^(\/es)?\/(learn|practice)\//.test(pathname);

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
          data-game={inGame || undefined}
          className={`consent-banner fixed inset-x-3 z-40 mx-auto flex max-w-xl flex-wrap items-center gap-3 rounded-2xl border border-line bg-surface p-4 text-sm shadow-[0_20px_50px_rgba(0,0,0,0.5)] ${inGame ? "top-14" : "bottom-3"}`}
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
