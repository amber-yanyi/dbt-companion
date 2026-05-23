import { NextRequest, NextResponse } from "next/server";
import { setSession, clearSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const { userId, action } = (await req.json()) as {
    userId?: string;
    action?: "signin" | "signout" | "switch";
  };

  if (action === "signout") {
    await clearSession();
    return NextResponse.json({ ok: true, redirect: "/" });
  }

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const { data: user, error } = await db
    .from("users")
    .select("id, role")
    .eq("id", userId)
    .single();
  if (error || !user) {
    return NextResponse.json({ error: "Unknown user" }, { status: 404 });
  }

  await setSession(user.id);
  const redirect =
    user.role === "student" ? "/student/home" : "/therapist/dashboard";
  return NextResponse.json({ ok: true, redirect });
}
