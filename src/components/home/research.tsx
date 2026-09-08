import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Globe, Lightbulb, Shield, Users } from "lucide-react";

export function Research() {
  return (
    <section>
      <div className="container">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-5xl text-primary-950 font-bold font-headline tracking-tight">
            Research Mission
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            My research spans several interdisciplinary projects that examine
            how
            <strong>
              {" "}
              digital technologies are designed, adapted, and governed,
            </strong>{" "}
            to improve health outcomes and promote health equity. Leveraging
            strengths in global health partnerships for interdisciplinary
            inquiry, I investigate interconnected challenges and solutions where
            digital innovation is both the contagion and the cure.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="flex flex-col hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Shield className="h-10 w-10 text-accent-950" />
                </div>
                <CardTitle className="font-headline text-accent-950 text-xl">
                  Misinformation & Information Integrity
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <CardDescription className="text-md">
                Building multimodal AI systems to detect health misinformation
                and studying its impacts on public health trust, especially
                during emergencies.
              </CardDescription>
            </CardContent>
          </Card>
          <Card className="flex flex-col hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Lightbulb className="h-10 w-10 text-accent-950" />
                </div>
                <CardTitle className="font-headline text-accent-950 text-xl">
                  AI Governance & Digital Equity
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <CardDescription className="text-md">
                Advancing practices and protections so artificial intelligence
                drives equitable health outcomes—especially in emergencies.
              </CardDescription>
            </CardContent>
          </Card>
          <Card className="flex flex-col hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Globe className="h-10 w-10 text-accent-950" />
                </div>
                <CardTitle className="font-headline text-accent-950 text-xl">
                  Technology Equity & Data Sovereignty
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <CardDescription className="text-md">
                Analyzing global power, access, and control of digital health
                data, to center local voices and priorities.
              </CardDescription>
            </CardContent>
          </Card>
          <Card className="flex flex-col hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Globe className="h-10 w-10 text-accent-950" />
                </div>
                <CardTitle className="font-headline text-accent-950 text-xl">
                  Digital Health Information Systems
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <CardDescription className="text-md">
                Integrating technology in resource-limited contexts with a focus
                on sustainability and community ownership.
              </CardDescription>
            </CardContent>
          </Card>
          <Card className="flex flex-col hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Shield className="h-10 w-10 text-accent-950" />
                </div>
                <CardTitle className="font-headline text-accent-950 text-xl">
                  Resilient Clinical Research Operations
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <CardDescription className="text-md">
                Designing and operationally implementing adaptive platform trial
                methods in partnerships to accelerate evidence generation when
                it matters most.
              </CardDescription>
            </CardContent>
          </Card>
          <Card className="flex flex-col hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="h-10 w-10 text-accent-950" />
                </div>
                <CardTitle className="font-headline font-strong text-accent-950 text-xl">
                  Community-Centred Implementation Science
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <CardDescription className="text-md">
                Using participatory, iterative methods to authentically engage
                and empower communities in health innovation.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
