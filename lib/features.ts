import type { FeatureId, Strings } from "@/lib/i18n";

/** The tools that have a public page of their own, in the order of `tools.items` in lib/i18n.ts. */
export const FEATURES: readonly FeatureId[] = ["name", "find", "neck", "metronome", "backing", "fingers", "strings"];

export type Side = "learn" | "practice" | "setup";

/** Where each one lives in the app, the side it is on, and its link-preview card
 *  (`public/og/<card>-<lang>.png`; without one, the landing's card). A new tool gets a line here,
 *  an entry in `tools.items` and a page in `features.pages`, in both languages. */
export const FEATURE_TOOL: Record<FeatureId, { href: string; side: Side; card?: string }> = {
  name: { href: "/learn/name-the-note", side: "learn", card: "name-the-note" },
  find: { href: "/learn/find-the-note", side: "learn", card: "find-the-note" },
  neck: { href: "/practice/neck", side: "practice", card: "neck" },
  metronome: { href: "/practice/metronome", side: "practice", card: "metronome" },
  backing: { href: "/practice/backing-tracks", side: "practice", card: "backing-tracks" },
  fingers: { href: "/practice/fingers", side: "practice", card: "fingers" },
  strings: { href: "/setup/strings", side: "setup", card: "strings" },
};

/** A tool's public page in a language: /metronome, /es/metronomo. */
export const featurePath = (t: Strings, id: FeatureId) => `${t.base}/${t.features.pages[id].slug}`;

export const featureBySlug = (t: Strings, slug: string) => FEATURES.find((id) => t.features.pages[id].slug === slug);
