import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "dbt_user";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const userId = req.cookies.get(COOKIE_NAME)?.value;

  const isProtected =
    pathname.startsWith("/student") || pathname.startsWith("/therapist");

  if (isProtected && !userId) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/student/:path*", "/therapist/:path*"],
};
