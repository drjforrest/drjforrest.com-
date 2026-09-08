import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Download } from "lucide-react";

export const metadata = {
  title: "Teaching Demo | Dr Jamie Forrest",
  description: "Teaching demonstration materials and handout.",
};

export default function TeachingDemoPage() {
  return (
    <div className="px-4 md:px-8 lg:px-16">
      <section className="container py-12">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-headline text-4xl font-bold">Teaching Demo</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Supporting materials for the teaching demonstration.
          </p>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline">
                <FileText className="h-5 w-5 text-primary" />
                Teaching Handout
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Download the handout that accompanies the teaching demonstration.
              </p>
              <a
                href="/teaching-demo/teaching_handout.docx"
                download
                className="mt-4 inline-flex items-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <Download className="h-4 w-4" />
                Download Handout (DOCX)
              </a>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
