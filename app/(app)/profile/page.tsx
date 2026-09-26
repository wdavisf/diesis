import type { Metadata } from "next";
import { Profile } from "@/components/profile";
import { appMetadata, currentStrings } from "@/lib/lang";

export async function generateMetadata(): Promise<Metadata> {
  const t = await currentStrings();
  return appMetadata("/profile", t.profile.title);
}

export default async function ProfilePage() {
  const t = await currentStrings();
  return <Profile t={t} />;
}
