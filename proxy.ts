import { NextResponse, type NextRequest } from "next/server";

export const ACCESS_COOKIE = "diesis_access";

export function proxy(request: NextRequest) {
  const code = process.env.DIESIS_ACCESS_CODE;
  if (!code) return NextResponse.next();
  const granted = request.cookies.get(ACCESS_COOKIE)?.value === code;
  if (granted) return NextResponse.next();
  const login = new URL("/login", request.url);
  login.searchParams.set("next", request.nextUrl.pathname + request.nextUrl.search);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ["/app/:path*"],
};
