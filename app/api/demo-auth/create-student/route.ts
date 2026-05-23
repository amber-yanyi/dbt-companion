import { NextRequest, NextResponse } from "next/server";
import { createDemoStudent, setSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { name } = (await req.json()) as { name?: string };
  if (!name || !name.trim()) {
    return NextResponse.json({ error: "Name required" }, { status: 400 });
  }
  try {
    const { id } = await createDemoStudent(name);
    await setSession(id);
    return NextResponse.json({ ok: true, redirect: "/student/home" });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to create";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
