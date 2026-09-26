import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SiteNav } from "@/components/site-nav";
import { appMetadata, currentStrings } from "@/lib/lang";

export async function generateMetadata(): Promise<Metadata> {
  return appMetadata("/start");
}

/** Every app screen (/start, /learn, /practice, /profile): the shared top bar (in app mode: Learn,
 *  Practice and the tools of the side you are on), then the screen. The bar lives here, not in the
 *  template, so it stays put while screens fade in under it. */
export default async function AppLayout({ children }: { children: ReactNode }) {
  const t = await currentStrings();
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteNav t={t} area="app" />
      {children}
    </div>
  );
}
