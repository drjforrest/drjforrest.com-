"""
One-shot re-clustering script.

Reuses existing UMAP 2D positions in papers_with_ml.json (no re-embedding,
no re-UMAP, no re-sentiment) and reruns HDBSCAN with a smaller
min_cluster_size to surface finer-grained topic groupings. Calls DeepSeek
for cluster labels.

Run from project root:
    source venv/bin/activate
    python scripts/recluster.py --min-cluster-size 5 --out data/processed/papers_with_ml.reclustered.json
"""
import argparse
import json
import logging
import os
import sys
from collections import Counter
from pathlib import Path

import numpy as np
import requests
from dotenv import load_dotenv

from app.services.cluster_labeling import build_cluster_label_prompt

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger("recluster")

PROJECT_ROOT = Path(__file__).resolve().parent.parent
load_dotenv(PROJECT_ROOT / ".env")

CLUSTER_COLORS = [
    "#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6",
    "#EC4899", "#14B8A6", "#F97316", "#6366F1", "#84CC16",
]


def llm_label_for_cluster(papers, deepseek_key, openai_key):
    """Generate a 2-5 word semantic label for a cluster via DeepSeek or OpenAI."""
    summaries = []
    for i, paper in enumerate(papers[:10]):
        title = paper.get("title", "")
        abstract = paper.get("abstract") or paper.get("tldr") or ""
        if abstract:
            summaries.append(f"{i+1}. {title}\n   {abstract[:200]}...")
        else:
            summaries.append(f"{i+1}. {title}")

    prompt = build_cluster_label_prompt("\n".join(summaries))

    if deepseek_key:
        try:
            response = requests.post(
                "https://api.deepseek.com/v1/chat/completions",
                headers={"Authorization": f"Bearer {deepseek_key}", "Content-Type": "application/json"},
                json={
                    "model": "deepseek-chat",
                    "messages": [{"role": "user", "content": prompt}],
                    "temperature": 0.3,
                    "max_tokens": 20,
                },
                timeout=15,
            )
            response.raise_for_status()
            return response.json()["choices"][0]["message"]["content"].strip()[:50]
        except Exception as exc:
            logger.warning(f"DeepSeek API failed: {exc}")

    if openai_key:
        try:
            from openai import OpenAI

            client = OpenAI(api_key=openai_key)
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.3,
                max_tokens=20,
            )
            content = response.choices[0].message.content or ""
            return content.strip()[:50]
        except Exception as exc:
            logger.warning(f"OpenAI API failed: {exc}")

    raise RuntimeError("All LLM APIs failed")


def simple_label(papers):
    """Fallback label using most frequent title words."""
    import re

    words = []
    stopwords = {"with", "from", "among", "between", "treatment", "study", "analysis"}
    for paper in papers:
        title = paper.get("title", "")
        words.extend(
            w.lower()
            for w in re.findall(r"\b\w{4,}\b", title)
            if w.lower() not in stopwords
        )
    if words:
        return " & ".join(w.capitalize() for w, _ in Counter(words).most_common(2))
    return "Research Cluster"


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", default="data/processed/papers_with_ml.json")
    parser.add_argument("--out", default="data/processed/papers_with_ml.reclustered.json")
    parser.add_argument("--method", choices=["hdbscan", "kmeans"], default="kmeans",
                        help="kmeans keeps a stable number of themes; hdbscan often collapses this corpus to two blobs")
    parser.add_argument("--n-clusters", type=int, default=6,
                        help="Used with --method kmeans (default: 6)")
    parser.add_argument("--min-cluster-size", type=int, default=5)
    parser.add_argument("--min-samples", type=int, default=None,
                        help="Default: max(2, min_cluster_size // 2)")
    parser.add_argument("--relabel-only", action="store_true",
                        help="Keep existing cluster assignments; only regenerate DeepSeek names")
    parser.add_argument("--no-llm", action="store_true", help="Skip LLM, use word-frequency labels")
    parser.add_argument("--cluster-on", choices=["positions", "embeddings", "umap-mid"], default="embeddings",
                        help="Cluster on 2D UMAP positions, full-dim embeddings, or a mid-dim UMAP (default: embeddings)")
    parser.add_argument("--umap-dim", type=int, default=5,
                        help="Dimensionality for --cluster-on umap-mid (default: 5)")
    parser.add_argument("--selection-method", choices=["eom", "leaf"], default="eom",
                        help="HDBSCAN cluster selection method (leaf = more granular)")
    parser.add_argument("--metric", default="euclidean",
                        help="HDBSCAN metric (e.g., euclidean, cosine; cosine only valid for embeddings)")
    args = parser.parse_args()

    input_path = PROJECT_ROOT / args.input
    out_path = PROJECT_ROOT / args.out

    logger.info(f"Loading {input_path}")
    with open(input_path) as f:
        data = json.load(f)

    papers = data["papers"]
    logger.info(f"Loaded {len(papers)} papers")

    if args.relabel_only:
        labels = np.array([int(p.get("cluster", -1)) for p in papers])
        logger.info("Relabel-only: keeping existing cluster assignments")
    else:
        metric = args.metric
        if args.cluster_on == "positions":
            cluster_input = np.array(
                [[p["position"]["x"], p["position"]["y"]] for p in papers],
                dtype=float,
            )
            logger.info(f"Clustering on 2D UMAP positions (shape {cluster_input.shape})")
        elif args.cluster_on == "umap-mid":
            import umap
            raw = np.array([p["embedding"] for p in papers], dtype=float)
            logger.info(f"Reducing to {args.umap_dim}D with UMAP for clustering...")
            reducer = umap.UMAP(
                n_components=args.umap_dim,
                n_neighbors=min(15, len(raw) - 1),
                min_dist=0.0,
                metric="cosine",
                random_state=42,
            )
            cluster_input = np.asarray(reducer.fit_transform(raw))
            logger.info(f"Clustering on mid-dim UMAP (shape {cluster_input.shape})")
        else:
            cluster_input = np.array([p["embedding"] for p in papers], dtype=float)
            logger.info(f"Clustering on full embeddings (shape {cluster_input.shape})")
            if args.metric == "cosine":
                norms = np.linalg.norm(cluster_input, axis=1, keepdims=True)
                norms[norms == 0] = 1.0
                cluster_input = cluster_input / norms
                metric = "euclidean"
                logger.info("Normalized embeddings; using euclidean (equivalent to cosine on unit vectors)")

        min_cluster_size = args.min_cluster_size
        min_samples = args.min_samples if args.min_samples is not None else max(2, min_cluster_size // 2)

        if args.method == "kmeans":
            from sklearn.cluster import KMeans
            n_clusters = max(2, min(args.n_clusters, len(papers) - 1))
            logger.info(f"KMeans n_clusters={n_clusters}")
            labels = KMeans(n_clusters=n_clusters, random_state=42, n_init=10).fit_predict(cluster_input)
        else:
            import hdbscan
            logger.info(f"HDBSCAN min_cluster_size={min_cluster_size}, min_samples={min_samples}, metric={metric}")
            clusterer = hdbscan.HDBSCAN(
                min_cluster_size=min_cluster_size,
                min_samples=min_samples,
                metric=metric,
                cluster_selection_method=args.selection_method,
            )
            labels = clusterer.fit_predict(cluster_input)

    unique = sorted(set(np.asarray(labels).tolist()))
    n_clusters = len([c for c in unique if c != -1])
    n_noise = int((np.asarray(labels) == -1).sum())
    logger.info(f"Found {n_clusters} clusters, {n_noise} noise points")
    for c in unique:
        count = int((np.asarray(labels) == c).sum())
        logger.info(f"  cluster {c}: {count} papers")

    new_papers = []
    for paper, cluster_id in zip(papers, labels):
        new_papers.append({**paper, "cluster": int(cluster_id)})

    grouped = {}
    for paper, cluster_id in zip(new_papers, labels):
        grouped.setdefault(int(cluster_id), []).append(paper)

    # Generate labels
    deepseek_key = os.getenv("DEEPSEEK_API_KEY", "")
    openai_key = os.getenv("OPENAI_API_KEY", "")
    use_llm = (not args.no_llm) and (deepseek_key or openai_key)
    if args.no_llm:
        logger.info("LLM labeling disabled (--no-llm)")
    elif not use_llm:
        logger.warning("No LLM API key found; using word-frequency fallback")

    cluster_labels = {}
    for cluster_id, cluster_papers in grouped.items():
        if cluster_id == -1:
            cluster_labels[cluster_id] = "Uncategorized"
            continue
        if use_llm:
            try:
                label = llm_label_for_cluster(cluster_papers, deepseek_key, openai_key)
                cluster_labels[cluster_id] = label
                logger.info(f"  cluster {cluster_id}: {label}")
                continue
            except Exception as exc:
                logger.warning(f"LLM labeling failed for cluster {cluster_id}: {exc}")
        cluster_labels[cluster_id] = simple_label(cluster_papers)
        logger.info(f"  cluster {cluster_id} (fallback): {cluster_labels[cluster_id]}")

    # Write back cluster_label on papers
    finalized_papers = [
        {**p, "cluster_label": cluster_labels.get(p["cluster"], "Unknown")}
        for p in new_papers
    ]

    # Build cluster_info (excluding noise from main legend)
    cluster_info = []
    for cluster_id in sorted(c for c in unique if c != -1):
        cluster_info.append({
            "id": int(cluster_id),
            "label": cluster_labels[cluster_id],
            "color": CLUSTER_COLORS[cluster_id % len(CLUSTER_COLORS)],
            "paper_count": int((labels == cluster_id).sum()),
        })

    result = {
        "papers": finalized_papers,
        "clusters": cluster_info,
        "metadata": {
            "total_papers": len(finalized_papers),
            "total_citations": sum(p.get("citations") or 0 for p in finalized_papers),
            "processing_timestamp": np.datetime64("now").astype(str),
        },
    }

    out_path.parent.mkdir(parents=True, exist_ok=True)
    with open(out_path, "w") as f:
        json.dump(result, f, indent=2)
    logger.info(f"Wrote {out_path}")


if __name__ == "__main__":
    sys.exit(main())
