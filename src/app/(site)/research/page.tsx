import Link from "next/link";
import { PageIntro } from "@/components/page-intro";
import { CollabCta } from "@/components/home/collab-cta";

const areas = [
  {
    number: "01",
    title: "Digital innovation as subject",
    description:
      "How AI, mobile platforms, and data systems transform health research, practice, and policy—the socio-technical dynamics, not only the tools.",
    tags: ["Digital ecosystems", "AI policy", "Health informatics"],
  },
  {
    number: "02",
    title: "Digital innovation as method",
    description:
      "Computational methods, machine learning, and network analysis applied to complex health data—developing and validating methods that can actually be used.",
    tags: ["Machine learning", "Network analysis", "Visualization"],
  },
  {
    number: "03",
    title: "Equitable research partnerships",
    description:
      "Collaboration models in the digital age: funding flows, knowledge sharing, and capacity building in North–South and South–South partnerships.",
    tags: ["Collaboration", "Equity", "Capacity"],
  },
  {
    number: "04",
    title: "Impact and translation",
    description:
      "Moving findings into policy, tools, and practice. Frameworks and indicators for whether a digital health intervention changed anything that matters.",
    tags: ["Knowledge translation", "Policy", "Measurement"],
  },
];

const facets = [
  {
    title: "Projects",
    body: "Multi-year, grant-funded work on AI readiness in African health systems, analyses of international research networks, and digital tools for clinical decision support—always with academic, NGO, and government partners.",
    href: "/projects",
    prompt: "See the case files",
  },
  {
    title: "Methods",
    body: "Mixed methods: social network analysis to map collaboration; machine learning for pattern recognition; case study and ethnography for implementation context; visualization for audiences who will never read the appendix.",
  },
  {
    title: "Impact",
    body: "Beyond papers: policy briefs for ministries, open tools for researchers, and training curricula adopted by partner institutions. Novelty is not the test. Usefulness is.",
    href: "/publications",
    prompt: "Publication index",
  },
];

export default function ResearchPage() {
  return (
    <>
      <PageIntro
        kicker="Research"
        title="Technology is never just the technology."
        description="A program at the intersection of digital innovation, global health, and collaborative science—aimed at more equitable health systems, not more dashboards."
      />

      <section className="site-section bg-[var(--color-chalk)]">
        <div className="container">
          <p className="meta-label text-[var(--color-cobalt)]">Program</p>
          <h2 className="mt-3 font-display text-3xl tracking-tight text-[var(--color-ink)] md:text-5xl">
            Four lines of inquiry
          </h2>
          <div className="mt-10 grid gap-0 md:grid-cols-2 md:border-2 md:border-[var(--color-ink)]">
            {areas.map((area) => (
              <article
                key={area.title}
                className="border-2 border-[var(--color-ink)] bg-white p-6 md:border-0 md:border-r md:border-b md:border-[var(--color-ink)] md:odd:border-l-0 md:[&:nth-child(-n+2)]:border-t-0 md:p-8"
              >
                <p className="meta-label text-[var(--color-cobalt)]">{area.number}</p>
                <h3 className="mt-4 font-display text-2xl tracking-tight text-[var(--color-ink)]">
                  {area.title}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-[var(--color-ink-muted)]">
                  {area.description}
                </p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {area.tags.map((tag) => (
                    <li
                      key={tag}
                      className="meta-label border border-[var(--color-ink)]/25 px-2 py-1 text-[var(--color-ink-muted)]"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="site-section bg-white">
        <div className="container">
          <p className="meta-label text-[var(--color-cobalt)]">How the work runs</p>
          <h2 className="mt-3 font-display text-3xl tracking-tight text-[var(--color-ink)] md:text-5xl">
            Facets
          </h2>
          <ul className="mt-10 divide-y-2 divide-[var(--color-ink)] border-y-2 border-[var(--color-ink)]">
            {facets.map((facet) => (
              <li key={facet.title} className="grid gap-4 py-8 md:grid-cols-[200px_1fr]">
                <h3 className="font-display text-2xl tracking-tight text-[var(--color-ink)]">
                  {facet.title}
                </h3>
                <div>
                  <p className="max-w-2xl text-base leading-relaxed text-[var(--color-ink-muted)]">
                    {facet.body}
                  </p>
                  {facet.href ? (
                    <Link
                      href={facet.href}
                      className="focus-ring mt-4 inline-flex text-sm font-bold uppercase tracking-wide text-[var(--color-cobalt)] underline-offset-4 hover:underline"
                    >
                      {facet.prompt} →
                    </Link>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CollabCta />
    </>
  );
}
