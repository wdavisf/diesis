/**
 * Affiliate links to Amazon.es (Will's Associates store id). Search links, not product links:
 * they need no per-product code, never go stale when a listing disappears, and the tag earns on
 * whatever the visitor buys in that session. Amazon.es only for now: English visitors outside
 * Spain would need their own marketplace's programme (OneLink), which Will has not joined.
 * The disclosure Amazon requires is shown next to every link and in the footer.
 */
export const AMAZON_TAG = 'willdafer-21';
export const AMAZON_HOST = 'https://www.amazon.es';

export function amazonSearch(query: string): string {
  const url = new URL('/s', AMAZON_HOST);
  url.searchParams.set('k', query);
  url.searchParams.set('tag', AMAZON_TAG);
  return url.toString();
}

/** "10-46", "10-68": a set is named by its thinnest and thickest gauge. */
export function setName(gauges: readonly number[]): string {
  return `${gauges[0]}-${gauges[gauges.length - 1]}`;
}
