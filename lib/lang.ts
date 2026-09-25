import type { Metadata } from "next";
import { headers } from "next/headers";
import { strings, type Lang, type Strings } from "@/lib/i18n";

/** Language of an app page (/learn/… English, /es/learn/… Spanish). proxy.ts rewrites the
 *  Spanish addresses onto the same pages and says so in a header. */
export async function currentLang(): Promise<Lang> {
  return (await headers()).get("x-diesis-lang") === "es" ? "es" : "en";
}

export async function currentStrings(): Promise<Strings> {
  return strings[await currentLang()];
}

/**
 * Metadata for an app page in its language: the page title, and a link preview (title,
 * description, the card for that language) so a shared /es/learn/… link previews in Spanish.
 * `path` is the page under /learn ("" for the menu), for the canonical and hreflang links.
 */
export async function appMetadata(path: string, title?: string): Promise<Metadata> {
  const t = await currentStrings();
  const full = title ? `${title} · Diesis` : t.meta.title;
  return {
    // The layout (no title) sets the template its pages use, and the menu's own title.
    title: title ?? { default: t.home.title, template: "%s · Diesis" },
    description: t.meta.description,
    alternates: {
      canonical: `${t.base}/learn${path}`,
      languages: { en: `/learn${path}`, es: `/es/learn${path}`, "x-default": `/learn${path}` },
    },
    openGraph: {
      title: full,
      description: t.meta.description,
      siteName: "Diesis",
      locale: t.code === "es" ? "es_ES" : "en_US",
      images: [{ url: t.code === "es" ? "/og-es.png?v=3" : "/og.png?v=3", width: 1200, height: 630 }],
    },
  };
}
