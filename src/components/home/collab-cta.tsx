import Link from "next/link";
import { collabContent } from "@/lib/home-content";

export function CollabCta() {
  return (
    <section className="site-section site-section--ink" aria-labelledby="collab-heading">
      <div className="container">
        <div className="border-2 border-[var(--color-signal)] px-6 py-12 md:px-12 md:py-16">
          <p className="meta-label text-[var(--color-signal)]">Collaborate</p>
          <h2
            id="collab-heading"
            className="mt-4 max-w-3xl font-display text-4xl tracking-tight text-white md:text-6xl"
          >
            {collabContent.headline}
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70">
            {collabContent.body}
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            {collabContent.actions.map((action, index) => {
              const primary = index === 0;
              return (
                <Link
                  key={action.label}
                  href={action.href}
                  {...(action.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className={
                    primary
                      ? "focus-ring inline-flex bg-[var(--color-signal)] px-5 py-3 text-sm font-bold uppercase tracking-wide text-[var(--color-ink)] hover:bg-white"
                      : "focus-ring inline-flex border-2 border-white/70 px-5 py-3 text-sm font-bold uppercase tracking-wide text-white hover:border-white hover:bg-white hover:text-[var(--color-ink)]"
                  }
                >
                  {action.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
