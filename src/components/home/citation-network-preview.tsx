import type {
  ClusterInfo,
  Paper,
  ResearchNetworkData,
} from "@/lib/types/research-network";

const VIEW_W = 800;
const VIEW_H = 520;
const MAX_NODES = 80;
const NEIGHBORS = 3;

const CLUSTER_ANCHORS: [number, number][] = [
  [0.24, 0.4],
  [0.76, 0.38],
  [0.5, 0.26],
  [0.36, 0.74],
  [0.68, 0.76],
  [0.52, 0.52],
];

type Node = {
  citations: number;
  cluster: number;
  color: string;
  x: number;
  y: number;
  r: number;
};

function pickPapers(papers: Paper[], clusters: ClusterInfo[]): Paper[] {
  if (papers.length <= MAX_NODES) return papers;

  const byCitations = [...papers].sort(
    (a, b) => (b.citations || 0) - (a.citations || 0)
  );
  const chosen = new Set<Paper>();

  for (const cluster of clusters) {
    const top = byCitations.find((paper) => paper.cluster === cluster.id);
    if (top) chosen.add(top);
  }

  for (const paper of byCitations) {
    if (chosen.size >= MAX_NODES) break;
    chosen.add(paper);
  }

  return [...chosen];
}

function radiusFor(citations: number, maxCitations: number) {
  return 5 + Math.sqrt(citations / Math.max(maxCitations, 1)) * 18;
}

function layoutNodes(papers: Paper[], clusters: ClusterInfo[]): Node[] {
  const colorByCluster = new Map(clusters.map((cluster) => [cluster.id, cluster.color]));
  const maxCitations = Math.max(...papers.map((paper) => paper.citations || 0), 1);
  const nodes: Node[] = [];
  const ordered = [...clusters].sort((a, b) => {
    const aCount = papers.filter((paper) => paper.cluster === a.id).length;
    const bCount = papers.filter((paper) => paper.cluster === b.id).length;
    return bCount - aCount;
  });

  ordered.forEach((cluster, clusterIndex) => {
    const members = papers.filter((paper) => paper.cluster === cluster.id);
    const [ax, ay] = CLUSTER_ANCHORS[clusterIndex % CLUSTER_ANCHORS.length];
    const cx = ax * VIEW_W;
    const cy = ay * VIEW_H;
    const spread = members.length > 8 ? 15 : 11;

    members.forEach((paper, memberIndex) => {
      const angle =
        (memberIndex / Math.max(members.length, 1)) * Math.PI * 2 + clusterIndex * 0.35;
      const radius = 18 + (memberIndex % 8) * spread;
      nodes.push({
        citations: paper.citations || 0,
        cluster: paper.cluster,
        color: colorByCluster.get(paper.cluster) ?? "#2550ff",
        x: Math.min(VIEW_W - 20, Math.max(20, cx + Math.cos(angle) * radius)),
        y: Math.min(VIEW_H - 22, Math.max(22, cy + Math.sin(angle) * radius)),
        r: radiusFor(paper.citations || 0, maxCitations),
      });
    });
  });

  return nodes;
}

function nearestEdges(nodes: Node[]) {
  const edges: { x1: number; y1: number; x2: number; y2: number; faint?: boolean }[] = [];
  const seen = new Set<string>();

  const addEdge = (i: number, j: number, faint = false) => {
    const a = Math.min(i, j);
    const b = Math.max(i, j);
    const key = `${a}-${b}`;
    if (seen.has(key)) return;
    seen.add(key);
    edges.push({
      x1: nodes[a].x,
      y1: nodes[a].y,
      x2: nodes[b].x,
      y2: nodes[b].y,
      faint,
    });
  };

  for (let i = 0; i < nodes.length; i += 1) {
    const source = nodes[i];
    const ranked = nodes
      .map((node, index) => ({
        index,
        same: node.cluster === source.cluster,
        dist: (node.x - source.x) ** 2 + (node.y - source.y) ** 2,
      }))
      .filter((item) => item.index !== i)
      .sort((a, b) => a.dist - b.dist);

    ranked
      .filter((item) => item.same)
      .slice(0, NEIGHBORS)
      .forEach((item) => addEdge(i, item.index));

    const bridge = ranked.find((item) => !item.same);
    if (bridge && source.citations > 40) addEdge(i, bridge.index, true);
  }

  return edges;
}

export function CitationNetworkPreview({ data }: { data: ResearchNetworkData }) {
  const papers = pickPapers(data.papers, data.clusters);
  const nodes = layoutNodes(papers, data.clusters);
  const edges = nearestEdges(nodes);
  const legend = data.clusters.slice(0, 6);

  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      className="absolute inset-0 h-full w-full"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-hidden="true"
    >
      <rect width={VIEW_W} height={VIEW_H} fill="#07080a" />

      {edges.map((edge, index) => (
        <line
          key={index}
          x1={edge.x1}
          y1={edge.y1}
          x2={edge.x2}
          y2={edge.y2}
          stroke={edge.faint ? "rgba(37,80,255,0.28)" : "rgba(255,255,255,0.22)"}
          strokeWidth={edge.faint ? 1 : 1.15}
        />
      ))}

      {nodes.map((node, index) => (
        <circle
          key={`${node.cluster}-${index}`}
          cx={node.x}
          cy={node.y}
          r={node.r}
          fill={node.color}
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="1"
          opacity="0.95"
        />
      ))}

      <rect x="16" y={VIEW_H - 16 - legend.length * 20} width="228" height={legend.length * 20 + 10} fill="rgba(7,8,10,0.72)" />
      {legend.map((cluster, index) => (
        <g key={cluster.id} transform={`translate(28, ${VIEW_H - 24 - (legend.length - 1 - index) * 20})`}>
          <circle r="5.5" cx="5.5" cy="0" fill={cluster.color} />
          <text
            x="18"
            y="4"
            fill="rgba(255,255,255,0.78)"
            fontSize="12"
            fontFamily="ui-sans-serif, system-ui, sans-serif"
          >
            {cluster.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
