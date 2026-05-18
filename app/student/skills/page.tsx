import Link from "next/link";

export default function SkillsLibrary() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/student/home" className="text-sm text-foreground-muted hover:text-foreground">
          ← Home
        </Link>
      </div>
      <header>
        <h1 className="text-2xl font-medium text-foreground">All skills</h1>
        <p className="text-foreground-muted mt-1">Coming in the next iteration.</p>
      </header>
    </div>
  );
}
