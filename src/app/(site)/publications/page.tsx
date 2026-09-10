"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { publications, Publication } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { PageIntro } from "@/components/page-intro";

type SortKey = "newest" | "oldest" | "cited" | "title";
type DecadeKey = "all" | "2020" | "2010" | "2000";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "cited", label: "Most cited" },
  { value: "title", label: "Title A–Z" },
];

const DECADE_OPTIONS: { value: DecadeKey; label: string }[] = [
  { value: "all", label: "All years" },
  { value: "2020", label: "2020s" },
  { value: "2010", label: "2010s" },
  { value: "2000", label: "2000s" },
];

function isFirstAuthor(authors: string) {
  return /Forrest/i.test(authors.split(",")[0] ?? "");
}

function inDecade(year: number, decade: DecadeKey) {
  if (decade === "all") return true;
  const start = Number(decade);
  return year >= start && year < start + 10;
}

function chipClass(active: boolean) {
  return active
    ? "inline-flex items-center border-2 border-[var(--color-ink)] bg-[var(--color-ink)] px-3 py-2 font-mono text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-signal)]"
    : "inline-flex items-center border-2 border-[var(--color-ink)] bg-white px-3 py-2 font-mono text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-[var(--color-signal)]";
}

function sortPublications(list: Publication[], sort: SortKey) {
  const next = [...list];
  next.sort((a, b) => {
    if (sort === "newest") return b.year - a.year || b.cites - a.cites;
    if (sort === "oldest") return a.year - b.year || b.cites - a.cites;
    if (sort === "cited") return b.cites - a.cites || b.year - a.year;
    return a.title.localeCompare(b.title);
  });
  return next;
}

export default function PublicationsPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sort, setSort] = useState<SortKey>("newest");
  const [decade, setDecade] = useState<DecadeKey>("all");
  const [firstAuthorOnly, setFirstAuthorOnly] = useState(false);

  const allTags = useMemo(
    () => [...new Set(publications.flatMap((p) => p.tags))].sort(),
    [],
  );

  const handleCopyCitation = (publication: Publication) => {
    const citation = `${publication.authors}. (${publication.year}). ${publication.title}. ${publication.journal}.${publication.doi ? ` doi:${publication.doi}` : ""}`;
    navigator.clipboard.writeText(citation);
    toast({
      title: "Citation copied",
      description: "The citation is on your clipboard.",
    });
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const filtersActive =
    searchTerm.trim() !== "" ||
    selectedTags.length > 0 ||
    decade !== "all" ||
    firstAuthorOnly;

  const filteredPublications = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    const list = publications.filter((p) => {
      const haystack = `${p.title} ${p.authors} ${p.journal} ${p.year}`.toLowerCase();
      const matchesSearch = q === "" || haystack.includes(q);
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every((tag) => p.tags.includes(tag));
      const matchesDecade = inDecade(p.year, decade);
      const matchesAuthor = !firstAuthorOnly || isFirstAuthor(p.authors);
      return matchesSearch && matchesTags && matchesDecade && matchesAuthor;
    });
    return sortPublications(list, sort);
  }, [searchTerm, selectedTags, decade, firstAuthorOnly, sort]);

  return (
    <>
      <PageIntro
        kicker="Publications"
        title="The scholarly record."
        description="Search, filter by decade or topic, and sort the full index. For a short reading list with why each paper matters, start on the home page."
      />

      <section className="site-section bg-[var(--color-chalk)]">
        <div className="container">
          <div className="border-2 border-[var(--color-ink)] bg-white p-4 md:p-6">
            <label className="sr-only" htmlFor="pub-search">
              Search publications
            </label>
            <input
              id="pub-search"
              type="search"
              placeholder="Search title, author, year, or journal"
              className="focus-ring w-full border-2 border-[var(--color-ink)] bg-[var(--color-chalk)] px-4 py-3 text-base text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className="mt-4 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
              <div>
                <p className="meta-label text-[var(--color-cobalt)]">Sort</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {SORT_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setSort(option.value)}
                      className={chipClass(sort === option.value)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              <p className="meta-label text-[var(--color-ink-muted)] md:text-right">
                {filteredPublications.length} of {publications.length}{" "}
                {filteredPublications.length === 1 ? "record" : "records"}
              </p>
            </div>

            <div className="mt-6">
              <p className="meta-label text-[var(--color-cobalt)]">Filter</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {DECADE_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setDecade(option.value)}
                    className={chipClass(decade === option.value)}
                  >
                    {option.label}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setFirstAuthorOnly((v) => !v)}
                  className={chipClass(firstAuthorOnly)}
                >
                  First author
                </button>
                {filtersActive ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedTags([]);
                      setDecade("all");
                      setFirstAuthorOnly(false);
                    }}
                    className="inline-flex items-center border-2 border-[var(--color-cobalt)] bg-white px-3 py-2 font-mono text-[0.72rem] font-medium uppercase tracking-[0.14em] text-[var(--color-cobalt)] hover:bg-[var(--color-cobalt)] hover:text-white"
                  >
                    Clear filters
                  </button>
                ) : null}
              </div>
            </div>

            <div className="mt-6">
              <p className="meta-label text-[var(--color-cobalt)]">Topics</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={chipClass(selectedTags.includes(tag))}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {filteredPublications.length === 0 ? (
            <p className="mt-10 text-lg text-[var(--color-ink-muted)]">
              Nothing matches those filters. Clear a topic or broaden the search.
            </p>
          ) : (
            <ul className="mt-8 divide-y-2 divide-[var(--color-ink)] border-y-2 border-[var(--color-ink)] bg-white">
              {filteredPublications.map((publication) => (
                <li
                  key={publication.id}
                  className="grid gap-4 px-4 py-8 md:grid-cols-[100px_1fr] md:px-6"
                >
                  <div>
                    <p className="meta-label text-[var(--color-cobalt)]">
                      {publication.year}
                    </p>
                    <p className="mt-2 font-mono text-xs text-[var(--color-ink-muted)]">
                      {publication.cites.toLocaleString()} cites
                    </p>
                  </div>
                  <div>
                    <h2 className="font-display text-xl leading-snug tracking-tight text-[var(--color-ink)] md:text-2xl">
                      <Link
                        href={`/publications/${publication.slug}`}
                        className="focus-ring underline-offset-4 hover:underline"
                      >
                        {publication.title}
                      </Link>
                    </h2>
                    <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
                      <span
                        dangerouslySetInnerHTML={{
                          __html: publication.authors.replace(
                            /\b(JI\s+Forrest|J\.?\s*I\.?\s*Forrest|Forrest\s*,?\s*J\.?\s*I?\.?)\b/gi,
                            "<b>$1</b>",
                          ),
                        }}
                      />
                    </p>
                    <p className="mt-1 text-sm italic text-[var(--color-ink-muted)]">
                      {publication.journal}
                    </p>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {publication.tags.map((tag) => (
                        <li
                          key={tag}
                          className="meta-label border border-[var(--color-ink)]/20 px-2 py-1 text-[var(--color-ink-muted)]"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 flex flex-wrap gap-4">
                      <Link
                        href={`/publications/${publication.slug}`}
                        className="focus-ring text-sm font-bold uppercase tracking-wide text-[var(--color-cobalt)] underline-offset-4 hover:underline"
                      >
                        Record →
                      </Link>
                      <a
                        href={publication.pdfUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="focus-ring text-sm font-bold uppercase tracking-wide text-[var(--color-ink)] underline-offset-4 hover:underline"
                      >
                        PDF
                      </a>
                      <button
                        type="button"
                        onClick={() => handleCopyCitation(publication)}
                        className="focus-ring text-sm font-bold uppercase tracking-wide text-[var(--color-ink)] underline-offset-4 hover:underline"
                      >
                        Copy citation
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
