import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "dbt_user";
const DEMO_CLINICIAN_ID = "00000000-0000-0000-0000-000000000001";
const DEMO_STUDENT_ID = "00000000-0000-0000-0000-000000000002";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const userId = req.cookies.get(COOKIE_NAME)?.value;

  const isStudentArea = pathname.startsWith("/student");
  const isTherapistArea = pathname.startsWith("/therapist");
  const isLogin = pathname === "/";

  if ((isStudentArea || isTherapistArea) && !userId) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (isStudentArea && userId === DEMO_CLINICIAN_ID) {
    return NextResponse.redirect(new URL("/therapist/dashboard", req.url));
  }

  if (isTherapistArea && userId === DEMO_STUDENT_ID) {
    return NextResponse.redirect(new URL("/student/home", req.url));
  }

  if (isLogin && userId) {
    const dest = userId === DEMO_CLINICIAN_ID ? "/therapist/dashboard" : "/student/home";
    return NextResponse.redirect(new URL(dest, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/student/:path*", "/therapist/:path*"],
};
