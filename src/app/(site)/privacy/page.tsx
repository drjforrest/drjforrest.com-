import { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/page-intro";

export const metadata: Metadata = {
  title: "Privacy Policy | Jamie Forrest",
  description:
    "How this site collects, uses, and protects personal information.",
};

export default function PrivacyPage() {
  return (
    <>
      <PageIntro
        kicker="Legal"
        title="Privacy policy"
        description={
          <>
            Last updated{" "}
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
            . How this site handles information you provide and information we
            collect automatically.
          </>
        }
      />

      <section className="site-section bg-[var(--color-chalk)]">
        <article className="container max-w-3xl space-y-10 text-base leading-relaxed text-[var(--color-ink)]">
          <div>
            <h2 className="font-display text-2xl tracking-tight">Overview</h2>
            <p className="mt-3 text-[var(--color-ink-muted)]">
              This policy describes how Jamie Forrest (“we,” “our,” or “us”)
              collects, uses, and protects personal information when you visit
              drjforrest.com or use its services.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl tracking-tight">
              Information we collect
            </h2>
            <h3 className="mt-4 font-display text-lg">You provide</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-[var(--color-ink-muted)]">
              <li>Contact details when you use the form (name, email, message)</li>
              <li>
                Optional Google Scholar identifiers submitted to the citation
                network generator
              </li>
              <li>Anything else you choose to share</li>
            </ul>
            <h3 className="mt-4 font-display text-lg">Collected automatically</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-[var(--color-ink-muted)]">
              <li>Usage data (pages, time, device)</li>
              <li>IP address and browser information</li>
              <li>Cookies and similar technologies</li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-2xl tracking-tight">How we use it</h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-[var(--color-ink-muted)]">
              <li>Respond to inquiries</li>
              <li>Improve the site</li>
              <li>Power the citation network generator</li>
              <li>Analyze usage and performance</li>
              <li>Comply with legal obligations</li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-2xl tracking-tight">
              Interactive tools
            </h2>
            <p className="mt-3 text-[var(--color-ink-muted)]">
              The citation network generator may send a Google Scholar author ID
              you provide to a research-network API on the same host (proxied as
              /citation-api) to build a visualization. Do not submit personal
              data beyond a public Scholar profile identifier.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl tracking-tight">Sharing</h2>
            <p className="mt-3 text-[var(--color-ink-muted)]">
              We do not sell, rent, or trade personal information. We may share
              it with service providers who operate the site, when required by
              law, in connection with a business transaction, or with your
              explicit consent.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl tracking-tight">
              Cookies and tracking
            </h2>
            <p className="mt-3 text-[var(--color-ink-muted)]">
              Essential cookies for functionality, analytics cookies (including
              Vercel Analytics), and performance cookies. You can control cookies
              in your browser; doing so may affect how the site works.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl tracking-tight">
              Security and retention
            </h2>
            <p className="mt-3 text-[var(--color-ink-muted)]">
              We use appropriate technical and organizational measures, but no
              internet transmission is fully secure. We retain personal
              information only as long as needed for the purposes in this policy,
              unless a longer period is required by law.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl tracking-tight">Your rights</h2>
            <p className="mt-3 text-[var(--color-ink-muted)]">
              Depending on location, you may have rights to access, correct,
              delete, restrict, port, or object to processing of your personal
              information. Use the contact form to exercise them.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl tracking-tight">Children</h2>
            <p className="mt-3 text-[var(--color-ink-muted)]">
              This site is not intended for children under 13. We do not
              knowingly collect their personal information.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl tracking-tight">Changes</h2>
            <p className="mt-3 text-[var(--color-ink-muted)]">
              Material changes will be posted on this page with an updated date.
              Continued use after changes constitutes acceptance.
            </p>
          </div>

          <div className="border-2 border-[var(--color-ink)] bg-white p-6">
            <p className="meta-label text-[var(--color-cobalt)]">Contact</p>
            <p className="mt-3 text-[var(--color-ink-muted)]">
              Questions:{" "}
              <Link
                href="/contact"
                className="font-bold text-[var(--color-ink)] underline-offset-4 hover:underline"
              >
                contact form
              </Link>
              . We aim to respond to privacy inquiries within 30 days.
            </p>
          </div>
        </article>
      </section>
    </>
  );
}
