import type { MetadataRoute } from "next";

const base = "https://diesis.app";

/** The public pages, each with its other-language twin. The game screens under /app are left out:
 *  they read the language from a cookie and say nothing a search result needs. */
export default function sitemap(): MetadataRoute.Sitemap {
  const pair = (en: string, es: string, priority: number) =>
    [en, es].map((path) => ({
      url: base + path,
      lastModified: new Date(),
      priority,
      alternates: { languages: { en: base + en, es: base + es } },
    }));
  return [...pair("/", "/es", 1), ...pair("/privacy", "/es/privacy", 0.3)];
}
