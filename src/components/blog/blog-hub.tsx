import Link from "next/link";
import { PageIntro } from "@/components/page-intro";
import { writingSites } from "@/lib/writing-sites";

export function BlogHub() {
  return (
    <>
      <PageIntro
        tone="ink"
        kicker="Writing"
        title="Two blogs. Same author."
        description="Pick the room that fits the question. Each site keeps its own theme, maps, and cadence. This index is the front door."
      />

      <section className="site-section bg-white">
        <div className="container">
          <p className="meta-label text-[var(--color-cobalt)]">Choose a site</p>
          <div className="mt-8 grid gap-0 border-2 border-[var(--color-ink)] md:grid-cols-2">
            {writingSites.map((site) => (
              <Link
                key={site.id}
                href={site.href}
                className="focus-ring group flex min-h-[320px] flex-col border-b-2 border-[var(--color-ink)] bg-white p-8 transition-colors last:border-b-0 hover:bg-[var(--color-ink)] hover:text-white md:border-b-0 md:border-r-2 md:last:border-r-0 md:p-10"
              >
                <p className="meta-label text-[var(--color-cobalt)] group-hover:text-[var(--color-signal)]">
                  {site.index} / {site.kicker}
                </p>
                <h2 className="mt-6 font-display text-3xl tracking-tight text-[var(--color-ink)] group-hover:text-white md:text-5xl">
                  {site.name}
                </h2>
                <p className="mt-4 max-w-md flex-1 text-lg leading-relaxed text-[var(--color-ink-muted)] group-hover:text-white/70">
                  {site.blurb}
                </p>
                <span className="mt-8 inline-flex w-fit bg-[var(--color-cobalt)] px-6 py-3 text-sm font-bold uppercase tracking-wide text-white group-hover:bg-[var(--color-signal)] group-hover:text-[var(--color-ink)]">
                  {site.cta} →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="site-section bg-[var(--color-chalk)]">
        <div className="container flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="meta-label text-[var(--color-cobalt)]">On this domain</p>
            <h2 className="mt-3 font-display text-2xl tracking-tight text-[var(--color-ink)] md:text-3xl">
              Earlier essays stay readable here
            </h2>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-[var(--color-ink-muted)]">
              The two blogs live on their own hosts. Pieces already published
              on drjforrest.com remain in the archive so old links do not break.
            </p>
          </div>
          <Link
            href="/blog/archive"
            className="focus-ring text-sm font-bold uppercase tracking-wide text-[var(--color-cobalt)] underline-offset-4 hover:underline"
          >
            Open the archive →
          </Link>
        </div>
      </section>
    </>
  );
}
