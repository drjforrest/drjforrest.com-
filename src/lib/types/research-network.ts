/**
 * TypeScript types for Research Network API
 * Matches the backend API response structure
 */

import type { SimulationNodeDatum } from 'd3';

export interface AuthorInfo {
  name: string;
  affiliations?: string;
  email?: string;
  interests: string[];
  cited_by_count: number;
}

export interface PaperPosition {
  x: number;
  y: number;
}

export interface Sentiment {
  label: 'positive' | 'negative' | 'neutral';
  score: number;
}

export interface Paper extends SimulationNodeDatum {
  title: string;
  link?: string;
  year: string | number;
  citations: number;
  cited_by_link?: string;
  authors: string;
  publication: string;
  
  // Semantic Scholar enrichment
  s2_paper_id?: string;
  abstract?: string;
  embedding?: number[];
  tldr?: string;
  pdf_url?: string;
  s2_authors?: string[];
  s2_citation_count?: number;
  
  // ML processing
  position: PaperPosition;
  cluster: number;
  cluster_label: string;
  sentiment?: Sentiment;
  
  // Author info
  author_info?: AuthorInfo;
}

export interface ClusterInfo {
  id: number;
  label: string;
  color: string;
  paper_count: number;
}

export interface Metadata {
  total_papers: number;
  total_citations: number;
  processing_timestamp: string;
}

export interface ResearchNetworkData {
  papers: Paper[];
  clusters: ClusterInfo[];
  metadata: Metadata;
}

export interface SimilarPaper {
  paper: {
    title: string;
    s2_paper_id?: string;
    year: string | number;
    citations: number;
    cluster: number;
    cluster_label: string;
    abstract?: string;
  };
  similarity: number;
}

export interface SimilarPapersResponse {
  target_paper: {
    title: string;
    s2_paper_id?: string;
  };
  similar_papers: SimilarPaper[];
}

// D3-specific types for force simulation
export interface D3Node extends Paper {
  id: string;
  fx?: number | null;
  fy?: number | null;
  vx?: number;
  vy?: number;
}

export interface D3Link {
  source: string | D3Node;
  target: string | D3Node;
  value: number; // Similarity strength
}
