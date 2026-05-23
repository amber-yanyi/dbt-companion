"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth";
import {
  getCurrentDearman,
  markDearmanPlanned,
  updateDearmanData,
} from "@/lib/dearman";

export async function saveDearmanScript(script: string) {
  const me = await requireSession();
  if (me.role !== "student") throw new Error("Not allowed");

  const entry = await getCurrentDearman(me.id);
  if (!entry) redirect("/student/skills/dearman");

  await updateDearmanData(entry.id, { script });
  if (entry.status === "in_progress") {
    await markDearmanPlanned(entry.id);
  }

  revalidatePath("/student/skills/dearman");
  revalidatePath("/student/skills/dearman/script");
  revalidatePath("/student/home");
}
