import type { MetadataRoute } from "next";

const base = "https://diesis.app";

/** The public pages, each with its other-language twin: the landing, the app's menu and tools
 *  (/learn and /es/learn since 0.11.0), and the privacy page. */
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
    ...pair("/learn", "/es/learn", 0.8),
    ...["/neck", "/name-the-note", "/find-the-note", "/metronome"].flatMap((p) => pair(`/learn${p}`, `/es/learn${p}`, 0.7)),
    ...pair("/privacy", "/es/privacy", 0.3),
  ];
}
