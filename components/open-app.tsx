"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { LANG_COOKIE, type Lang } from "@/lib/i18n";

/**
 * "Open the app": a client-side navigation to /app (prefetched, no full page load) that also
 * stores the language the visitor was reading in, so the app comes up in it. This replaces the
 * `/lang/<code>?next=/app` redirect hop the landing used, which cost a round trip and a white
 * flash on every tap. The language switch itself still goes through `/lang`.
 */
export function OpenApp({ lang, onClick, ...props }: Omit<ComponentProps<typeof Link>, "href"> & { lang: Lang }) {
  return (
    <Link
      href="/learn"
      onClick={(e) => {
        document.cookie = `${LANG_COOKIE}=${lang}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
        onClick?.(e);
      }}
      {...props}
    />
  );
}
