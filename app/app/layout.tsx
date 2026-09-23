import type { Metadata } from "next";

export const metadata: Metadata = { title: "Play" };

export default function AppLayout({ children }: LayoutProps<"/app">) {
  return <div className="flex min-h-dvh flex-col">{children}</div>;
}
