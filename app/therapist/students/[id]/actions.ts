"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { upsertCurrentAssignment } from "@/lib/assignments";
import { upsertClinicianNote } from "@/lib/notes";

async function assertOwnsStudent(clinicianId: string, studentId: string) {
  const { data, error } = await db
    .from("users")
    .select("linked_clinician_id")
    .eq("id", studentId)
    .eq("role", "student")
    .single();
  if (error || !data || data.linked_clinician_id !== clinicianId) {
    throw new Error("Not allowed");
  }
}

export async function saveAssignment(params: {
  studentId: string;
  focusSkillId: string | null;
  dailyCheckins: string[];
  note: string;
}) {
  const me = await requireSession();
  if (me.role !== "clinician") throw new Error("Not allowed");
  await assertOwnsStudent(me.id, params.studentId);

  await upsertCurrentAssignment({
    studentId: params.studentId,
    clinicianId: me.id,
    focusSkillId: params.focusSkillId,
    dailyCheckins: params.dailyCheckins,
    note: params.note.trim() ? params.note.trim() : null,
  });

  revalidatePath(`/therapist/students/${params.studentId}`);
  revalidatePath("/therapist/dashboard");
  revalidatePath("/student/home");
}

export async function saveClinicianNote(studentId: string, content: string) {
  const me = await requireSession();
  if (me.role !== "clinician") throw new Error("Not allowed");
  await assertOwnsStudent(me.id, studentId);

  await upsertClinicianNote(me.id, studentId, content);
  revalidatePath(`/therapist/students/${studentId}`);
}
