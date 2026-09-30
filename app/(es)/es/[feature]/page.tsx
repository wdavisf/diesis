import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FeaturePage } from "@/components/feature-page";
import { featureMetadata } from "@/lib/feature-metadata";
import { FEATURES, featureBySlug } from "@/lib/features";
import { strings } from "@/lib/i18n";

/* The public page of each tool, in Spanish: its address is the tool's slug in `features.pages`
   (lib/i18n.ts). Only those slugs exist; anything else is a 404. */
const t = strings.es;

export const dynamicParams = false;

export function generateStaticParams() {
  return FEATURES.map((id) => ({ feature: t.features.pages[id].slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ feature: string }> }): Promise<Metadata> {
  const id = featureBySlug(t, (await params).feature);
  return id ? featureMetadata(t, id) : {};
}

export default async function Page({ params }: { params: Promise<{ feature: string }> }) {
  const id = featureBySlug(t, (await params).feature);
  if (!id) notFound();
  return <FeaturePage t={t} id={id} />;
}
