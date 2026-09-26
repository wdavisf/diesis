"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { LangSwitch } from "@/components/lang-switch";
import { OpenApp } from "@/components/open-app";
import type { Strings } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/** The tools of each side, in the order of `nav.learnTools` and `nav.practiceTools` in lib/i18n.ts. */
export const LEARN_HREFS = ["/learn/name-the-note", "/learn/find-the-note"] as const;
export const PRACTICE_HREFS = ["/practice/neck", "/practice/metronome"] as const;

/** The same page in the other language: every page has an /es twin, the app included. */
function otherLangPath(pathname: string, t: Strings): string {
  if (t.otherLang === "es") return pathname === "/" ? "/es" : `/es${pathname}`;
  return pathname.replace(/^\/es(?=\/|$)/, "") || "/";
}

const link = "inline-flex h-8 shrink-0 items-center rounded-lg px-3 text-sm whitespace-nowrap transition-colors";

/**
 * The one bar at the top of every page, web and app alike: the logo (back to the landing), then
 * on the web the page sections and "Open the app"; in the app the two sides, Learn and Practice,
 * and the tools of the side you are on, the current one lit (on /start and /profile, the sides only). On a phone the tools drop to a second row that scrolls sideways. While an exercise is
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
  const inArea = (root: string) => pathname === `${t.base}${root}` || pathname.startsWith(`${t.base}${root}/`);
  const side = inArea("/learn") ? "learn" : inArea("/practice") ? "practice" : null;
  const areas = (["learn", "practice"] as const).map((a) => {
    const href = `${t.base}/${a}`;
    const on = side === a;
    return (
      <Link
        key={a}
        href={href}
        aria-current={pathname === href ? "page" : undefined}
        className={cn(link, "font-medium", on ? "bg-amber/15 text-amber-text" : "text-dim hover:bg-white/5 hover:text-ink")}
      >
        {t.nav.areas[a]}
      </Link>
    );
  });
  const hrefs = side === "learn" ? LEARN_HREFS : side === "practice" ? PRACTICE_HREFS : [];
  const names = side === "learn" ? t.nav.learnTools : t.nav.practiceTools;
  const tools = hrefs.map((path, i) => {
    const href = `${t.base}${path}`;
    const on = pathname.startsWith(href);
    return (
      <Link
        key={href}
        href={href}
        aria-current={on ? "page" : undefined}
        className={cn(link, on ? "bg-surface-raised font-medium text-ink" : "text-dim hover:bg-white/5 hover:text-ink")}
      >
        {names[i]}
      </Link>
    );
  });
  const bar = (
    <>
      {areas}
      {tools.length ? <span className="mx-1 h-5 w-px shrink-0 bg-line" aria-hidden /> : null}
      {tools}
    </>
  );

  return (
    <header className="site-nav sticky top-0 z-30 border-b border-line/80 bg-stage/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-4 px-4">
        <Link href={home} aria-label="Diesis" className="shrink-0">
          <Logo />
        </Link>

        {area === "app" ? (
          <nav aria-label={t.home.title} className="hidden min-w-0 flex-1 items-center gap-1 overflow-x-auto md:flex">
            {bar}
          </nav>
        ) : null}

        <div className="flex shrink-0 items-center gap-1">
          {area === "app" ? (
            <Link
              href={`${t.base}/profile`}
              aria-current={pathname === `${t.base}/profile` ? "page" : undefined}
              aria-label={t.profile.title}
              className={cn(link, "gap-1.5 px-2.5", pathname === `${t.base}/profile` ? "bg-surface-raised font-medium text-ink" : "text-dim hover:bg-white/5 hover:text-ink")}
            >
              <UserRound className="size-4" aria-hidden />
              <span className="hidden sm:inline">{t.profile.title}</span>
            </Link>
          ) : null}
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
          {bar}
        </nav>
      ) : null}
    </header>
  );
}
