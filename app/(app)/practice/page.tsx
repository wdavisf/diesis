import type { Metadata } from "next";
import { PRACTICE_ITEMS, ToolMenu } from "@/components/tool-menu";
import { appMetadata, currentStrings } from "@/lib/lang";

export async function generateMetadata(): Promise<Metadata> {
  const t = await currentStrings();
  return appMetadata("/practice", t.practiceMenu.title);
}

export default async function PracticeMenu() {
  const t = await currentStrings();
  return <ToolMenu t={t} menu={t.practiceMenu} items={PRACTICE_ITEMS} />;
}
