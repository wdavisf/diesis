import Link from "next/link";
import { Logo } from "@/components/logo";

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-8 text-sm text-dim">
        <div className="flex items-center gap-4">
          <Logo size="sm" />
          <span className="hidden sm:inline">Guitar notes, scales and reading, as games.</span>
        </div>
        <nav className="flex flex-wrap gap-x-5 gap-y-2">
          <Link href="/app" className="hover:text-ink">Open the app</Link>
          <Link href="/privacy" className="hover:text-ink">Privacy</Link>
          <a href="mailto:hello@diesis.app" className="hover:text-ink">hello@diesis.app</a>
        </nav>
      </div>
      <div className="mx-auto w-full max-w-6xl px-4 pb-8 text-xs text-dim">
        © {new Date().getFullYear()} Diesis. Made in Cáceres, Spain. “Diesis” is Greek for the semitone: one fret.
      </div>
    </footer>
  );
}
