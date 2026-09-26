import type { Metadata } from "next";
import { LEARN_ITEMS, ToolMenu } from "@/components/tool-menu";
import { appMetadata, currentStrings } from "@/lib/lang";

export async function generateMetadata(): Promise<Metadata> {
  const t = await currentStrings();
  return appMetadata("/learn", t.learnMenu.title);
}

export default async function LearnMenu() {
  const t = await currentStrings();
  return <ToolMenu t={t} menu={t.learnMenu} items={LEARN_ITEMS} />;
}
