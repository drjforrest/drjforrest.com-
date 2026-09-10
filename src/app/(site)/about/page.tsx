import Image from "next/image";
import Link from "next/link";
import { PageIntro } from "@/components/page-intro";
import { CollabCta } from "@/components/home/collab-cta";
import { CV_URL } from "@/lib/constants";

export const metadata = {
  title: "Teaching | Jamie Forrest",
  description:
    "Teaching statement, current MSHI courses, and biography — Associate Director, MS in Health Informatics, Northeastern University Vancouver.",
};

const courses = [
  {
    code: "HINF 5101",
    title: "Introduction to Health Informatics and Health Information Systems",
    note: "MSHI core · Vancouver",
    body: "How technology, people, and health systems interrelate—and why that relationship, not the tool, decides whether informatics creates value.",
  },
  {
    code: "HINF 5106",
    title: "The Canadian Healthcare System",
    note: "MSHI core · Vancouver",
    body: "The institutional context Canadian informatics graduates actually work in: governance, data flows, and the constraints that theory tends to skip.",
  },
  {
    code: "HINF 5500",
    title: "Artificial Intelligence and Health Informatics",
    note: "MSHI · Vancouver catalog",
    body: "AI as a health-system problem: evidence, equity, and the conditions under which models should (and should not) enter clinical and public-health work.",
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
        kicker="Teaching · About"
        title="The deepest learning still happens by doing."
        description="Associate Director, MS in Health Informatics — Northeastern University, Vancouver. I train practitioners who can govern technology with evidence, context, and care—not classroom theory alone."
      />

      <section className="site-section bg-white">
        <div className="container">
          <p className="meta-label text-[var(--color-cobalt)]">Teaching statement</p>
          <h2 className="mt-3 max-w-4xl font-display text-3xl tracking-tight text-[var(--color-ink)] md:text-5xl">
            Health informatics sits at the centre of an AI-reshaped job market. Graduates have to be ready on day one.
          </h2>
          <div className="mt-8 max-w-3xl space-y-5 text-lg leading-relaxed text-[var(--color-ink-muted)]">
            <p>
              AI is reshaping work across nearly every sector, and health is no
              exception. For that potential to become better outcomes for
              patients and populations, people entering the field need a
              practical skillset—adaptability, evidence literacy, and enough
              systems knowledge to contribute to institutions that are already
              in motion.
            </p>
            <p>
              That is why the institution matters. Northeastern’s premise is
              that durable learning happens by doing. I bring trial operations,
              ministry data systems, and applied AI into the MSHI classroom so
              students learn to study and improve the systems that produce
              evidence, not only to operate the tools those systems happen to
              run.
            </p>
            <p>
              Teaching is not a side activity. Curriculum, mentorship, and
              program strategy in Vancouver are how this research program
              reaches the next generation of health informatics leaders.
            </p>
          </div>
        </div>
      </section>

      <section className="site-section bg-[var(--color-chalk)]">
        <div className="container">
          <p className="meta-label text-[var(--color-cobalt)]">Current teaching</p>
          <h2 className="mt-3 font-display text-3xl tracking-tight text-[var(--color-ink)] md:text-5xl">
            MSHI Vancouver
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-[var(--color-ink-muted)]">
            Callouts for courses I teach and lead in the Vancouver MS in Health
            Informatics program.
          </p>
          <ul className="mt-10 grid gap-0 border-2 border-[var(--color-ink)] md:grid-cols-3">
            {courses.map((course, index) => (
              <li
                key={course.code}
                className={`bg-white p-6 md:p-8 ${
                  index < courses.length - 1
                    ? "border-b-2 border-[var(--color-ink)] md:border-b-0 md:border-r-2"
                    : ""
                }`}
              >
                <p className="meta-label text-[var(--color-cobalt)]">
                  {course.code} · {course.note}
                </p>
                <h3 className="mt-4 font-display text-xl tracking-tight text-[var(--color-ink)]">
                  {course.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--color-ink-muted)]">
                  {course.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

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
                Associate Teaching Professor
                <br />
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
                  I am a global health researcher, clinical trialist, and
                  technologist whose career spans three continents. I serve as
                  Associate Director of the Master of Science in Health
                  Informatics program at Northeastern University’s Vancouver
                  campus.
                </p>
                <p>
                  I spent five years in Rwanda working with the Ministry of
                  Health, leading implementation of a national health
                  informatics platform that aggregated district-level data so
                  ministry leadership could see the system in real time. During
                  that period I also contributed to the planning and execution
                  of ICASA in Kigali in 2019.
                </p>
                <p>
                  Returning to Canada at the start of the COVID-19 pandemic, I
                  joined the founding team of Purpose Life Sciences and the
                  TOGETHER Adaptive Platform Trial. As global executive
                  director I oversaw more than 12 intervention evaluations from
                  the recruitment of more than 15,000 patients across 22
                  clinical sites over three years. I later helped launch Purpose
                  Africa, supporting ministries of health to build clinical
                  research infrastructure and strengthen biomedical value
                  chains—work that continues today.
                </p>
                <p>
                  Alongside that global health work I have a deep interest in
                  computer science, put to work as the first employee of
                  Counterforce AI, where I developed social-listening tools to
                  mitigate online disinformation during public health
                  emergencies. I remain an advisor to the platform.
                </p>
                <p>
                  I earned a PhD in Population and Public Health from the
                  University of British Columbia (2022) and an MPH with a
                  global health concentration from Simon Fraser University
                  (2009).
                </p>
              </div>

              <ul className="mt-12 flex flex-wrap gap-2">
                {expertise.map((skill) => (
                  <li
                    key={skill}
                    className="meta-label border-2 border-[var(--color-ink)] bg-[var(--color-chalk)] px-3 py-2 text-[var(--color-ink)]"
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
                (advisor) · McMaster University, Health Research Methods,
                Evidence &amp; Impact (2022–2025).
              </p>
            </div>
          </div>
        </div>
      </section>

      <CollabCta />
    </>
  );
}
