import type { MetadataRoute } from "next";
import { FEATURES, featurePath } from "@/lib/features";
import { strings } from "@/lib/i18n";

const base = "https://diesis.app";

/** The public pages, each with its other-language twin: the landing, each tool's own page, the
 *  app (its front door, the menus of its sides and their tools, the practice log, the profile), and the privacy page. */
export default function sitemap(): MetadataRoute.Sitemap {
  const pair = (en: string, es: string, priority: number) =>
    [en, es].map((path) => ({
      url: base + path,
      lastModified: new Date(),
      priority,
      alternates: { languages: { en: base + en, es: base + es } },
    }));
  return [
    ...pair("/", "/es", 1),
    ...FEATURES.flatMap((id) => pair(featurePath(strings.en, id), featurePath(strings.es, id), 0.9)),
    ...["/start", "/learn/notes", "/learn/reading", "/learn/tab", "/practice", "/setup"].flatMap((p) => pair(p, `/es${p}`, 0.8)),
    ...["/learn/name-the-note", "/learn/find-the-note", "/learn/read-the-note", "/learn/staff-to-neck", "/learn/sight-reading", "/learn/read-a-bar", "/practice/neck", "/practice/metronome", "/practice/backing-tracks", "/practice/fingers", "/setup/strings", "/setup/tuner", "/log", "/profile"].flatMap((p) => pair(p, `/es${p}`, 0.7)),
    ...pair("/privacy", "/es/privacy", 0.3),
  ];
}
