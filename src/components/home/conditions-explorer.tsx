"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { themes, type ThemeId } from "@/lib/home-content";
import { cn } from "@/lib/utils";

export function ConditionsExplorer() {
  const [active, setActive] = useState<ThemeId>("evidence");
  const current = themes.find((t) => t.id === active) ?? themes[0];

  return (
    <section
      className="site-section bg-[var(--color-chalk)]"
      aria-labelledby="conditions-heading"
      id="explore-conditions"
    >
      <div className="container">
        <p className="meta-label">Explore the conditions</p>
        <h2
          id="conditions-heading"
          className="mt-3 max-w-4xl font-display text-4xl tracking-tight text-[var(--color-ink)] md:text-6xl"
        >
          Technology does not arrive in a vacuum.
        </h2>
        <p className="mt-4 max-w-2xl text-lg text-[var(--color-ink-muted)]">
          Five conditions shape whether health technology creates value—and for whom.
          Select a theme to see how the work maps onto each.
        </p>

        <div
          className="mt-8 flex flex-wrap gap-2"
          role="tablist"
          aria-label="Conditions"
        >
          {themes.map((theme) => {
            const selected = theme.id === active;
            return (
              <button
                key={theme.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setActive(theme.id)}
                className={cn(
                  "focus-ring border-2 px-3 py-1.5 text-sm font-medium transition-colors",
                  selected
                    ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-signal)]"
                    : "border-[var(--color-ink)] bg-white text-[var(--color-ink)] hover:bg-[var(--color-cobalt)] hover:text-white hover:border-[var(--color-cobalt)]"
                )}
              >
                {theme.label}
              </button>
            );
          })}
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div className="relative aspect-square max-w-3xl overflow-hidden border-2 border-[var(--color-ink)] bg-[var(--color-ink)]">
            <Image
              src="/domains-of-adoption.jpeg"
              alt="Diagram of domains that shape technology adoption in health systems"
              fill
              className="object-contain object-center"
              sizes="(max-width: 1024px) 100vw, 60vw"
              priority
            />
          </div>

          <div
            className="border-2 border-[var(--color-ink)] bg-[var(--color-ink)] p-6 text-white md:p-8"
            aria-live="polite"
            role="tabpanel"
          >
            <p className="meta-label text-[var(--color-signal)]">{current.label}</p>
            <p className="mt-4 text-xl leading-relaxed text-white/85">
              {current.explanation}
            </p>
            <div className="mt-8 border-t border-white/20 pt-6">
              <p className="meta-label">Featured project</p>
              <p className="mt-2 font-display text-2xl text-[var(--color-signal)]">
                {current.featuredProjectLabel}
              </p>
              <Link
                href={current.relatedHref}
                className="focus-ring mt-6 inline-flex text-sm font-bold uppercase tracking-wide text-[var(--color-signal)] underline-offset-4 hover:underline"
              >
                {current.goDeeperLabel} →
              </Link>
            </div>
          </div>
        </div>

        <noscript>
          <ul className="mt-8 space-y-4">
            {themes.map((theme) => (
              <li
                key={`ns-${theme.id}`}
                className="border border-[var(--color-line)] p-4"
              >
                <strong>{theme.label}</strong>
                <p>{theme.explanation}</p>
                <a href={theme.relatedHref}>{theme.goDeeperLabel}</a>
              </li>
            ))}
          </ul>
        </noscript>
      </div>
    </section>
  );
}
