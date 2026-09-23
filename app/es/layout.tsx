import { HtmlLang } from "@/components/html-lang";

/** Marks the document Spanish for the /es pages. */
export default function EsLayout({ children }: LayoutProps<"/es">) {
  return (
    <>
      <HtmlLang lang="es" />
      {children}
    </>
  );
}
