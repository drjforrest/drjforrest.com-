import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { publications } from "@/lib/data";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return publications.map((publication) => ({
    slug: publication.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const publication = publications.find((p) => p.slug === slug);

  if (!publication) {
    return { title: "Publication Not Found" };
  }

  return {
    title: `${publication.title} | Jamie Forrest`,
    description: publication.abstract.substring(0, 160) + "...",
    openGraph: {
      title: publication.title,
      description: publication.abstract.substring(0, 160) + "...",
      images: [publication.imageUrl],
    },
  };
}

export default async function PublicationPage({ params }: Props) {
  const { slug } = await params;
  const publication = publications.find((p) => p.slug === slug);

  if (!publication) {
    notFound();
  }

  const relatedPublications = publications
    .filter((p) => p.id !== publication.id)
    .filter((p) => p.tags.some((tag) => publication.tags.includes(tag)))
    .slice(0, 3);

  return (
    <>
      <section className="site-section bg-white site-section--flush">
        <div className="container">
          <Link
            href="/publications"
            className="focus-ring meta-label text-[var(--color-cobalt)] underline-offset-4 hover:underline"
          >
            ← Publication index
          </Link>
          <p className="mt-8 meta-label text-[var(--color-cobalt)]">
            {publication.journal} · {publication.year}
          </p>
          <h1 className="mt-3 max-w-4xl font-display text-3xl tracking-tight text-[var(--color-ink)] md:text-5xl">
            {publication.title}
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-[var(--color-ink-muted)]">
            {publication.authors}
          </p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {publication.tags.map((tag) => (
              <li
                key={tag}
                className="meta-label border-2 border-[var(--color-ink)] px-2 py-1 text-[var(--color-ink)]"
              >
                {tag}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="site-section bg-[var(--color-chalk)]">
        <div className="container grid gap-10 lg:grid-cols-[1fr_280px]">
          <div>
            <p className="meta-label text-[var(--color-cobalt)]">Abstract</p>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[var(--color-ink)]">
              {publication.abstract}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={publication.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring inline-flex bg-[var(--color-cobalt)] px-5 py-3 text-sm font-bold uppercase tracking-wide text-white hover:bg-[var(--color-cobalt-deep)]"
              >
                Read paper →
              </a>
              {publication.fullTextUrl &&
              publication.fullTextUrl !== publication.pdfUrl ? (
                <a
                  href={publication.fullTextUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-ring inline-flex border-2 border-[var(--color-ink)] px-5 py-3 text-sm font-bold uppercase tracking-wide text-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-white"
                >
                  Full text
                </a>
              ) : null}
            </div>
            {publication.doi ? (
              <p className="mt-6 text-sm text-[var(--color-ink-muted)]">
                DOI:{" "}
                <a
                  href={`https://doi.org/${publication.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-ring font-medium text-[var(--color-cobalt)] underline-offset-4 hover:underline"
                >
                  {publication.doi}
                </a>
              </p>
            ) : null}
          </div>
          <aside className="h-fit border-2 border-[var(--color-ink)] bg-white p-6">
            <p className="meta-label text-[var(--color-cobalt)]">Citations</p>
            <p className="mt-3 font-display text-4xl tracking-tight text-[var(--color-ink)]">
              {publication.cites.toLocaleString()}
            </p>
            <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
              {publication.citesPerYear.toFixed(1)} per year
            </p>
          </aside>
        </div>
      </section>

      {relatedPublications.length > 0 ? (
        <section className="site-section bg-white">
          <div className="container">
            <p className="meta-label text-[var(--color-cobalt)]">Related</p>
            <h2 className="mt-3 font-display text-3xl tracking-tight text-[var(--color-ink)]">
              Nearby in the record
            </h2>
            <ul className="mt-8 divide-y-2 divide-[var(--color-ink)] border-y-2 border-[var(--color-ink)]">
              {relatedPublications.map((related) => (
                <li key={related.id} className="py-6">
                  <p className="meta-label text-[var(--color-cobalt)]">
                    {related.year} · {related.journal}
                  </p>
                  <Link
                    href={`/publications/${related.slug}`}
                    className="focus-ring mt-2 block font-display text-xl tracking-tight text-[var(--color-ink)] underline-offset-4 hover:underline"
                  >
                    {related.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </>
  );
}
