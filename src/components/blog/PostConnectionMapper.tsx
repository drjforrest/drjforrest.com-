"use client";

import { useEffect, useState } from 'react';
import { mapPostConnections, type MapPostConnectionsOutput } from '@/ai/blog-flows/map-post-connections';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { MapPin, ArrowRight, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { type Post } from '@/lib/blog/posts';

interface PostConnectionMapperProps {
  currentPost: Post;
  allPosts: Post[];
}

const connectionTypeColors = {
  'Similar Issue': 'bg-red-100 text-red-800 hover:bg-red-200',
  'Complementary Perspective': 'bg-blue-100 text-blue-800 hover:bg-blue-200',
  'Shared Solution': 'bg-green-100 text-green-800 hover:bg-green-200',
  'Common Stakeholder': 'bg-purple-100 text-purple-800 hover:bg-purple-200',
  'Sequential Topic': 'bg-orange-100 text-orange-800 hover:bg-orange-200',
} as const;

export function PostConnectionMapper({ currentPost, allPosts }: PostConnectionMapperProps) {
  const [connections, setConnections] = useState<MapPostConnectionsOutput | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const otherPosts = allPosts.filter(post => post.slug !== currentPost.slug);

  useEffect(() => {
    const findConnections = async () => {
      if (otherPosts.length === 0) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError('');
      
      try {
        const result = await mapPostConnections({
          targetPost: currentPost,
          otherPosts: otherPosts
        });
        setConnections(result);
      } catch (e) {
        console.error(e);
        setError('Could not map post connections');
      } finally {
        setLoading(false);
      }
    };

    findConnections();
  }, [currentPost, otherPosts]);

  if (otherPosts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <MapPin className="h-6 w-6 text-primary" />
            <CardTitle>Connected Posts</CardTitle>
          </div>
          <CardDescription>
            Explore thematic connections between posts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            More connections will appear as additional posts are published.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <MapPin className="h-6 w-6 text-primary" />
          <CardTitle>Connected Posts</CardTitle>
        </div>
        <CardDescription>
          Explore thematic connections between posts
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        )}
        
        {error && (
          <div className="flex items-center gap-2 p-4 bg-destructive/10 rounded-lg text-destructive">
            <AlertTriangle className="h-5 w-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}
        
        {connections && connections.connections.length > 0 && (
          <div className="space-y-4">
            {connections.connections.map((connection, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm mb-1">
                      {connection.connectedPostTitle}
                    </h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {connection.connectionReason}
                    </p>
                  </div>
                  <Badge 
                    variant="secondary" 
                    className={connectionTypeColors[connection.connectionType]}
                  >
                    {connection.connectionType}
                  </Badge>
                </div>
                <div className="flex justify-end">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/blog/posts/${connection.connectedPostSlug}`}>
                      Read Post <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {connections && connections.connections.length === 0 && (
          <p className="text-muted-foreground text-center py-8">
            No strong thematic connections found with existing posts.
          </p>
        )}
      </CardContent>
    </Card>
  );
}