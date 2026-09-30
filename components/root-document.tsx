import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import { Consent } from "@/components/consent";
import { strings, type Lang } from "@/lib/i18n";
import { CARD_VERSION } from "@/lib/lang";
import "@/app/globals.css";

const geistSans = Geist({ variable: "--font-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  axes: ["opsz", "SOFT"],
});

/** The landing's own words in that language: the fallback for any page without its own. */
export function rootMetadata(lang: Lang): Metadata {
  const { title, description } = strings[lang].meta;
  return {
    title: { default: "Diesis", template: "%s · Diesis" },
    description,
    metadataBase: new URL("https://diesis.app"),
    icons: { icon: "/favicon.svg", apple: "/icon.png" },
    openGraph: {
      title,
      description,
      siteName: "Diesis",
      locale: lang === "es" ? "es_ES" : "en_US",
      images: [{ url: `${lang === "es" ? "/og-es.png" : "/og.png"}?v=${CARD_VERSION}`, width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image" },
  };
}

export const rootViewport: Viewport = { themeColor: "#14120f" };

const SIDEBAR_SCRIPT = `try{if(localStorage.getItem("diesis_sidebar")==="collapsed")document.documentElement.dataset.sidebar="collapsed"}catch(e){}`;

/**
 * The document every page is drawn in: fonts, the theme, the consent banner. There are two root
 * layouts, app/(en) and app/(es), one per language, so the server sends `<html lang>` right for
 * every page while the pages that can be static stay static (a single root layout would have to
 * read the request to know the language, which makes every page dynamic). Moving between the
 * two is a full page load; within a language, navigation stays on the client.
 */
export function RootDocument({ lang, children }: { lang: Lang; children: ReactNode }) {
  return (
    <html lang={lang} className={`${geistSans.variable} ${geistMono.variable} ${display.variable} h-full`} suppressHydrationWarning>
      <body className="flex min-h-full flex-col">
        {/* The app's sidebar, collapsed or not (components/app-nav.tsx): set on <html> before the
            first paint, so a collapsed sidebar does not open and shut on every load. */}
        <script dangerouslySetInnerHTML={{ __html: SIDEBAR_SCRIPT }} />
        {children}
        <Consent />
      </body>
    </html>
  );
}
