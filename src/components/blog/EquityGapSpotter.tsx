"use client";

import { useEffect, useState } from 'react';
import { spotEquityGaps, type SpotEquityGapsOutput } from '@/ai/blog-flows/spot-equity-gaps';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Target, AlertTriangle } from 'lucide-react';

interface EquityGapSpotterProps {
  blogTitle: string;
  blogContent: string;
}

const categoryColors = {
  'Access': 'bg-red-100 text-red-800 hover:bg-red-200',
  'Affordability': 'bg-orange-100 text-orange-800 hover:bg-orange-200', 
  'Digital Literacy': 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
  'Infrastructure': 'bg-green-100 text-green-800 hover:bg-green-200',
  'Privacy & Security': 'bg-blue-100 text-blue-800 hover:bg-blue-200',
  'Cultural Barriers': 'bg-purple-100 text-purple-800 hover:bg-purple-200',
  'Data Representation': 'bg-pink-100 text-pink-800 hover:bg-pink-200',
} as const;

export function EquityGapSpotter({ blogTitle, blogContent }: EquityGapSpotterProps) {
  const [gaps, setGaps] = useState<SpotEquityGapsOutput | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const analyzeGaps = async () => {
      setLoading(true);
      setError('');
      
      try {
        const result = await spotEquityGaps({ 
          blogPostContent: blogContent,
          title: blogTitle 
        });
        setGaps(result);
      } catch (e) {
        console.error(e);
        setError('Could not analyze equity gaps');
      } finally {
        setLoading(false);
      }
    };

    if (blogContent && blogTitle) {
      analyzeGaps();
    } else {
      setLoading(false);
    }
  }, [blogContent, blogTitle]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Target className="h-6 w-6 text-primary" />
          <CardTitle>Equity Gaps Identified</CardTitle>
        </div>
        <CardDescription>
          AI-identified digital health equity gaps discussed in this post
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        )}
        
        {error && (
          <div className="flex items-center gap-2 p-4 bg-destructive/10 rounded-lg text-destructive">
            <AlertTriangle className="h-5 w-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}
        
        {gaps && gaps.gaps.length > 0 && (
          <div className="space-y-4">
            {gaps.gaps.map((gap, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-medium text-sm leading-relaxed flex-1">{gap.gap}</p>
                  <Badge 
                    variant="secondary" 
                    className={categoryColors[gap.category]}
                  >
                    {gap.category}
                  </Badge>
                </div>
                <p className="text-muted-foreground text-sm">
                  <span className="font-medium">Most impacted:</span> {gap.impact}
                </p>
              </div>
            ))}
          </div>
        )}
        
        {gaps && gaps.gaps.length === 0 && (
          <p className="text-muted-foreground text-center py-8">
            No specific equity gaps identified in this post.
          </p>
        )}
      </CardContent>
    </Card>
  );
}