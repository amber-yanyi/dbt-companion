export function FlagBadge() {
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs text-accent bg-accent-soft"
      title="Student flagged this for the next session"
    >
      <span aria-hidden className="text-sm leading-none">
        ★
      </span>
      <span>Flagged</span>
    </span>
  );
}
