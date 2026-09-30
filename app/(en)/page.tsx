import type { Metadata } from "next";
import { Landing } from "@/components/landing";
import { strings } from "@/lib/i18n";

const t = strings.en;
export const metadata: Metadata = {
  title: { absolute: t.meta.title },
  description: t.meta.description,
  alternates: { canonical: "/", languages: { en: "/", es: "/es", "x-default": "/" } },
};

export default function Page() {
  return <Landing t={t} />;
}
