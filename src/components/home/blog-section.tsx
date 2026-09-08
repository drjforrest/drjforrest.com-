import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Rss, Calendar } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { fetchBlogFeed, fallbackBlogData } from "@/lib/blog-feed";

export async function BlogSection() {
  // Fetch the latest blog posts
  const blogFeed = await fetchBlogFeed() || fallbackBlogData;

  return (
    <section className="bg-secondary">
      <div className="container">
        <div>
          <h2 className="font-headline text-5xl text-primary-950 font-bold tracking-tight mb-2">
            Mind the Gap
          </h2>
          <h3 className="font-semibold text-eggplant-950 text-2xl mb-8">
            AI, Digital Health, and Who Gets Left Behind
          </h3>
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
            <div>
              <p className="text-lg text-muted-foreground mb-6">
                In this rapidly evolving digital age, Artificial Intelligence
                (AI) is transforming every facet of our lives, and healthcare is
                no exception. As an academic investigating the public
                health side of AI in its many forms, I'm asking the
                critical question:{" "}
                <strong>
                  Who benefits from this revolution, and who might be left
                  behind?
                </strong>
              </p>
              <p className="text-muted-foreground mb-6">
                Mind the Gap is a space to explore the fascinating, often
                complex, and sometimes unsettling intersection of AI and
                health, always with a sharp focus on equity. It discusses how
                these powerful technologies can either bridge or widen existing
                disparities, examining the challenges of algorithmic
                bias, the growing digital divide, equitable access, and data privacy and sovereignty.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <Button asChild size="lg" variant="white-card">
                  <Link href="/blog">
                    Visit Mind the Gap
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-red-500 text-red-500 hover:bg-red-50 hover:text-red-700">
                  <Link href="/blog/feed.xml">
                    <Rss className="mr-2 h-4 w-4" />
                    RSS Feed
                  </Link>
                </Button>
              </div>
              <div className="my-6 flex justify-center">
                <Image
                  src="/images/mind-the-gap-logo.png"
                  alt="Mind the Gap Logo"
                  width={300}
                  height={200}
                  className="rounded-lg max-w-full h-auto"
                />
              </div>
            </div>
            <div>
              <div className="mb-6">
                <h4 className="text-xl font-semibold text-primary-950 mb-4 flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Latest Posts
                </h4>
                <div className="space-y-4">
                  {blogFeed.posts.map((post, index) => {
                    // Parse the date for better formatting
                    const date = new Date(post.pubDate);
                    const formattedDate = date.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    });

                    return (
                      <Card key={index} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <CardTitle className="text-base font-semibold leading-tight pr-2">
                              <Link
                                href={post.link}
                                className="hover:text-primary transition-colors"
                              >
                                {post.title}
                              </Link>
                            </CardTitle>
                            <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                            {post.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex flex-wrap gap-1">
                              {post.categories.slice(0, 2).map((category, catIndex) => (
                                <Badge key={catIndex} variant="secondary" className="text-xs">
                                  {category}
                                </Badge>
                              ))}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {formattedDate}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
              <div className="text-center">
                <Link
                  href="/blog/archive"
                  className="text-sm text-primary hover:underline inline-flex items-center"
                >
                  View all posts <ExternalLink className="ml-1 h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
