import { PleaseDayEntry } from "@/lib/please";

export function PleasePatterns({
  entries,
}: {
  entries: Record<string, PleaseDayEntry>;
}) {
  const observations = collectObservations(entries);
  if (observations.length === 0) return null;
  return (
    <ul className="text-sm text-foreground-muted space-y-1">
      {observations.map((o, i) => (
        <li key={i}>· {o}</li>
      ))}
    </ul>
  );
}

function collectObservations(
  entries: Record<string, PleaseDayEntry>
): string[] {
  const out: string[] = [];
  const sleeps = Object.values(entries)
    .map((e) => e.data.sleep_hours)
    .filter((v): v is number => typeof v === "number");
  if (sleeps.length >= 3) {
    const avg = sleeps.reduce((a, b) => a + b, 0) / sleeps.length;
    if (avg < 7) {
      out.push(`Sleep averaging ${avg.toFixed(1)} hours across ${sleeps.length} entries`);
    }
  }

  const illnessDays = Object.values(entries).filter((e) => e.data.illness?.present).length;
  if (illnessDays > 0) {
    out.push(
      `Noted not feeling well on ${illnessDays} day${illnessDays === 1 ? "" : "s"}`
    );
  }

  const substanceDays = Object.values(entries).filter((e) => e.data.substances?.used).length;
  if (substanceDays > 0) {
    out.push(
      `Logged substance use on ${substanceDays} day${substanceDays === 1 ? "" : "s"}`
    );
  }

  return out;
}
