import type { Metadata } from "next";
import { ReadGame } from "@/components/read-game";
import { appMetadata, currentStrings } from "@/lib/lang";

export async function generateMetadata(): Promise<Metadata> {
  const t = await currentStrings();
  return appMetadata("/learn/read-a-bar", t.read.bar.title);
}

export default async function ReadBarRoute() {
  const t = await currentStrings();
  return <ReadGame mode="bar" t={t.game} tc={t.challenge} ts={t.settings} tr={t.read} lang={t.code} />;
}
