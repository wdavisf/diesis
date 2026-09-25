"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { LangSwitch } from "@/components/lang-switch";
import { OpenApp } from "@/components/open-app";
import type { Strings } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/** The tools, in the order of `nav.tools` in lib/i18n.ts. */
export const TOOL_HREFS = ["/learn", "/learn/name-the-note", "/learn/find-the-note", "/learn/metronome"] as const;

/** The same page in the other language: the web has /es twins; the app keeps its path (the
 *  language lives in a cookie there). */
function otherLangPath(pathname: string, t: Strings): string {
  if (pathname.startsWith("/learn")) return pathname;
  if (t.otherLang === "es") return pathname === "/" ? "/es" : `/es${pathname}`;
  return pathname.replace(/^\/es(?=\/|$)/, "") || "/";
}

const link = "inline-flex h-8 shrink-0 items-center rounded-lg px-3 text-sm whitespace-nowrap transition-colors";

/**
 * The one bar at the top of every page, web and app alike: the logo (back to the landing), then
 * on the web the page sections and "Open the app", in the app the tools with the current one
 * lit. On a phone the tools drop to a second row that scrolls sideways. While an exercise is
 * being played sideways on a phone, or on a short screen, globals.css hides it (`.site-nav`).
 */
export function SiteNav({ t, area }: { t: Strings; area: "site" | "app" }) {
  const pathname = usePathname() ?? "/";
  const home = t.base || "/";
  const row = useRef<HTMLElement>(null);
  // On a phone the tools row scrolls: bring the current tool into view.
  useEffect(() => {
    row.current?.querySelector<HTMLElement>('[aria-current="page"]')?.scrollIntoView({ block: "nearest", inline: "center" });
  }, [pathname]);
  const tools = TOOL_HREFS.map((href, i) => {
    const on = href === "/learn" ? pathname === "/learn" : pathname.startsWith(href);
    return (
      <Link
        key={href}
        href={href}
        aria-current={on ? "page" : undefined}
        className={cn(link, on ? "bg-surface-raised font-medium text-ink" : "text-dim hover:bg-white/5 hover:text-ink")}
      >
        {t.nav.tools[i]}
      </Link>
    );
  });

  return (
    <header className="site-nav sticky top-0 z-30 border-b border-line/80 bg-stage/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-4 px-4">
        <Link href={home} aria-label="Diesis" className="shrink-0">
          <Logo />
        </Link>

        {area === "app" ? (
          <nav aria-label={t.home.title} className="hidden min-w-0 flex-1 items-center gap-1 overflow-x-auto md:flex">
            {tools}
          </nav>
        ) : null}

        <div className="flex shrink-0 items-center gap-1">
          {area === "site" ? (
            <>
              <Button asChild variant="ghost" size="sm" className="hidden text-dim hover:bg-white/5 hover:text-ink sm:inline-flex">
                <a href={`${home}#how`}>{t.nav.how}</a>
              </Button>
              <Button asChild variant="ghost" size="sm" className="hidden text-dim hover:bg-white/5 hover:text-ink sm:inline-flex">
                <a href={`${home}#learn`}>{t.nav.learn}</a>
              </Button>
              <Button asChild variant="ghost" size="sm" className="hidden text-dim hover:bg-white/5 hover:text-ink sm:inline-flex">
                <a href={`${home}#faq`}>{t.nav.faq}</a>
              </Button>
            </>
          ) : null}
          <LangSwitch t={t} next={otherLangPath(pathname, t)} className="ml-2" />
          {area === "site" ? (
            <Button asChild size="sm" className="ml-2">
              <OpenApp lang={t.code}>
                {t.nav.cta} <ArrowRight className="size-4" />
              </OpenApp>
            </Button>
          ) : null}
        </div>
      </div>

      {area === "app" ? (
        <nav ref={row} aria-label={t.home.title} className="flex gap-1 overflow-x-auto px-3 pb-2 [scrollbar-width:none] md:hidden">
          {tools}
        </nav>
      ) : null}
    </header>
  );
}
