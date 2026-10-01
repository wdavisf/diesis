import type { Metadata } from "next";
import { Tuner } from "@/components/tuner";
import { appMetadata, currentStrings } from "@/lib/lang";

export async function generateMetadata(): Promise<Metadata> {
  const t = await currentStrings();
  return appMetadata("/setup/tuner", t.tuner.title);
}

export default async function TunerPage() {
  const t = await currentStrings();
  return <Tuner t={t.tuner} tunings={t.profile.tunings} lang={t.code} />;
}
