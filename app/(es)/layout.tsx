import type { ReactNode } from "react";
import { RootDocument, rootMetadata, rootViewport } from "@/components/root-document";

/* Root layout of every Spanish page (everything under /es, and Will's /roadmap): see components/root-document.tsx. */
export const metadata = rootMetadata("es");
export const viewport = rootViewport;

export default function Layout({ children }: { children: ReactNode }) {
  return <RootDocument lang="es">{children}</RootDocument>;
}
