import type { ReactNode } from "react";
import { RootDocument, rootMetadata, rootViewport } from "@/components/root-document";

/* Root layout of every English page: see components/root-document.tsx. */
export const metadata = rootMetadata("en");
export const viewport = rootViewport;

export default function Layout({ children }: { children: ReactNode }) {
  return <RootDocument lang="en">{children}</RootDocument>;
}
