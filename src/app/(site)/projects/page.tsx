import Link from "next/link";
import { PageIntro } from "@/components/page-intro";
import { CollabCta } from "@/components/home/collab-cta";

export const metadata = {
  title: "Work | Jamie Forrest",
  description:
    "Teaching, trials, national health-information systems, and applied tools—case files from research and practice.",
};

const current = [
  {
    id: "health-informatics-education",
    number: "01",
    name: "MSHI · Northeastern Vancouver",
    tagline: "Associate Director · Health informatics education",
    description:
      "Leading curriculum and program strategy for Northeastern’s MS in Health Informatics (Vancouver), and mentoring students entering informatics careers. The work treats evidence, infrastructure, and equity as the conditions under which technology is worth teaching.",
    tags: ["Teaching", "Curriculum", "Health informatics", "Capacity"],
    links: [] as { label: string; href: string }[],
  },
  {
    id: "medcontext",
    number: "02",
    name: "MedContext",
    tagline: "Agentic AI for medical misinformation detection",
    description:
      "Multimodal detection across open and social sources, with particular attention to authentic images paired with false claims. Evaluates contextual authenticity rather than content alone. Submitted to the Kaggle MedGemma Impact Challenge.",
    tags: ["AI/ML", "Health misinformation", "Kaggle"],
    links: [
      { label: "GitHub", href: "https://github.com/drjforrest/medcontext" },
    ],
  },
  {
    id: "manuscripts",
    number: "03",
    name: "Manuscripts",
    tagline: "Independent Mac app for academic workflow",
    description:
      "A focused desktop tool for papers, submissions, and revisions. Each manuscript becomes a complete record—authors, versions, submission state, journal requirements—rather than scattered notes and PDFs. Local-first.",
    tags: ["Mac app", "Academic tools"],
    links: [
      { label: "manuscripts-app.com", href: "https://manuscripts-app.com" },
    ],
  },
  {
    id: "boreal-labs",
    number: "04",
    name: "Boreal Labs",
    tagline: "Founder & principal scientist",
    description:
      "Private consulting, strategic guidance, and investment in global health, technology, and AI readiness.",
    tags: ["Consulting", "Advisory"],
    links: [{ label: "boreal-labs.com", href: "https://boreal-labs.com" }],
  },
];

const past = [
  {
    id: "together-trial",
    name: "TOGETHER Trial",
    tagline: "Executive Director · Adaptive platform clinical trial",
    description:
      "Evaluated repurposed therapies for COVID-19. Led recruitment of 12,000+ patients across 22 collaborating sites, with findings in The Lancet and the New England Journal of Medicine.",
    tags: ["Clinical trials", "Evidence", "COVID-19"],
    period: "2020–2023",
  },
  {
    id: "cytel",
    name: "Cytel Canada Health",
    tagline: "Director of Global Health Strategy",
    description:
      "Decision-support and visualization tools for policymakers modelling COVID-19 impacts and tracking global trial progress. Work for the Bill & Melinda Gates Foundation, UNICEF, and Health Data Research UK.",
    tags: ["Policy", "Data visualization"],
    period: "2020–2021",
  },
  {
    id: "purpose-africa",
    name: "Purpose Africa",
    tagline: "Research capacity · Ministries of Health",
    description:
      "Supporting African ministries to build clinical-research infrastructure and strengthen biomedical value chains through training, mentorship, and collaborative partnerships.",
    tags: ["Capacity", "Partnerships", "Africa"],
    period: "2016–present",
  },
  {
    id: "rwanda-biomedical-centre",
    name: "Rwanda Biomedical Centre",
    tagline: "Data science advisor · Ministry of Health",
    description:
      "Scientific and analytic support to the Division of HIV, STIs and Viral Hepatitis: surveillance indicators, data quality, and routine reporting. Supported RHAP and DHIS2-based national systems.",
    tags: ["Infrastructure", "Government", "Rwanda"],
    period: "2017–2019",
  },
];

export default function ProjectsPage() {
  return (
    <>
      <PageIntro
        kicker="Work"
        title="Case files, not a gallery."
        description="Teaching, trials, national data platforms, and a few tools built because the existing ones were not good enough. Each file is a system—people, infrastructure, and evidence—not a logo."
      />

      <section className="site-section bg-[var(--color-chalk)]">
        <div className="container">
          <p className="meta-label text-[var(--color-cobalt)]">Current</p>
          <h2 className="mt-3 font-display text-3xl tracking-tight text-[var(--color-ink)] md:text-5xl">
            Active work
          </h2>
          <div className="mt-10 grid gap-0 md:grid-cols-2 md:border-2 md:border-[var(--color-ink)]">
            {current.map((project) => (
              <article
                key={project.id}
                id={project.id}
                className="flex min-h-[280px] scroll-mt-24 flex-col border-2 border-[var(--color-ink)] bg-white p-6 md:border-0 md:border-r md:border-b md:border-[var(--color-ink)] md:odd:border-l-0 md:[&:nth-child(-n+2)]:border-t-0 md:p-8"
              >
                <p className="meta-label text-[var(--color-cobalt)]">
                  {project.number} / {project.tagline}
                </p>
                <h3 className="mt-6 font-display text-3xl tracking-tight text-[var(--color-ink)]">
                  {project.name}
                </h3>
                <p className="mt-4 flex-1 text-base leading-relaxed text-[var(--color-ink-muted)]">
                  {project.description}
                </p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <li
                      key={tag}
                      className="meta-label border border-[var(--color-ink)]/25 px-2 py-1 text-[var(--color-ink-muted)]"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
                {project.links.length > 0 ? (
                  <div className="mt-6 flex flex-wrap gap-4">
                    {project.links.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="focus-ring text-sm font-bold uppercase tracking-wide text-[var(--color-cobalt)] underline-offset-4 hover:underline"
                      >
                        {link.label} →
                      </a>
                    ))}
                  </div>
                ) : null}
              </article>
            ))}
          </div>

          <p className="mt-8 text-sm text-[var(--color-ink-muted)]">
            Also:{" "}
            <a
              href="https://www.counterforce.tech/"
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring font-bold text-[var(--color-ink)] underline-offset-4 hover:underline"
            >
              Counterforce AI
            </a>
            — advisor; first employee. Social-listening tools for online
            disinformation during public-health emergencies.
          </p>
        </div>
      </section>

      <section className="site-section bg-white">
        <div className="container">
          <p className="meta-label text-[var(--color-cobalt)]">Archive</p>
          <h2 className="mt-3 font-display text-3xl tracking-tight text-[var(--color-ink)] md:text-5xl">
            Previous systems
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-[var(--color-ink-muted)]">
            Leadership in trials, ministry data systems, and research-capacity
            partnerships.
          </p>
          <ul className="mt-10 divide-y-2 divide-[var(--color-ink)] border-y-2 border-[var(--color-ink)]">
            {past.map((project) => (
              <li
                key={project.id}
                id={project.id}
                className="grid scroll-mt-24 gap-4 py-8 md:grid-cols-[160px_1fr]"
              >
                <p className="meta-label text-[var(--color-cobalt)]">
                  {project.period}
                </p>
                <div>
                  <h3 className="font-display text-2xl tracking-tight text-[var(--color-ink)]">
                    {project.name}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-[var(--color-ink-muted)]">
                    {project.tagline}
                  </p>
                  <p className="mt-3 max-w-2xl text-base leading-relaxed text-[var(--color-ink-muted)]">
                    {project.description}
                  </p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <li
                        key={tag}
                        className="meta-label border border-[var(--color-ink)]/25 px-2 py-1 text-[var(--color-ink-muted)]"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
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
