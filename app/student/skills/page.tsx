import Link from "next/link";

const SKILLS = [
  {
    slug: "dearman",
    name: "DEARMAN",
    when: "When you have a conversation you want to approach intentionally.",
  },
] as const;

export default function SkillsLibrary() {
  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/student/home"
          className="text-sm text-foreground-muted hover:text-foreground"
        >
          ← Home
        </Link>
      </div>
      <header>
        <h1 className="text-2xl font-medium text-foreground">All skills</h1>
        <p className="text-foreground-muted mt-1">
          Skills you can pick up anytime.
        </p>
      </header>

      <div className="grid gap-3">
        {SKILLS.map((s) => (
          <Link
            key={s.slug}
            href={`/student/skills/${s.slug}`}
            className="block bg-surface border border-border rounded-2xl p-5 hover:border-accent transition-colors"
          >
            <div className="text-foreground font-medium">{s.name}</div>
            <div className="text-sm text-foreground-muted mt-1">{s.when}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
