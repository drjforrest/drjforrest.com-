import type { ReactNode } from "react";

type PageIntroProps = {
  kicker: string;
  title: string;
  description?: ReactNode;
  tone?: "paper" | "ink";
};

export function PageIntro({
  kicker,
  title,
  description,
  tone = "paper",
}: PageIntroProps) {
  const ink = tone === "ink";

  return (
    <section
      className={
        ink
          ? "site-section site-section--ink site-section--flush"
          : "site-section bg-white site-section--flush"
      }
    >
      <div className="container">
        <p
          className={
            ink
              ? "meta-label text-[var(--color-signal)]"
              : "meta-label text-[var(--color-cobalt)]"
          }
        >
          {kicker}
        </p>
        <h1
          className={`mt-3 max-w-4xl font-display text-4xl tracking-tight md:text-6xl ${
            ink ? "text-white" : "text-[var(--color-ink)]"
          }`}
        >
          {title}
        </h1>
        {description ? (
          <div
            className={`mt-5 max-w-2xl text-lg leading-relaxed ${
              ink ? "text-white/70" : "text-[var(--color-ink-muted)]"
            }`}
          >
            {description}
          </div>
        ) : null}
      </div>
    </section>
  );
}
