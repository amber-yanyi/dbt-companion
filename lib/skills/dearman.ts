export const DEARMAN_SKILL_ID = "dearman";

export type DearmanReflection = {
  happened: "yes" | "no" | "postponed";
  overall?: number;
  got_what_asked?: "yes" | "partially" | "no";
  relationship?: "better" | "same" | "worse";
  notes?: string;
};

export type DearmanData = {
  situation?: string;
  concrete_goal?: string;
  relationship_goal?: string;
  describe?: string;
  express?: string;
  assert?: string;
  reinforce?: string;
  mindful?: string;
  appear?: string;
  negotiate?: string;
  script?: string;
  reflection?: DearmanReflection;
  flagged?: boolean;
};

export type DearmanStatus = "in_progress" | "planned" | "reflected";

export type DearmanPlanStep = {
  key: keyof DearmanData;
  title: string;
  helper: string;
  letter?: string;
};

export const DEARMAN_PLAN_STEPS: readonly DearmanPlanStep[] = [
  {
    key: "situation",
    title: "What's the situation?",
    helper: "Describe what's happening, factually. Save feelings for the next steps.",
  },
  {
    key: "concrete_goal",
    title: "What do you want from this conversation?",
    helper: "The specific outcome you're asking for, in one sentence.",
  },
  {
    key: "relationship_goal",
    title: "How do you want the relationship afterward?",
    helper: "What connection with this person you want to keep or build.",
  },
  {
    key: "describe",
    letter: "D",
    title: "Describe",
    helper: "State the facts of the situation, as you'd describe them to someone outside it.",
  },
  {
    key: "express",
    letter: "E",
    title: "Express",
    helper: "Say how you feel about it, using \"I\" statements. Don't blame.",
  },
  {
    key: "assert",
    letter: "A",
    title: "Assert",
    helper: "Ask clearly for what you want, or clearly say no. Be direct.",
  },
  {
    key: "reinforce",
    letter: "R",
    title: "Reinforce",
    helper: "Explain the positive outcome — what's in it for them, or for the two of you.",
  },
  {
    key: "mindful",
    letter: "M",
    title: "Stay mindful",
    helper:
      "What will you remind yourself to come back to if the conversation drifts?",
  },
  {
    key: "appear",
    letter: "A",
    title: "Appear confident",
    helper: "Tone, posture, eye contact — how will you carry yourself going in?",
  },
  {
    key: "negotiate",
    letter: "N",
    title: "Negotiate",
    helper: "What are you willing to give, or what alternative could work?",
  },
] as const;

export function isPlanStepKey(s: string): s is DearmanPlanStep["key"] {
  return DEARMAN_PLAN_STEPS.some((step) => step.key === s);
}

export function getStepIndex(key: DearmanPlanStep["key"]): number {
  return DEARMAN_PLAN_STEPS.findIndex((s) => s.key === key);
}

export function isPlanComplete(data: DearmanData): boolean {
  return DEARMAN_PLAN_STEPS.every((step) => {
    const value = data[step.key];
    return typeof value === "string" && value.trim().length > 0;
  });
}

export function firstIncompleteStep(data: DearmanData): DearmanPlanStep {
  const incomplete = DEARMAN_PLAN_STEPS.find((step) => {
    const value = data[step.key];
    return !(typeof value === "string" && value.trim().length > 0);
  });
  return incomplete ?? DEARMAN_PLAN_STEPS[0];
}

export function composeDearmanScript(data: DearmanData): string {
  const parts = [data.describe, data.express, data.assert, data.reinforce]
    .filter((s): s is string => typeof s === "string" && s.trim().length > 0)
    .map((s) => s.trim());
  return parts.join("\n\n");
}
