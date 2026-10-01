import type { Metadata } from "next";
import { ReadFlow } from "@/components/read-game";
import { appMetadata, currentStrings } from "@/lib/lang";

export async function generateMetadata(): Promise<Metadata> {
  const t = await currentStrings();
  return appMetadata("/learn/sight-reading", t.read.flow.title);
}

export default async function SightReadingPage() {
  const t = await currentStrings();
  return <ReadFlow t={t.game} tc={t.challenge} ts={t.settings} tr={t.read} lang={t.code} />;
}
