import type { Metadata } from "next";
import { Landing } from "@/components/landing";
import { strings } from "@/lib/i18n";

const t = strings.es;
export const metadata: Metadata = {
  title: { absolute: t.meta.title },
  description: t.meta.description,
  openGraph: {
    title: t.meta.title,
    description: t.meta.description,
    siteName: "Diesis",
    locale: "es_ES",
    images: [{ url: "/og-es.png?v=4", width: 1200, height: 630 }],
  },
  alternates: { canonical: "/es", languages: { en: "/", es: "/es", "x-default": "/" } },
};

export default function Page() {
  return <Landing t={t} />;
}
