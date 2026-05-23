"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function toggleEntryFlag(entryId: string) {
  const me = await requireSession();

  const { data: entry, error: readErr } = await db
    .from("skill_entries")
    .select("user_id, data")
    .eq("id", entryId)
    .single();
  if (readErr || !entry) throw new Error("Entry not found");
  if (entry.user_id !== me.id) throw new Error("Not allowed");

  const current = (entry.data as Record<string, unknown>) ?? {};
  const flagged = !current.flagged;
  const newData = { ...current, flagged };

  const { error } = await db
    .from("skill_entries")
    .update({ data: newData, updated_at: new Date().toISOString() })
    .eq("id", entryId);
  if (error) throw error;

  revalidatePath("/student/checkin");
  revalidatePath("/student/home");
  revalidatePath("/student/skills/dearman");
  revalidatePath("/student/skills/opposite-action");
  revalidatePath("/therapist/dashboard");
  revalidatePath(`/therapist/students/${me.id}`);
}
