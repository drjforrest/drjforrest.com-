import Link from "next/link";
import { Post } from "@/lib/blog/posts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArticleTypeBadge } from "@/components/ui/article-type-badge";
import { ArrowRight } from "lucide-react";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Link href={`/blog/posts/${post.slug}`} className="group block">
      <Card className="h-full flex flex-col transition-all duration-300 ease-in-out group-hover:shadow-xl group-hover:-translate-y-2 group-hover:scale-[1.02] border border-border/60 hover:border-primary/70 bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-lg hover:bg-card/80">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <ArticleTypeBadge articleType={post.articleType} size="sm" />
            <Badge variant="secondary" className="text-xs">
              {post.category}
            </Badge>
            <p className="text-sm text-muted-foreground">
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <CardTitle className="text-xl font-bold leading-tight group-hover:text-primary transition-colors">
            {post.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow pb-4">
          <p className="text-muted-foreground leading-relaxed">
            {post.excerpt}
          </p>
        </CardContent>
        <CardFooter className="pt-4 border-t">
          <div className="flex justify-between items-center w-full">
            <div className="flex flex-wrap gap-1">
              {post.tags &&
                post.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              {post.tags && post.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{post.tags.length - 3}
                </Badge>
              )}
            </div>
            <div className="flex items-center text-sm font-medium text-primary group-hover:underline">
              Read More <ArrowRight className="ml-1 h-4 w-4" />
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
