"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { LangSwitch } from "@/components/lang-switch";
import { OpenApp } from "@/components/open-app";
import type { Strings } from "@/lib/i18n";

/** The same page in the other language: every page has an /es twin, the app included. */
export function otherLangPath(pathname: string, t: Strings): string {
  if (t.otherLang === "es") return pathname === "/" ? "/es" : `/es${pathname}`;
  return pathname.replace(/^\/es(?=\/|$)/, "") || "/";
}

/**
 * The bar at the top of the web pages (the landing, each tool's public page and the privacy
 * page): the logo, the landing's sections, EN/ES and "Open the app". `other` is the same page in
 * the other language when its address is not simply the /es twin (the tool pages, whose slug is
 * translated). The app has its own navigation, components/app-nav.tsx.
 */
export function SiteNav({ t, other }: { t: Strings; other?: string }) {
  const pathname = usePathname() ?? "/";
  const home = t.base || "/";

  return (
    <header className="site-nav sticky top-0 z-30 border-b border-line/80 bg-stage/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-4 px-4">
        <Link href={home} aria-label="Diesis" className="shrink-0">
          <Logo />
        </Link>

        <div className="flex shrink-0 items-center gap-1">
          <Button asChild variant="ghost" size="sm" className="hidden text-dim hover:bg-white/5 hover:text-ink sm:inline-flex">
            <a href={`${home}#tools`}>{t.nav.tools}</a>
          </Button>
          <Button asChild variant="ghost" size="sm" className="hidden text-dim hover:bg-white/5 hover:text-ink sm:inline-flex">
            <a href={`${home}#maker`}>{t.maker.eyebrow}</a>
          </Button>
          <Button asChild variant="ghost" size="sm" className="hidden text-dim hover:bg-white/5 hover:text-ink sm:inline-flex">
            <a href={`${home}#faq`}>{t.nav.faq}</a>
          </Button>
          <LangSwitch t={t} next={other ?? otherLangPath(pathname, t)} className="ml-2" />
          <Button asChild size="sm" className="ml-2">
            <OpenApp lang={t.code}>
              {t.nav.cta} <ArrowRight className="size-4" />
            </OpenApp>
          </Button>
        </div>
      </div>
    </header>
  );
}
