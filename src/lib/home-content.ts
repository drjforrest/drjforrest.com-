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
  featuredProjectId: string;
  featuredProjectLabel: string;
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
};

export type SelectedPublication = {
  id: string;
  year: number;
  type: string;
  theme: string;
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
  kicker: "Jamie Forrest · PhD, MPH · Northeastern University",
  headline: "Context Matters.",
  subhead: "Especially when it comes to health.",
  descriptor: "Health informatics · Global health · Clinical research",
  statement:
    "I am an Associate Director of the MSHI program at Northeastern University’s Vancouver campus. I study and teach in context—evidence, data infrastructure, institutional capacity, and trust—in which health technology can create value equitably. Drawing on work in applied data analytics and health informatics in Rwanda and international clinical research partners, my scholarship separates the signal from the noise.",
  primaryCta: { label: "Explore the work", href: "#featured-work" },
  secondaryCta: { label: "Read the ideas", href: BLOG_URL, external: true },
};

export const themes: Theme[] = [
  {
    id: "evidence",
    label: "Evidence",
    explanation:
      "How knowledge is generated, evaluated, and made usable when treatment claims are contested and decisions cannot wait.",
    featuredProjectId: "together-trial",
    featuredProjectLabel: "The TOGETHER Trial",
    relatedHref: "/projects#together-trial",
    goDeeperLabel: "See the evidence system",
  },
  {
    id: "infrastructure",
    label: "Infrastructure",
    explanation:
      "The data systems and technical foundations that let ministries and health systems see themselves in real time.",
    featuredProjectId: "rwanda-informatics",
    featuredProjectLabel: "Rwanda national health informatics platform",
    relatedHref: "/projects#rwanda-biomedical-centre",
    goDeeperLabel: "Explore the infrastructure",
  },
  {
    id: "capacity",
    label: "Capacity",
    explanation:
      "The people, institutions, and partnerships required to sustain clinical research and biomedical systems beyond a single project.",
    featuredProjectId: "purpose-africa",
    featuredProjectLabel: "Purpose Africa",
    relatedHref: "/projects#purpose-africa",
    goDeeperLabel: "Follow the partnerships",
  },
  {
    id: "equity",
    label: "Equity",
    explanation:
      "How power, access, and context determine who benefits when technology and evidence reach health systems.",
    featuredProjectId: "health-informatics-education",
    featuredProjectLabel: "MSHI · Northeastern Vancouver",
    relatedHref: "/about",
    goDeeperLabel: "Read the teaching agenda",
  },
  {
    id: "trust",
    label: "Trust",
    explanation:
      "How information integrity shapes public confidence during health emergencies—and why the surrounding conditions matter as much as the tools.",
    featuredProjectId: "together-trial",
    featuredProjectLabel: "Evidence under pressure · TOGETHER",
    relatedHref: "/projects#together-trial",
    goDeeperLabel: "See how evidence was built",
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
  },
  {
    id: "together-trial",
    title: "The TOGETHER Trial",
    premise:
      "An adaptive platform that evaluated repurposed COVID-19 therapies across more than 12,000 patients in six countries.",
    tags: ["Evidence", "Clinical trials", "Global health", "Infrastructure"],
    href: "/projects#together-trial",
    prompt: "Explore the system",
    artifactLabel: "Executive Director · 22 sites · 12+ therapies",
  },
  {
    id: "rwanda-informatics",
    title: "Rwanda health informatics",
    premise:
      "Leading implementation of a national platform that gave ministry leadership real-time visibility across district health data.",
    tags: ["Infrastructure", "Health informatics", "Implementation", "Global health"],
    href: "/projects#rwanda-biomedical-centre",
    prompt: "See the case file",
    artifactLabel: "Ministry of Health · five years · ICASA 2019",
  },
  {
    id: "purpose-africa",
    title: "Purpose Africa",
    premise:
      "Supporting African Ministries of Health to build clinical-research infrastructure and strengthen biomedical value chains.",
    tags: ["Capacity", "Global health", "Partnerships", "Implementation"],
    href: "/projects#purpose-africa",
    prompt: "See the case file",
    artifactLabel: "Research capacity · drug discovery · ongoing",
  },
];

/** Secondary affiliation — present lightly, not as a lead homepage story. */
export const secondaryAffiliations = [
  {
    id: "counterforce",
    label: "Counterforce AI",
    note: "Advisor; first employee. Social-listening tools for online disinformation during public-health emergencies.",
    href: "https://www.counterforce.tech/",
  },
  {
    id: "mcmaster",
    label: "McMaster University",
    note: "Senior Researcher in Health Research Methods, Evidence & Impact (2022–2025), working with TOGETHER principal investigators on trial design.",
    href: "/about",
  },
];

export const selectedPublications: SelectedPublication[] = [
  {
    id: "fluvoxamine-lancet",
    year: 2022,
    type: "Journal article",
    theme: "Evidence",
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
    theme: "Evidence",
    title: "Effect of early treatment with ivermectin among patients with Covid-19",
    outlet: "New England Journal of Medicine",
    whyItMatters:
      "Tests a widely promoted claim under rigorous conditions—evidence as a public good, not a marketing asset.",
    href: "https://doi.org/10.1056/NEJMoa2115869",
    doi: "10.1056/NEJMoa2115869",
  },
  {
    id: "partnerships-ajtmh",
    year: 2022,
    type: "Journal article",
    theme: "Capacity",
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
    theme: "Infrastructure",
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
    theme: "Infrastructure",
    title:
      "Resilient Clinical Trial Infrastructure in Response to the COVID-19 Pandemic: Lessons Learned from the TOGETHER Randomized Platform Clinical Trial",
    outlet: "Clinical trial methods",
    whyItMatters:
      "Documents the operational conditions—sites, data, partnerships—that made rapid evidence generation possible.",
    href: "/publications",
  },
];

export const blogSignals: BlogSignal[] = [
  {
    title: "Designed Elsewhere, Deployed Here",
    blurb:
      "An algorithm trained far from the ward it enters does not automatically know the constraints of the system it lands in.",
    href: BLOG_URL,
    date: "2025-04-17",
    featured: true,
  },
  {
    title: "Why clinicians still hesitate at AI decision support",
    blurb:
      "Sixty-six years after computerized diagnosis entered the literature, hesitation may be the right response—if you ask the right questions.",
    href: BLOG_URL,
    date: "2025-11-07",
  },
  {
    title: "When seeing is no longer believing",
    blurb:
      "Deepfakes turn visual evidence into a contested public-health resource, not a self-evident fact.",
    href: BLOG_URL,
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
