import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github, Sparkles, Shield, FlaskConical, Globe, Users, Building2, GraduationCap, Lightbulb, BarChart2, FileText } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Projects | Dr Jamie Forrest",
  description: "Current and past projects in AI, misinformation detection, clinical trials, and global health research.",
};

const projects = [
  {
    id: "trust-defense",
    name: "Trust Defense Technology",
    tagline: "Chief Technology Officer | AI-Powered Threat Detection",
    description:
      "Leading the development of an AI platform designed to detect, map, and respond to AI-amplified threats against institutional trust in real-time. A structural response to the commercialized ecosystem of disinformation — rooted in years of health equity research and crisis informatics. Trust in critical institutions — health systems, defense agencies, and emergency responders — is under systematic attack; generative AI has removed cost and skill barriers to industrialized misinformation campaigns. Three pillars: SEE (real-time multimodal detection — MedContext deployed at 91.4% accuracy for medical misinformation); MAP (graph neural network analysis of narrative spread, in development); ACT (operational response including pre-bunking and counter-messaging, in development).",
    icon: Shield,
    tags: ["Trust Defense", "AI/ML", "Health Informatics"],
    links: [],
  },
  {
    id: "health-equity-research",
    name: "Health Equity & Crisis Informatics",
    tagline: "Research Leadership | AI in Health",
    description:
      "Interdisciplinary research dedicated to equity, trust, and resilience in crisis response. In times of crisis — from pandemics to climate emergencies — misinformation undermines trust in science and exacerbates health inequities. This work brings together frontline clinical expertise, cutting-edge AI, and global health leadership to transform evidence into action. Research pillars: Trust & Crisis Intelligence (AI tools to detect and counter misinformation); Resilient & Equitable Health Systems; Equity-Driven Interventions. A unique pipeline from evidence to actionable AI systems deployed at scale.",
    icon: GraduationCap,
    tags: ["Trust & Crisis Intelligence", "Equity", "Teaching & Mentorship", "Research"],
    links: [],
  },
  {
    id: "boreal-labs",
    name: "Boreal Labs",
    tagline: "Founder & Principal Scientist",
    description:
      "Private consulting, strategic guidance, and investment in global health, technology, and AI readiness.",
    icon: Lightbulb,
    tags: ["Consulting", "Strategic Advisory", "Investment"],
    links: [{ label: "boreal-labs.com", href: "https://boreal-labs.com", icon: ExternalLink }],
  },
  {
    id: "medcontext",
    name: "MedContext",
    tagline: "Agentic AI for Medical Misinformation Detection",
    description:
      "Multimodal detection across open and social sources, achieving 91.4% accuracy in detecting medical misinformation — particularly authentic images paired with false claims. Evaluates contextual authenticity rather than content alone. Submitted to the Kaggle MedGemma Impact Challenge. Powers the SEE (real-time detection) pillar of the trust defense platform.",
    icon: Sparkles,
    tags: ["AI/ML", "Health Misinformation", "Kaggle", "Multimodal"],
    links: [
      { label: "Kaggle Submission", href: "https://kaggle.com", icon: ExternalLink },
      { label: "GitHub", href: "https://github.com/drjforrest/medcontext", icon: Github },
    ],
  },
  {
    id: "manuscripts",
    name: "Manuscripts",
    tagline: "Independent Mac app for academic workflow",
    description:
      "A focused desktop tool for keeping track of papers, submissions, and revisions. Each manuscript becomes a complete record — authors, versions, submission state, and journal requirements — rather than scattered notes and PDFs. Local-first, no cloud or seat licensing. Built for academics who, like me, were tired of losing track of which version of which paper went to which journal.",
    icon: FileText,
    tags: ["Mac App", "Academic Tools", "Independent Software", "Productivity"],
    links: [
      { label: "manuscripts-app.com", href: "https://manuscripts-app.com", icon: ExternalLink },
    ],
  },
];

const pastProjects = [
  {
    id: "together-trial",
    name: "TOGETHER Trial",
    tagline: "Global Adaptive Platform Clinical Trial",
    description:
      "Executive Director of the TOGETHER Adaptive Platform Trial evaluating repurposed therapies for COVID-19. Led recruitment of 12,000+ patients across 22 international collaborating sites, with findings published in The Lancet and New England Journal of Medicine.",
    icon: FlaskConical,
    tags: ["Clinical Trials", "Global Health", "Executive Leadership", "COVID-19"],
    period: "2020-2023",
  },
  {
    id: "cytel",
    name: "Cytel Canada Health",
    tagline: "Director of Global Health Strategy",
    description:
      "Developed web-based decision-support and data visualization tools for policymakers to model COVID-19 impacts and track global clinical trial progress. Delivered successful projects for the Bill & Melinda Gates Foundation, UNICEF, and Health Data Research UK.",
    icon: BarChart2,
    tags: ["Data Visualization", "Decision Support", "Policy", "COVID-19"],
    period: "2020-2021",
  },
  {
    id: "purpose-africa",
    name: "Purpose Africa",
    tagline: "Research Capacity Building Initiative",
    description:
      "Co-founded initiative to strengthen health research capacity across Africa through training, mentorship, and collaborative research partnerships. Developed programs in research methodology, data analysis, and scientific writing for early-career researchers.",
    icon: Users,
    tags: ["Capacity Building", "Mentorship", "Africa", "Education"],
    period: "2016-2019",
  },
  {
    id: "rwanda-biomedical-centre",
    name: "Rwanda Biomedical Centre",
    tagline: "Data Science Advisor, Ministry of Health",
    description:
      "Provided direct scientific and data analytic support to the Rwanda Biomedical Centre (Division of HIV, STIs and Viral Hepatitis), including surveillance indicator configuration, data quality management, and routine reporting workflows. Supported national health systems including the Rwanda Health Analytics Platform (RHAP) and DHIS2-based surveillance.",
    icon: Building2,
    tags: ["Policy Advisory", "Data Science", "Government", "Rwanda"],
    period: "2017-2019",
  },
];

export default function ProjectsPage() {
  return (
    <>
      <section>
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight text-primary-950">
              Projects
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              From research leadership and health systems to AI ventures and digital tools.
              Spanning surveillance, clinical trials, capacity building, and misinformation detection.
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <h2 className="text-2xl font-bold font-headline text-primary-950 mb-6">Current Projects</h2>
          <div className="grid grid-cols-1 gap-8">
        {projects.map((project) => (
          <Card
            key={project.id}
            id={project.id}
            className="flex flex-col hover:shadow-xl transition-all duration-300 scroll-mt-24"
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent-600/20">
                    <project.icon className="h-7 w-7 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="font-headline text-2xl text-accent-950">
                      {project.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground font-medium">
                      {project.tagline}
                    </p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <CardDescription className="text-base leading-relaxed mb-6">
                {project.description}
              </CardDescription>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="text-xs border-accent-950/20"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Links */}
              {project.links.length > 0 && (
              <div className="flex gap-3 mt-auto">
                {project.links.map((link) => (
                  <Button
                    key={link.label}
                    variant={link.label.includes("GitHub") ? "outline" : "default"}
                    size="sm"
                    asChild
                  >
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      <link.icon className="h-4 w-4" />
                      {link.label}
                    </a>
                  </Button>
                ))}
              </div>
              )}
            </CardContent>
          </Card>
        ))}
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="mb-8">
            <h2 className="text-2xl font-bold font-headline text-primary-950 mb-2">Past Projects</h2>
            <p className="text-muted-foreground">
              Previous leadership roles in global health research, clinical trials, and health systems strengthening.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {pastProjects.map((project) => (
          <Card
            key={project.id}
            id={project.id}
            className="flex flex-col hover:shadow-lg transition-all duration-300 scroll-mt-24"
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-muted to-muted/50">
                    <project.icon className="h-7 w-7 text-muted-foreground" />
                  </div>
                  <div>
                    <CardTitle className="font-headline text-xl text-accent-950">
                      {project.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground font-medium">
                      {project.tagline}
                    </p>
                  </div>
                </div>
                {project.period && (
                  <Badge
                    variant="outline"
                    className="text-xs border-accent-950/20"
                  >
                    {project.period}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <CardDescription className="text-base leading-relaxed mb-6">
                {project.description}
              </CardDescription>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-auto">
                {project.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="text-xs border-accent-950/20"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="text-center">
            <p className="text-foreground mb-4">
              Interested in collaborating on AI and health research?
            </p>
            <Button asChild size="lg">
              <a href="/contact">Get in Touch</a>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
