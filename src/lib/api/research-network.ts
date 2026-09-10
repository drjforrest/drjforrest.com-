/**
 * Research Network API Service
 * Fetches data from the Python FastAPI backend
 */

import type {
  ResearchNetworkData,
  Paper,
  ClusterInfo,
  Metadata,
  SimilarPapersResponse,
} from '@/lib/types/research-network';

/** Browser calls same-origin `/api/citation/*` (OpenAlex-backed Next.js routes). */
export const RESEARCH_NETWORK_API_URL = '/api/citation';

const API_BASE_URL = RESEARCH_NETWORK_API_URL;

/**
 * Custom error class for backend connectivity issues
 */
export class BackendOfflineError extends Error {
  constructor(message: string = 'The citation network backend is currently offline') {
    super(message);
    this.name = 'BackendOfflineError';
  }
}

/**
 * Check if error is a network/connection error
 */
function isConnectionError(error: any): boolean {
  return (
    error instanceof TypeError && 
    (error.message.includes('fetch') || error.message.includes('network'))
  ) || 
  error.message?.includes('ECONNREFUSED') ||
  error.message?.includes('Failed to fetch');
}

/**
 * Fetch all papers with ML processing data
 */
export async function fetchResearchNetwork(): Promise<ResearchNetworkData> {
  try {
    const response = await fetch(`${API_BASE_URL}/metadata`, {
      next: { revalidate: 3600 }, // Revalidate every hour
      signal: AbortSignal.timeout(30000), // 30 second timeout
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Also fetch papers
    const papersResponse = await fetch(`${API_BASE_URL}/papers`, {
      signal: AbortSignal.timeout(30000),
    });
    if (!papersResponse.ok) {
      throw new Error(`HTTP error! status: ${papersResponse.status}`);
    }
    
    const papersData = await papersResponse.json();
    
    return {
      papers: papersData.papers || [],
      clusters: data.clusters || [],
      metadata: data.metadata || {
        total_papers: 0,
        total_citations: 0,
        processing_timestamp: new Date().toISOString(),
      },
    };
  } catch (error) {
    console.error('Error fetching research network:', error);
    
    // Check if it's a connection error and throw a more specific error
    if (isConnectionError(error)) {
      throw new BackendOfflineError();
    }
    
    throw error;
  }
}

/**
 * Fetch papers for a specific cluster
 */
export async function fetchClusterPapers(clusterId: number): Promise<Paper[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/papers?cluster=${clusterId}`,
      {
        next: { revalidate: 3600 },
        signal: AbortSignal.timeout(30000),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.papers || [];
  } catch (error) {
    console.error(`Error fetching cluster ${clusterId}:`, error);
    
    if (isConnectionError(error)) {
      throw new BackendOfflineError();
    }
    
    throw error;
  }
}

/**
 * Find similar papers to a given paper
 */
export async function fetchSimilarPapers(
  paperId: string,
  limit: number = 5
): Promise<SimilarPapersResponse> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/similar/${encodeURIComponent(paperId)}?limit=${limit}`,
      {
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching similar papers for ${paperId}:`, error);
    throw error;
  }
}

/**
 * Get cluster information
 */
export async function fetchClusters(): Promise<ClusterInfo[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/clusters`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.clusters || [];
  } catch (error) {
    console.error('Error fetching clusters:', error);
    throw error;
  }
}

/**
 * Get metadata
 */
export async function fetchMetadata(): Promise<Metadata & { clusters: ClusterInfo[] }> {
  try {
    const response = await fetch(`${API_BASE_URL}/metadata`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching metadata:', error);
    throw error;
  }
}

/**
 * Analyze arbitrary text and find similar papers
 */
export async function analyzeText(text: string): Promise<any> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/analyze-text?text=${encodeURIComponent(text)}`,
      {
        method: 'POST',
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error analyzing text:', error);
    throw error;
  }
}

export type AuthorPreviewPaper = {
  title: string;
  year?: number | string | null;
  citations?: number;
  authors?: string;
  publication?: string;
  doi?: string | null;
};

export type AuthorPreview = {
  author: {
    name: string;
    orcid?: string | null;
    openalex_id: string;
    affiliations: string[];
    cited_by_count: number;
    works_count: number;
  };
  sample_papers: AuthorPreviewPaper[];
  match_index: number;
  match_count: number;
  has_next: boolean;
};

export async function previewAuthor(
  query: string,
  offset: number = 0
): Promise<AuthorPreview> {
  const response = await fetch(
    `${API_BASE_URL}/preview-author?query=${encodeURIComponent(query)}&offset=${offset}`,
    { signal: AbortSignal.timeout(20000) }
  );
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export async function generateResearchNetwork(
  authorId: string
): Promise<ResearchNetworkData> {
  const response = await fetch(
    `${API_BASE_URL}/generate-network?author_id=${encodeURIComponent(authorId)}`,
    {
      method: "POST",
      signal: AbortSignal.timeout(120000),
    }
  );
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
  }
  return response.json();
}

/**
 * Collect data for a new author (interactive feature)
 */
export async function collectAuthorData(
  authorId: string,
  runMl: boolean = false
): Promise<any> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/collect?author_id=${encodeURIComponent(authorId)}&run_ml=${runMl}`,
      {
        method: 'POST',
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error collecting author data for ${authorId}:`, error);
    throw error;
  }
}
