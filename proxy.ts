import { NextResponse, type NextRequest } from "next/server";
import { LANG_COOKIE } from "@/lib/i18n";

/** Header the app pages read their language from (lib/lang.ts). Set only here. */
export const LANG_HEADER = "x-diesis-lang";

/**
 * The app speaks the language of its address, like the landing: /learn/… is English and
 * /es/learn/… Spanish, so a shared link opens (and previews) in the language it was shared in.
 * /es/learn/… is served by the same pages under /learn, told the language by a header. Someone
 * who picked Spanish and lands on /learn/… (an old bookmark, the menu of an older page) goes to
 * the /es twin.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const headers = new Headers(request.headers);
  headers.delete(LANG_HEADER);

  if (pathname === "/es/learn" || pathname.startsWith("/es/learn/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(3);
    headers.set(LANG_HEADER, "es");
    return NextResponse.rewrite(url, { request: { headers } });
  }

  if (request.cookies.get(LANG_COOKIE)?.value === "es") {
    const url = request.nextUrl.clone();
    url.pathname = `/es${pathname}`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next({ request: { headers } });
}

export const config = { matcher: ["/learn", "/learn/:path*", "/es/learn", "/es/learn/:path*"] };
