"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { DEARMAN_SKILL_ID, DearmanReflection } from "@/lib/skills/dearman";

export async function updateReflection(
  entryId: string,
  reflection: DearmanReflection
) {
  const me = await requireSession();
  if (me.role !== "student") throw new Error("Not allowed");

  const { data: entry, error: readErr } = await db
    .from("skill_entries")
    .select("user_id, skill_id, status, data")
    .eq("id", entryId)
    .single();
  if (readErr || !entry) throw new Error("Entry not found");
  if (entry.user_id !== me.id) throw new Error("Not allowed");
  if (entry.skill_id !== DEARMAN_SKILL_ID) throw new Error("Not a DEARMAN entry");
  if (entry.status !== "reflected") {
    throw new Error("Can only edit reflections on reflected entries");
  }

  const newData = {
    ...((entry.data as Record<string, unknown>) ?? {}),
    reflection,
  };
  const { error } = await db
    .from("skill_entries")
    .update({ data: newData, updated_at: new Date().toISOString() })
    .eq("id", entryId);
  if (error) throw error;

  revalidatePath("/student/skills/dearman");
  revalidatePath(`/therapist/students/${me.id}`);
  redirect("/student/skills/dearman");
}
