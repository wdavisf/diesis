import type { Metadata } from "next";
import { Game } from "@/components/game";
import { currentStrings } from "@/lib/lang";

export async function generateMetadata(): Promise<Metadata> {
  const t = await currentStrings();
  return { title: t.game.title };
}

export default async function NameTheNotePage() {
  const t = await currentStrings();
  return <Game t={t.game} />;
}
