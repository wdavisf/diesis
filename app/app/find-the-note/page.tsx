import type { Metadata } from "next";
import { FindGame } from "@/components/find-game";
import { currentStrings } from "@/lib/lang";

export async function generateMetadata(): Promise<Metadata> {
  const t = await currentStrings();
  return { title: t.find.title };
}

export default async function FindTheNotePage() {
  const t = await currentStrings();
  return <FindGame t={t.game} tf={t.find} tc={t.challenge} />;
}
