import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ToolFigure } from "@/components/tool-figure";
import { LEARN_ITEMS, PRACTICE_ITEMS, SETUP_ITEMS } from "@/components/tool-menu";
import { FEATURES, FEATURE_TOOL, featurePath, type Side } from "@/lib/features";
import type { Strings } from "@/lib/i18n";

const SIDES: Side[] = ["learn", "practice", "setup"];

/**
 * The landing's "Inside" section: the three sides of the app, each with its tools as cards. A
 * card shows a still of the tool and leads to the tool's own public page; its "Open" button goes
 * straight into the tool. Beside each side, what is coming to it (from the app's menus, so the
 * two stay in step).
 */
export function FeatureCards({ t }: { t: Strings }) {
  const menus = { learn: t.learnMenu, practice: t.practiceMenu, setup: t.setupMenu };
  const items = { learn: LEARN_ITEMS, practice: PRACTICE_ITEMS, setup: SETUP_ITEMS };
  return (
    <div className="mt-12 grid grid-cols-1 gap-14">
      {SIDES.map((side) => {
        const coming = menus[side].modes.map((m, i) => ({ title: m.title, when: items[side][i].when })).filter((m) => m.when !== "now");
        const groups = [
          { name: t.home.next, chip: "border-amber/40 text-amber-text", list: coming.filter((m) => m.when === "next") },
          { name: t.home.later, chip: "border-line text-dim", list: coming.filter((m) => m.when === "later") },
        ].filter((g) => g.list.length);
        return (
          <div key={side} className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr] lg:gap-10">
            <div>
              <h3 className="font-display text-3xl font-semibold">{t.nav.areas[side]}</h3>
              <p className="mt-2 text-dim">{menus[side].lede}</p>
              {groups.map((g) => (
                <div key={g.name} className="mt-5">
                  <p className="text-xs font-semibold tracking-wide text-dim uppercase">{g.name}</p>
                  <ul className="mt-2 flex flex-wrap gap-1.5">
                    {g.list.map((m) => (
                      <li key={m.title} className={`rounded-full border px-2.5 py-0.5 text-xs ${g.chip}`}>
                        {m.title}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {FEATURES.map((id, i) => {
                if (FEATURE_TOOL[id].side !== side) return null;
                const tool = t.tools.items[i];
                const page = featurePath(t, id);
                return (
                  <li
                    key={id}
                    className="flex min-w-0 flex-col rounded-2xl border border-line bg-stage p-4 transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-amber/60 motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:p-5"
                  >
                    <Link href={page} className="flex min-w-0 flex-1 flex-col rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
                      <ToolFigure id={id} t={t} />
                      <span className="mt-4 font-display text-xl font-semibold">{tool.title}</span>
                      <span className="mt-1.5 flex-1 text-sm text-dim">{tool.body}</span>
                    </Link>
                    <div className="mt-4 flex items-center justify-between gap-3">
                      {/* The card above is already this link; this one is for the eye. */}
                      <Link href={page} aria-hidden tabIndex={-1} className="flex items-center gap-1.5 text-sm font-semibold text-ink hover:text-amber-text">
                        {t.features.more} <ArrowRight className="size-4" />
                      </Link>
                      <Link
                        href={`${t.base}${FEATURE_TOOL[id].href}`}
                        aria-label={`${t.tools.open}: ${tool.title}`}
                        className="inline-flex h-9 items-center rounded-lg border border-amber/50 px-3.5 text-sm font-semibold text-amber-text outline-none transition-colors hover:bg-amber/10 focus-visible:ring-3 focus-visible:ring-ring/50"
                      >
                        {t.tools.open}
                      </Link>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
