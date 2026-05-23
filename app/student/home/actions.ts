"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { clearSession, requireSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { isSeeded } from "@/lib/seeded-users";

export async function deleteCurrentDemoStudent() {
  const me = await requireSession();
  if (me.role !== "student") throw new Error("Not allowed");
  if (isSeeded(me.id)) {
    throw new Error("Seeded demo students can't be deleted");
  }

  // ON DELETE CASCADE on FKs handles skill_entries, assignments, and
  // clinician_notes cleanup.
  const { error } = await db.from("users").delete().eq("id", me.id);
  if (error) throw error;

  await clearSession();
  revalidatePath("/therapist/dashboard");
  redirect("/");
}
