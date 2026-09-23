import { NextResponse, type NextRequest } from "next/server";
import { isLang, LANG_COOKIE } from "@/lib/i18n";

/** Sets the language cookie and sends the visitor back where they were. */
export async function GET(request: NextRequest, ctx: RouteContext<"/lang/[code]">) {
  const { code } = await ctx.params;
  const next = request.nextUrl.searchParams.get("next") ?? "/";
  const safe = next.startsWith("/") && !next.startsWith("//") ? next : "/";
  const res = NextResponse.redirect(new URL(safe, request.url));
  if (isLang(code)) {
    res.cookies.set({ name: LANG_COOKIE, value: code, path: "/", sameSite: "lax", maxAge: 60 * 60 * 24 * 365 });
  }
  return res;
}
