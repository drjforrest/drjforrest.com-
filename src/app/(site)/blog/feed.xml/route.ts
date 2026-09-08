import { getAllPosts } from '@/lib/blog/posts';
import { NextResponse } from 'next/server';

const SITE_URL = 'https://drjforrest.com';
const SITE_NAME = 'Mind the Gap';
const SITE_DESCRIPTION = 'AI, Health, and Digital Equity - Exploring how technology can heal or harm, and ensuring no one gets left behind.';

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, function (c) {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

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
  const lastBuildDate = new Date().toUTCString();
  
  // Get the most recent post date for lastBuildDate
  const mostRecentPost = posts[0];
  const pubDate = mostRecentPost ? new Date(mostRecentPost.date).toUTCString() : lastBuildDate;

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${SITE_URL}/blog</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>en-us</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <pubDate>${pubDate}</pubDate>
    <ttl>60</ttl>
    <atom:link href="${SITE_URL}/blog/feed.xml" rel="self" type="application/rss+xml" />
    <managingEditor>jamie@drjforrest.com (Jamie Forrest)</managingEditor>
    <webMaster>jamie@drjforrest.com (Jamie Forrest)</webMaster>
    <category>Digital Health</category>
    <category>AI Ethics</category>
    <category>Health Equity</category>
    <category>Global Health</category>
    <generator>Next.js RSS Generator</generator>
    <docs>https://www.rssboard.org/rss-specification</docs>
    ${posts.map((post) => {
      const postUrl = `${SITE_URL}/blog/posts/${post.slug}`;
      const postDate = new Date(post.date).toUTCString();
      
      // Create a clean description from the excerpt and a snippet of content
      const description = post.excerpt || stripMarkdown(post.content).substring(0, 300) + '...';
      
      // Extract categories from tags and article type
      const categories = [...post.tags, post.category, post.articleType]
        .filter(Boolean)
        .map(cat => `    <category>${escapeXml(cat)}</category>`)
        .join('\n');

      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <description><![CDATA[${description}]]></description>
      <pubDate>${postDate}</pubDate>
      <author>jamie@drjforrest.com (Jamie Forrest)</author>
${categories}
    </item>`;
    }).join('\n')}
  </channel>
</rss>`;

  return new NextResponse(rssXml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200',
    },
  });
}