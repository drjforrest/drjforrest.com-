import Image from "next/image";
import Link from "next/link";
import { apps } from "@/lib/apps";

export function AppsSection() {
  const featured = apps.find((app) => app.featured) ?? apps[0];
  const secondary = apps.filter((app) => app.id !== featured.id);

  return (
    <section
      id="apps"
      className="site-section site-section--ink"
      aria-labelledby="apps-heading"
    >
      <div className="container">
        <p className="meta-label text-[var(--color-signal)]">Apps</p>
        <h2
          id="apps-heading"
          className="mt-3 max-w-4xl font-display text-4xl tracking-tight text-white md:text-6xl"
        >
          Tools I build and ship.
        </h2>
        <p className="mt-4 max-w-2xl text-lg text-white/70">
          Independent software for academic work, social signal intelligence, and
          trust defense—available to buy, download, or explore.
        </p>

        <article className="mt-12 grid gap-0 border-2 border-white/20 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="relative min-h-[280px] overflow-hidden bg-[var(--color-ink-soft)] lg:min-h-[420px]">
            <Image
              src={featured.image}
              alt={featured.imageAlt}
              fill
              className="object-cover object-top"
              sizes="(max-width: 1024px) 100vw, 60vw"
              priority
            />
          </div>
          <div className="flex flex-col justify-between border-t-2 border-white/20 bg-[var(--color-ink)] p-6 md:p-8 lg:border-l-2 lg:border-t-0">
            {featured.badge ? (
              <p className="meta-label text-[var(--color-signal)]">{featured.badge}</p>
            ) : null}
            <div className="mt-4">
              <h3 className="font-display text-3xl tracking-tight text-white md:text-4xl">
                {featured.name}
              </h3>
              <p className="mt-2 text-sm font-medium uppercase tracking-wide text-[var(--color-cobalt-bright)]">
                {featured.tagline}
              </p>
              <p className="mt-5 text-base leading-relaxed text-white/75">
                {featured.description}
              </p>
            </div>
            <Link
              href={featured.href}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring mt-8 inline-flex w-fit items-center justify-center bg-[var(--color-signal)] px-6 py-3 text-sm font-bold uppercase tracking-wide text-[var(--color-ink)] transition-colors hover:bg-white"
            >
              {featured.cta} →
            </Link>
          </div>
        </article>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {secondary.map((app) => (
            <article
              key={app.id}
              className="flex flex-col border-2 border-white/20 bg-[var(--color-ink-soft)] p-6 transition-colors hover:border-[var(--color-signal)]/50 md:p-7"
            >
              <div className="flex items-start gap-4">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden border border-white/15 bg-white/5 p-2">
                  <Image
                    src={app.image}
                    alt={app.imageAlt}
                    fill
                    className="object-contain p-1"
                    sizes="56px"
                  />
                </div>
                <div>
                  {app.badge ? (
                    <p className="meta-label text-[var(--color-signal)]">{app.badge}</p>
                  ) : null}
                  <h3 className="mt-1 font-display text-2xl tracking-tight text-white">
                    {app.name}
                  </h3>
                  <p className="mt-1 text-sm text-[var(--color-cobalt-bright)]">
                    {app.tagline}
                  </p>
                </div>
              </div>
              <p className="mt-5 flex-1 text-base leading-relaxed text-white/70">
                {app.description}
              </p>
              <Link
                href={app.href}
                className="focus-ring mt-6 inline-flex text-sm font-bold uppercase tracking-wide text-[var(--color-signal)] underline-offset-4 hover:underline"
                {...(app.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                {app.cta} →
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
