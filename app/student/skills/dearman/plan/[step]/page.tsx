import Link from "next/link";
import { notFound } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { ensureCurrentDearman } from "@/lib/dearman";
import {
  DEARMAN_PLAN_STEPS,
  DearmanData,
  isPlanStepKey,
} from "@/lib/skills/dearman";
import { PlanStepForm } from "@/components/dearman/plan-step-form";

export default async function PlanStepPage({
  params,
}: {
  params: Promise<{ step: string }>;
}) {
  const { step } = await params;
  if (!isPlanStepKey(step)) notFound();

  const me = await requireSession();
  if (me.role !== "student") return null;

  const entry = await ensureCurrentDearman(me.id);
  const stepDef = DEARMAN_PLAN_STEPS.find((s) => s.key === step)!;
  const stepIndex = DEARMAN_PLAN_STEPS.findIndex((s) => s.key === step);
  const initialValue =
    (entry.data[step as keyof DearmanData] as string | undefined) ?? "";
  const isLast = stepIndex === DEARMAN_PLAN_STEPS.length - 1;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Link
          href="/student/skills/dearman"
          className="text-sm text-foreground-muted hover:text-foreground"
        >
          ← DEARMAN
        </Link>
        <span className="text-xs text-foreground-muted">
          Step {stepIndex + 1} of {DEARMAN_PLAN_STEPS.length}
        </span>
      </div>

      <header className="space-y-3">
        {stepDef.letter && (
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-accent-soft text-accent font-semibold text-lg">
            {stepDef.letter}
          </div>
        )}
        <h1 className="text-2xl font-medium text-foreground">{stepDef.title}</h1>
        <p className="text-foreground-muted leading-relaxed">{stepDef.helper}</p>
      </header>

      <PlanStepForm
        stepKey={step}
        initialValue={initialValue}
        isLast={isLast}
      />
    </div>
  );
}
