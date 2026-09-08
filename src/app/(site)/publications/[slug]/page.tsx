import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Quote, Users, Calendar, BookOpen, TrendingUp } from "lucide-react";
import { publications } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static params for all publications
export async function generateStaticParams() {
  return publications.map((publication) => ({
    slug: publication.slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const publication = publications.find((p) => p.slug === slug);

  if (!publication) {
    return {
      title: "Publication Not Found",
    };
  }

  return {
    title: `${publication.title} | Jamie Forrest`,
    description: publication.abstract.substring(0, 160) + "...",
    openGraph: {
      title: publication.title,
      description: publication.abstract.substring(0, 160) + "...",
      images: [publication.imageUrl],
    },
  };
}

export default async function PublicationPage({ params }: Props) {
  const { slug } = await params;
  const publication = publications.find((p) => p.slug === slug);

  if (!publication) {
    notFound();
  }

  const relatedPublications = publications
    .filter((p) => p.id !== publication.id)
    .filter((p) => p.tags.some((tag) => publication.tags.includes(tag)))
    .slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24">
        <div className="container">
          <div className="mb-6">
            <Button asChild variant="ghost" size="sm">
              <Link href="/publications" className="inline-flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Publications
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            {/* Left Column - Image */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <div className="relative aspect-[3/4] overflow-hidden rounded-lg border-4 border-card shadow-2xl">
                  <Image
                    src={publication.imageUrl}
                    alt={publication.title}
                    fill
                    className="object-cover"
                    data-ai-hint={publication.aiHint}
                  />
                </div>

                {/* Quick Stats */}
                <div className="mt-6 space-y-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <TrendingUp className="h-4 w-4" />
                        Citations
                      </div>
                      <div className="text-2xl font-bold">{publication.cites.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">
                        {publication.citesPerYear.toFixed(1)} per year
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Calendar className="h-4 w-4" />
                        Published
                      </div>
                      <div className="text-lg font-semibold">{publication.year}</div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            {/* Right Column - Content */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                <div>
                  <h1 className="font-headline text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                    {publication.title}
                  </h1>
                </div>

                {/* Journal & Year */}
                <div className="flex items-center gap-2 text-muted-foreground">
                  <BookOpen className="h-4 w-4" />
                  <span className="font-medium">{publication.journal}</span>
                  <span>•</span>
                  <span>{publication.year}</span>
                </div>

                {/* Authors */}
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Users className="h-4 w-4" />
                    Authors
                  </div>
                  <p className="text-sm leading-relaxed">{publication.authors}</p>
                </div>

                {/* Tags */}
                <div>
                  <div className="flex flex-wrap gap-2">
                    {publication.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Abstract */}
                <div>
                  <h2 className="font-headline text-xl font-semibold mb-4">Abstract</h2>
                  <div className="relative">
                    <Quote className="absolute -left-2 -top-2 h-8 w-8 text-muted-foreground/30" />
                    <p className="pl-6 text-muted-foreground leading-relaxed">
                      {publication.abstract}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <Button asChild size="lg" className="flex-1">
                    <a
                      href={publication.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Read Full Paper
                    </a>
                  </Button>

                  {publication.fullTextUrl && publication.fullTextUrl !== publication.pdfUrl && (
                    <Button asChild variant="outline" size="lg" className="flex-1">
                      <a
                        href={publication.fullTextUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Full Text PDF
                      </a>
                    </Button>
                  )}
                </div>

                {/* DOI */}
                {publication.doi && (
                  <div className="pt-4 border-t">
                    <div className="text-sm">
                      <span className="font-medium text-muted-foreground">DOI: </span>
                      <a
                        href={`https://doi.org/${publication.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {publication.doi}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Publications */}
      {relatedPublications.length > 0 && (
        <section className="bg-secondary">
          <div className="container">
            <h2 className="font-headline text-2xl font-bold tracking-tight mb-8">
              Related Publications
            </h2>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {relatedPublications.map((relatedPub) => (
                <Card key={relatedPub.id} className="group hover:shadow-lg transition-shadow">
                  <div className="relative aspect-video overflow-hidden rounded-t-lg">
                    <Image
                      src={relatedPub.imageUrl}
                      alt={relatedPub.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      data-ai-hint={relatedPub.aiHint}
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="font-headline text-lg line-clamp-2">
                      {relatedPub.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {relatedPub.journal} • {relatedPub.year}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1">
                        {relatedPub.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/publications/${relatedPub.slug}`}>
                          Read More
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
