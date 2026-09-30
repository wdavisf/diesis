import type { Metadata } from "next";
import { headers } from "next/headers";
import { strings, type Lang, type Strings } from "@/lib/i18n";

/** Language of an app page (/learn/… English, /es/learn/… Spanish; the same for /start,
 *  /practice, /setup and /profile). The Spanish addresses re-export the same pages
 *  (app/(es)/es/(app)); proxy.ts says which language was asked for in a header. */
export async function currentLang(): Promise<Lang> {
  return (await headers()).get("x-diesis-lang") === "es" ? "es" : "en";
}

export async function currentStrings(): Promise<Strings> {
  return strings[await currentLang()];
}

/** Query string on every link-preview card: bump it when a card changes, so chat apps fetch it again. */
export const CARD_VERSION = 4;

/**
 * What a shared link to an app page shows in a chat: its own description and its own card
 * (`public/og/<card>-<lang>.png`, drawn by tools/og-card.mjs, `npm run icons`). Pages without a
 * card (the menus, the profile, Name the note) share the landing's game card. Keyed by the page's
 * English address: add a line when a tool is built.
 */
const PREVIEWS: Record<string, { card?: string; blurb: (t: Strings) => string }> = {
  "/start": { blurb: (t) => t.meta.description },
  "/learn": { blurb: (t) => t.home.learn },
  "/learn/name-the-note": { blurb: (t) => t.learnMenu.modes[0].body },
  "/learn/find-the-note": { card: "find-the-note", blurb: (t) => t.learnMenu.modes[1].body },
  "/practice": { blurb: (t) => t.home.practice },
  "/practice/neck": { card: "neck", blurb: (t) => t.practiceMenu.modes[0].body },
  "/practice/metronome": { card: "metronome", blurb: (t) => t.practiceMenu.modes[1].body },
  "/practice/backing-tracks": { card: "backing-tracks", blurb: (t) => t.practiceMenu.modes[2].body },
  "/practice/fingers": { card: "fingers", blurb: (t) => t.practiceMenu.modes[3].body },
  "/setup": { blurb: (t) => t.home.setup },
  "/setup/strings": { card: "strings", blurb: (t) => t.setupMenu.modes[0].body },
  "/profile": { blurb: (t) => t.meta.description },
};

/**
 * Metadata for an app page in its language: the page title, and a link preview (title, the
 * page's own description, its card in that language) so a shared /es/learn/… link previews in
 * Spanish. `path` is the page's English address ("/learn", "/practice/metronome"), for the
 * canonical and hreflang links and to pick the preview.
 */
export async function appMetadata(path: string, title?: string): Promise<Metadata> {
  const t = await currentStrings();
  const full = title ? `${title} · Diesis` : t.meta.title;
  const preview = PREVIEWS[path];
  const description = preview?.blurb(t) ?? t.meta.description;
  const card = preview?.card ? `/og/${preview.card}-${t.code}.png` : t.code === "es" ? "/og-es.png" : "/og.png";
  return {
    // The layout (no title) sets the template its pages use, and the menu's own title.
    title: title ?? { default: t.home.title, template: "%s · Diesis" },
    description,
    alternates: {
      canonical: `${t.base}${path}`,
      languages: { en: path, es: `/es${path}`, "x-default": path },
    },
    openGraph: {
      title: full,
      description,
      siteName: "Diesis",
      locale: t.code === "es" ? "es_ES" : "en_US",
      images: [{ url: `${card}?v=${CARD_VERSION}`, width: 1200, height: 630 }],
    },
  };
}
