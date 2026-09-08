import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Shield, Lightbulb } from "lucide-react";

const expertise = [
  "AI in Healthcare",
  "Health Informatics",
  "Misinformation Detection",
  "Digital Innovation",
  "Global Health",
  "Clinical Research Operations",
  "Curriculum Development",
  "Teaching & Mentorship",
  "Capacity Building",
  "Cross-Continental Partnerships",
  "Health Equity",
  "Data Science for Health",
  "Research Methods",
];

export default function AboutPage() {
  return (
    <div className="px-4 md:px-8 lg:px-16">
      {/* Hero Section */}
      <section>
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
              <div className="flex flex-col items-center text-center md:items-start md:text-left">
                <Avatar className="h-50 w-50 border-4 border-background shadow-lg">
                  <AvatarImage src="/images/jamie-forrest.png" alt="Dr. Jamie Forrest" />
                  <AvatarFallback>JF</AvatarFallback>
                </Avatar>
                <h1 className="mt-6 font-headline text-3xl font-bold">
                  Dr. Jamie Forrest PhD, MPH
                </h1>
                <p className="mt-2 text-muted-foreground">
                  AI &amp; Health Informatics Researcher | Vancouver, BC, Canada
                </p>
                <div className="mt-4 flex flex-col gap-2 md:flex-row">
                  <a 
                    href="/master-academic-cv.md" 
                    download 
                    className="inline-flex items-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    Download CV (Markdown)
                  </a>
                  <a 
                    href="/pdf/Forrest_JI_CV.pdf" 
                    download 
                    className="inline-flex items-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    Download CV (PDF)
                  </a>
                </div>
              </div>
              <div className="md:col-span-2">
                <h2 className="font-headline text-2xl font-semibold">
                  AI &amp; Data Science for Health Equity and Trust
                </h2>
                <h3 className="mt-2 text-lg font-medium text-primary">
                  Building AI systems to detect and counter threats to institutional trust — informed by global health research, teaching, and mentorship
                </h3>
                
                {/* Current Focus Card */}
                <Card className="mt-6 bg-gradient-to-br from-accent-50 to-primary-50 border-accent-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-accent-950 font-headline">
                      <Sparkles className="h-5 w-5 text-accent-600" />
                      Current Focus
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-primary-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-foreground">Trust Defense Technology — CTO</p>
                        <p className="text-sm text-muted-foreground">
                          AI platform detecting and responding to AI-amplified threats against
                          institutional trust in real-time — with applications across health systems,
                          public health communication, and crisis response.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Lightbulb className="h-5 w-5 text-primary-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-foreground">MedContext</p>
                        <p className="text-sm text-muted-foreground">
                          Agentic AI system achieving 91.4% accuracy in detecting medical misinformation
                          (authentic images paired with false claims). Kaggle MedGemma Impact Challenge.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="prose prose-lg mt-6 max-w-none text-muted-foreground dark:prose-invert">
                  <p>
                    I build and lead AI systems for trust defense and health informatics, informed by a research career spanning clinical trials, data science, curriculum development, and equity in AI-enabled health systems. My work focuses on deployable technology that detects, maps, and responds to AI-amplified threats against institutional trust — turning research insights into real-time operational systems.
                  </p>
                  <p>
                    That career began with community-driven biomedical and socio-behavioural research grounded in a commitment to equity and local agency. With foundational training in quantitative public health methods, I have consistently centered research around the lived realities of marginalized communities — ensuring that evidence meaningfully serves those it is intended to benefit. Years embedded with Rwanda&apos;s Ministry of Health, co-developing and scaling digital health information systems, deepened my understanding of the intersection of technology, data sovereignty, and sustainable innovation in resource-limited settings.
                  </p>
                  <p>
                    During the COVID-19 pandemic, I led global clinical research operations across 22 sites on three continents, generating actionable evidence at unprecedented speed. Those experiences sharpened my view of how the pressure for rapid results can exacerbate inequities in research capacity and governance — especially in low- and middle-income contexts — and drove me toward building adaptive systems that safeguard integrity while promoting equity.
                  </p>
                  <p>
                    Throughout my career, I have been deeply committed to mentorship and training — developing curricula in research methods, data science, and AI literacy for researchers and health professionals at every career stage. Today, my aim is to unite the ecosystem-level perspective gained through years of global health research with practical, deployed AI technology — helping institutions defend trust and training the next generation of leaders in health informatics.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-16">
              <h3 className="text-center font-headline text-2xl font-semibold">
                Areas of Expertise
              </h3>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {expertise.map((skill) => (
                  <Badge key={skill} variant="outline" className="px-4 py-2 text-md">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
