import { BLOG_URL, CV_URL } from "@/lib/constants";

export type ThemeId =
  | "evidence"
  | "infrastructure"
  | "capacity"
  | "equity"
  | "trust";

export type Theme = {
  id: ThemeId;
  label: string;
  explanation: string;
  workApproach: string;
  relatedHref: string;
  goDeeperLabel: string;
};

export type FeaturedProject = {
  id: string;
  title: string;
  premise: string;
  tags: string[];
  href: string;
  external?: boolean;
  prompt: string;
  artifactLabel: string;
  themes: ThemeId[];
};

export type SelectedPublication = {
  id: string;
  year: number;
  type: string;
  themes: ThemeId[];
  title: string;
  outlet: string;
  whyItMatters: string;
  href: string;
  doi?: string;
};

export type BlogSignal = {
  title: string;
  blurb: string;
  href: string;
  date: string;
  featured?: boolean;
};

export const heroContent = {
  kicker: [
    "ASSOCIATE PROFESSOR",
    "ASSOCIATE PROGRAM DIRECTOR, MS in HEALTH INFORMATICS",
  ],
  headline: "Context Matters.",
  subhead: "Especially in health.",
  statement:
    "By separating signal from noise, I teach and investigate the conditions in which health technology creates value, and for whom.",
  primaryCta: { label: "Explore the work", href: "#featured-work" },
  secondaryCta: { label: "Read the ideas", href: BLOG_URL },
};

export const themes: Theme[] = [
  {
    id: "evidence",
    label: "Evidence",
    explanation:
      "How knowledge is generated, evaluated, and made usable when treatment claims are contested and decisions cannot wait.",
    workApproach:
      "I design and run the systems that turn contested treatment claims into usable results. The TOGETHER adaptive platform evaluated more than a dozen therapies across 12,000 patients in six countries—so clinicians and ministries had evidence, not rumours, while the window to act was still open.",
    relatedHref: "/research#together-trial",
    goDeeperLabel: "See the evidence system",
  },
  {
    id: "infrastructure",
    label: "Infrastructure",
    explanation:
      "The data systems and technical foundations that let ministries and health systems see themselves in real time.",
    workApproach:
      "Health systems cannot govern what they cannot see. In Rwanda I helped stand up a national informatics platform that gave ministry leadership real-time visibility across district data. The same lesson ran through TOGETHER: resilient trial infrastructure—sites, data, partnerships—is what makes rapid evidence possible.",
    relatedHref: "/research#rwanda-biomedical-centre",
    goDeeperLabel: "Explore the infrastructure",
  },
  {
    id: "capacity",
    label: "Capacity",
    explanation:
      "The people, institutions, and partnerships required to sustain clinical research and biomedical systems beyond a single project.",
    workApproach:
      "Evidence and infrastructure do not persist without people and institutions. Purpose Africa works with ministries to build clinical-research capacity and biomedical value chains. At Northeastern I train informatics leaders who can run those systems, not only consume their outputs.",
    relatedHref: "/research#purpose-africa",
    goDeeperLabel: "Follow the partnerships",
  },
  {
    id: "equity",
    label: "Equity",
    explanation:
      "How power, access, and context determine who benefits when technology and evidence reach health systems.",
    workApproach:
      "Who benefits is a design question, not a downstream detail. Teaching, partnership architecture, and the structure of trial networks decide whether technology and evidence reach the health systems that need them—or remain concentrated where they were built. The 2026 network analysis of AI diagnostic trials in sub-Saharan Africa makes that fragmentation visible.",
    relatedHref: "/about",
    goDeeperLabel: "Read the teaching agenda",
  },
  {
    id: "trust",
    label: "Trust",
    explanation:
      "How information integrity shapes public confidence during health emergencies—and why the surrounding conditions matter as much as the tools.",
    workApproach:
      "During emergencies, information integrity is a public-health resource. I test widely promoted claims under trial conditions, and I advise on tools that detect and map medical misinformation before it hardens into policy and practice.",
    relatedHref: "/research#hero-lab",
    goDeeperLabel: "See the trust work",
  },
];

export const featuredProjects: FeaturedProject[] = [
  {
    id: "health-informatics-education",
    title: "Health informatics education",
    premise:
      "Preparing globally minded health-informatics leaders to build and govern technology with evidence, context, and care.",
    tags: ["Teaching", "Health informatics", "Equity", "Capacity"],
    href: "/about",
    prompt: "Explore the approach",
    artifactLabel: "Northeastern · MSHI Vancouver · Associate Director",
    themes: ["capacity", "equity"],
  },
  {
    id: "together-trial",
    title: "The TOGETHER Trial",
    premise:
      "An adaptive platform that evaluated repurposed COVID-19 therapies across more than 12,000 patients in six countries.",
    tags: ["Evidence", "Clinical trials", "Global health", "Infrastructure"],
    href: "/research#together-trial",
    prompt: "Explore the system",
    artifactLabel: "Executive Director · 22 sites · 12+ therapies",
    themes: ["evidence", "infrastructure", "trust"],
  },
  {
    id: "rwanda-informatics",
    title: "Rwanda health informatics",
    premise:
      "Leading implementation of a national platform that gave ministry leadership real-time visibility across district health data.",
    tags: ["Infrastructure", "Health informatics", "Implementation", "Global health"],
    href: "/research#rwanda-biomedical-centre",
    prompt: "See the case file",
    artifactLabel: "Ministry of Health · five years · ICASA 2019",
    themes: ["infrastructure", "equity"],
  },
  {
    id: "purpose-africa",
    title: "Purpose Africa",
    premise:
      "Supporting African Ministries of Health to build clinical-research infrastructure and strengthen biomedical value chains.",
    tags: ["Capacity", "Global health", "Partnerships", "Implementation"],
    href: "/research#purpose-africa",
    prompt: "See the case file",
    artifactLabel: "Research capacity · drug discovery · ongoing",
    themes: ["capacity", "equity"],
  },
  {
    id: "african-ai-innovation",
    title: "African AI diagnostic trial networks",
    premise:
      "A social-network analysis of AI diagnostic trials in sub-Saharan Africa found complete structural fragmentation—no institution bridging between trials.",
    tags: ["Equity", "Science of science", "AI"],
    href: "/research#african-ai-innovation",
    prompt: "Read the analysis",
    artifactLabel: "Lancet Regional Health — Africa · 2026",
    themes: ["equity", "infrastructure"],
  },
  {
    id: "long-covid-follow-up",
    title: "Fluvoxamine and metformin for Long COVID fatigue",
    premise:
      "Adaptive trial of 399 adults with post-COVID fatigue: fluvoxamine reduced fatigue versus placebo at day 60, with a sustained effect at day 90; metformin did not.",
    tags: ["Evidence", "Long COVID", "Trials"],
    href: "/research#together-trial",
    prompt: "See the trial",
    artifactLabel: "Annals of Internal Medicine · 2026",
    themes: ["evidence"],
  },
  {
    id: "counterforce",
    title: "Counterforce AI",
    premise:
      "Social-listening and threat-detection tools for information disorder during public-health emergencies—detect emerging narratives before they harden into harm.",
    tags: ["Trust", "Misinformation", "AI"],
    href: "https://www.counterforce.tech/",
    external: true,
    prompt: "Visit Counterforce",
    artifactLabel: "Advisor · first employee",
    themes: ["trust"],
  },
];

export const selectedPublications: SelectedPublication[] = [
  {
    id: "fluvoxamine-lancet",
    year: 2022,
    type: "Journal article",
    themes: ["evidence"],
    title:
      "Effect of early treatment with fluvoxamine on risk of emergency care and hospitalisation among patients with COVID-19: the TOGETHER randomised platform trial",
    outlet: "The Lancet Global Health",
    whyItMatters:
      "Shows how adaptive platform trials can turn contested treatment claims into usable evidence at speed.",
    href: "https://doi.org/10.1016/S2214-109X(21)00448-4",
    doi: "10.1016/S2214-109X(21)00448-4",
  },
  {
    id: "ivermectin-nejm",
    year: 2022,
    type: "Journal article",
    themes: ["evidence", "trust"],
    title: "Effect of early treatment with ivermectin among patients with Covid-19",
    outlet: "New England Journal of Medicine",
    whyItMatters:
      "Tests a widely promoted claim under rigorous conditions—evidence as a public good, not a marketing asset.",
    href: "https://doi.org/10.1056/NEJMoa2115869",
    doi: "10.1056/NEJMoa2115869",
  },
  {
    id: "long-covid-annals",
    year: 2026,
    type: "Journal article",
    themes: ["evidence"],
    title: "The Effect of Fluvoxamine and Metformin for Fatigue in Patients With Long COVID",
    outlet: "Annals of Internal Medicine",
    whyItMatters:
      "Extends the platform-trial logic past acute COVID: a contested recovery claim, tested rather than assumed.",
    href: "https://doi.org/10.7326/ANNALS-25-03959",
    doi: "10.7326/ANNALS-25-03959",
  },
  {
    id: "partnerships-ajtmh",
    year: 2022,
    type: "Journal article",
    themes: ["capacity", "equity"],
    title:
      "Toward a New Paradigm of North–South and South–South Partnerships for Pandemic Preparedness",
    outlet: "American Journal of Tropical Medicine and Hygiene",
    whyItMatters:
      "Argues that durable trial and response capacity depends on partnership design, not only funding volume.",
    href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC9768281/",
  },
  {
    id: "hiv-continuum-rwanda",
    year: 2015,
    type: "Journal article",
    themes: ["infrastructure", "equity"],
    title: "HIV care continuum in Rwanda: a cross-sectional analysis of the national programme",
    outlet: "The Lancet HIV",
    whyItMatters:
      "Uses national programme data to make the care cascade visible—and therefore governable—at scale.",
    href: "https://doi.org/10.1016/S2352-3018(15)00024-7",
    doi: "10.1016/S2352-3018(15)00024-7",
  },
  {
    id: "resilient-infrastructure",
    year: 2022,
    type: "Journal article",
    themes: ["infrastructure", "evidence"],
    title:
      "Resilient Clinical Trial Infrastructure in Response to the COVID-19 Pandemic: Lessons Learned from the TOGETHER Randomized Platform Clinical Trial",
    outlet: "American Journal of Tropical Medicine and Hygiene",
    whyItMatters:
      "Documents the operational conditions—sites, data, partnerships—that made rapid evidence generation possible.",
    href: "/publications/resilient-clinical-trial-infrastructure-in-response-to-the-covid-19-pandemic-lessons-learned-from-the-together-randomized-platform-clinical-trial",
  },
  {
    id: "ai-networks-africa",
    year: 2026,
    type: "Journal article",
    themes: ["equity", "infrastructure"],
    title:
      "Mapping AI diagnostic innovation networks in sub-Saharan Africa: a social network analysis of trials, institutions, and funders",
    outlet: "The Lancet Regional Health — Africa",
    whyItMatters:
      "Shows complete structural fragmentation in AI diagnostic trials—no institutional bridges—so equity is a network design problem, not only a model problem.",
    href: "https://doi.org/10.1016/j.lanafr.2026.100064",
    doi: "10.1016/j.lanafr.2026.100064",
  },
];

export function projectsForTheme(id: ThemeId): FeaturedProject[] {
  return featuredProjects.filter((project) => project.themes.includes(id));
}

export function publicationsForTheme(id: ThemeId): SelectedPublication[] {
  return selectedPublications.filter((pub) => pub.themes.includes(id));
}

export const blogSignals: BlogSignal[] = [
  {
    title: "Designed Elsewhere, Deployed Here",
    blurb:
      "An algorithm trained far from the ward it enters does not automatically know the constraints of the system it lands in.",
    href: "/blog/posts/designed-elsewhere-deployed-here-ai-fragile-health-systems",
    date: "2026-04-17",
    featured: true,
  },
  {
    title: "Why clinicians still hesitate at AI decision support",
    blurb:
      "Sixty-six years after computerized diagnosis entered the literature, hesitation may be the right response—if you ask the right questions.",
    href: "/blog/posts/persistance-of-reluctance-why-doctors-still-hesitate-at-ai-clinical-crossroads",
    date: "2025-11-07",
  },
  {
    title: "When seeing is no longer believing",
    blurb:
      "Deepfakes turn visual evidence into a contested public-health resource, not a self-evident fact.",
    href: "/blog/posts/when-seeing-is-no-longer-believing",
    date: "2025-12-03",
  },
];

export const collabContent = {
  headline: "Good work needs the right conditions, too.",
  body: "I collaborate with researchers, students, ministries, and clinical-research partners working to strengthen health informatics, evidence generation, and research capacity—especially where infrastructure and trust are uneven.",
  actions: [
    { label: "Collaborate", href: "/contact" },
    { label: "Invite me to speak", href: "/contact" },
    { label: "View CV", href: CV_URL, external: true },
    { label: "Contact", href: "/contact" },
  ],
};
