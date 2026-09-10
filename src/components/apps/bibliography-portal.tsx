import Link from "next/link";
import { logoutBibliography } from "@/app/apps/bibliography/actions";
import { BIBLIOGRAPHY_URL } from "@/lib/bibliography-auth";

const capabilities = [
  {
    title: "PDF processing",
    body: "Drop papers in. Text, metadata, and files are extracted and stored with UUID-based deduplication.",
  },
  {
    title: "Search",
    body: "Full-text and semantic search over the library, with similarity scoring against the collection.",
  },
  {
    title: "Citations",
    body: "Format references as APA, MLA, Chicago, IEEE, Harvard, or BibTeX without leaving the paper.",
  },
  {
    title: "Team notes",
    body: "User-attributed annotations with private or shared visibility for collaborators.",
  },
];

export function BibliographyPortal() {
  return (
    <>
      <section className="site-section bg-white site-section--flush">
        <div className="container">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="meta-label text-[var(--color-cobalt)]">Internal library</p>
              <h1 className="mt-3 max-w-3xl font-display text-4xl tracking-tight text-[var(--color-ink)] md:text-5xl">
                Bibliography
              </h1>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[var(--color-ink-muted)]">
                Scientific papers, PDFs, citations, and team notes. Invite-only.
                The app is at library.drjforrest.com when that host is online.
              </p>
            </div>
            <form action={logoutBibliography}>
              <button
                type="submit"
                className="focus-ring meta-label text-[var(--color-ink-muted)] underline-offset-4 hover:underline"
              >
                Sign out
              </button>
            </form>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={BIBLIOGRAPHY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring inline-flex bg-[var(--color-cobalt)] px-6 py-3 text-sm font-bold uppercase tracking-wide text-white hover:bg-[var(--color-cobalt-deep)]"
            >
              Open library →
            </a>
            <Link
              href="/#apps"
              className="focus-ring inline-flex border-2 border-[var(--color-ink)] px-6 py-3 text-sm font-bold uppercase tracking-wide text-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-white"
            >
              Back to Apps
            </Link>
          </div>
        </div>
      </section>

      <section className="site-section bg-[var(--color-chalk)]">
        <div className="container">
          <p className="meta-label text-[var(--color-cobalt)]">What it does</p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl tracking-tight text-[var(--color-ink)]">
            A working library, not a reference dump.
          </h2>
          <ul className="mt-10 grid gap-0 border-2 border-[var(--color-ink)] md:grid-cols-2">
            {capabilities.map((item) => (
              <li
                key={item.title}
                className="border-[var(--color-ink)] p-6 odd:border-b-2 md:odd:border-b-0 md:odd:border-r-2 md:[&:nth-child(-n+2)]:border-b-2"
              >
                <h3 className="font-display text-xl text-[var(--color-ink)]">
                  {item.title}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-[var(--color-ink-muted)]">
                  {item.body}
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-8 max-w-2xl text-sm text-[var(--color-ink-muted)]">
            If the library host is down, this page still unlocks for people with
            the code. Try the Open library link again later. Do not share the
            code without approval.
          </p>
        </div>
      </section>
    </>
  );
}
