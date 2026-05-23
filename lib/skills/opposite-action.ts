export const OPPOSITE_ACTION_SKILL_ID = "opposite-action";

export type OppositeActionShift = "shift" | "some" | "none";

export type OppositeActionData = {
  situation: string;
  shift?: OppositeActionShift | null;
  note?: string | null;
  flagged?: boolean;
};

export const SHIFT_LABEL: Record<OppositeActionShift, string> = {
  shift: "Felt a shift",
  some: "Some change",
  none: "Not much change",
};
