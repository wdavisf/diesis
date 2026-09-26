import type { MetadataRoute } from "next";

const base = "https://diesis.app";

/** The public pages, each with its other-language twin: the landing, the app (its front door,
 *  the Learn and Practice menus and their tools, the profile), and the privacy page. */
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
    ...["/start", "/learn", "/practice"].flatMap((p) => pair(p, `/es${p}`, 0.8)),
    ...["/learn/name-the-note", "/learn/find-the-note", "/practice/neck", "/practice/metronome", "/practice/backing-tracks", "/practice/strings", "/profile"].flatMap((p) => pair(p, `/es${p}`, 0.7)),
    ...pair("/privacy", "/es/privacy", 0.3),
  ];
}
