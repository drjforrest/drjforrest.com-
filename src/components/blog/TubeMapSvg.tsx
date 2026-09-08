"use client";

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { drawAiMetroLine } from '@/ai/blog-flows/draw-ai-metro-line';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Skeleton } from '@/components/ui/skeleton';
import { Sparkles } from 'lucide-react';

interface TubeMapSvgProps {
  categories: string[];
  tags: string[];
}

export function TubeMapSvg({ categories, tags }: TubeMapSvgProps) {
  const [aiLine, setAiLine] = useState<{ start: string; end: string } | null>(null);
  const [loading, setLoading] = useState(true);

  // Define strategic positions on the London Underground map
  // These coordinates are positioned to align with major stations/interchanges on the real map
  const stationPositions = useMemo(() => {
    const positions = new Map<string, { x: number; y: number; type: 'category' | 'tag' | 'intersection'; station: string }>();
    
    // Major interchange positions (percentages of SVG viewBox for responsive scaling)
    // Based on approximate positions of major London Underground interchanges
    const majorInterchanges = [
      { name: 'King\'s Cross St. Pancras', x: 50, y: 25, type: 'intersection' as const },
      { name: 'Oxford Circus', x: 45, y: 35, type: 'intersection' as const },
      { name: 'Liverpool Street', x: 55, y: 30, type: 'intersection' as const },
      { name: 'Bank', x: 57, y: 40, type: 'intersection' as const },
      { name: 'Victoria', x: 42, y: 55, type: 'intersection' as const },
      { name: 'Waterloo', x: 48, y: 50, type: 'intersection' as const },
      { name: 'London Bridge', x: 52, y: 52, type: 'intersection' as const },
      { name: 'Paddington', x: 35, y: 30, type: 'category' as const },
      { name: 'Euston', x: 47, y: 22, type: 'category' as const },
      { name: 'Green Park', x: 44, y: 42, type: 'tag' as const },
      { name: 'Piccadilly Circus', x: 46, y: 38, type: 'tag' as const },
      { name: 'Westminster', x: 45, y: 48, type: 'tag' as const },
      { name: 'Canary Wharf', x: 75, y: 45, type: 'tag' as const },
      { name: 'Holborn', x: 48, y: 32, type: 'tag' as const },
      { name: 'Tower Hill', x: 60, y: 42, type: 'tag' as const },
      { name: 'Camden Town', x: 48, y: 18, type: 'tag' as const },
      { name: 'Marble Arch', x: 40, y: 35, type: 'tag' as const },
      { name: 'Bond Street', x: 42, y: 37, type: 'tag' as const },
      { name: 'Baker Street', x: 41, y: 28, type: 'tag' as const },
      { name: 'Tottenham Court Road', x: 46, y: 33, type: 'tag' as const },
    ];

    // Map categories to major interchanges first (most important)
    categories.forEach((category, index) => {
      if (index < majorInterchanges.length) {
        const station = majorInterchanges[index];
        positions.set(category, {
          x: station.x,
          y: station.y,
          type: 'category',
          station: station.name
        });
      }
    });

    // Map tags to remaining stations
    const remainingStations = majorInterchanges.slice(categories.length);
    tags.forEach((tag, index) => {
      if (index < remainingStations.length) {
        const station = remainingStations[index];
        positions.set(tag, {
          x: station.x,
          y: station.y,
          type: station.type === 'intersection' ? 'intersection' : 'tag',
          station: station.name
        });
      }
    });

    return positions;
  }, [categories, tags]);

  useEffect(() => {
    async function getAiLine() {
      try {
        setLoading(true);
        const line = await drawAiMetroLine({ availableCategories: categories, availableTags: tags });
        if (stationPositions.has(line.start) && stationPositions.has(line.end)) {
          setAiLine(line);
        }
      } catch (error) {
        console.error("Failed to draw AI line:", error);
      } finally {
        setLoading(false);
      }
    }
    getAiLine();
  }, [categories, tags, stationPositions]);

  const aiLineCoords = useMemo(() => {
    if (!aiLine || !stationPositions.has(aiLine.start) || !stationPositions.has(aiLine.end)) return null;
    const startNode = stationPositions.get(aiLine.start);
    const endNode = stationPositions.get(aiLine.end);
    if (!startNode || !endNode) return null;
    return { x1: startNode.x, y1: startNode.y, x2: endNode.x, y2: endNode.y };
  }, [aiLine, stationPositions]);

  if (loading) {
    return <Skeleton className="w-full h-[600px]" />
  }

  return (
    <TooltipProvider>
      <div className="relative w-full">
        <div className="relative">
          {/* Background London Underground Map */}
          <img 
            src="/images/tube.svg" 
            alt="London Underground Map" 
            className="w-full h-auto"
            style={{ maxHeight: '600px' }}
          />
          
          {/* Interactive Overlay */}
          <svg 
            viewBox="0 0 100 100" 
            className="absolute inset-0 w-full h-full pointer-events-none"
            preserveAspectRatio="none"
            aria-labelledby="overlay-title" 
            role="img"
          >
            <title id="overlay-title">Interactive overlay for blog content</title>
            
            {/* AI Connection Line */}
            {aiLineCoords && (
              <line
                x1={`${aiLineCoords.x1}%`}
                y1={`${aiLineCoords.y1}%`}
                x2={`${aiLineCoords.x2}%`}
                y2={`${aiLineCoords.y2}%`}
                stroke="hsl(var(--primary))"
                strokeWidth="0.5"
                strokeDasharray="2 2"
                className="animate-pulse"
              />
            )}

            {/* Interactive Stations */}
            {Array.from(stationPositions.entries()).map(([content, position]) => {
              const isCategory = position.type === 'category';
              const isIntersection = position.type === 'intersection';
              
              return (
                <g key={content} className="pointer-events-auto">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link href={`/archive?filter=${encodeURIComponent(content)}`} className="group">
                        <g transform={`translate(${position.x}, ${position.y})`}>
                          {/* Station Marker */}
                          {isCategory ? (
                            // Category stations - larger rectangular markers
                            <>
                              <rect 
                                x="-1.5" y="-1" width="3" height="2" 
                                fill="hsl(var(--primary))" 
                                stroke="white" 
                                strokeWidth="0.2"
                                rx="0.3"
                                className="transition-transform group-hover:scale-150"
                              />
                              <rect 
                                x="-1.2" y="-0.7" width="2.4" height="1.4" 
                                fill="white"
                                rx="0.2"
                              />
                            </>
                          ) : isIntersection ? (
                            // Intersection stations - distinctive markers
                            <>
                              <circle 
                                r="1" 
                                fill="white" 
                                stroke="hsl(var(--primary))" 
                                strokeWidth="0.3"
                                className="transition-transform group-hover:scale-150"
                              />
                              <circle r="0.5" fill="hsl(var(--primary))" />
                            </>
                          ) : (
                            // Regular tag stations - small circles
                            <>
                              <circle 
                                r="0.8" 
                                fill="hsl(var(--secondary))" 
                                stroke="white" 
                                strokeWidth="0.2"
                                className="transition-transform group-hover:scale-125"
                              />
                              <circle r="0.4" fill="white" />
                            </>
                          )}
                          
                          {/* Station Label */}
                          <text 
                            fill="hsl(var(--foreground))" 
                            x={isCategory ? "-2" : "0"} 
                            y={isCategory ? "0.3" : "-1.5"} 
                            textAnchor={isCategory ? "end" : "middle"} 
                            className={`select-none font-semibold pointer-events-none ${
                              isCategory ? 'text-xs' : 'text-xxs'
                            }`}
                            fontSize={isCategory ? "0.8" : "0.6"}
                            dominantBaseline="middle"
                          >
                            {content}
                          </text>
                        </g>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Explore posts about "{content}"</p>
                      <p className="text-xs text-muted-foreground">Located at {position.station}</p>
                    </TooltipContent>
                  </Tooltip>
                </g>
              );
            })}
          </svg>
        </div>
        
        {/* Legend */}
        <div className="absolute bottom-2 right-2 flex items-center gap-2 text-sm text-muted-foreground bg-background/90 p-3 rounded-md shadow-lg">
          <Sparkles className="h-4 w-4 text-primary"/>
          <span>AI suggested route on real London Underground</span>
        </div>
      </div>
    </TooltipProvider>
  );
}
