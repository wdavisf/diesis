import { FEATURE_TOOL, featurePath } from "@/lib/features";
import type { FeatureId, Strings } from "@/lib/i18n";

/* schema.org descriptions of the site and of each tool's page, for search engines
   (components/json-ld.tsx puts them in the page). Only what the page itself says: no ratings,
   no claims the copy does not make. Free today, so the offer is 0; change it with the pricing. */

const SITE = "https://diesis.app";
const WILL = {
  "@type": "Person",
  "@id": `${SITE}/#will`,
  name: "Will",
  alternateName: "WILLDAFER",
  url: "https://willdafer.es",
  sameAs: ["https://instagram.com/willdafer.es", "https://instagram.com/diesis.app"],
};
const FREE = { "@type": "Offer", price: "0", priceCurrency: "EUR" };

function website(t: Strings) {
  return {
    "@type": "WebSite",
    "@id": `${SITE}/#site`,
    name: "Diesis",
    url: `${SITE}${t.base || "/"}`,
    description: t.footer.tagline,
    inLanguage: ["en", "es"],
    publisher: { "@id": WILL["@id"] },
  };
}

/** The landing: the site, the app as a whole, and who makes it. */
export function landingData(t: Strings) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      website(t),
      WILL,
      {
        "@type": "WebApplication",
        "@id": `${SITE}/#app`,
        name: "Diesis",
        url: `${SITE}${t.base || "/"}`,
        description: t.meta.description,
        applicationCategory: "EducationalApplication",
        operatingSystem: "Any",
        browserRequirements: "Requires JavaScript",
        inLanguage: t.code,
        offers: FREE,
        author: { "@id": WILL["@id"] },
      },
    ],
  };
}

/** A tool's public page: the tool as an application, where the page sits, and its questions. */
export function featureData(t: Strings, id: FeatureId, title: string) {
  const page = t.features.pages[id];
  const url = `${SITE}${featurePath(t, id)}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      website(t),
      WILL,
      {
        "@type": "WebApplication",
        "@id": `${url}#tool`,
        name: `${title} · Diesis`,
        url,
        description: page.description,
        applicationCategory: "EducationalApplication",
        operatingSystem: "Any",
        browserRequirements: "Requires JavaScript",
        inLanguage: t.code,
        offers: FREE,
        isPartOf: { "@id": `${SITE}/#site` },
        author: { "@id": WILL["@id"] },
        installUrl: `${SITE}${t.base}${FEATURE_TOOL[id].href}`,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Diesis", item: `${SITE}${t.base || "/"}` },
          { "@type": "ListItem", position: 2, name: title, item: url },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: page.faq.map((q) => ({ "@type": "Question", name: q.q, acceptedAnswer: { "@type": "Answer", text: q.a } })),
      },
    ],
  };
}
