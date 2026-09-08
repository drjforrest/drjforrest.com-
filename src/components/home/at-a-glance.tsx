import Link from "next/link";
import { ArrowRight, User, FlaskConical, Book, Mail } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const sections = [
  {
    title: "About",
    description: "My background and cross-continental experience.",
    href: "/about",
    icon: <User className="h-8 w-8 text-primary" />,
  },
  {
    title: "Research",
    description: "Projects, methods, and impact.",
    href: "/research",
    icon: <FlaskConical className="h-8 w-8 text-primary" />,
  },
  {
    title: "Publications",
    description: "A collection of my published work.",
    href: "/publications",
    icon: <Book className="h-8 w-8 text-primary" />,
  },
  {
    title: "Contact",
    description: "Let's connect and collaborate.",
    href: "/contact",
    icon: <Mail className="h-8 w-8 text-primary" />,
  },
];

export function AtAGlance() {
  return (
    <section className="bg-secondary">
      <div className="container">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {sections.map((section) => (
            <Link href={section.href} key={section.title} className="group">
              <Card className="h-full transition-all group-hover:shadow-lg group-hover:-translate-y-1">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    {section.icon}
                    <ArrowRight className="h-6 w-6 text-muted-foreground transition-transform group-hover:translate-x-1" />
                  </div>
                  <CardTitle className="pt-4 font-headline">{section.title}</CardTitle>
                  <CardDescription>{section.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
