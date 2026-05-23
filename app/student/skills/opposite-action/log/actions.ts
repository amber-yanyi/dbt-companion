"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth";
import { insertLibraryLog } from "@/lib/library-logs";
import {
  OPPOSITE_ACTION_SKILL_ID,
  OppositeActionData,
} from "@/lib/skills/opposite-action";

export async function saveOppositeActionLog(data: OppositeActionData) {
  const me = await requireSession();
  if (me.role !== "student") throw new Error("Not allowed");
  if (!data.situation.trim()) throw new Error("Situation required");

  await insertLibraryLog(me.id, OPPOSITE_ACTION_SKILL_ID, {
    situation: data.situation.trim(),
    shift: data.shift ?? null,
    note: data.note?.trim() || null,
  });

  revalidatePath("/student/skills/opposite-action");
  revalidatePath("/student/home");
  revalidatePath(`/therapist/students/${me.id}`);
  redirect("/student/skills/opposite-action");
}
