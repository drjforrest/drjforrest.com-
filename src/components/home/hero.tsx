import Link from "next/link";
import { heroContent } from "@/lib/home-content";
import { AmplitudeMeter } from "@/components/home/amplitude-meter";

export function Hero() {
  return (
    <section
      className="hero-section site-section--flush relative overflow-hidden"
      aria-labelledby="hero-heading"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_15%,rgba(37,80,255,0.4),transparent_55%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_35%,rgba(7,8,10,0.9)_100%)]" />
      </div>

      {/* Layered behind copy — free field, not a card */}
      <AmplitudeMeter />

      <div className="container pointer-events-none relative z-10 pb-10 pt-24 md:pb-16 md:pt-28">
        <div className="pointer-events-auto relative max-w-3xl lg:max-w-[54%]">
          {/* Soft scrim so type stays sharp over the meter */}
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-x-6 -inset-y-4 -z-10 bg-[radial-gradient(ellipse_at_20%_40%,rgba(7,8,10,0.82)_0%,rgba(7,8,10,0.55)_45%,transparent_75%)] md:-inset-x-10"
          />
          <p className="mb-6 max-w-xl text-sm font-medium leading-snug text-[var(--color-signal)] md:text-[0.95rem] md:leading-relaxed">
            {heroContent.kicker}
          </p>
          <h1
            id="hero-heading"
            className="font-display text-[clamp(3rem,9vw,7rem)] leading-[0.9] text-white"
          >
            {heroContent.headline}
          </h1>
          <p className="mt-4 font-display text-[clamp(1.25rem,3.2vw,2.15rem)] leading-snug text-[var(--color-cobalt-bright)] md:mt-5">
            {heroContent.subhead}
          </p>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/75 md:text-xl">
            {heroContent.statement}
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href={heroContent.primaryCta.href}
              className="focus-ring inline-flex items-center justify-center rounded-none bg-[var(--color-signal)] px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-[var(--color-ink)] transition-colors hover:bg-white"
            >
              {heroContent.primaryCta.label}
            </Link>
            <Link
              href={heroContent.secondaryCta.href}
              {...(heroContent.secondaryCta.href.startsWith("http")
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="focus-ring inline-flex items-center justify-center rounded-none border-2 border-white/70 px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:border-white hover:bg-white hover:text-[var(--color-ink)]"
            >
              {heroContent.secondaryCta.label}
            </Link>
          </div>
          <p className="meta-label mt-8 text-white/40">
            Hover the field — noise becomes signal
          </p>
        </div>
      </div>
    </section>
  );
}
