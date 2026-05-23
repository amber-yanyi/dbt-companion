"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth";
import {
  ensureCurrentDearman,
  updateDearmanData,
} from "@/lib/dearman";
import {
  DEARMAN_PLAN_STEPS,
  DearmanData,
  isPlanStepKey,
} from "@/lib/skills/dearman";

export async function saveStep(stepKey: string, value: string) {
  const me = await requireSession();
  if (me.role !== "student") throw new Error("Not allowed");
  if (!isPlanStepKey(stepKey)) throw new Error("Unknown step");

  const entry = await ensureCurrentDearman(me.id);
  await updateDearmanData(entry.id, {
    [stepKey]: value,
  } as Partial<DearmanData>);

  revalidatePath("/student/skills/dearman");
  revalidatePath("/student/home");

  const idx = DEARMAN_PLAN_STEPS.findIndex((s) => s.key === stepKey);
  const next = DEARMAN_PLAN_STEPS[idx + 1];
  if (next) {
    redirect(`/student/skills/dearman/plan/${next.key}`);
  } else {
    redirect("/student/skills/dearman/script");
  }
}

export async function saveStepAndExit(stepKey: string, value: string) {
  const me = await requireSession();
  if (me.role !== "student") throw new Error("Not allowed");
  if (!isPlanStepKey(stepKey)) throw new Error("Unknown step");

  const entry = await ensureCurrentDearman(me.id);
  await updateDearmanData(entry.id, {
    [stepKey]: value,
  } as Partial<DearmanData>);

  revalidatePath("/student/skills/dearman");
  revalidatePath("/student/home");
  redirect("/student/skills/dearman");
}
