import Link from "next/link";

export default function ObserveDescribePage() {
  return (
    <div className="space-y-10">
      <div>
        <Link
          href="/student/skills"
          className="text-sm text-foreground-muted hover:text-foreground"
        >
          ← All skills
        </Link>
      </div>

      <header>
        <h1 className="text-2xl font-medium text-foreground">
          Observe &amp; Describe
        </h1>
        <p className="text-foreground-muted mt-2 leading-relaxed">
          Mindfulness in two parts: notice what&rsquo;s happening, then put
          words to it without judgment.
        </p>
      </header>

      <section className="bg-surface border border-border rounded-2xl p-6 space-y-5">
        <div>
          <h2 className="text-sm font-medium text-foreground-muted uppercase tracking-wide">
            Observe
          </h2>
          <p className="mt-2 text-foreground leading-relaxed">
            Pay attention to one thing — a sensation, a sound, a thought —
            without doing anything about it. Just notice it, the way you might
            notice a cloud passing.
          </p>
        </div>
        <div className="pt-3 border-t border-border">
          <h2 className="text-sm font-medium text-foreground-muted uppercase tracking-wide">
            Describe
          </h2>
          <p className="mt-2 text-foreground leading-relaxed">
            Put words to what you observed — in factual language, no
            commentary. &ldquo;My chest is tight&rdquo; rather than &ldquo;I&rsquo;m
            freaking out.&rdquo; &ldquo;I notice the thought that I&rsquo;ll
            fail&rdquo; rather than &ldquo;I&rsquo;m going to fail.&rdquo;
          </p>
        </div>
        <div className="pt-3 border-t border-border">
          <h2 className="text-sm font-medium text-foreground-muted uppercase tracking-wide">
            When to use
          </h2>
          <ul className="mt-2 space-y-1.5 text-foreground leading-relaxed">
            <li>· You feel overwhelmed and want to ground.</li>
            <li>· You&rsquo;re caught up in interpretation and need the facts.</li>
            <li>· You want to slow down before reacting.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
