import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FlaskConical, Handshake, TrendingUp, Zap } from "lucide-react";
import Link from "next/link";

const researchAreas = [
  {
    icon: <Zap className="h-5 w-5 text-primary" />,
    title: "Digital Innovation as Research Subject",
    description: "Investigating how AI, mobile platforms, and data systems are transforming health research, practice, and policy. This area focuses on the socio-technical dynamics of digital ecosystems.",
    tags: ["Digital Ecosystems", "AI Policy", "Health Informatics"],
  },
  {
    icon: <FlaskConical className="h-5 w-5 text-primary" />,
    title: "Digital Innovation as Research Tool",
    description: "Applying computational methods, machine learning, and network analysis to uncover insights from complex health data. This work aims to develop and validate novel digital methodologies for research.",
    tags: ["Machine Learning", "Network Analysis", "Data Visualization"],
  },
  {
    icon: <Handshake className="h-5 w-5 text-primary" />,
    title: "Equitable Research Partnerships",
    description: "Analyzing and promoting equitable collaboration models in the digital age. This includes studying funding flows, knowledge sharing, and capacity building in North-South partnerships.",
    tags: ["Collaboration", "Equity", "Capacity Building"],
  },
   {
    icon: <TrendingUp className="h-5 w-5 text-primary" />,
    title: "Research Impact & Translation",
    description: "Focusing on translating research findings into tangible policy, tools, and practices. This involves developing frameworks and indicators to measure the real-world impact of digital health interventions.",
    tags: ["Knowledge Translation", "Impact Measurement", "Policy"],
  },
];

export default function ResearchPage() {
  return (
    <>
      <section className="bg-secondary">
        <div className="container text-center">
          <h1 className="font-headline text-4xl font-bold tracking-tight md:text-5xl">
            My Research Program
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg text-muted-foreground">
            My research operates at the intersection of digital innovation, global health, and collaborative science. I aim to understand, critique, and harness technology to build more equitable and effective health systems worldwide.
          </p>
        </div>
      </section>

      <section>
        <div className="container max-w-4xl">
           <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {researchAreas.map((area) => (
              <div key={area.title} className="flex items-start space-x-4">
                <div className="mt-1 flex-shrink-0">{area.icon}</div>
                <div>
                  <h3 className="font-semibold">{area.title}</h3>
                  <p className="mt-1 text-muted-foreground">{area.description}</p>
                   <div className="mt-2 flex flex-wrap gap-2">
                    {area.tags.map(tag => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-secondary">
        <div className="container max-w-4xl">
          <h2 className="mb-8 text-center font-headline text-3xl font-bold">
            Key Research Facets
          </h2>
          <Accordion type="single" collapsible defaultValue="item-1">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-xl">Projects</AccordionTrigger>
              <AccordionContent className="prose prose-lg max-w-none text-muted-foreground">
                <p>
                  My project portfolio includes multi-year, grant-funded initiatives focused on AI readiness in African health systems, analyses of international research networks, and the development of digital tools for clinical decision support. Each project is conducted in close partnership with academic institutions, NGOs, and government bodies.
                </p>
                <Button asChild>
                  <Link href="/publications">View Related Publications</Link>
                </Button>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-xl">Methods</AccordionTrigger>
              <AccordionContent className="prose prose-lg max-w-none text-muted-foreground">
                <p>
                  I employ a mixed-methods approach that combines qualitative inquiry with quantitative and computational techniques. Core methodologies include:
                </p>
                <ul>
                  <li><strong>Social Network Analysis (SNA):</strong> To map and measure collaborative structures.</li>
                  <li><strong>Machine Learning:</strong> For predictive modeling and pattern recognition in large datasets.</li>
                  <li><strong>Case Study & Ethnography:</strong> To understand the context-specific nuances of technology implementation.</li>
                  <li><strong>Data Visualization:</strong> To communicate complex findings to diverse audiences.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-xl">Research Impact</AccordionTrigger>
              <AccordionContent className="prose prose-lg max-w-none text-muted-foreground">
                <p>
                  Impact is a central tenet of my work. Beyond academic publications, my research has contributed to policy briefs for health ministries, open-source software tools for researchers, and training curricula that have been adopted by partner institutions. The goal is always to ensure that research outputs are not just academically novel but also practically useful and socially beneficial.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
    </>
  );
}
