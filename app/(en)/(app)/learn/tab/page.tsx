import type { Metadata } from "next";
import { LearnMenu, learnMetadata } from "@/components/learn-menu";

export function generateMetadata(): Promise<Metadata> {
  return learnMetadata("tab");
}

export default function Page() {
  return <LearnMenu track="tab" />;
}
