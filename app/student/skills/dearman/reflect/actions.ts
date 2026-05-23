"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth";
import { getCurrentDearman, markDearmanReflected } from "@/lib/dearman";
import { DearmanReflection } from "@/lib/skills/dearman";

export async function saveDearmanReflection(reflection: DearmanReflection) {
  const me = await requireSession();
  if (me.role !== "student") throw new Error("Not allowed");

  const entry = await getCurrentDearman(me.id);
  if (!entry) redirect("/student/skills/dearman");

  await markDearmanReflected(entry.id, reflection);

  revalidatePath("/student/skills/dearman");
  revalidatePath("/student/home");
  revalidatePath(`/therapist/students/${me.id}`);

  redirect("/student/home");
}
