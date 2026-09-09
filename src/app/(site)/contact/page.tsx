import { ContactForm } from "@/components/contact-form";
import { PageIntro } from "@/components/page-intro";
import { SOCIAL_LINKS } from "@/lib/constants";

const channels = [
  {
    label: "LinkedIn",
    href: SOCIAL_LINKS.linkedin,
    note: "Professional network",
  },
  {
    label: "ORCID",
    href: SOCIAL_LINKS.orcid,
    note: "Scholarly identity",
  },
  {
    label: "GitHub",
    href: SOCIAL_LINKS.github,
    note: "Code and tools",
  },
];

export default function ContactPage() {
  return (
    <>
      <PageIntro
        tone="ink"
        kicker="Collaborate"
        title="Good work needs the right conditions, too."
        description="Researchers, students, ministries, funders, and press—if you are trying to strengthen health informatics, evidence generation, or research capacity, I want to hear from you."
      />

      <section className="site-section bg-white">
        <div className="container grid gap-12 lg:grid-cols-2">
          <div>
            <p className="meta-label text-[var(--color-cobalt)]">Channels</p>
            <h2 className="mt-3 font-display text-3xl tracking-tight text-[var(--color-ink)]">
              Get in touch
            </h2>
            <p className="mt-4 max-w-md text-lg leading-relaxed text-[var(--color-ink-muted)]">
              Use the form, or reach me on the networks below. I aim to reply
              within two working days.
            </p>
            <ul className="mt-8 divide-y-2 divide-[var(--color-ink)] border-y-2 border-[var(--color-ink)]">
              {channels.map((channel) => (
                <li key={channel.label}>
                  <a
                    href={channel.href}
                    target="_blank"
                    rel="noreferrer"
                    className="focus-ring flex items-baseline justify-between gap-4 py-4 hover:bg-[var(--color-chalk)]"
                  >
                    <span className="font-display text-xl tracking-tight text-[var(--color-ink)]">
                      {channel.label}
                    </span>
                    <span className="meta-label text-[var(--color-ink-muted)]">
                      {channel.note} →
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
