import Image from "next/image";
import Link from "next/link";

export function CitationNetworkSection() {
  return (
    <section
      id="citation-network"
      className="site-section bg-white"
      aria-labelledby="citation-network-heading"
    >
      <div className="container">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
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
          <div className="relative aspect-[5/3] overflow-hidden border-2 border-[var(--color-ink)] bg-[var(--color-chalk)]">
            <Image
              src="/images/neural-network.png"
              alt="Citation network visualization preview"
              fill
              className="object-contain p-4"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
