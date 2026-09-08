import { getAllPosts } from '@/lib/blog/posts';
import { NextResponse } from 'next/server';

const SITE_URL = 'https://drjforrest.com';
const SITE_NAME = 'Mind the Gap';
const SITE_DESCRIPTION = 'AI, Health, and Digital Equity - Exploring how technology can heal or harm, and ensuring no one gets left behind.';

function stripMarkdown(markdown: string): string {
  return markdown
    // Remove headers
    .replace(/#{1,6}\s+/g, '')
    // Remove bold/italic
    .replace(/\*{1,2}([^*]+)\*{1,2}/g, '$1')
    .replace(/_{1,2}([^_]+)_{1,2}/g, '$1')
    // Remove links
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove images
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '')
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, '')
    // Remove inline code
    .replace(/`([^`]+)`/g, '$1')
    // Remove blockquotes
    .replace(/^\s*>\s+/gm, '')
    // Clean up multiple whitespaces and newlines
    .replace(/\n\s*\n/g, '\n\n')
    .replace(/\s+/g, ' ')
    .trim();
}

export async function GET() {
  const posts = getAllPosts();
  
  const jsonFeed = {
    version: 'https://jsonfeed.org/version/1.1',
    title: SITE_NAME,
    home_page_url: SITE_URL,
    feed_url: `${SITE_URL}/blog/feed.json`,
    description: SITE_DESCRIPTION,
    language: 'en-us',
    authors: [
      {
        name: 'Jamie Forrest',
        email: 'jamie@drjforrest.com',
        url: 'https://drjforrest.com'
      }
    ],
    items: posts.map((post) => {
      const postUrl = `${SITE_URL}/blog/posts/${post.slug}`;
      const description = post.excerpt || stripMarkdown(post.content).substring(0, 300) + '...';
      
      return {
        id: postUrl,
        url: postUrl,
        title: post.title,
        content_html: post.content, // Raw markdown - readers can process as needed
        content_text: stripMarkdown(post.content),
        summary: description,
        date_published: new Date(post.date).toISOString(),
        authors: [
          {
            name: 'Jamie Forrest',
            email: 'jamie@drjforrest.com'
          }
        ],
        tags: [...post.tags, post.category, post.articleType].filter(Boolean),
        _article_type: post.articleType,
        _category: post.category
      };
    })
  };

  return new NextResponse(JSON.stringify(jsonFeed, null, 2), {
    headers: {
      'Content-Type': 'application/feed+json',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200',
    },
  });
}