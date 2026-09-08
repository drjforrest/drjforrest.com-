import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, Shield, FlaskConical, Globe, Users, Building2, GraduationCap, Lightbulb, BarChart2, FileText } from "lucide-react";
import Link from "next/link";

const featuredProjects = [
  {
    id: "trust-defense",
    name: "Trust Defense Technology",
    tagline: "Chief Technology Officer | AI-Powered Threat Detection",
    description:
      "Leading the development of systems that detect, map, and respond to AI-amplified threats against institutional trust in real-time — a structural response to the commercialized ecosystem of disinformation, rooted in years of health equity research and crisis informatics. MedContext, the platform's first deployed product, achieves 91.4% accuracy in detecting medical misinformation.",
    icon: Shield,
    tags: ["Trust Defense", "AI/ML", "Health Informatics"],
    href: "/projects",
    external: false,
  },
  {
    id: "health-equity-research",
    name: "Health Equity & Crisis Informatics",
    tagline: "Research Leadership | AI in Health",
    description:
      "Leading interdisciplinary research integrating crisis informatics and data science to create next-generation intelligence for health resilience. This work bridges frontline clinical expertise, AI, and global health leadership — transforming evidence into action through deployed AI systems.",
    icon: GraduationCap,
    tags: ["Trust & Crisis Intelligence", "Equity", "Teaching & Mentorship"],
    href: "/projects",
    external: false,
  },
  {
    id: "boreal-labs",
    name: "Boreal Labs",
    tagline: "Founder & Principal Scientist",
    description:
      "Private consulting, strategic guidance, and investment in global health, technology, and AI readiness.",
    icon: Lightbulb,
    tags: ["Consulting", "Strategic Advisory", "Investment"],
    href: "https://boreal-labs.com",
    external: true,
  },
  {
    id: "medcontext",
    name: "MedContext",
    tagline: "Agentic AI for Medical Misinformation Detection",
    description:
      "Multimodal detection system achieving 91.4% accuracy in identifying medical misinformation — particularly authentic images paired with false claims — through contextual authenticity analysis. Submitted to the Kaggle MedGemma Impact Challenge.",
    icon: Sparkles,
    tags: ["AI/ML", "Kaggle", "Multimodal"],
    href: "/projects#medcontext",
  },
  {
    id: "manuscripts",
    name: "Manuscripts",
    tagline: "A Mac app for academics",
    description:
      "A focused desktop tool for keeping track of papers, submissions, and revisions — each manuscript as a complete record with authors, versions, and journal state, rather than a row in a spreadsheet. Built local-first for academics who've outgrown ad-hoc tracking.",
    icon: FileText,
    tags: ["Mac App", "Academic Tools", "Independent Software"],
    href: "https://forrestjamie.gumroad.com/l/hutrvj",
    external: true,
  },
];

const pastProjects = [
  {
    id: "together-trial",
    name: "TOGETHER Trial",
    tagline: "Global Adaptive Platform Clinical Trial",
    description:
      "Executive Director of the TOGETHER Adaptive Platform Trial evaluating repurposed therapies for COVID-19. Recruited 12,000+ patients across 22 international sites, with findings published in The Lancet and NEJM.",
    icon: FlaskConical,
    tags: ["Clinical Trials", "Global Health", "Executive Leadership"],
    href: "/projects#together-trial",
  },
  {
    id: "cytel",
    name: "Cytel Canada Health",
    tagline: "Director of Global Health Strategy",
    description:
      "Developed web-based decision-support and data visualization tools for policymakers to model COVID-19 impacts and track global clinical trial progress. Delivered successful projects for the Bill & Melinda Gates Foundation, UNICEF, and Health Data Research UK.",
    icon: BarChart2,
    tags: ["Data Visualization", "Decision Support", "Policy"],
    href: "/projects#cytel",
  },
  {
    id: "purpose-africa",
    name: "Purpose Africa",
    tagline: "Research Capacity Building Initiative",
    description:
      "Co-founded initiative to strengthen health research capacity across Africa through training, mentorship, and collaborative research partnerships.",
    icon: Users,
    tags: ["Capacity Building", "Mentorship", "Africa"],
    href: "/projects#purpose-africa",
  },
  {
    id: "rwanda-biomedical-centre",
    name: "Rwanda Biomedical Centre",
    tagline: "Data Science Advisor, Ministry of Health",
    description:
      "Provided direct scientific and data analytic support to the Rwanda Biomedical Centre, including surveillance indicator configuration, data quality management, and routine reporting workflows. Supported national health systems including the Rwanda Health Analytics Platform (RHAP) and DHIS2-based surveillance.",
    icon: Building2,
    tags: ["Policy Advisory", "Data Science", "Government", "Rwanda"],
    href: "/projects#rwanda-biomedical-centre",
  },
];

export function ProjectsSection() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-accent-50/50 via-white to-white">
      <div className="container">
        {/* Current Projects */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-bold font-headline tracking-tight text-primary-950">
              Current Projects
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              From research leadership and health systems to AI ventures and
              digital tools — spanning surveillance, clinical trials, and capacity building.
            </p>
          </div>
          <Button asChild variant="outline" className="w-fit group">
            <Link href="/projects" className="flex items-center gap-2">
              View All Projects
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          {featuredProjects.map((project) => (
            <Card
              key={project.id}
              className="flex flex-col hover:shadow-lg transition-all duration-300 group"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-accent-600/10 group-hover:from-primary/20 group-hover:to-accent-600/20 transition-colors">
                    <project.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <CardTitle className="font-headline text-xl text-accent-950 mt-4">
                  {project.name}
                </CardTitle>
                <p className="text-sm text-muted-foreground font-medium">
                  {project.tagline}
                </p>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <CardDescription className="text-sm leading-relaxed mb-4 flex-1">
                  {project.description}
                </CardDescription>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="text-xs border-accent-950/10"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                <Button variant="ghost" size="sm" asChild className="w-fit -ml-2">
                  {project.external ? (
                    <a
                      href={project.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-primary"
                    >
                      Learn more
                      <ArrowRight className="h-3 w-3" />
                    </a>
                  ) : (
                    <Link
                      href={project.href}
                      className="flex items-center gap-1 text-primary"
                    >
                      Learn more
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Past Projects */}
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-headline tracking-tight text-primary-950">
            Past Projects
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
            Previous leadership roles in global health research, clinical trials, and health systems strengthening.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pastProjects.map((project) => (
            <Card
              key={project.id}
              className="flex flex-col hover:shadow-lg transition-all duration-300 group"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-muted to-muted/50 group-hover:from-muted/80 group-hover:to-muted/30 transition-colors">
                    <project.icon className="h-6 w-6 text-muted-foreground" />
                  </div>
                </div>
                <CardTitle className="font-headline text-xl text-accent-950 mt-4">
                  {project.name}
                </CardTitle>
                <p className="text-sm text-muted-foreground font-medium">
                  {project.tagline}
                </p>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <CardDescription className="text-sm leading-relaxed mb-4 flex-1">
                  {project.description}
                </CardDescription>

                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="text-xs border-accent-950/10"
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
  );
}
