import type { Metadata } from "next";
import { ReadGame } from "@/components/read-game";
import { appMetadata, currentStrings } from "@/lib/lang";

export async function generateMetadata(): Promise<Metadata> {
  const t = await currentStrings();
  return appMetadata("/learn/read-the-note", t.read.note.title);
}

export default async function ReadNoteRoute() {
  const t = await currentStrings();
  return <ReadGame mode="note" t={t.game} tc={t.challenge} ts={t.settings} tr={t.read} lang={t.code} />;
}
