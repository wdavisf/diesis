import type { Metadata } from "next";
import { StringsSetup } from "@/components/strings-setup";
import { appMetadata, currentStrings } from "@/lib/lang";

export async function generateMetadata(): Promise<Metadata> {
  const t = await currentStrings();
  return appMetadata("/setup/strings", t.setup.title);
}

export default async function StringsPage() {
  const t = await currentStrings();
  return <StringsSetup t={t.setup} tp={t.profile} lang={t.code} base={t.base} />;
}
