import Link from "next/link";
import type { FeaturedProject } from "@/lib/home-content";

export function WorkExamples({
  projects,
  themeLabel,
}: {
  projects: FeaturedProject[];
  themeLabel: string;
}) {
  return (
    <div id="featured-work" className="mt-14 scroll-mt-24">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="meta-label text-[var(--color-cobalt)]">
            Examples · {projects.length}{" "}
            {projects.length === 1 ? "project" : "projects"}
          </p>
          <h3 className="mt-2 font-display text-3xl tracking-tight text-[var(--color-ink)] md:text-4xl">
            How the work addresses {themeLabel}
          </h3>
        </div>
      </div>

      {projects.length === 0 ? (
        <p className="mt-8 text-[var(--color-ink-muted)]">
          No projects tagged to this condition yet.
        </p>
      ) : (
        <div className="mt-8 grid gap-0 md:grid-cols-2 md:border-2 md:border-[var(--color-ink)]">
          {projects.map((project, index) => (
            <article
              key={project.id}
              className="group flex min-h-[260px] flex-col border-2 border-[var(--color-ink)] bg-white p-6 transition-colors hover:bg-[var(--color-ink)] hover:text-white md:border-0 md:border-r md:border-b md:border-[var(--color-ink)] md:odd:border-l-0 md:[&:nth-child(-n+2)]:border-t-0 md:p-8"
            >
              <p className="meta-label text-[var(--color-cobalt)] group-hover:text-[var(--color-signal)]">
                {String(index + 1).padStart(2, "0")} / {project.artifactLabel}
              </p>
              <h4 className="mt-6 font-display text-2xl tracking-tight md:text-3xl">
                {project.title}
              </h4>
              <p className="mt-4 text-base leading-relaxed text-[var(--color-ink-muted)] group-hover:text-white/70">
                {project.premise}
              </p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <li
                    key={tag}
                    className="meta-label border border-current/30 px-2 py-1 text-[var(--color-ink-muted)] group-hover:text-white/60"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
              <Link
                href={project.href}
                className="focus-ring mt-auto pt-8 text-sm font-bold uppercase tracking-wide text-[var(--color-cobalt)] underline-offset-4 group-hover:text-[var(--color-signal)] group-hover:underline"
                {...(project.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                {project.prompt} →
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
