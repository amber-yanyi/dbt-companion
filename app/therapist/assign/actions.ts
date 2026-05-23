"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { upsertCurrentAssignment } from "@/lib/assignments";

export async function saveBulkAssignment(params: {
  studentIds: string[];
  focusSkillId: string | null;
  dailyCheckins: string[];
  note: string;
}) {
  const me = await requireSession();
  if (me.role !== "clinician") throw new Error("Not allowed");
  if (params.studentIds.length === 0) {
    throw new Error("No students selected");
  }

  const { data: linked } = await db
    .from("users")
    .select("id")
    .eq("role", "student")
    .eq("linked_clinician_id", me.id);
  const allowed = new Set((linked ?? []).map((r) => r.id as string));
  const ids = params.studentIds.filter((id) => allowed.has(id));
  if (ids.length === 0) throw new Error("No valid students");

  const note = params.note.trim() ? params.note.trim() : null;

  for (const studentId of ids) {
    await upsertCurrentAssignment({
      studentId,
      clinicianId: me.id,
      focusSkillId: params.focusSkillId,
      dailyCheckins: params.dailyCheckins,
      note,
    });
    revalidatePath(`/therapist/students/${studentId}`);
  }
  revalidatePath("/therapist/dashboard");
  revalidatePath("/student/home");

  redirect("/therapist/dashboard");
}
