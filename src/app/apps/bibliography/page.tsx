import { BibliographyLoginForm } from "@/components/apps/bibliography-login-form";
import { BibliographyPortal } from "@/components/apps/bibliography-portal";
import {
  bibliographyAuthConfigured,
  createBibliographyCsrfToken,
  isBibliographyAuthenticated,
} from "@/lib/bibliography-auth";

export const dynamic = "force-dynamic";

export default async function BibliographyPage() {
  const configured = bibliographyAuthConfigured();
  const authenticated = await isBibliographyAuthenticated();

  if (!authenticated) {
    return (
      <section className="site-section bg-[var(--color-chalk)]">
        <div className="container">
          {!configured ? (
            <div className="mx-auto max-w-lg border-2 border-[var(--color-ink)] bg-white p-6 md:p-8">
              <h1 className="font-display text-3xl tracking-tight text-[var(--color-ink)]">
                Bibliography portal
              </h1>
              <p className="mt-4 text-base leading-relaxed text-[var(--color-ink-muted)]">
                Set <code>BIBLIOGRAPHY_ACCESS_CODE</code> in the environment,
                then reload. The signing secret can be{" "}
                <code>BIBLIOGRAPHY_PORTAL_SECRET</code> or the existing Radar
                portal secret.
              </p>
            </div>
          ) : (
            <BibliographyLoginForm csrf={createBibliographyCsrfToken()} />
          )}
        </div>
      </section>
    );
  }

  return <BibliographyPortal />;
}
