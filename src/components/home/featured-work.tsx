import Link from "next/link";
import { featuredProjects, secondaryAffiliations } from "@/lib/home-content";

export function FeaturedWork() {
  return (
    <section
      id="featured-work"
      className="site-section bg-white"
      aria-labelledby="featured-work-heading"
    >
      <div className="container">
        <p className="meta-label text-[var(--color-cobalt)]">Featured work</p>
        <h2
          id="featured-work-heading"
          className="mt-3 max-w-4xl font-display text-4xl tracking-tight text-[var(--color-ink)] md:text-6xl"
        >
          Teaching, trials, and health-system infrastructure.
        </h2>
        <p className="mt-4 max-w-2xl text-lg text-[var(--color-ink-muted)]">
          From Northeastern’s MSHI program to Rwanda’s national data platform and
          the TOGETHER Trial—work that treats evidence, infrastructure, and
          capacity as the conditions for useful technology.
        </p>

        <div className="mt-12 grid gap-0 md:grid-cols-2 md:border-2 md:border-[var(--color-ink)]">
          {featuredProjects.map((project, index) => (
            <article
              key={project.id}
              className="group flex min-h-[300px] flex-col border-2 border-[var(--color-ink)] bg-white p-6 transition-colors hover:bg-[var(--color-ink)] hover:text-white md:border-0 md:border-r md:border-b md:border-[var(--color-ink)] md:odd:border-l-0 md:[&:nth-child(-n+2)]:border-t-0 md:p-8"
            >
              <p className="meta-label text-[var(--color-cobalt)] group-hover:text-[var(--color-signal)]">
                {String(index + 1).padStart(2, "0")} / {project.artifactLabel}
              </p>
              <h3 className="mt-6 font-display text-3xl tracking-tight md:text-4xl">
                {project.title}
              </h3>
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

        <aside className="mt-10 border-t-2 border-[var(--color-ink)] pt-8">
          <p className="meta-label">Also</p>
          <ul className="mt-4 grid gap-4 md:grid-cols-2">
            {secondaryAffiliations.map((item) => (
              <li key={item.id} className="text-sm leading-relaxed text-[var(--color-ink-muted)]">
                <Link
                  href={item.href}
                  className="focus-ring font-bold text-[var(--color-ink)] underline-offset-4 hover:underline"
                >
                  {item.label}
                </Link>
                <span className="mx-2 text-[var(--color-line)]">·</span>
                {item.note}
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  );
}
