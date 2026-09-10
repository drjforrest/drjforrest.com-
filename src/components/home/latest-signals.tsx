import Link from "next/link";
import { BLOG_URL } from "@/lib/constants";
import { blogSignals } from "@/lib/home-content";

export function LatestSignals() {
  const featured = blogSignals.find((s) => s.featured) ?? blogSignals[0];
  const rest = blogSignals.filter((s) => s !== featured);

  return (
    <section className="site-section site-section--cobalt" aria-labelledby="signals-heading">
      <div className="container">
        <p className="meta-label text-[var(--color-signal)]">Latest signals</p>
        <h2
          id="signals-heading"
          className="mt-3 font-display text-4xl tracking-tight text-white md:text-6xl"
        >
          Ideas, field notes, and explainers.
        </h2>
        <p className="mt-4 max-w-2xl text-lg text-white/75">
          Writing on technology, health, evidence, and trust. Two blogs share
          a front door here; each keeps its own theme.
        </p>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <article className="border-2 border-white bg-[var(--color-ink)] p-8 text-white md:p-10">
            <p className="meta-label text-[var(--color-signal)]">Start here</p>
            <h3 className="mt-4 font-display text-3xl tracking-tight md:text-5xl">
              {featured.title}
            </h3>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-white/75">
              {featured.blurb}
            </p>
            <Link
              href={featured.href}
              className="focus-ring mt-8 inline-flex bg-[var(--color-signal)] px-5 py-3 text-sm font-bold uppercase tracking-wide text-[var(--color-ink)] transition-colors hover:bg-white"
            >
              Read the essay →
            </Link>
          </article>

          <div className="flex flex-col gap-4">
            {rest.map((signal) => (
              <article
                key={signal.title}
                className="border-2 border-white/40 bg-transparent p-5 text-white"
              >
                <p className="meta-label text-white/60">{signal.date}</p>
                <h3 className="mt-2 font-display text-xl">{signal.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/75">
                  {signal.blurb}
                </p>
                <Link
                  href={signal.href}
                  className="focus-ring mt-3 inline-flex text-sm font-bold uppercase tracking-wide text-[var(--color-signal)] underline-offset-4 hover:underline"
                >
                  Open →
                </Link>
              </article>
            ))}
            <Link
              href={BLOG_URL}
              className="focus-ring mt-2 inline-flex items-center justify-center border-2 border-white px-5 py-3 text-sm font-bold uppercase tracking-wide text-white hover:bg-white hover:text-[var(--color-cobalt)]"
            >
              Visit the writing
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
