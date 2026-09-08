import { AiSummary } from "@/components/blog/AiSummary";
import EnvironmentalHypocrisyComparison from "@/components/blog/EnvironmentalHypocrisyComparison";
import { EquityGapSpotter } from "@/components/blog/EquityGapSpotter";
import LevelingEffectVisualization from "@/components/blog/LevellingEffectVisualization";
import { PostConnectionMapper } from "@/components/blog/PostConnectionMapper";
import ConsultingTransformationViz from "@/components/blog/charts/blogArticle4-charts";
import { ArticleTypeBadge } from "@/components/ui/article-type-badge";
import { Badge } from "@/components/ui/badge";
import { getAllPosts, getPostBySlug } from "@/lib/blog/posts";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

interface PostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  const allPosts = getAllPosts();

  if (!post) {
    notFound();
  }

  // Process content to handle multiple component tags
  // Split by all component tags and preserve them
  const componentRegex = /<(ConsultingTransformationViz|HypocrisyMatrixViz|LevelingEffectViz)\s*\/>/g;
  const parts: Array<{ type: 'text' | 'component'; content: string }> = [];
  let lastIndex = 0;
  let match;

  while ((match = componentRegex.exec(post.content)) !== null) {
    // Add text before component
    if (match.index > lastIndex) {
      parts.push({
        type: 'text',
        content: post.content.slice(lastIndex, match.index),
      });
    }
    // Add component
    parts.push({
      type: 'component',
      content: match[1], // Component name
    });
    lastIndex = match.index + match[0].length;
  }
  // Add remaining text
  if (lastIndex < post.content.length) {
    parts.push({
      type: 'text',
      content: post.content.slice(lastIndex),
    });
  }

  // If no components found, just use the full content as text
  if (parts.length === 0) {
    parts.push({ type: 'text', content: post.content });
  }

  return (
    <article className="max-w-4xl mx-auto py-8">
      <header className="mb-8 text-center">
        <div className="mb-4 flex justify-center gap-2 flex-wrap">
          <ArticleTypeBadge articleType={post.articleType} />
          <Badge variant="secondary">{post.category}</Badge>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">
          {post.title}
        </h1>
        <p className="text-muted-foreground">
          {new Date(post.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        <div className="mt-4 flex justify-center flex-wrap gap-2">
          {post.tags &&
            post.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
        </div>
      </header>

      <div className="prose dark:prose-invert max-w-none text-lg">
        <p className="lead text-xl text-muted-foreground mb-8">
          {post.excerpt}
        </p>

        {parts.map((part, index) => (
          <div key={index}>
            {part.type === 'text' ? (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  img: ({ node, ...props }) => {
                    const alt = props.alt || "";
                    const src = props.src || "";

                    // Only specific academic papers/documents should keep larger size
                    const keepLargerSize =
                      (alt.toLowerCase().includes("publication") && alt.toLowerCase().includes("academic")) ||
                      (alt.toLowerCase().includes("paper") && alt.toLowerCase().includes("documenting")) ||
                      src.includes("hcq-publication") ||
                      src.includes("science-medical-reasoning") ||
                      src.includes("ledley-ct-scanner");

                    // Default to medium size for most images, smaller for general illustrations
                    const sizeClasses = keepLargerSize
                      ? "max-w-3xl max-h-[500px] object-contain"
                      : "max-w-xl max-h-80 object-contain";

                    return (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        {...props}
                        className={`rounded-lg shadow-md my-8 mx-auto border border-border/30 bg-card/30 p-2 ${sizeClasses}`}
                        alt={alt}
                      />
                    );
                  },
                  h1: ({ node, ...props }) => (
                    <h1 {...props} className="text-3xl font-bold mt-8 mb-4" />
                  ),
                  h2: ({ node, ...props }) => (
                    <h2 {...props} className="text-2xl font-bold mt-6 mb-3" />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3 {...props} className="text-xl font-bold mt-6 mb-3" />
                  ),
                  p: ({ node, ...props }) => (
                    <p {...props} className="mb-4 leading-relaxed" />
                  ),
                  ul: ({ node, ...props }) => (
                    <ul {...props} className="list-disc pl-6 mb-4 space-y-2" />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol {...props} className="list-decimal pl-6 mb-4 space-y-2" />
                  ),
                  blockquote: ({ node, ...props }) => (
                    <blockquote
                      {...props}
                      className="border-l-4 border-primary/30 pl-4 italic my-6 text-muted-foreground"
                    />
                  ),
                  em: ({ node, ...props }) => (
                    <em
                      {...props}
                      className="italic text-muted-foreground text-sm block text-center my-2"
                    />
                  ),
                }}
              >
                {part.content}
              </ReactMarkdown>
            ) : (
              <div className="my-8">
                {part.content === 'ConsultingTransformationViz' && <ConsultingTransformationViz />}
                {part.content === 'HypocrisyMatrixViz' && <EnvironmentalHypocrisyComparison />}
                {part.content === 'LevelingEffectViz' && <LevelingEffectVisualization />}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-12 space-y-8">
        <AiSummary blogPostContent={post.content} />
        <EquityGapSpotter blogTitle={post.title} blogContent={post.content} />
        <PostConnectionMapper currentPost={post} allPosts={allPosts} />
      </div>
    </article>
  );
}