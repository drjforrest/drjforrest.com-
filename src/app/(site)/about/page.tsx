import Image from "next/image";
import Link from "next/link";
import { PageIntro } from "@/components/page-intro";
import { CollabCta } from "@/components/home/collab-cta";
import { CV_URL } from "@/lib/constants";

const focus = [
  {
    kicker: "01 / Teaching",
    title: "MSHI · Northeastern Vancouver",
    body: "Associate Director of the Master of Science in Health Informatics program—curriculum, mentorship, and the next generation of practitioners who can govern technology with evidence and care.",
  },
  {
    kicker: "02 / Evidence",
    title: "Clinical research operations",
    body: "TOGETHER Trial executive leadership across 22 sites and three continents—adaptive platforms that turn contested treatment claims into usable evidence at speed.",
  },
  {
    kicker: "03 / Infrastructure",
    title: "Health systems & informatics",
    body: "Five years with Rwanda’s Ministry of Health on national data platforms, surveillance, and the conditions under which digital systems actually get used.",
  },
];

const expertise = [
  "Health informatics",
  "Clinical research operations",
  "Global health",
  "Evidence generation",
  "Data infrastructure",
  "Capacity building",
  "Health equity",
  "Teaching & mentorship",
  "Research methods",
  "Curriculum development",
];

export default function AboutPage() {
  return (
    <>
      <PageIntro
        tone="ink"
        kicker="About · Teaching"
        title="Context, capacity, and the conditions for useful health technology."
        description="Associate Director, MSHI — Northeastern University (Vancouver). I study and teach where evidence, infrastructure, and trust decide whether technology creates value equitably."
      />

      <section className="site-section bg-white">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.4fr] lg:items-start">
            <aside className="lg:sticky lg:top-24">
              <div className="relative aspect-[4/5] overflow-hidden border-2 border-[var(--color-ink)] bg-[var(--color-chalk)]">
                <Image
                  src="/images/jamie-forrest.png"
                  alt="Dr. Jamie Forrest"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 360px"
                  priority
                />
              </div>
              <p className="mt-6 font-display text-2xl tracking-tight text-[var(--color-ink)]">
                Jamie Forrest, PhD, MPH
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-muted)]">
                Associate Director, MS in Health Informatics
                <br />
                Northeastern University · Vancouver
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <a
                  href={CV_URL}
                  download
                  className="focus-ring inline-flex items-center justify-center bg-[var(--color-cobalt)] px-5 py-3 text-sm font-bold uppercase tracking-wide text-white hover:bg-[var(--color-cobalt-deep)]"
                >
                  Download CV (PDF)
                </a>
                <a
                  href="/master-academic-cv.md"
                  download
                  className="focus-ring inline-flex items-center justify-center border-2 border-[var(--color-ink)] px-5 py-3 text-sm font-bold uppercase tracking-wide text-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-white"
                >
                  Download CV (Markdown)
                </a>
              </div>
            </aside>

            <div>
              <p className="meta-label text-[var(--color-cobalt)]">Biography</p>
              <div className="mt-4 max-w-2xl space-y-5 text-lg leading-relaxed text-[var(--color-ink-muted)]">
                <p>
                  I lead curriculum and mentorship in Northeastern’s MSHI program, informed by a
                  research career that spans clinical trials, national health-information systems,
                  and equity in how evidence reaches practice.
                </p>
                <p>
                  That career began with community-driven biomedical and socio-behavioural research
                  grounded in local agency. Years embedded with Rwanda’s Ministry of Health,
                  co-developing and scaling digital health information systems, made the
                  intersection of technology, data sovereignty, and sustainable innovation
                  concrete—not theoretical.
                </p>
                <p>
                  During COVID-19 I led global clinical research operations across 22 sites on
                  three continents. The pressure for rapid results can deepen inequities in
                  research capacity and governance, especially in low- and middle-income
                  contexts. That is why I care as much about the conditions around a trial or a
                  tool as I do about the tool itself.
                </p>
                <p>
                  Teaching is not a side activity. I develop curricula in research methods, data
                  science, and AI literacy for practitioners at every career stage—so the next
                  generation can govern technology with evidence, context, and care.
                </p>
              </div>

              <ul className="mt-12 grid gap-0 border-2 border-[var(--color-ink)] md:grid-cols-3">
                {focus.map((item) => (
                  <li
                    key={item.title}
                    className="border-t-2 border-[var(--color-ink)] p-6 first:border-t-0 md:border-t-0 md:border-l-2 md:first:border-l-0"
                  >
                    <p className="meta-label text-[var(--color-cobalt)]">{item.kicker}</p>
                    <h2 className="mt-4 font-display text-xl tracking-tight text-[var(--color-ink)]">
                      {item.title}
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-[var(--color-ink-muted)]">
                      {item.body}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="site-section bg-[var(--color-chalk)]">
        <div className="container">
          <p className="meta-label text-[var(--color-cobalt)]">Expertise</p>
          <h2 className="mt-3 font-display text-3xl tracking-tight text-[var(--color-ink)] md:text-5xl">
            Areas of work
          </h2>
          <ul className="mt-8 flex flex-wrap gap-2">
            {expertise.map((skill) => (
              <li
                key={skill}
                className="meta-label border-2 border-[var(--color-ink)] bg-white px-3 py-2 text-[var(--color-ink)]"
              >
                {skill}
              </li>
            ))}
          </ul>
          <p className="mt-8 text-sm text-[var(--color-ink-muted)]">
            Also:{" "}
            <Link
              href="https://www.counterforce.tech/"
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring font-bold text-[var(--color-ink)] underline-offset-4 hover:underline"
            >
              Counterforce AI
            </Link>{" "}
            (advisor) · McMaster University, Health Research Methods, Evidence &amp; Impact
            (2022–2025).
          </p>
        </div>
      </section>

      <CollabCta />
    </>
  );
}
