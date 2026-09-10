import Link from "next/link";
import type { SelectedPublication } from "@/lib/home-content";

export function RelatedPapers({
  publications,
  themeLabel,
}: {
  publications: SelectedPublication[];
  themeLabel: string;
}) {
  if (publications.length === 0) {
    return null;
  }

  return (
    <div className="mt-14">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="meta-label text-[var(--color-cobalt)]">Related papers</p>
          <h3 className="mt-2 font-display text-2xl tracking-tight text-[var(--color-ink)] md:text-3xl">
            Research that speaks to {themeLabel}
          </h3>
        </div>
        <Link
          href="/publications"
          className="focus-ring text-sm font-bold uppercase tracking-wide text-[var(--color-cobalt)] underline-offset-4 hover:underline"
        >
          Full publication index →
        </Link>
      </div>

      <ul className="mt-8 divide-y-2 divide-[var(--color-ink)] border-y-2 border-[var(--color-ink)]">
        {publications.map((pub) => (
          <li
            key={pub.id}
            className="grid gap-4 py-6 md:grid-cols-[120px_1fr_auto] md:gap-8"
          >
            <div>
              <p className="meta-label text-[var(--color-cobalt)]">{pub.type}</p>
              <p className="mt-2 font-mono text-sm text-[var(--color-ink-muted)]">
                {pub.year}
              </p>
            </div>
            <div>
              <h4 className="font-display text-lg leading-snug text-[var(--color-ink)] md:text-xl">
                {pub.title}
              </h4>
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
  );
}
