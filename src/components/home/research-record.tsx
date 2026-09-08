import Link from "next/link";
import { selectedPublications } from "@/lib/home-content";

export function ResearchRecord() {
  return (
    <section className="site-section bg-[var(--color-chalk)]" aria-labelledby="research-heading">
      <div className="container">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="meta-label text-[var(--color-cobalt)]">Research record</p>
            <h2
              id="research-heading"
              className="mt-3 font-display text-4xl tracking-tight text-[var(--color-ink)] md:text-6xl"
            >
              Selected research
            </h2>
            <p className="mt-4 max-w-2xl text-lg text-[var(--color-ink-muted)]">
              A short credibility block—not a CV dump. Each paper includes why it
              matters in plain language.
            </p>
          </div>
          <Link
            href="/publications"
            className="focus-ring text-sm font-bold uppercase tracking-wide text-[var(--color-cobalt)] underline-offset-4 hover:underline"
          >
            Full publication index →
          </Link>
        </div>

        <ul className="mt-12 divide-y-2 divide-[var(--color-ink)] border-y-2 border-[var(--color-ink)]">
          {selectedPublications.map((pub) => (
            <li key={pub.id} className="grid gap-4 py-8 md:grid-cols-[140px_1fr_auto] md:gap-8">
              <div>
                <p className="meta-label text-[var(--color-cobalt)]">{pub.type}</p>
                <p className="mt-2 font-mono text-sm text-[var(--color-ink-muted)]">
                  {pub.year} · {pub.theme}
                </p>
              </div>
              <div>
                <h3 className="font-display text-xl leading-snug text-[var(--color-ink)] md:text-2xl">
                  {pub.title}
                </h3>
                <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
                  {pub.outlet}
                </p>
                <p className="mt-3 text-base leading-relaxed text-[var(--color-ink)]">
                  <span className="meta-label mr-2 inline text-[var(--color-cobalt)]">
                    Why it matters
                  </span>
                  {pub.whyItMatters}
                </p>
              </div>
              <div className="flex flex-row gap-3 md:flex-col md:items-end">
                <Link
                  href={pub.href}
                  {...(pub.href.startsWith("http")
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="focus-ring text-sm font-bold uppercase tracking-wide text-[var(--color-cobalt)] underline-offset-4 hover:underline"
                >
                  Read
                </Link>
                {pub.doi ? (
                  <Link
                    href={`https://doi.org/${pub.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="focus-ring meta-label text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
                  >
                    DOI
                  </Link>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
