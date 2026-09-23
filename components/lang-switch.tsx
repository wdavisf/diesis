import Link from "next/link";
import type { Strings } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/** EN/ES toggle. Goes through /lang/[code] so the cookie follows the visitor into the app. */
export function LangSwitch({ t, next, className }: { t: Strings; next: string; className?: string }) {
  return (
    <Link
      href={`/lang/${t.otherLang}?next=${encodeURIComponent(next)}`}
      hrefLang={t.otherLang}
      lang={t.otherLang}
      aria-label={t.otherName}
      className={cn(
        "inline-flex h-8 items-center rounded-lg border border-line bg-surface px-2.5 text-xs font-bold tracking-wider text-ink hover:bg-surface-raised",
        className,
      )}
    >
      {t.otherLabel}
    </Link>
  );
}
