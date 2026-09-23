import { cn } from "@/lib/utils";

/** A lowercase delta, δ, drawn so it also reads as a note: a filled head, a stem, and the
 *  δ's top arm as the flag. Amber on the stage. Same geometry as public/favicon.svg (which
 *  tools/icons.mjs renders to PNG); change both together. */
export function LogoMark({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 1024 1024" aria-hidden="true" focusable="false" className={className}>
      <rect width="1024" height="1024" rx="230" fill="#14120f" />
      <g transform="translate(512 512) scale(1.08) translate(-512 -512)">
        <path
          d="M 604 626 C 672 520 636 386 528 306 C 470 262 480 214 552 208 C 626 202 690 236 716 288"
          fill="none"
          stroke="#e0a63a"
          strokeWidth={84}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="722" cy="300" r="56" fill="#e0a63a" />
        <ellipse cx="470" cy="712" rx="196" ry="150" transform="rotate(-18 470 712)" fill="#e0a63a" />
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
