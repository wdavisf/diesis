import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AppSidebar, AppTopBar, TabBar } from "@/components/app-nav";
import { appMetadata, currentStrings } from "@/lib/lang";

export async function generateMetadata(): Promise<Metadata> {
  return appMetadata("/start");
}

/** Every app screen (/start, /learn, /practice, /setup, /profile) inside the app's navigation
 *  (components/app-nav.tsx): from `md` a sidebar on the left; on a phone a bar at the top and the
 *  tab bar at the bottom, which the screen leaves room for. It lives here, not in the template,
 *  so it stays put while screens fade in beside it. */
export default async function AppLayout({ children }: { children: ReactNode }) {
  const t = await currentStrings();
  return (
    <div className="flex min-h-dvh flex-col md:flex-row">
      <AppSidebar t={t} />
      <div className="app-main flex min-w-0 flex-1 flex-col pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-0">
        <AppTopBar t={t} />
        {children}
      </div>
      <TabBar t={t} />
    </div>
  );
}
