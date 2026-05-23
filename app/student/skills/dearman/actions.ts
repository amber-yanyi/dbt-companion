"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { getCurrentDearman } from "@/lib/dearman";

export async function abandonCurrentDearman() {
  const me = await requireSession();
  if (me.role !== "student") throw new Error("Not allowed");

  const entry = await getCurrentDearman(me.id);
  if (!entry) return;

  const { error } = await db
    .from("skill_entries")
    .delete()
    .eq("id", entry.id)
    .eq("user_id", me.id);
  if (error) throw error;

  revalidatePath("/student/home");
  revalidatePath("/student/skills/dearman");
}
