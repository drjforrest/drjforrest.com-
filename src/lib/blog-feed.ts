import { getAllPosts } from "@/lib/blog/posts";

export interface BlogPost {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  categories: string[];
}

export interface BlogFeed {
  title: string;
  description: string;
  posts: BlogPost[];
}

const MAX_DESCRIPTION = 150;

function truncate(text: string, max = MAX_DESCRIPTION): string {
  if (text.length <= max) return text;
  return text.slice(0, max) + "...";
}

export async function fetchBlogFeed(): Promise<BlogFeed | null> {
  try {
    const posts = getAllPosts().slice(0, 3);
    return {
      title: "Writing",
      description: "Essays on technology, health, evidence, and trust",
      posts: posts.map((post) => ({
        title: post.title,
        description: truncate(post.excerpt ?? ""),
        link: `/blog/posts/${post.slug}`,
        pubDate: post.date,
        categories: [post.category, ...(post.tags ?? [])].filter(Boolean),
      })),
    };
  } catch (error) {
    console.error("Error loading blog posts:", error);
    return null;
  }
}

export const fallbackBlogData: BlogFeed = {
  title: "Writing",
  description: "Essays on technology, health, evidence, and trust",
  posts: [],
};
