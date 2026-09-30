import type { Metadata } from "next";
import { SETUP_ITEMS, ToolMenu } from "@/components/tool-menu";
import { appMetadata, currentStrings } from "@/lib/lang";

export async function generateMetadata(): Promise<Metadata> {
  const t = await currentStrings();
  return appMetadata("/setup", t.setupMenu.title);
}

export default async function SetupMenu() {
  const t = await currentStrings();
  return <ToolMenu t={t} menu={t.setupMenu} items={SETUP_ITEMS} />;
}
