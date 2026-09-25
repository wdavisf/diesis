import type { Metadata } from "next";
import { SpeedTrainer } from "@/components/speed-trainer";
import { currentStrings } from "@/lib/lang";

export async function generateMetadata(): Promise<Metadata> {
  const t = await currentStrings();
  return { title: t.speed.title };
}

export default async function SpeedTrainerPage() {
  const t = await currentStrings();
  return <SpeedTrainer t={t.speed} tm={t.metronome} tg={t.game} />;
}
