import Link from "next/link";

export default function StudentHome() {
  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-2xl font-medium text-foreground">Hi there</h1>
        <p className="text-foreground-muted mt-1">Welcome back.</p>
      </section>

      <section className="bg-surface border border-border rounded-2xl p-6">
        <h2 className="text-sm font-medium text-foreground-muted uppercase tracking-wide">
          This week&apos;s focus
        </h2>
        <p className="mt-3 text-foreground">
          No focus set yet — your clinician will share one when you next meet.
        </p>
      </section>

      <section>
        <Link
          href="/student/skills"
          className="block bg-surface border border-border rounded-2xl p-6 hover:border-accent transition-colors"
        >
          <h2 className="text-foreground font-medium">All skills</h2>
          <p className="text-foreground-muted text-sm mt-1">
            Browse DBT skills you can use anytime.
          </p>
        </Link>
      </section>
    </div>
  );
}
