import type { Metadata } from "next";
import { PracticeLog } from "@/components/practice-log";
import { appMetadata, currentStrings } from "@/lib/lang";

export async function generateMetadata(): Promise<Metadata> {
  const t = await currentStrings();
  return appMetadata("/log", t.log.title);
}

export default async function LogPage() {
  const t = await currentStrings();
  return <PracticeLog t={t} />;
}
