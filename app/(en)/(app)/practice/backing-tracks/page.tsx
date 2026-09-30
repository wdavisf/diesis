import type { Metadata } from "next";
import { BackingTracks } from "@/components/backing-tracks";
import { appMetadata, currentStrings } from "@/lib/lang";

export async function generateMetadata(): Promise<Metadata> {
  const t = await currentStrings();
  return appMetadata("/practice/backing-tracks", t.backing.title);
}

export default async function BackingTracksPage() {
  const t = await currentStrings();
  return <BackingTracks t={t.backing} neck={t.neck} base={t.base} lang={t.code} />;
}
