"use client";

import { useState } from "react";
import Image from "next/image";
import { publications, Publication } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, FileText, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function PublicationsPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const allTags = [...new Set(publications.flatMap((p) => p.tags))];

  const handleCopyCitation = (publication: Publication) => {
    const citation = `${publication.authors}. (${
      publication.year
    }). ${publication.title}. ${publication.journal}.${publication.doi ? ` doi:${publication.doi}` : ""}`;
    navigator.clipboard.writeText(citation);
    toast({
      title: "Citation Copied",
      description: "The citation has been copied to your clipboard.",
    });
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const filteredPublications = publications.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.authors.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.journal.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.year.toString().includes(searchTerm);

    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.every((tag) => p.tags.includes(tag));

    return matchesSearch && matchesTags;
  });

  return (
    <>
      <section className="bg-secondary">
        <div className="container text-center">
          <h1 className="font-headline text-4xl font-bold tracking-tight md:text-5xl">
            Publications
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg text-muted-foreground">
            A comprehensive list of my scholarly work. Use the search and filter
            options to explore specific topics and contributions.
          </p>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="mb-12">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by title, author, year, or journal..."
                className="w-full pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "secondary"}
                  onClick={() => toggleTag(tag)}
                  className="cursor-pointer"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredPublications.map((publication) => (
              <Card
                key={publication.id}
                className="flex flex-col overflow-hidden"
              >
                <div className="relative aspect-video">
                  <Image
                    src={publication.imageUrl}
                    alt={publication.title}
                    fill
                    className="object-cover"
                    data-ai-hint={publication.aiHint}
                  />
                </div>
                <CardContent className="flex flex-1 flex-col p-6">
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-2">
                      {publication.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <h3 className="mt-4 font-headline text-lg font-semibold">
                      {publication.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      <span
                        dangerouslySetInnerHTML={{
                          __html: publication.authors.replace(
                            /\b(JI\s+Forrest|J\.?\s*I\.?\s*Forrest|Forrest\s*,?\s*J\.?\s*I?\.?)\b/gi,
                            "<b>$1</b>",
                          ),
                        }}
                      />
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      <i>{publication.journal}</i>, {publication.year}
                    </p>
                  </div>
                  <div className="mt-6 flex flex-wrap gap-2">
                    <Button size="sm" asChild>
                      <a
                        href={publication.pdfUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <FileText className="mr-2 h-4 w-4" /> View PDF
                      </a>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopyCitation(publication)}
                    >
                      <Copy className="mr-2 h-4 w-4" /> Copy Citation
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {filteredPublications.length === 0 && (
            <div className="text-center col-span-full py-16">
              <p className="text-lg text-muted-foreground">
                No publications found matching your criteria.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
