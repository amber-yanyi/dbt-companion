import Link from "next/link";

export default function ScriptStub() {
  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/student/skills/dearman"
          className="text-sm text-foreground-muted hover:text-foreground"
        >
          ← DEARMAN
        </Link>
      </div>
      <header>
        <h1 className="text-2xl font-medium text-foreground">Your script</h1>
        <p className="text-foreground-muted mt-2">
          The composed script view is coming in the next iteration.
        </p>
      </header>
    </div>
  );
}
