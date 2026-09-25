import type { Metadata } from "next";
import { Metronome } from "@/components/metronome";
import { currentStrings } from "@/lib/lang";

export async function generateMetadata(): Promise<Metadata> {
  const t = await currentStrings();
  return { title: t.metronome.title };
}

export default async function MetronomePage() {
  const t = await currentStrings();
  return <Metronome t={t.metronome} tg={t.game} />;
}
