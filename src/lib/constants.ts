export type NavLink = {
  href: string;
  label: string;
  description: string;
  external?: boolean;
};

export type UtilityLink = {
  href: string;
  label: string;
  external?: boolean;
};

export const BLOG_URL = "/blog";
export const CV_URL = "/pdf/Forrest_JI_CV.pdf";

export const NAV_LINKS: NavLink[] = [
  { href: "/#apps", label: "Apps", description: "Manuscripts, Radar, INFORM!, Counterforce" },
  {
    href: "/research",
    label: "Research",
    description: "Research and scholarship",
  },
  {
    href: "/research-network",
    label: "Network",
    description: "Citation network generator",
  },
  {
    href: "/publications",
    label: "Publications",
    description: "Scholarly record",
  },
  {
    href: BLOG_URL,
    label: "Blog",
    description: "Mind the Gap, and Rounds & Square Pegs",
  },
  {
    href: "/about",
    label: "Teaching",
    description: "Teaching, courses, and bio",
  },
];

export const UTILITY_LINKS: UtilityLink[] = [
  { href: "/contact", label: "Collaborate" },
  { href: CV_URL, label: "CV", external: true },
  { href: "/publications", label: "Publication Index" },
];

export const SOCIAL_LINKS = {
  linkedin: "https://www.linkedin.com/in/drjforrest",
  orcid: "https://orcid.org/0000-0002-8900-7350",
  github: "https://github.com/drjforrest",
  scholar:
    "https://scholar.google.com/citations?user=iHagagz9UAAAAJ&hl=en&inst=17001591832933267808",
};

export const SITE_INFO = {
  name: "Jamie Forrest",
  title: "Health informatics · Global health · Clinical research",
  shortName: "Jamie Forrest",
  tagline: "Context Matters. Especially in health.",
  description:
    "Associate Director, MSHI (Northeastern Vancouver). I study and teach the conditions in which health technology and evidence create value equitably.",
};
