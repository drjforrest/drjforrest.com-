import { Badge } from "./badge";
import { ArticleType, getArticleTypeMetadata } from "@/lib/blog/articleTypes";

interface ArticleTypeBadgeProps {
  articleType: ArticleType;
  size?: "sm" | "default" | "lg";
}

export function ArticleTypeBadge({ articleType, size = "default" }: ArticleTypeBadgeProps) {
  const metadata = getArticleTypeMetadata(articleType);
  
  return (
    <Badge 
      variant="outline" 
      className={`border-2 font-medium ${size === "sm" ? "text-xs px-2 py-1" : ""}`}
      style={{ 
        borderColor: metadata.color,
        color: metadata.color,
        backgroundColor: `${metadata.color}15`
      }}
    >
      <span className="mr-1">{metadata.icon}</span>
      {articleType}
    </Badge>
  );
}