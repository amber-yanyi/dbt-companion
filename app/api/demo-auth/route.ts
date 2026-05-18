import { NextRequest, NextResponse } from "next/server";
import { setSession, clearSession, UserRole } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { role, action } = (await req.json()) as {
    role?: UserRole;
    action?: "signin" | "signout" | "switch";
  };

  if (action === "signout") {
    await clearSession();
    return NextResponse.json({ ok: true, redirect: "/" });
  }

  if (!role || (role !== "student" && role !== "clinician")) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  await setSession(role);
  const redirect = role === "student" ? "/student/home" : "/therapist/dashboard";
  return NextResponse.json({ ok: true, redirect });
}
