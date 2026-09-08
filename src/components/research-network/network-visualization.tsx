'use client';

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import type { Paper, ClusterInfo } from '@/lib/types/research-network';
import { Card } from '@/components/ui/card';

interface NetworkVisualizationProps {
  papers: Paper[];
  clusters: ClusterInfo[];
  onPaperClick?: (paper: Paper) => void;
  selectedCluster?: number | null;
}

export function NetworkVisualization({
  papers,
  clusters,
  onPaperClick,
  selectedCluster,
}: NetworkVisualizationProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [hoveredPaper, setHoveredPaper] = useState<Paper | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    // Handle responsive sizing
  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current) {
        const container = svgRef.current.parentElement;
        if (container) {
          setDimensions({
            width: container.clientWidth,
            height: 500, // Fixed height for more compact display
          });
        }
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Create D3 visualization
  useEffect(() => {
    if (!svgRef.current || !papers.length || dimensions.width === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous

    const { width, height } = dimensions;

    // Create color scale for clusters
    const colorScale = d3.scaleOrdinal<number, string>()
      .domain(clusters.map(c => c.id))
      .range(clusters.map(c => c.color));

    // Filter papers if cluster is selected
    const visiblePapers = selectedCluster !== null && selectedCluster !== undefined
      ? papers.filter(p => p.cluster === selectedCluster)
      : papers;

    // Scale for node size based on citations
    const citationScale = d3.scaleSqrt()
      .domain([0, d3.max(visiblePapers, d => d.citations) || 100])
      .range([4, 16]);

    // Find the actual range of UMAP coordinates
    const xExtent = d3.extent(visiblePapers, d => d.position.x) as [number, number];
    const yExtent = d3.extent(visiblePapers, d => d.position.y) as [number, number];
    
    // First normalize UMAP coords to a small range (0-10), then scale to screen
    const targetRange = 10; // Normalize to 0-10 range
    
    const xNormalize = d3.scaleLinear()
      .domain(xExtent)
      .range([0, targetRange]);
    
    const yNormalize = d3.scaleLinear()
      .domain(yExtent)
      .range([0, targetRange]);
    
    // Then scale normalized coords to screen with padding
    const padding = 100;
    const xScale = d3.scaleLinear()
      .domain([0, targetRange])
      .range([padding, width - padding]);
    
    const yScale = d3.scaleLinear()
      .domain([0, targetRange])
      .range([padding, height - padding]);
    
    // Combined function to go from UMAP -> normalized -> screen
    const xPos = (x: number) => xScale(xNormalize(x));
    const yPos = (y: number) => yScale(yNormalize(y));

    // Create zoom behavior with constrained panning
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 5])
      .translateExtent([[-width * 0.5, -height * 0.5], [width * 1.5, height * 1.5]]) // Limit panning range
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Main group for zoom/pan
    const g = svg.append('g');

    // Create force simulation with proper coordinate mapping
    // No collision force - allow nodes to overlap naturally at their UMAP positions
    const simulation = d3.forceSimulation(visiblePapers as any)
      .force('x', d3.forceX<Paper>(d => xPos(d.position.x)).strength(1))
      .force('y', d3.forceY<Paper>(d => yPos(d.position.y)).strength(1));

    // Function to update mouse position relative to the container
    function updateMousePosition(event: MouseEvent) {
      if (svgRef.current) {
        const rect = svgRef.current.getBoundingClientRect();
        setMousePosition({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top
        });
      }
    }

    // Create nodes
    const nodes = g.selectAll<SVGCircleElement, Paper>('circle')
      .data(visiblePapers)
      .join('circle')
      .attr('r', d => citationScale(d.citations))
      .attr('fill', d => colorScale(d.cluster))
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .attr('opacity', 0.8)
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        d3.select(this)
          .attr('stroke-width', 3)
          .attr('opacity', 1);
        setHoveredPaper(d);
        updateMousePosition(event);
      })
      .on('mousemove', function(event) {
        updateMousePosition(event);
      })
      .on('mouseout', function() {
        d3.select(this)
          .attr('stroke-width', 1.5)
          .attr('opacity', 0.8);
        setHoveredPaper(null);
      })
      .on('click', (event, d) => {
        if (onPaperClick) {
          onPaperClick(d);
        }
      })
      .call(
        d3.drag<SVGCircleElement, Paper>()
          .on('start', dragStarted)
          .on('drag', dragged)
          .on('end', dragEnded) as any
      );

    // Add labels for highly cited papers
    const labels = g.selectAll<SVGTextElement, Paper>('text')
      .data(visiblePapers.filter(p => p.citations > 100))
      .join('text')
      .text(d => {
        const maxLength = 30;
        return d.title.length > maxLength 
          ? d.title.substring(0, maxLength) + '...'
          : d.title;
      })
      .attr('font-size', 10)
      .attr('fill', '#333')
      .attr('opacity', 0.7)
      .attr('text-anchor', 'middle')
      .attr('pointer-events', 'none');

    // Update positions on simulation tick
    simulation.on('tick', () => {
      nodes
        .attr('cx', d => d.x!)
        .attr('cy', d => d.y!);

      labels
        .attr('x', d => (d as any).x)
        .attr('y', d => (d as any).y - citationScale((d as any).citations) - 5);
    });

    // Drag functions
    function dragStarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragEnded(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    // Add legend
    const legend = svg.append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(20, 20)`);

    clusters.forEach((cluster, i) => {
      const legendRow = legend.append('g')
        .attr('transform', `translate(0, ${i * 25})`);

      legendRow.append('circle')
        .attr('r', 6)
        .attr('fill', cluster.color);

      legendRow.append('text')
        .attr('x', 15)
        .attr('y', 5)
        .attr('font-size', 12)
        .attr('fill', '#333')
        .text(`${cluster.label} (${cluster.paper_count})`);
    });

    return () => {
      simulation.stop();
    };
  }, [papers, clusters, dimensions, selectedCluster, onPaperClick]);

  return (
    <div className="relative w-full">
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="border rounded-lg bg-slate-50"
      />
      
      {/* Tooltip */}
      {hoveredPaper && (
        <Card 
          className="absolute p-4 max-w-sm shadow-lg bg-white/95 backdrop-blur pointer-events-none z-10"
          style={{
            left: `${mousePosition.x + 15}px`,
            top: `${mousePosition.y + 15}px`,
          }}
        >
          <h3 className="font-bold text-sm mb-2">{hoveredPaper.title}</h3>
          <div className="text-xs space-y-1 text-muted-foreground">
            <p><strong>Year:</strong> {hoveredPaper.year}</p>
            <p><strong>Citations:</strong> {hoveredPaper.citations}</p>
            <p><strong>Cluster:</strong> {hoveredPaper.cluster_label}</p>
            {hoveredPaper.sentiment && (
              <p><strong>Sentiment:</strong> {hoveredPaper.sentiment.label} ({(hoveredPaper.sentiment.score * 100).toFixed(0)}%)</p>
            )}
            {hoveredPaper.tldr && (
              <p className="mt-2 italic">{hoveredPaper.tldr}</p>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
