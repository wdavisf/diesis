import Link from "next/link";
import { OpenApp } from "@/components/open-app";
import { Logo } from "@/components/logo";
import type { Strings } from "@/lib/i18n";

export function Footer({ t }: { t: Strings }) {
  const other = t.otherLang === "es" ? "/es" : "/";
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-8 text-sm text-dim">
        <div className="flex items-center gap-4">
          <Logo size="sm" />
          <span className="hidden sm:inline">{t.footer.tagline}</span>
        </div>
        <nav className="flex flex-wrap gap-x-5 gap-y-2">
          <OpenApp lang={t.code} className="hover:text-ink">{t.nav.cta}</OpenApp>
          <Link href={`${t.base}/privacy`} className="hover:text-ink">{t.nav.privacy}</Link>
          <a href="mailto:hello@diesis.app" className="hover:text-ink">hello@diesis.app</a>
          <a href={`/lang/${t.otherLang}?next=${encodeURIComponent(other)}`} hrefLang={t.otherLang} lang={t.otherLang} className="hover:text-ink">
            {t.otherName}
          </a>
        </nav>
      </div>
      <div className="mx-auto w-full max-w-6xl px-4 pb-8 text-xs text-dim">
        © {new Date().getFullYear()} Diesis. {t.footer.made}
      </div>
    </footer>
  );
}
