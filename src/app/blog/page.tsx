import Link from "next/link";
import { getAllPosts } from "@/lib/blog/posts";
import { Button } from "@/components/ui/button";
import { PostCard } from "@/components/blog/PostCard";
import { Badge } from "@/components/ui/badge";
import { ArticleTypeBadge } from "@/components/ui/article-type-badge";

export default function BlogHome() {
  const posts = getAllPosts();
  const featuredPosts = posts.slice(0, 3); // Show first 3 posts as featured
  const allCategories = [...new Set(posts.map((p) => p.category))];
  const allTags = [...new Set(posts.flatMap((p) => p.tags))];
  const allArticleTypes = [...new Set(posts.map((p) => p.articleType))];

  return (
    <div className="min-h-screen relative">
      {/* Muted tube map background */}
      <div
        className="absolute inset-0 opacity-10 bg-center bg-no-repeat bg-contain pointer-events-none"
        style={{
          backgroundImage: "url(/blog/images/tube.svg)",
          backgroundSize: "90%",
          backgroundPosition: "center 10%",
        }}
      />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 py-12">
        {/* Hero section */}
        <div className="max-w-4xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Mind the Gap: AI, Health, and Digital Equity
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Navigating the intersection of technology and fairness in health.
            Exploring how AI can heal or harm, and ensuring no one gets left
            behind.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/blog/archive">
              <Button
                size="lg"
                className="text-lg px-8 py-3 border-2 border-primary/20 hover:border-primary/40"
              >
                Browse All Posts
              </Button>
            </Link>
          </div>
        </div>

        {/* Featured posts section */}
        <div className="w-full max-w-6xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-8">Featured Articles</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featuredPosts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
          {posts.length > 3 && (
            <div className="mt-8">
              <Link href="/blog/archive">
                <Button variant="outline">
                  View All {posts.length} Articles →
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Categories and tags section */}
        <div className="w-full max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold mb-6">Explore Topics</h3>
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold mb-3">Article Types</h4>
              <div className="flex flex-wrap gap-2 justify-center">
                {allArticleTypes.map((articleType) => (
                  <Link
                    key={articleType}
                    href={`/blog/archive?articleType=${encodeURIComponent(articleType)}`}
                  >
                    <div className="cursor-pointer hover:opacity-80 transition-opacity">
                      <ArticleTypeBadge articleType={articleType} />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-3">Categories</h4>
              <div className="flex flex-wrap gap-2 justify-center">
                {allCategories.map((category) => (
                  <Link
                    key={category}
                    href={`/blog/archive?filter=${encodeURIComponent(category)}`}
                  >
                    <Badge
                      variant="default"
                      className="text-sm hover:bg-primary/80 cursor-pointer"
                    >
                      {category}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-3">Tags</h4>
              <div className="flex flex-wrap gap-2 justify-center">
                {allTags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog/archive?filter=${encodeURIComponent(tag)}`}
                  >
                    <Badge
                      variant="outline"
                      className="text-sm hover:bg-accent cursor-pointer"
                    >
                      {tag}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
