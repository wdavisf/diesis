import type { Metadata } from "next";
import { Metronome } from "@/components/metronome";
import { appMetadata, currentStrings } from "@/lib/lang";

export async function generateMetadata(): Promise<Metadata> {
  const t = await currentStrings();
  return appMetadata("/metronome", t.metronome.title);
}

export default async function MetronomePage() {
  const t = await currentStrings();
  return <Metronome t={t.metronome} ts={t.speed} tg={t.game} />;
}
