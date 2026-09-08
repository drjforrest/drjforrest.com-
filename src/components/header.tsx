"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { BLOG_URL, CV_URL, NAV_LINKS, UTILITY_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function isExternal(href: string) {
  return href.startsWith("http") || href.endsWith(".pdf");
}

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[var(--color-ink)] text-white">
      <div className="container flex h-16 items-center gap-4">
        <Link
          href="/"
          className="focus-ring group flex shrink-0 items-center gap-2 rounded-sm"
        >
          <span
            aria-hidden
            className="h-2.5 w-2.5 bg-[var(--color-signal)] transition-transform group-hover:scale-125"
          />
          <span className="font-display text-lg tracking-tight text-white md:text-xl">
            Jamie Forrest
          </span>
        </Link>

        <nav
          aria-label="Primary"
          className="ml-4 hidden items-center gap-5 text-sm lg:flex"
        >
          {NAV_LINKS.map((link) => {
            const active =
              !isExternal(link.href) &&
              (pathname === link.href || pathname.startsWith(link.href + "/"));
            const external = isExternal(link.href) || Boolean(link.external);
            return (
              <Link
                key={`${link.label}-${link.href}`}
                href={link.href}
                className={cn(
                  "focus-ring rounded-sm font-medium transition-colors",
                  active
                    ? "text-[var(--color-signal)]"
                    : "text-white/65 hover:text-white"
                )}
                {...(external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto hidden items-center gap-2 md:flex">
          <Link
            href={CV_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring meta-label rounded-sm px-2 py-1 text-white/55 hover:text-white"
          >
            CV
          </Link>
          <Link
            href="/publications"
            className="focus-ring meta-label rounded-sm px-2 py-1 text-white/55 hover:text-white"
          >
            Pubs
          </Link>
          <Button
            asChild
            size="sm"
            className="rounded-none bg-[var(--color-cobalt)] font-bold uppercase tracking-wide text-white hover:bg-[var(--color-cobalt-deep)]"
          >
            <Link href="/contact">Collaborate</Link>
          </Button>
        </div>

        <div className="ml-auto md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="focus-ring text-white hover:bg-white/10 hover:text-white">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="border-l-white/10 bg-[var(--color-ink)] text-white">
              <nav aria-label="Mobile" className="mt-10 flex flex-col gap-4">
                {NAV_LINKS.map((link) => (
                  <SheetClose asChild key={`m-${link.label}`}>
                    <Link
                      href={link.href}
                      className="focus-ring font-display text-2xl text-white"
                      {...(isExternal(link.href) || link.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}
                <div className="mt-6 flex flex-col gap-3 border-t border-white/15 pt-6">
                  {UTILITY_LINKS.map((link) => (
                    <SheetClose asChild key={link.label}>
                      <Link
                        href={link.href}
                        className="focus-ring text-white/70"
                        {...(isExternal(link.href) || link.external
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                      >
                        {link.label}
                      </Link>
                    </SheetClose>
                  ))}
                  <SheetClose asChild>
                    <Link
                      href={BLOG_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="focus-ring text-[var(--color-signal)]"
                    >
                      Visit the blog
                    </Link>
                  </SheetClose>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
