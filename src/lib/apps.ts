export const MANUSCRIPTS_GUMROAD_URL =
  "https://forrestjamie.gumroad.com/l/hutrvj";

export const COUNTERFORCE_URL = "https://www.counterforce.tech/";

export type AppListing = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  href: string;
  cta: string;
  external?: boolean;
  image: string;
  imageAlt: string;
  badge?: string;
  featured?: boolean;
};

export const apps: AppListing[] = [
  {
    id: "manuscripts",
    name: "Manuscripts",
    tagline: "Mac app for academic workflow",
    description:
      "Keep every paper, submission, and revision in one local-first record—authors, versions, journal state—without cloud seats or spreadsheet chaos. Built for academics who were tired of losing track of which version went where.",
    href: MANUSCRIPTS_GUMROAD_URL,
    cta: "Buy on Gumroad",
    external: true,
    image: "/manuscripts-ad.png",
    imageAlt: "Manuscripts Mac app — track papers, submissions, and revisions",
    badge: "For sale now",
    featured: true,
  },
  {
    id: "radar",
    name: "Radar",
    tagline: "Social signal intelligence for Mac",
    description:
      "Watch topics across social platforms and the web, cluster what emerges into themes, and get digests. Internal Counterforce distribution—password-gated download and setup handbook.",
    href: "/apps/radar",
    cta: "Download & setup",
    image: "/apps/radar/img/app-icon.png",
    imageAlt: "Radar app icon",
    badge: "Internal license",
  },
  {
    id: "counterforce",
    name: "Counterforce",
    tagline: "Detect, map, neutralize misinformation",
    description:
      "End-to-end platform for governments and organizations to detect emerging narratives, map amplification networks, and act before harm spreads. First employee and ongoing advisor.",
    href: COUNTERFORCE_URL,
    cta: "Visit Counterforce",
    external: true,
    image: "/apps/counterforce/counterforce-dark.png",
    imageAlt: "Counterforce logo",
  },
];
