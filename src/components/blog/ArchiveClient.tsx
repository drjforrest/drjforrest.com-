"use client";

import { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { PostCard } from '@/components/blog/PostCard';
import { Post } from '@/lib/blog/posts';
import { Input } from '@/components/ui/input';
import { ArticleTypeBadge } from '@/components/ui/article-type-badge';
import { getAllArticleTypes } from '@/lib/blog/articleTypes';
import { Search } from 'lucide-react';

interface ArchiveClientProps {
  posts: Post[];
}

function ArchiveContent({ posts }: ArchiveClientProps) {
  const searchParams = useSearchParams();
  const initialFilter = searchParams.get('filter') || '';
  const initialArticleType = searchParams.get('articleType') || 'All';

  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState(initialFilter);
  const [activeArticleType, setActiveArticleType] = useState(initialArticleType);

  const allFilters = useMemo(() => {
    const categories = [...new Set(posts.map(p => p.category))];
    const tags = [...new Set(posts.flatMap(p => p.tags))];
    return ['All', ...categories, ...tags];
  }, [posts]);

  const allArticleTypes = useMemo(() => {
    const usedTypes = [...new Set(posts.map(p => p.articleType))];
    return ['All', ...usedTypes];
  }, [posts]);

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            post.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesFilter = activeFilter === 'All' || 
                            activeFilter === '' || 
                            post.category === activeFilter || 
                            post.tags.includes(activeFilter);

      const matchesArticleType = activeArticleType === 'All' || 
                                 post.articleType === activeArticleType;

      return matchesSearch && matchesFilter && matchesArticleType;
    });
  }, [posts, searchTerm, activeFilter, activeArticleType]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tighter mb-4">Blog Archive</h1>
        <p className="text-muted-foreground">Browse all our articles or use the filters to find what you're looking for.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Article Types</h3>
          <div className="flex flex-wrap gap-2">
            {allArticleTypes.map(articleType => (
              <button
                key={articleType}
                onClick={() => setActiveArticleType(articleType)}
                className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                  activeArticleType === articleType 
                    ? 'bg-primary text-primary-foreground border-primary' 
                    : 'bg-transparent hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                {articleType === 'All' ? 'All Types' : articleType}
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-2">Categories & Tags</h3>
          <div className="flex flex-wrap gap-2">
            {allFilters.map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                  activeFilter === filter 
                    ? 'bg-primary text-primary-foreground border-primary' 
                    : 'bg-transparent hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))
        ) : (
          <p className="md:col-span-2 lg:col-span-3 text-center text-muted-foreground">No posts found.</p>
        )}
      </div>
    </div>
  );
}

export function ArchiveClient({ posts }: ArchiveClientProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ArchiveContent posts={posts} />
    </Suspense>
  );
}
