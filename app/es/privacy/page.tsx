import type { Metadata } from "next";
import { PrivacyPage } from "@/components/privacy-page";
import { strings } from "@/lib/i18n";

const t = strings.es;
export const metadata: Metadata = {
  title: t.meta.privacyTitle,
  description: t.meta.privacyDescription,
  openGraph: {
    title: t.meta.privacyTitle,
    description: t.meta.privacyDescription,
    siteName: "Diesis",
    locale: "es_ES",
    images: [{ url: "/og-es.png?v=3", width: 1200, height: 630 }],
  },
  alternates: { canonical: "/es/privacy", languages: { en: "/privacy", es: "/es/privacy", "x-default": "/privacy" } },
};

export default function Page() {
  return <PrivacyPage t={t} />;
}
