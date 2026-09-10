import Link from "next/link";
import { CitationNetworkPreview } from "@/components/home/citation-network-preview";
import { getHomepageNetworkPreview } from "@/lib/citation-network/openalex";

export function CitationNetworkSection() {
  const network = getHomepageNetworkPreview();

  return (
    <section
      id="citation-network"
      className="site-section bg-white"
      aria-labelledby="citation-network-heading"
    >
      <div className="container">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch">
          <div>
            <p className="meta-label text-[var(--color-cobalt)]">Interactive tool</p>
            <h2
              id="citation-network-heading"
              className="mt-3 max-w-3xl font-display text-4xl tracking-tight text-[var(--color-ink)] md:text-6xl"
            >
              Citation network generator
            </h2>
            <p className="mt-4 max-w-2xl text-lg text-[var(--color-ink-muted)]">
              Explore how publications connect—citation patterns and thematic clusters
              drawn from the public scholarly record.
            </p>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--color-ink-muted)]">
              Start with my network, or generate a temporary view from a name, ORCID,
              or OpenAlex profile to see how a research program hangs together.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/research-network"
                className="focus-ring inline-flex items-center justify-center bg-[var(--color-cobalt)] px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-[var(--color-cobalt-deep)]"
              >
                Explore the network →
              </Link>
              <Link
                href="/research-network#ml-pipeline"
                className="focus-ring inline-flex items-center justify-center border-2 border-[var(--color-ink)] px-6 py-3 text-sm font-bold uppercase tracking-wide text-[var(--color-ink)] transition-colors hover:bg-[var(--color-ink)] hover:text-white"
              >
                How it works
              </Link>
            </div>
          </div>
          <Link
            href="/research-network"
            aria-label="Open the citation network visualization"
            className="focus-ring group relative block aspect-[5/3] overflow-hidden border-2 border-[var(--color-ink)] bg-[var(--color-ink)] transition-colors hover:border-[var(--color-cobalt)] lg:aspect-auto lg:h-full lg:min-h-[320px]"
          >
            <CitationNetworkPreview data={network} />
            <span className="pointer-events-none absolute bottom-4 right-4 bg-[var(--color-signal)] px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-[var(--color-ink)] opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
              Explore →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
