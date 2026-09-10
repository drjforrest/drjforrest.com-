import Link from "next/link";
import { PageIntro } from "@/components/page-intro";
import { CollabCta } from "@/components/home/collab-cta";

export const metadata = {
  title: "Research & Scholarship | Jamie Forrest",
  description:
    "Science-of-science work on how health research gets done: global health systems, clinical research capacity, and digital health methods.",
};

const streams = [
  {
    number: "01",
    title: "Global health & health systems",
    description:
      "How institutions, policies, and data flows shape population health. This includes nearly five years advising Rwanda’s Ministry of Health and co-leading the Rwanda Health Analytics Platform across 500+ facilities—and a social-network analysis of AI diagnostic trial networks in sub-Saharan Africa that found complete structural fragmentation, with no institutional bridges between trials.",
    tags: ["Health systems", "Rwanda", "Science of science"],
  },
  {
    number: "02",
    title: "Clinical research capacity",
    description:
      "The human, institutional, and technical infrastructure that makes rigorous trials possible where they have historically been scarce. As Executive Director of the TOGETHER Adaptive Platform Trial, I oversaw more than 12 candidate therapies across more than 12,000 patients at 22 sites in six countries. Purpose Africa continues that capacity work with ministries of health.",
    tags: ["Trials", "Capacity", "TOGETHER"],
  },
  {
    number: "03",
    title: "Digital health & applied data science",
    description:
      "The methods: network analysis, bibliometrics, and computational social science, applied both to health problems and to the research enterprise itself. This includes Counterforce AI social-listening tools and the MedContext multimodal misinformation detector (91.4% on Med-MMHL)—and the toolkit for studying how knowledge actually flows.",
    tags: ["Network analysis", "AI", "Misinformation"],
  },
];

const current = [
  {
    id: "african-ai-innovation",
    title: "African AI innovation ecosystem",
    body: "Mapping research partnerships, funding flows, and institutional networks that shape AI in African health systems—including the trial-network analysis in The Lancet Regional Health — Africa (2026).",
  },
  {
    id: "science-of-science",
    title: "Science of science in global health",
    body: "Using network analysis and bibliometrics to study how global health research ecosystems are structured, where knowledge flows, and how capacity building works in practice.",
  },
  {
    id: "together-trial",
    title: "TOGETHER Trial — long COVID follow-up",
    body: "Co-investigator on fluvoxamine and metformin for fatigue (Annals of Internal Medicine, 2026), extending the platform that evaluated repurposed COVID-19 therapies.",
  },
  {
    id: "hero-lab",
    title: "Health misinformation & trust",
    body: "HERO Lab / Counterforce AI work on information disorder in health emergencies, including social listening and MedContext multimodal detection.",
  },
];

const past = [
  {
    id: "together-trial-archive",
    period: "2020–2023",
    role: "Executive Director",
    org: "TOGETHER Adaptive Platform Trial",
  },
  {
    id: "mcmaster",
    period: "2022–2025",
    role: "Senior Researcher",
    org: "McMaster University, Health Research Methods, Evidence & Impact",
  },
  {
    id: "purpose-africa",
    period: "2023–2025",
    role: "Co-founder",
    org: "Purpose Africa — clinical research capacity with ministries of health",
  },
  {
    id: "rwanda-biomedical-centre",
    period: "2015–2020",
    role: "Advisor",
    org: "Rwanda Ministry of Health / Rwanda Biomedical Centre",
  },
  {
    id: "university-of-rwanda",
    period: "2018–2024",
    role: "Adjunct Assistant Professor",
    org: "University of Rwanda, School of Public Health",
  },
  {
    id: "cytel",
    period: "2020–2021",
    role: "Director of Global Health Strategy",
    org: "Cytel Canada Health",
  },
];

export default function ResearchPage() {
  return (
    <>
      <PageIntro
        kicker="Research & Scholarship"
        title="Not just whether evidence is produced. How the ecosystem that produces it is organized."
        description="I use network analysis, bibliometrics, and computational social science to study the structures, relationships, and institutional dynamics that shape health research—especially in global health and low-resource settings."
      />

      <section className="site-section bg-[var(--color-chalk)]">
        <div className="container">
          <p className="meta-label text-[var(--color-cobalt)]">Program</p>
          <h2 className="mt-3 font-display text-3xl tracking-tight text-[var(--color-ink)] md:text-5xl">
            Three connected lines of work
          </h2>
          <div className="mt-10 grid gap-0 border-2 border-[var(--color-ink)] md:grid-cols-3">
            {streams.map((stream, index) => (
              <article
                key={stream.title}
                className={`bg-white p-6 md:p-8 ${
                  index < streams.length - 1
                    ? "border-b-2 border-[var(--color-ink)] md:border-b-0 md:border-r-2"
                    : ""
                }`}
              >
                <p className="meta-label text-[var(--color-cobalt)]">{stream.number}</p>
                <h3 className="mt-4 font-display text-2xl tracking-tight text-[var(--color-ink)]">
                  {stream.title}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-[var(--color-ink-muted)]">
                  {stream.description}
                </p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {stream.tags.map((tag) => (
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
          <p className="mt-8 max-w-3xl text-base leading-relaxed text-[var(--color-ink-muted)]">
            The same questions run through all three: where knowledge flows (or
            fails to), who holds power in the partnership architecture, and
            whether low- and middle-income countries are partners—not just
            research sites—in the discoveries that affect their health. I bring
            that framing into the MSHI program at Northeastern, training
            informatics leaders who can study and improve the systems that
            produce evidence, not only use the data.
          </p>
        </div>
      </section>

      <section className="site-section bg-white">
        <div className="container">
          <p className="meta-label text-[var(--color-cobalt)]">Now</p>
          <h2 className="mt-3 font-display text-3xl tracking-tight text-[var(--color-ink)] md:text-5xl">
            Current scholarship
          </h2>
          <ul className="mt-10 divide-y-2 divide-[var(--color-ink)] border-y-2 border-[var(--color-ink)]">
            {current.map((item) => (
              <li key={item.id} id={item.id} className="scroll-mt-24 py-8">
                <h3 className="font-display text-2xl tracking-tight text-[var(--color-ink)]">
                  {item.title}
                </h3>
                <p className="mt-3 max-w-3xl text-base leading-relaxed text-[var(--color-ink-muted)]">
                  {item.body}
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-sm text-[var(--color-ink-muted)]">
            Also:{" "}
            <Link
              href="/publications"
              className="focus-ring font-bold text-[var(--color-ink)] underline-offset-4 hover:underline"
            >
              publication index
            </Link>
            {" · "}
            <Link
              href="/research-network"
              className="focus-ring font-bold text-[var(--color-ink)] underline-offset-4 hover:underline"
            >
              citation network
            </Link>
            {" · "}
            <a
              href="https://www.counterforce.tech/"
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring font-bold text-[var(--color-ink)] underline-offset-4 hover:underline"
            >
              Counterforce AI
            </a>{" "}
            (advisor).
          </p>
        </div>
      </section>

      <section className="site-section bg-[var(--color-chalk)]">
        <div className="container">
          <p className="meta-label text-[var(--color-cobalt)]">Earlier</p>
          <h2 className="mt-3 font-display text-3xl tracking-tight text-[var(--color-ink)] md:text-5xl">
            Selected past appointments
          </h2>
          <p className="mt-4 max-w-2xl text-base text-[var(--color-ink-muted)]">
            A short record of the systems this program grew out of—not a second
            research page.
          </p>
          <div className="mt-8 overflow-x-auto border-2 border-[var(--color-ink)] bg-white">
            <table className="w-full min-w-[36rem] text-left text-sm">
              <thead className="border-b-2 border-[var(--color-ink)] bg-[var(--color-ink)] text-white">
                <tr>
                  <th className="meta-label px-4 py-3 font-medium">Years</th>
                  <th className="meta-label px-4 py-3 font-medium">Role</th>
                  <th className="meta-label px-4 py-3 font-medium">Organization</th>
                </tr>
              </thead>
              <tbody>
                {past.map((row) => (
                  <tr
                    key={row.id}
                    id={row.id}
                    className="scroll-mt-24 border-b border-[var(--color-ink)]/20 last:border-b-0"
                  >
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-[var(--color-cobalt)]">
                      {row.period}
                    </td>
                    <td className="px-4 py-3 text-[var(--color-ink)]">{row.role}</td>
                    <td className="px-4 py-3 text-[var(--color-ink-muted)]">
                      {row.org}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <CollabCta />
    </>
  );
}
