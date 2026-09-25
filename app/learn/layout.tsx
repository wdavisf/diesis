import type { Metadata } from "next";
import { SiteNav } from "@/components/site-nav";
import { currentStrings } from "@/lib/lang";

export const metadata: Metadata = { title: "Learn" };

/** Every screen under /learn: the shared top bar (in app mode: the tools), then the screen. The
 *  bar lives here, not in the template, so it stays put while screens fade in under it. */
export default async function AppLayout({ children }: LayoutProps<"/learn">) {
  const t = await currentStrings();
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteNav t={t} area="app" />
      {children}
    </div>
  );
}
