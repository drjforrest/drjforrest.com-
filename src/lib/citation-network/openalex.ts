import { unstable_cache } from "next/cache";
import type {
  ClusterInfo,
  Paper,
  ResearchNetworkData,
} from "@/lib/types/research-network";
import type { AuthorPreview } from "@/lib/api/research-network";
import { publications } from "@/lib/data";

const OPENALEX_BASE = "https://api.openalex.org";
const MAILTO = "j.forrest@northeastern.edu";
const USER_AGENT = `ForrestInsightsCitationNetwork/1.0 (mailto:${MAILTO})`;

export const DEFAULT_OPENALEX_AUTHOR_ID = "A5022908989";

const ORCID_RE = /(\d{4}-\d{4}-\d{4}-\d{3}[0-9Xx])/;
const OPENALEX_ID_RE = /(A\d{6,})/i;

const CLUSTER_COLORS = [
  "#2550ff",
  "#f5c518",
  "#0f766e",
  "#b45309",
  "#7c3aed",
  "#be123c",
  "#0369a1",
  "#365314",
  "#9f1239",
  "#1e3a8a",
];

type OpenAlexAuthor = {
  id?: string;
  display_name?: string;
  orcid?: string | null;
  ids?: { orcid?: string | null };
  cited_by_count?: number;
  works_count?: number;
  last_known_institutions?: { display_name?: string }[];
};

type OpenAlexWork = {
  id?: string;
  title?: string;
  publication_year?: number;
  cited_by_count?: number;
  doi?: string | null;
  ids?: { doi?: string | null };
  abstract_inverted_index?: Record<string, number[]> | null;
  authorships?: { author?: { display_name?: string } }[];
  primary_location?: {
    landing_page_url?: string | null;
    source?: { display_name?: string } | null;
  } | null;
  primary_topic?: {
    display_name?: string;
    field?: { display_name?: string };
  } | null;
};

class CitationNetworkError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.name = "CitationNetworkError";
    this.status = status;
  }
}

function reconstructAbstract(
  inverted?: Record<string, number[]> | null
): string | undefined {
  if (!inverted) return undefined;
  try {
    const positions = Object.values(inverted).flat();
    if (positions.length === 0) return undefined;
    const size = Math.max(...positions) + 1;
    const words = new Array<string>(size).fill("");
    for (const [word, locs] of Object.entries(inverted)) {
      for (const pos of locs) words[pos] = word;
    }
    const text = words.join(" ").trim();
    return text || undefined;
  } catch {
    return undefined;
  }
}

async function openAlexGet<T>(
  path: string,
  params: Record<string, string | number> = {},
  options: { cache?: RequestCache } = {}
): Promise<T> {
  const url = new URL(`${OPENALEX_BASE}${path}`);
  url.searchParams.set("mailto", MAILTO);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, String(value));
  }

  const init: RequestInit & { next?: { revalidate: number } } = {
    headers: { Accept: "application/json", "User-Agent": USER_AGENT },
    ...(options.cache
      ? { cache: options.cache }
      : { next: { revalidate: 3600 } }),
  };

  const response = await fetch(url.toString(), init);

  if (response.status === 429) {
    await new Promise((resolve) => setTimeout(resolve, 1200));
    const retry = await fetch(url.toString(), {
      headers: { Accept: "application/json", "User-Agent": USER_AGENT },
    });
    if (!retry.ok) {
      throw new CitationNetworkError(
        `OpenAlex rate limited (${retry.status})`,
        502
      );
    }
    return retry.json() as Promise<T>;
  }

  if (!response.ok) {
    throw new CitationNetworkError(
      `OpenAlex request failed (${response.status})`,
      response.status === 404 ? 404 : 502
    );
  }

  return response.json() as Promise<T>;
}

function authorIdFromUrl(raw: string): string {
  return raw.replace(/\/$/, "").split("/").pop() || raw;
}

function normalizeQuery(raw: string): string {
  return raw.trim();
}

async function listAuthorCandidates(query: string): Promise<OpenAlexAuthor[]> {
  const raw = normalizeQuery(query);
  if (!raw) {
    throw new CitationNetworkError(
      "Enter an author name, ORCID, or OpenAlex URL."
    );
  }

  const openalexMatch = raw.match(OPENALEX_ID_RE);
  if (
    openalexMatch &&
    (raw.toLowerCase().includes("openalex.org") || raw.toUpperCase().startsWith("A"))
  ) {
    const authorId = openalexMatch[1].toUpperCase();
    const author = await openAlexGet<OpenAlexAuthor>(`/authors/${authorId}`);
    return [author];
  }

  const orcidMatch = raw.match(ORCID_RE);
  if (orcidMatch) {
    const data = await openAlexGet<{ results?: OpenAlexAuthor[] }>("/authors", {
      filter: `orcid:${orcidMatch[1]}`,
      "per-page": 5,
    });
    const results = data.results || [];
    if (results.length === 0) {
      throw new CitationNetworkError(
        `No OpenAlex author found for ORCID ${orcidMatch[1]}`,
        404
      );
    }
    return results.sort((a, b) => (b.works_count || 0) - (a.works_count || 0));
  }

  if (raw.includes("scholar.google") || /user=/.test(raw)) {
    throw new CitationNetworkError(
      "Paste an author name, ORCID, or OpenAlex URL instead of a Google Scholar link."
    );
  }

  const data = await openAlexGet<{ results?: OpenAlexAuthor[] }>("/authors", {
    search: raw,
    "per-page": 8,
    sort: "works_count:desc",
  });
  const results = data.results || [];
  if (results.length === 0) {
    throw new CitationNetworkError(`No OpenAlex author found for “${raw}”`, 404);
  }
  return results;
}

function authorCard(author: OpenAlexAuthor) {
  const institutions = (author.last_known_institutions || [])
    .map((inst) => inst.display_name)
    .filter((name): name is string => Boolean(name));
  return {
    name: author.display_name || "Unknown",
    orcid: author.ids?.orcid || author.orcid || null,
    openalex_id: authorIdFromUrl(author.id || ""),
    affiliations: institutions,
    cited_by_count: author.cited_by_count || 0,
    works_count: author.works_count || 0,
  };
}

function workCard(work: OpenAlexWork) {
  const authors = (work.authorships || [])
    .map((item) => item.author?.display_name)
    .filter((name): name is string => Boolean(name))
    .join(", ");
  const venue = work.primary_location?.source?.display_name || "";
  const doi = work.doi || work.ids?.doi || null;
  return {
    title: work.title || "",
    year: work.publication_year ?? null,
    citations: work.cited_by_count || 0,
    authors,
    publication: venue,
    doi,
  };
}

async function fetchSampleWorks(openalexAuthorId: string, n = 2) {
  const data = await openAlexGet<{ results?: OpenAlexWork[] }>("/works", {
    filter: `author.id:${openalexAuthorId}`,
    "per-page": Math.max(n, 5),
    sort: "cited_by_count:desc",
    select:
      "id,title,publication_year,cited_by_count,authorships,primary_location,doi,ids",
  });
  return (data.results || [])
    .filter((work) => work.title)
    .slice(0, n)
    .map(workCard);
}

async function fetchAuthorWorks(openalexAuthorId: string): Promise<OpenAlexWork[]> {
  const works: OpenAlexWork[] = [];
  let cursor: string | null = "*";
  let pages = 0;

  while (cursor && pages < 4 && works.length < 200) {
    const page: {
      results?: OpenAlexWork[];
      meta?: { next_cursor?: string | null };
    } = await openAlexGet("/works", {
      filter: `author.id:${openalexAuthorId}`,
      "per-page": 200,
      cursor,
      select:
        "id,title,publication_year,cited_by_count,doi,ids,abstract_inverted_index,authorships,primary_location,primary_topic",
    });
    works.push(...(page.results || []));
    cursor = page.meta?.next_cursor || null;
    pages += 1;
  }

  return works;
}

function themeLabel(work: OpenAlexWork, title: string, abstract?: string): string {
  const haystack = `${title} ${abstract || ""}`.toLowerCase();
  if (
    /\bcovid|sars-cov|fluvoxamine|ivermectin|hydroxychloroquine|interferon lambda|together trial/.test(
      haystack
    )
  ) {
    return "COVID-19 & clinical trials";
  }
  if (/\bhiv\b|aids|antiretroviral|\bart\b|haart|circumcision/.test(haystack)) {
    return "HIV & infectious disease";
  }
  if (
    /rwanda|africa|health system|ministry|surveillance|partnership|capacity/.test(
      haystack
    )
  ) {
    return "Health systems & global health";
  }
  if (
    /misinformation|deepfake|artificial intelligence|\bai\b|digital health|mobile health|m-health/.test(
      haystack
    )
  ) {
    return "Digital health & AI";
  }
  if (
    /msm|gay|bisexual|stigma|adherence|respondent-driven|network meta/.test(
      haystack
    )
  ) {
    return "Population health & methods";
  }
  return (
    work.primary_topic?.field?.display_name ||
    work.primary_topic?.display_name ||
    "Other scholarship"
  );
}

function layoutNetwork(papers: Paper[]): { papers: Paper[]; clusters: ClusterInfo[] } {
  const labels = [...new Set(papers.map((paper) => paper.cluster_label))];
  const clusters: ClusterInfo[] = labels.map((label, index) => ({
    id: index,
    label,
    color: CLUSTER_COLORS[index % CLUSTER_COLORS.length],
    paper_count: papers.filter((paper) => paper.cluster_label === label).length,
  }));

  const idByLabel = new Map(clusters.map((cluster) => [cluster.label, cluster.id]));
  const positioned = papers.map((paper) => ({
    ...paper,
    cluster: idByLabel.get(paper.cluster_label) ?? 0,
  }));

  clusters.forEach((cluster, clusterIndex) => {
    const members = positioned.filter((paper) => paper.cluster === cluster.id);
    const angle = (clusterIndex / Math.max(clusters.length, 1)) * Math.PI * 2;
    const cx = Math.cos(angle) * 4.2;
    const cy = Math.sin(angle) * 4.2;
    members.forEach((paper, memberIndex) => {
      const spread = (memberIndex / Math.max(members.length, 1)) * Math.PI * 2;
      const radius = 0.35 + (memberIndex % 6) * 0.18;
      paper.position = {
        x: cx + Math.cos(spread) * radius,
        y: cy + Math.sin(spread) * radius,
      };
    });
  });

  return { papers: positioned, clusters };
}

function papersFromOpenAlex(
  works: OpenAlexWork[],
  authorInfo: ReturnType<typeof authorCard>
): Paper[] {
  return works
    .filter((work) => work.title)
    .map((work) => {
      const authors = (work.authorships || [])
        .map((item) => item.author?.display_name)
        .filter((name): name is string => Boolean(name))
        .join(", ");
      const venue = work.primary_location?.source?.display_name || "";
      const doi = work.doi || work.ids?.doi || undefined;
      const abstract = reconstructAbstract(work.abstract_inverted_index);
      const title = work.title || "";
      const label = themeLabel(work, title, abstract);
      return {
        title,
        link: work.primary_location?.landing_page_url || doi || work.id,
        year: work.publication_year ? String(work.publication_year) : "",
        citations: work.cited_by_count || 0,
        authors,
        publication: venue,
        abstract,
        position: { x: 0, y: 0 },
        cluster: 0,
        cluster_label: label,
        author_info: {
          name: authorInfo.name,
          affiliations: authorInfo.affiliations.join(", "),
          interests: [],
          cited_by_count: authorInfo.cited_by_count,
        },
      } satisfies Paper;
    });
}

function localFallbackNetwork(): ResearchNetworkData {
  const papers: Paper[] = publications.map((pub) => ({
    title: pub.title,
    link: pub.fullTextUrl || pub.pdfUrl,
    year: String(pub.year),
    citations: pub.cites,
    authors: pub.authors,
    publication: pub.journal,
    abstract: pub.abstract,
    position: { x: 0, y: 0 },
    cluster: 0,
    cluster_label: themeLabel({}, pub.title, pub.abstract),
  }));
  const laidOut = layoutNetwork(papers);
  return {
    papers: laidOut.papers,
    clusters: laidOut.clusters,
    metadata: {
      total_papers: laidOut.papers.length,
      total_citations: laidOut.papers.reduce(
        (sum, paper) => sum + (paper.citations || 0),
        0
      ),
      processing_timestamp: new Date().toISOString(),
    },
  };
}

/** Static homepage preview: local publications, same clustering as the live tool. */
export function getHomepageNetworkPreview(): ResearchNetworkData {
  return localFallbackNetwork();
}

export async function previewAuthor(
  query: string,
  offset = 0
): Promise<AuthorPreview> {
  const candidates = await listAuthorCandidates(query);
  if (offset < 0 || offset >= candidates.length) {
    throw new CitationNetworkError("No further author matches to review.", 404);
  }
  const author = authorCard(candidates[offset]);
  const samples = await fetchSampleWorks(author.openalex_id, 2);
  if (samples.length === 0) {
    throw new CitationNetworkError(
      "This author record has no public papers to confirm.",
      404
    );
  }
  return {
    author,
    sample_papers: samples,
    match_index: offset,
    match_count: candidates.length,
    has_next: offset + 1 < candidates.length,
  };
}

export async function buildAuthorNetwork(
  authorId: string
): Promise<ResearchNetworkData> {
  const candidates = await listAuthorCandidates(authorId);
  const author = authorCard(candidates[0]);
  const works = await fetchAuthorWorks(author.openalex_id);
  if (works.length < 3) {
    throw new CitationNetworkError(
      `Not enough papers found for author (found ${works.length}). Minimum 3 required.`
    );
  }
  const laidOut = layoutNetwork(papersFromOpenAlex(works, author));
  return {
    papers: laidOut.papers,
    clusters: laidOut.clusters,
    metadata: {
      total_papers: laidOut.papers.length,
      total_citations: laidOut.papers.reduce(
        (sum, paper) => sum + (paper.citations || 0),
        0
      ),
      processing_timestamp: new Date().toISOString(),
    },
  };
}

export const getDefaultNetwork = unstable_cache(
  async (): Promise<ResearchNetworkData> => {
    try {
      return await buildAuthorNetwork(DEFAULT_OPENALEX_AUTHOR_ID);
    } catch (error) {
      console.error(
        "OpenAlex default network failed; using local publications.",
        error
      );
      return localFallbackNetwork();
    }
  },
  ["citation-default-network"],
  { revalidate: 3600 }
);

export { CitationNetworkError };
