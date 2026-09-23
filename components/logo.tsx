import { cn } from "@/lib/utils";

/** The sharp sign, ♯: what "diesis" means in Italian and Spanish. Amber on the stage. Same
 *  geometry as public/favicon.svg and tools/icons.mjs; change all three together. */
export function LogoMark({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 1024 1024" aria-hidden="true" focusable="false" className={className}>
      <rect width="1024" height="1024" rx="230" fill="#14120f" />
      <g fill="#e0a63a">
        <rect x="384" y="196" width="72" height="632" rx="36" />
        <rect x="568" y="196" width="72" height="632" rx="36" />
        <path d="M232 470 L792 340 L792 436 L232 566 Z" />
        <path d="M232 682 L792 552 L792 648 L232 778 Z" />
      </g>
    </svg>
  );
}

/** Mark plus the word, for headers and footers. */
export function Logo({ size = "md", className }: { size?: "sm" | "md" | "lg"; className?: string }) {
  const px = size === "sm" ? 26 : size === "lg" ? 44 : 32;
  const text = size === "sm" ? "text-base" : size === "lg" ? "text-2xl" : "text-lg";
  return (
    <span className={cn("inline-flex items-center gap-2.5 font-display font-semibold tracking-tight text-ink", text, className)}>
      <LogoMark size={px} className="rounded-[22%] ring-1 ring-white/10" />
      Diesis
    </span>
  );
}
