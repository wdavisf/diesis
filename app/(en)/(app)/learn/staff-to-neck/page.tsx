import type { Metadata } from "next";
import { ReadGame } from "@/components/read-game";
import { appMetadata, currentStrings } from "@/lib/lang";

export async function generateMetadata(): Promise<Metadata> {
  const t = await currentStrings();
  return appMetadata("/learn/staff-to-neck", t.read.neck.title);
}

export default async function StaffToNeckRoute() {
  const t = await currentStrings();
  return <ReadGame mode="neck" t={t.game} tc={t.challenge} ts={t.settings} tr={t.read} lang={t.code} />;
}
