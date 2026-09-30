import type { Metadata } from "next";
import { Fingers } from "@/components/fingers";
import { appMetadata, currentStrings } from "@/lib/lang";

export async function generateMetadata(): Promise<Metadata> {
  const t = await currentStrings();
  return appMetadata("/practice/fingers", t.fingers.title);
}

export default async function FingersPage() {
  const t = await currentStrings();
  return <Fingers t={t.fingers} tm={t.metronome} tg={t.game} />;
}
