/** Structured data for search engines (lib/structured-data.ts), as a JSON-LD script in the page. */
export function JsonLd({ data }: { data: object }) {
  // "<" is escaped so nothing in the copy can close the script element.
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
