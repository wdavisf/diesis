import { cn } from "@/lib/utils";

/** A lowercase delta, δ, set on five staff lines like a note on a score. The outline is the δ
 *  of EB Garamond (SIL Open Font License); the lines are cream at 45%, the letter amber on the
 *  stage. Same drawing as public/favicon.svg (which tools/icons.mjs renders to PNG); change
 *  both together. */
const DELTA_PATH =
  "M193 -14Q167 -14 137.5 -1.5Q108 11 82.0 35.5Q56 60 40.0 95.5Q24 131 24 176Q24 219 36.5 258.5Q49 298 70.0 329.0Q91 360 118.5 378.0Q146 396 176 397Q186 397 204.0 390.5Q222 384 238.5 376.5Q255 369 261 364Q267 360 270.5 361.0Q274 362 271 366Q255 392 229.0 426.0Q203 460 175.0 493.0Q147 526 126 548Q120 555 107.0 572.5Q94 590 83.0 611.5Q72 633 72 650Q72 659 84.0 671.0Q96 683 114.0 691.5Q132 700 150 700Q182 700 219.5 686.5Q257 673 294.0 650.0Q331 627 361.5 597.5Q392 568 410.0 535.0Q428 502 428 470Q428 462 422.5 456.0Q417 450 409 450Q400 450 382.5 470.5Q365 491 338.0 518.5Q311 546 273 566Q245 581 224.0 587.5Q203 594 179 594Q177 594 172.0 593.0Q167 592 167 587Q167 580 174.5 567.5Q182 555 188 546Q202 530 223.0 507.0Q244 484 266.5 459.0Q289 434 309 412Q332 388 351.0 357.5Q370 327 381.5 292.0Q393 257 392 220Q391 167 373.0 124.0Q355 81 325.5 50.0Q296 19 261.5 2.5Q227 -14 193 -14ZM155 66Q181 66 206.5 80.0Q232 94 254.0 118.0Q276 142 289.0 172.0Q302 202 302 233Q302 251 298.0 273.5Q294 296 287.0 313.0Q280 330 268 330Q229 330 194.5 314.0Q160 298 133.5 270.5Q107 243 92.0 207.5Q77 172 77 134Q77 116 87.5 100.0Q98 84 116.0 75.0Q134 66 155 66Z";
const DELTA_TRANSFORM = "translate(322.1 834.2) scale(0.8403 -0.8403)";
const STAFF = [132, 322, 512, 702, 892];

export function LogoMark({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 1024 1024" aria-hidden="true" focusable="false" className={className}>
      <rect width="1024" height="1024" rx="230" fill="#14120f" />
      <g stroke="#e9e2cf" strokeWidth={14} strokeLinecap="round" opacity={0.45}>
        {STAFF.map((y) => (
          <line key={y} x1={120} x2={904} y1={y} y2={y} />
        ))}
      </g>
      <path transform={DELTA_TRANSFORM} d={DELTA_PATH} fill="#e0a63a" />
    </svg>
  );
}

/* The wordmark is "δiesis": the D is the same EB Garamond δ as the mark, drawn inline at text
 * size (Fraunces has no Greek, and the letter must match the mark anyway). The glyph spans
 * y = -14…700 in font units; WORD_DELTA_EM is its height in em, picked so its bowl sits on
 * Fraunces' x-height, and the stroke thickens Garamond's regular weight toward Fraunces semibold. */
const GLYPH_TOP = 700;
const GLYPH_BOTTOM = -14;
const GLYPH_ADVANCE = 452;
const WORD_DELTA_EM = 0.8;
const WORD_DELTA_STROKE = 24;

function DeltaGlyph({ className }: { className?: string }) {
  const height = GLYPH_TOP - GLYPH_BOTTOM;
  return (
    <svg
      viewBox={`0 ${-GLYPH_TOP} ${GLYPH_ADVANCE} ${height}`}
      aria-hidden="true"
      focusable="false"
      className={cn("inline-block w-auto", className)}
      style={{ height: `${WORD_DELTA_EM}em`, verticalAlign: `${(GLYPH_BOTTOM / height) * WORD_DELTA_EM}em` }}
    >
      <path transform="scale(1 -1)" d={DELTA_PATH} fill="currentColor" stroke="currentColor" strokeWidth={WORD_DELTA_STROKE} strokeLinejoin="round" />
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
      <span className="sr-only">Diesis</span>
      <span aria-hidden="true" className="whitespace-nowrap">
        <DeltaGlyph />
        iesis
      </span>
    </span>
  );
}
