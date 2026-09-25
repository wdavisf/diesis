import type { Metadata } from "next";

export const metadata: Metadata = { title: "Learn" };

export default function AppLayout({ children }: LayoutProps<"/learn">) {
  return <div className="flex min-h-dvh flex-col">{children}</div>;
}
