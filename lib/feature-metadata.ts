import type { Metadata } from "next";
import { FEATURE_TOOL, featurePath } from "@/lib/features";
import { strings, type FeatureId, type Strings } from "@/lib/i18n";
import { CARD_VERSION } from "@/lib/lang";

/** Title, description, hreflang pair and link preview of a tool's public page, in its language. */
export function featureMetadata(t: Strings, id: FeatureId): Metadata {
  const page = t.features.pages[id];
  const { card } = FEATURE_TOOL[id];
  const image = card ? `/og/${card}-${t.code}.png` : t.code === "es" ? "/og-es.jpg" : "/og.jpg";
  const en = featurePath(strings.en, id);
  const es = featurePath(strings.es, id);
  return {
    title: { absolute: page.metaTitle },
    description: page.description,
    alternates: { canonical: t.code === "es" ? es : en, languages: { en, es, "x-default": en } },
    openGraph: {
      title: page.metaTitle,
      description: page.description,
      siteName: "Diesis",
      locale: t.code === "es" ? "es_ES" : "en_US",
      images: [{ url: `${image}?v=${CARD_VERSION}`, width: 1200, height: 630 }],
    },
  };
}
