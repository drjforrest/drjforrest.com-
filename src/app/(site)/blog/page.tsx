import Link from "next/link";
import { getAllPosts } from "@/lib/blog/posts";
import { PageIntro } from "@/components/page-intro";
import { BLOG_URL } from "@/lib/constants";

export default function BlogHome() {
  const posts = getAllPosts();

  return (
    <>
      <PageIntro
        tone="ink"
        kicker="Writing"
        title="Rounds & Square Pegs"
        description="New essays live on the public blog. This page is the on-site archive of earlier posts."
      />

      <section className="site-section bg-white">
        <div className="container">
          <a
            href={BLOG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring inline-flex bg-[var(--color-cobalt)] px-6 py-3 text-sm font-bold uppercase tracking-wide text-white hover:bg-[var(--color-cobalt-deep)]"
          >
            Visit the blog →
          </a>
          <Link
            href="/blog/archive"
            className="focus-ring ml-4 inline-flex border-2 border-[var(--color-ink)] px-6 py-3 text-sm font-bold uppercase tracking-wide text-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-white"
          >
            Full archive
          </Link>
        </div>
      </section>

      <section className="site-section bg-[var(--color-chalk)]">
        <div className="container">
          <p className="meta-label text-[var(--color-cobalt)]">On-site archive</p>
          <h2 className="mt-3 font-display text-3xl tracking-tight text-[var(--color-ink)]">
            Earlier posts
          </h2>
          <ul className="mt-8 divide-y-2 divide-[var(--color-ink)] border-y-2 border-[var(--color-ink)] bg-white">
            {posts.slice(0, 8).map((post) => (
              <li key={post.slug} className="px-4 py-6 md:px-6">
                <p className="meta-label text-[var(--color-cobalt)]">
                  {post.articleType} · {post.category}
                </p>
                <Link
                  href={`/blog/posts/${post.slug}`}
                  className="focus-ring mt-2 block font-display text-xl tracking-tight text-[var(--color-ink)] underline-offset-4 hover:underline"
                >
                  {post.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
