import type { Metadata } from "next";
import { Neck } from "@/components/neck";
import { appMetadata, currentStrings } from "@/lib/lang";

export async function generateMetadata(): Promise<Metadata> {
  const t = await currentStrings();
  return appMetadata("/neck", t.neck.title);
}

export default async function NeckPage() {
  const t = await currentStrings();
  return <Neck t={t.neck} tg={t.game} lang={t.code} />;
}
