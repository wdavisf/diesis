import type { Metadata } from "next";
import { Landing } from "@/components/landing";
import { strings } from "@/lib/i18n";

const t = strings.es;
export const metadata: Metadata = {
  title: { absolute: t.meta.title },
  description: t.meta.description,
  openGraph: { title: t.meta.title, description: t.meta.description, locale: "es_ES" },
  alternates: { canonical: "/es", languages: { en: "/", es: "/es", "x-default": "/" } },
};

export default function Page() {
  return <Landing t={t} />;
}
