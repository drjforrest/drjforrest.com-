import Link from "next/link";
import { getAllPosts } from "@/lib/blog/posts";
import { PageIntro } from "@/components/page-intro";

export const metadata = {
  title: "Blog | Jamie Forrest",
  description:
    "Rounds & Square Pegs — essays on technology, health, evidence, and trust.",
};

export default function BlogHome() {
  const posts = getAllPosts();
  const [featured, ...rest] = posts;

  return (
    <>
      <PageIntro
        tone="ink"
        kicker="Blog"
        title="Rounds & Square Pegs"
        description="Essays and field notes on technology, health, evidence, and trust. The archive lives in this site—not a separate destination."
      />

      {featured ? (
        <section className="site-section bg-white">
          <div className="container">
            <p className="meta-label text-[var(--color-cobalt)]">Latest</p>
            <article className="mt-4 border-2 border-[var(--color-ink)] bg-[var(--color-chalk)] p-6 md:p-10">
              <p className="meta-label text-[var(--color-cobalt)]">
                {featured.articleType} · {featured.category} ·{" "}
                {new Date(featured.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <h2 className="mt-4 max-w-4xl font-display text-3xl tracking-tight text-[var(--color-ink)] md:text-5xl">
                <Link
                  href={`/blog/posts/${featured.slug}`}
                  className="focus-ring underline-offset-4 hover:underline"
                >
                  {featured.title}
                </Link>
              </h2>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[var(--color-ink-muted)]">
                {featured.excerpt}
              </p>
              <Link
                href={`/blog/posts/${featured.slug}`}
                className="focus-ring mt-6 inline-flex bg-[var(--color-cobalt)] px-6 py-3 text-sm font-bold uppercase tracking-wide text-white hover:bg-[var(--color-cobalt-deep)]"
              >
                Read the essay →
              </Link>
            </article>
          </div>
        </section>
      ) : null}

      <section className="site-section bg-[var(--color-chalk)]">
        <div className="container">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="meta-label text-[var(--color-cobalt)]">Archive</p>
              <h2 className="mt-3 font-display text-3xl tracking-tight text-[var(--color-ink)]">
                All posts
              </h2>
            </div>
            <Link
              href="/blog/archive"
              className="focus-ring text-sm font-bold uppercase tracking-wide text-[var(--color-cobalt)] underline-offset-4 hover:underline"
            >
              Filter the archive →
            </Link>
          </div>
          <ul className="mt-8 divide-y-2 divide-[var(--color-ink)] border-y-2 border-[var(--color-ink)] bg-white">
            {(featured ? rest : posts).map((post) => (
              <li key={post.slug} className="px-4 py-6 md:px-6">
                <p className="meta-label text-[var(--color-cobalt)]">
                  {post.articleType} · {post.category} ·{" "}
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                <Link
                  href={`/blog/posts/${post.slug}`}
                  className="focus-ring mt-2 block font-display text-xl tracking-tight text-[var(--color-ink)] underline-offset-4 hover:underline"
                >
                  {post.title}
                </Link>
                <p className="mt-2 max-w-3xl text-base text-[var(--color-ink-muted)]">
                  {post.excerpt}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
