import type { Metadata } from "next";
import { PrivacyPage } from "@/components/privacy-page";
import { strings } from "@/lib/i18n";

const t = strings.en;
export const metadata: Metadata = {
  title: t.meta.privacyTitle,
  description: t.meta.privacyDescription,
  alternates: { canonical: "/privacy", languages: { en: "/privacy", es: "/es/privacy", "x-default": "/privacy" } },
};

export default function Page() {
  return <PrivacyPage t={t} />;
}
