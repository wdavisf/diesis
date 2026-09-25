import type { Metadata } from "next";
import { FindGame } from "@/components/find-game";
import { appMetadata, currentStrings } from "@/lib/lang";

export async function generateMetadata(): Promise<Metadata> {
  const t = await currentStrings();
  return appMetadata("/find-the-note", t.find.title);
}

export default async function FindTheNotePage() {
  const t = await currentStrings();
  return <FindGame t={t.game} tf={t.find} tc={t.challenge} ts={t.settings} lang={t.code} />;
}
