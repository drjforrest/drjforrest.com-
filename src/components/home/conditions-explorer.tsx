"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { WorkExamples } from "@/components/home/featured-work";
import { RelatedPapers } from "@/components/home/research-record";
import {
  projectsForTheme,
  publicationsForTheme,
  themes,
  type ThemeId,
} from "@/lib/home-content";
import { cn } from "@/lib/utils";

export function ConditionsExplorer() {
  const [active, setActive] = useState<ThemeId>("evidence");
  const current = themes.find((t) => t.id === active) ?? themes[0];
  const projects = projectsForTheme(current.id);
  const papers = publicationsForTheme(current.id);

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
          Select one to read how the work addresses it, with only the matching
          projects below.
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
                id={`condition-tab-${theme.id}`}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls="condition-panel"
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

        <div
          id="condition-panel"
          role="tabpanel"
          aria-labelledby={`condition-tab-${current.id}`}
          aria-live="polite"
        >
          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:items-stretch lg:gap-x-10 lg:gap-y-3">
            <div className="lg:contents">
              <div className="relative aspect-square overflow-hidden border-2 border-[var(--color-ink)] bg-[var(--color-ink)] lg:col-start-1 lg:row-start-1 lg:h-full">
                <Image
                  src="/domains-of-adoption.jpeg"
                  alt="Diagram of five attributes that shape technology adoption in health systems: capacity, trust, evidence, access and equity, and infrastructure"
                  fill
                  className="object-contain object-center"
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  priority
                />
              </div>
              <p className="mt-3 text-sm text-[var(--color-ink-muted)] lg:col-start-1 lg:row-start-2 lg:mt-0">
                Five attributes for successful implementation.{" "}
                <span className="font-medium text-[var(--color-ink)]">
                  {current.label}
                </span>{" "}
                is selected.
              </p>
            </div>

            <div className="flex h-full flex-col border-2 border-[var(--color-ink)] bg-[var(--color-ink)] p-6 text-white md:p-8 lg:col-start-2 lg:row-start-1">
              <p className="meta-label text-[var(--color-signal)]">{current.label}</p>
              <p className="mt-4 text-xl leading-relaxed text-white/85">
                {current.explanation}
              </p>
              <div className="mt-8 border-t border-white/20 pt-6 lg:mt-auto lg:pt-8">
                <p className="meta-label text-[var(--color-signal)]">
                  How the work answers
                </p>
                <p className="mt-3 text-base leading-relaxed text-white/80 md:text-lg">
                  {current.workApproach}
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

          <WorkExamples projects={projects} themeLabel={current.label} />
          <RelatedPapers publications={papers} themeLabel={current.label} />
        </div>

        <noscript>
          <ul className="mt-8 space-y-8">
            {themes.map((theme) => (
              <li
                key={`ns-${theme.id}`}
                className="border-2 border-[var(--color-ink)] bg-white p-6"
              >
                <strong className="font-display text-2xl">{theme.label}</strong>
                <p className="mt-3">{theme.explanation}</p>
                <p className="mt-3">{theme.workApproach}</p>
                <ul className="mt-4 list-disc space-y-1 pl-5">
                  {projectsForTheme(theme.id).map((project) => (
                    <li key={project.id}>
                      <a href={project.href}>{project.title}</a>
                    </li>
                  ))}
                </ul>
                <a className="mt-4 inline-block" href={theme.relatedHref}>
                  {theme.goDeeperLabel}
                </a>
              </li>
            ))}
          </ul>
        </noscript>
      </div>
    </section>
  );
}
