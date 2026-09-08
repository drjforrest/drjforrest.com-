import { BLOG_URL, CV_URL, NAV_LINKS, SOCIAL_LINKS } from "@/lib/constants";
import { Linkedin } from "lucide-react";
import Link from "next/link";
import { Icons } from "./icons";
import { Button } from "./ui/button";

export function Footer() {
  return (
    <footer className="border-t-4 border-[var(--color-cobalt)] bg-[var(--color-ink)] text-white">
      <div className="container py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="space-y-4">
            <p className="font-display text-3xl tracking-tight">Jamie Forrest</p>
            <p className="max-w-md text-white/70">
              Context Matters. Especially when it comes to health.
            </p>
            <p className="meta-label text-white/45">
              Health informatics · Global health · Clinical research
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="meta-label text-white/45">
              Navigate
            </h2>
            {NAV_LINKS.map((link) => (
              <Link
                key={`f-${link.label}`}
                href={link.href}
                className="text-white/80 transition-colors hover:text-white"
                {...(link.href.startsWith("http")
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="meta-label text-white/45">
              Utilities
            </h2>
            <Link href="/contact" className="hover:text-white">
              Collaborate
            </Link>
            <Link
              href={CV_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              CV
            </Link>
            <Link href="/publications" className="hover:text-white">
              Publication Index
            </Link>
            <Link
              href={BLOG_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              Writing / Blog
            </Link>
            <div className="mt-4 flex items-center gap-2">
              <Button variant="ghost" size="icon" asChild className="text-[var(--color-paper)] hover:bg-white/10 hover:text-white">
                <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noreferrer">
                  <Linkedin className="h-5 w-5" />
                  <span className="sr-only">LinkedIn</span>
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild className="text-[var(--color-paper)] hover:bg-white/10 hover:text-white">
                <a href={SOCIAL_LINKS.orcid} target="_blank" rel="noreferrer">
                  <Icons.orcid className="h-5 w-5" />
                  <span className="sr-only">ORCID</span>
                </a>
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-white/15 pt-6">
          <p className="text-center text-sm text-white/45">
            © {new Date().getFullYear()} Jamie Forrest
          </p>
        </div>
      </div>
    </footer>
  );
}
