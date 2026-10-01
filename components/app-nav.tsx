"use client";

import { useEffect, useSyncExternalStore, type ComponentType, type SVGProps } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, ChevronLeft, Ear, Gauge, Guitar, Hand, Headphones, Metronome, Music2, NotebookPen, PanelLeft, Ruler, Search, SlidersHorizontal, UserRound, Wrench } from "lucide-react";
import { Feedback } from "@/components/feedback";
import { LangSwitch } from "@/components/lang-switch";
import { Logo, LogoMark } from "@/components/logo";
import { otherLangPath } from "@/components/site-nav";
import type { Strings } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type Icon = ComponentType<{ className?: string; strokeWidth?: number | string }>;

/** A slice of fretboard: strings across, frets down. Drawn like the lucide icons beside it. */
function NeckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden {...props}>
      <rect x="2" y="7" width="20" height="10" rx="1.5" />
      <path d="M7 7v10M12 7v10M17 7v10M2 10.5h20M2 13.5h20" />
    </svg>
  );
}

type Side = "learn" | "practice" | "setup";

/**
 * The three sides and their tools. Names come from lib/i18n.ts in the same order: `nav.areas`,
 * `nav.learnTools` / `practiceTools` / `setupTools` for the built tools, `nav.learnSoon` /
 * `setupSoon` for the ones shown dimmed as coming next. A new tool gets a line here.
 */
const SIDES: { id: Side; icon: Icon; tools: { href: string; icon: Icon }[]; soon: Icon[] }[] = [
  {
    id: "learn",
    icon: BookOpen,
    tools: [
      { href: "/learn/name-the-note", icon: Music2 },
      { href: "/learn/find-the-note", icon: Search },
    ],
    soon: [Ear],
  },
  {
    id: "practice",
    icon: Guitar,
    tools: [
      { href: "/practice/neck", icon: NeckIcon },
      { href: "/practice/metronome", icon: Metronome },
      { href: "/practice/backing-tracks", icon: Headphones },
      { href: "/practice/fingers", icon: Hand },
    ],
    soon: [],
  },
  {
    id: "setup",
    icon: Wrench,
    tools: [
      { href: "/setup/strings", icon: SlidersHorizontal },
      { href: "/setup/tuner", icon: Gauge },
    ],
    soon: [Ruler, Guitar],
  },
];

function toolNames(t: Strings): Record<Side, { tools: string[]; soon: string[] }> {
  return {
    learn: { tools: t.nav.learnTools, soon: t.nav.learnSoon },
    practice: { tools: t.nav.practiceTools, soon: [] },
    setup: { tools: t.nav.setupTools, soon: t.nav.setupSoon },
  };
}

/* Open or collapsed is an attribute on <html>, so the width is right before React wakes up: the
   root layout's inline script sets it from localStorage on load, the toggle keeps both in step.
   The `rail:` variant in globals.css reads it. */
const SIDEBAR_KEY = "diesis_sidebar";
const SIDEBAR_EVENT = "diesis:sidebar";

function subscribe(onChange: () => void) {
  window.addEventListener(SIDEBAR_EVENT, onChange);
  return () => window.removeEventListener(SIDEBAR_EVENT, onChange);
}
const isCollapsed = () => document.documentElement.dataset.sidebar === "collapsed";

function setCollapsed(next: boolean) {
  if (next) document.documentElement.dataset.sidebar = "collapsed";
  else delete document.documentElement.dataset.sidebar;
  try {
    window.localStorage.setItem(SIDEBAR_KEY, next ? "collapsed" : "open");
  } catch {
    // Private mode: it still works until the next load.
  }
  window.dispatchEvent(new Event(SIDEBAR_EVENT));
}

const row =
  "group/row relative flex h-9.5 shrink-0 items-center gap-3 rounded-[0.625rem] px-2.5 text-left text-sm outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 rail:mx-auto rail:w-11 rail:justify-center rail:px-0";
const idle = "text-dim hover:bg-white/5 hover:text-ink";
const lit = "bg-amber/15 font-semibold text-amber-text";
/* The name of a row. On the rail it becomes the row's tooltip, shown on hover and keyboard focus. */
const label =
  "min-w-0 flex-1 truncate rail:pointer-events-none rail:absolute rail:left-full rail:z-50 rail:ml-2.5 rail:flex-none rail:rounded-lg rail:border rail:border-line rail:bg-surface-raised rail:px-2.5 rail:py-1.5 rail:text-xs rail:font-medium rail:text-ink rail:opacity-0 rail:shadow-[0_8px_24px_rgba(0,0,0,0.45)] rail:group-hover/row:opacity-100 rail:group-focus-visible/row:opacity-100";
const glyph = "size-[1.125rem] shrink-0";

/**
 * The app's navigation from `md` up (Will, 2026-09-30: a left sidebar "like Toggl, but properly
 * done"): the practice log on top, which is on no side, then every tool under its side, the
 * current one lit, the ones coming next dimmed; feedback, the profile and the language at the
 * bottom. It collapses to a rail of icons with the names as
 * tooltips: by the button or the [ key from `lg` (remembered in localStorage `diesis_sidebar`),
 * and always between `md` and `lg`, where the screen needs the width. Phones get `AppTopBar`
 * and `TabBar` instead. While an exercise is played on a short screen globals.css hides all
 * three (`.app-nav`), like the consent banner.
 */
export function AppSidebar({ t }: { t: Strings }) {
  const pathname = usePathname() ?? "/";
  const collapsed = useSyncExternalStore(subscribe, isCollapsed, () => false);
  const names = toolNames(t);
  const profile = `${t.base}/profile`;
  const log = `${t.base}/log`;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "[" || e.metaKey || e.ctrlKey || e.repeat) return;
      if (e.target instanceof Element && e.target.closest("input, textarea, select, [contenteditable]")) return;
      if (!window.matchMedia("(min-width: 64rem)").matches) return;
      setCollapsed(!isCollapsed());
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const toggleName = collapsed ? t.nav.expand : t.nav.collapse;

  return (
    <aside className="app-nav sticky top-0 z-30 hidden h-dvh w-61 shrink-0 flex-col border-r border-line/80 bg-surface/40 transition-[width] duration-200 motion-reduce:transition-none md:flex rail:w-16">
      <div className="flex h-14 shrink-0 items-center justify-between pr-2 pl-4 rail:h-auto rail:flex-col rail:gap-1.5 rail:px-0 rail:pt-3">
        <Link href={`${t.base}/start`} aria-label="Diesis" className="rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
          <Logo className="rail:hidden" />
          <LogoMark size={32} className="hidden rounded-[22%] ring-1 ring-white/10 rail:block" />
        </Link>
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={toggleName}
          aria-expanded={!collapsed}
          title={`${toggleName} · [`}
          className="hidden size-9 items-center justify-center rounded-lg text-dim outline-none transition-colors hover:bg-white/5 hover:text-ink focus-visible:ring-3 focus-visible:ring-ring/50 lg:flex"
        >
          <PanelLeft className={glyph} strokeWidth={1.75} aria-hidden />
        </button>
      </div>

      <nav
        aria-label={t.home.title}
        className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-3 py-2 [scrollbar-width:none] rail:gap-0 rail:overflow-visible rail:px-0 [@media(max-height:42rem)]:rail:overflow-y-auto"
      >
        <Link href={log} aria-current={pathname === log ? "page" : undefined} className={cn(row, pathname === log ? lit : idle)}>
          <NotebookPen className={glyph} strokeWidth={1.75} aria-hidden />
          <span className={label}>{t.log.title}</span>
        </Link>
        {SIDES.map((side) => {
          const menu = `${t.base}/${side.id}`;
          return (
            <div key={side.id} className="flex flex-col gap-0.5">
              <Link
                href={menu}
                aria-current={pathname === menu ? "page" : undefined}
                className={cn(
                  "mb-0.5 self-start rounded-md px-2.5 py-0.5 text-[0.6875rem] font-semibold tracking-[0.08em] uppercase outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 rail:hidden",
                  pathname === menu ? "text-amber-text" : "text-dim/80 hover:text-ink",
                )}
              >
                {t.nav.areas[side.id]}
              </Link>
              <span className="mx-auto my-2 hidden h-px w-7 bg-line rail:block" aria-hidden />
              {side.tools.map(({ href: path, icon: ToolIcon }, n) => {
                const href = `${t.base}${path}`;
                const on = pathname.startsWith(href);
                return (
                  <Link key={href} href={href} aria-current={on ? "page" : undefined} className={cn(row, on ? lit : idle)}>
                    <ToolIcon className={glyph} strokeWidth={1.75} />
                    <span className={label}>{names[side.id].tools[n]}</span>
                  </Link>
                );
              })}
              {side.soon.map((SoonIcon, n) => (
                <div key={n} aria-disabled className={cn(row, "text-dim/75")}>
                  <SoonIcon className={glyph} strokeWidth={1.75} />
                  <span className={label}>
                    {names[side.id].soon[n]}
                    <span className="hidden rail:inline"> · {t.nav.soon}</span>
                  </span>
                  <span className="rounded-full border border-line px-1.5 py-px text-[0.6875rem] rail:hidden">{t.nav.soon}</span>
                </div>
              ))}
            </div>
          );
        })}
      </nav>

      <div className="flex shrink-0 flex-col gap-0.5 border-t border-line/80 p-3 rail:items-center rail:px-0">
        <Feedback t={t} variant="side" className={cn(row, idle)} labelClassName={label} />
        <div className="flex items-center gap-1 rail:flex-col rail:gap-2">
          <Link href={profile} aria-current={pathname === profile ? "page" : undefined} className={cn(row, "flex-1 rail:flex-none", pathname === profile ? lit : idle)}>
            <UserRound className={glyph} strokeWidth={1.75} aria-hidden />
            <span className={label}>{t.profile.title}</span>
          </Link>
          <LangSwitch t={t} next={otherLangPath(pathname, t)} />
        </div>
      </div>
    </aside>
  );
}

/** On a phone, the bar at the top: inside a tool, the way back to its side and the tool's name; anywhere else the logo. Feedback and the language on the right. */
export function AppTopBar({ t }: { t: Strings }) {
  const pathname = usePathname() ?? "/";
  const names = toolNames(t);
  let here: { side: Side; name: string } | null = null;
  for (const side of SIDES) {
    const n = side.tools.findIndex(({ href }) => pathname.startsWith(`${t.base}${href}`));
    if (n >= 0) here = { side: side.id, name: names[side.id].tools[n] };
  }

  return (
    <header className="app-nav sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between gap-3 border-b border-line/80 bg-stage/85 px-4 backdrop-blur-md md:hidden">
      {here ? (
        <div className="flex min-w-0 items-center">
          <Link
            href={`${t.base}/${here.side}`}
            aria-label={t.nav.areas[here.side]}
            className="-ml-3 flex size-11 shrink-0 items-center justify-center rounded-lg text-dim outline-none hover:text-ink focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <ChevronLeft className="size-6" aria-hidden />
          </Link>
          <p className="truncate font-display text-lg font-semibold tracking-tight">{here.name}</p>
        </div>
      ) : (
        <Link href={`${t.base}/start`} aria-label="Diesis" className="shrink-0">
          <Logo />
        </Link>
      )}
      <div className="flex shrink-0 items-center gap-1">
        <Feedback t={t} variant="bar" />
        <LangSwitch t={t} next={otherLangPath(pathname, t)} className="ml-1" />
      </div>
    </header>
  );
}

/** On a phone, the bar at the bottom, like an iPhone app's (Will, 2026-09-30, as in Tabula): the three sides, the practice log and the profile. A side's tools are on its menu. */
export function TabBar({ t }: { t: Strings }) {
  const pathname = usePathname() ?? "/";
  const tabs = [
    ...SIDES.map((side) => ({ href: `${t.base}/${side.id}`, name: t.nav.areas[side.id], icon: side.icon })),
    { href: `${t.base}/log`, name: t.log.tab, icon: NotebookPen as Icon },
    { href: `${t.base}/profile`, name: t.profile.title, icon: UserRound as Icon },
  ];
  return (
    <nav aria-label={t.home.title} className="app-nav fixed inset-x-0 bottom-0 z-30 border-t border-line/80 bg-stage/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden">
      <ul className="mx-auto grid max-w-lg grid-cols-5">
        {tabs.map(({ href, name, icon: TabIcon }) => {
          const on = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={pathname === href ? "page" : on ? "true" : undefined}
                className={cn(
                  "flex h-16 flex-col items-center justify-center gap-1 text-xs font-medium outline-none transition-colors focus-visible:bg-white/5",
                  on ? "text-amber-text" : "text-dim active:text-ink",
                )}
              >
                <TabIcon className="size-6" strokeWidth={on ? 2.25 : 1.75} />
                {name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
