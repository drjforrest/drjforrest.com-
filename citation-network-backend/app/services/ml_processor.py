"""
ML Processing Service - UMAP, Clustering, Sentiment
research-network-api/app/services/ml_processor.py
"""
import numpy as np
from typing import List, Dict, Optional
import logging
from sklearn.preprocessing import StandardScaler
import umap
import hdbscan
from sentence_transformers import SentenceTransformer
import json
from pathlib import Path

logger = logging.getLogger(__name__)


class MLProcessor:
    """Process papers with ML: dimensionality reduction, clustering, sentiment"""
    
    def __init__(self):
        self.sentiment_model = None  # Lazy load
        self.embedding_model = None  # For papers without S2 embeddings
        
    def load_sentiment_model(self):
        """Lazy load sentiment analysis model"""
        if self.sentiment_model is None:
            logger.info("Loading sentiment analysis model...")
            from transformers import pipeline
            self.sentiment_model = pipeline(
                "sentiment-analysis",
                model="distilbert-base-uncased-finetuned-sst-2-english"
            )
        return self.sentiment_model
    
    def load_embedding_model(self):
        """Lazy load embedding model for papers without S2 embeddings"""
        if self.embedding_model is None:
            logger.info("Loading sentence transformer model...")
            self.embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
        return self.embedding_model
    
    def process_embeddings(self, papers: List[Dict]) -> np.ndarray:
        """Extract or generate embeddings for all papers"""
        logger.info("Processing embeddings...")
        
        # Use sentence transformer for ALL papers to ensure consistent dimensions
        # (S2 embeddings are 768D, sentence-transformers are 384D - can't mix)
        logger.info(f"Generating embeddings for {len(papers)} papers using sentence transformer...")
        model = self.load_embedding_model()
        
        texts = []
        for paper in papers:
            # Use abstract if available, otherwise title
            text = paper.get('abstract') or paper.get('tldr') or paper.get('title', '')
            texts.append(text)
        
        # Generate all embeddings at once
        embeddings = model.encode(texts, show_progress_bar=True)
        
        # Update papers with embeddings
        for paper, embedding in zip(papers, embeddings):
            paper['embedding'] = embedding.tolist()
        
        logger.info(f"✅ Generated embeddings for {len(papers)} papers")
        logger.info(f"✅ Embedding matrix shape: {embeddings.shape}")
        
        return embeddings, papers
    
    def reduce_dimensions(self, embeddings: np.ndarray) -> np.ndarray:
        """Reduce embeddings to 2D using UMAP"""
        logger.info("Reducing dimensions with UMAP...")
        
        if len(embeddings) < 5:
            logger.warning("Not enough papers for UMAP, using simple projection")
            # Fallback for small datasets
            return embeddings[:, :2]
        
        reducer = umap.UMAP(
            n_components=2,
            n_neighbors=min(15, len(embeddings) - 1),
            min_dist=0.1,
            metric='cosine',
            random_state=42
        )
        
        coords_2d = reducer.fit_transform(embeddings)
        logger.info("ÏÉ Dimensionality reduction complete")
        return coords_2d
    
    def cluster_papers(self, embeddings: np.ndarray) -> np.ndarray:
        """Cluster papers using HDBSCAN
        
        Args:
            embeddings: Either 2D UMAP coordinates or high-dim embeddings
        """
        logger.info("Clustering papers with HDBSCAN...")
        
        if len(embeddings) < 5:
            logger.warning("Not enough papers for clustering, assigning all to cluster 0")
            return np.zeros(len(embeddings), dtype=int)
        
        # Improved parameters for better clustering
        # min_cluster_size: ensures meaningful groups (not too fragmented)
        # Cap between 3-20 papers per cluster for balance
        min_cluster_size = max(3, min(len(embeddings) // 5, 20))
        
        # min_samples: higher = more conservative, tighter clusters
        min_samples = max(2, min_cluster_size // 3)
        
        logger.info(f"Using min_cluster_size={min_cluster_size}, min_samples={min_samples}")
        
        clusterer = hdbscan.HDBSCAN(
            min_cluster_size=min_cluster_size,
            min_samples=min_samples,
            metric='euclidean',
            cluster_selection_method='eom'  # Excess of Mass for better boundaries
        )
        
        clusters = clusterer.fit_predict(embeddings)
        
        n_clusters = len(set(clusters)) - (1 if -1 in clusters else 0)
        n_noise = list(clusters).count(-1)
        
        logger.info(f"✅ Found {n_clusters} clusters ({n_noise} noise points)")
        return clusters
    
    def analyze_sentiment(self, papers: List[Dict]) -> List[Dict]:
        """Analyze sentiment of paper abstracts"""
        logger.info("Analyzing sentiment...")
        
        model = self.load_sentiment_model()
        
        for paper in papers:
            abstract = paper.get('abstract') or paper.get('tldr') or paper.get('title', '')
            
            if abstract and len(abstract) > 10:
                # Truncate to model max length (512 tokens ≈ 2000 chars)
                # Be more conservative to avoid token length errors
                text = abstract[:1500]
                
                try:
                    result = model(text, truncation=True, max_length=512)[0]
                    paper['sentiment'] = {
                        'label': result['label'].lower(),
                        'score': round(result['score'], 3)
                    }
                except Exception as e:
                    logger.error(f"Error analyzing sentiment: {e}")
                    paper['sentiment'] = {'label': 'neutral', 'score': 0.5}
            else:
                paper['sentiment'] = {'label': 'neutral', 'score': 0.5}
        
        logger.info("ÏÉ Sentiment analysis complete")
        return papers
    
    def generate_cluster_labels_simple(self, cluster_papers: List[Dict]) -> str:
        """Fallback simple labeling if LLM fails"""
        from collections import Counter
        import re
        
        words = []
        for paper in cluster_papers:
            title = paper.get('title', '')
            words.extend([
                w.lower() for w in re.findall(r'\b\w{4,}\b', title)
                if w.lower() not in {'with', 'from', 'among', 'between', 'treatment', 'study', 'analysis'}
            ])
        
        if words:
            most_common = Counter(words).most_common(3)
            return " & ".join([w.capitalize() for w, _ in most_common[:2]])
        return "Research Cluster"
    
    def generate_cluster_labels(self, papers: List[Dict]) -> Dict[int, str]:
        """Generate meaningful labels for clusters using LLM"""
        logger.info("Generating cluster labels with LLM...")
        
        clusters = {}
        for paper in papers:
            cluster_id = paper.get('cluster', -1)
            if cluster_id not in clusters:
                clusters[cluster_id] = []
            clusters[cluster_id].append(paper)
        
        cluster_labels = {}
        
        # Check for API keys from settings
        from app.config import settings
        deepseek_key = settings.DEEPSEEK_API_KEY
        openai_key = settings.OPENAI_API_KEY
        use_llm = deepseek_key or openai_key
        
        if not use_llm:
            logger.warning("No LLM API key found. Set DEEPSEEK_API_KEY or OPENAI_API_KEY in .env for better labels.")
        
        for cluster_id, cluster_papers in clusters.items():
            if cluster_id == -1:
                cluster_labels[cluster_id] = "Uncategorized"
                continue
            
            # Try LLM labeling if API key available
            if use_llm:
                try:
                    label = self._generate_llm_label(cluster_papers, deepseek_key, openai_key)
                    cluster_labels[cluster_id] = label
                    logger.info(f"Cluster {cluster_id}: {label}")
                    continue
                except Exception as e:
                    logger.warning(f"LLM labeling failed for cluster {cluster_id}: {e}. Using fallback.")
            
            # Fallback to simple method
            cluster_labels[cluster_id] = self.generate_cluster_labels_simple(cluster_papers)
        
        logger.info(f"✅ Generated labels for {len(cluster_labels)} clusters")
        return cluster_labels
    
    def _generate_llm_label(self, cluster_papers: List[Dict], deepseek_key: str, openai_key: str) -> str:
        """Use LLM to generate semantic cluster label"""
        # Prepare paper summaries (titles + abstracts if available)
        paper_summaries = []
        for i, paper in enumerate(cluster_papers[:10]):  # Limit to 10 papers for context
            title = paper.get('title', '')
            abstract = paper.get('abstract', '') or paper.get('tldr', '')
            if abstract:
                paper_summaries.append(f"{i+1}. {title}\n   {abstract[:200]}...")
            else:
                paper_summaries.append(f"{i+1}. {title}")
        
        papers_text = "\n\n".join(paper_summaries)
        
        prompt = f"""Analyze these research papers and generate a concise, descriptive label (2-5 words) that captures the main research theme.

Papers:
{papers_text}

Provide ONLY the label, nothing else. The label should be:
- Specific and descriptive
- 2-5 words maximum
- Capture the core research topic
- Use proper capitalization

Label:"""
        
        # Try DeepSeek first (cheaper), fallback to OpenAI
        if deepseek_key:
            try:
                import requests
                response = requests.post(
                    "https://api.deepseek.com/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {deepseek_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": "deepseek-chat",
                        "messages": [{"role": "user", "content": prompt}],
                        "temperature": 0.3,
                        "max_tokens": 20
                    },
                    timeout=10
                )
                response.raise_for_status()
                label = response.json()['choices'][0]['message']['content'].strip()
                return label[:50]  # Limit length
            except Exception as e:
                logger.warning(f"DeepSeek API failed: {e}")
        
        if openai_key:
            try:
                import openai
                openai.api_key = openai_key
                response = openai.ChatCompletion.create(
                    model="gpt-3.5-turbo",
                    messages=[{"role": "user", "content": prompt}],
                    temperature=0.3,
                    max_tokens=20
                )
                label = response.choices[0].message.content.strip()
                return label[:50]
            except Exception as e:
                logger.warning(f"OpenAI API failed: {e}")
        
        raise Exception("All LLM APIs failed")
    
    def process_papers(self, papers: List[Dict], persist_default: bool = False) -> Dict:
        """Main processing pipeline.

        Args:
            papers: Raw paper dicts to process.
            persist_default: If True, write the result to
                data/processed/papers_with_ml.json (the default network served
                by the API). Off-line pipelines should set this to True. The
                visitor-facing /api/generate-network endpoint MUST leave this
                False so visitors don't overwrite the site's default network.
        """
        logger.info("<eth>ÙsÿÛ Starting ML processing pipeline...")
        
        # 1. Get embeddings
        embeddings, papers_with_embeddings = self.process_embeddings(papers)
        
        # 2. Reduce dimensions
        coords_2d = self.reduce_dimensions(embeddings)
        
        # 3. Cluster (on 2D UMAP output for better semantic grouping)
        # UMAP preserves semantic structure while reducing noise
        clusters = self.cluster_papers(coords_2d)
        
        # 4. Add coordinates and clusters to papers
        for i, paper in enumerate(papers_with_embeddings):
            paper['position'] = {
                'x': float(coords_2d[i, 0]),
                'y': float(coords_2d[i, 1])
            }
            paper['cluster'] = int(clusters[i])
        
        # 5. Sentiment analysis
        papers_with_embeddings = self.analyze_sentiment(papers_with_embeddings)
        
        # 6. Generate cluster labels
        cluster_labels = self.generate_cluster_labels(papers_with_embeddings)
        
        # Add cluster labels to papers
        for paper in papers_with_embeddings:
            cluster_id = paper.get('cluster', -1)
            paper['cluster_label'] = cluster_labels.get(cluster_id, "Unknown")
        
        # 7. Prepare metadata
        cluster_info = []
        cluster_colors = [
            '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
            '#EC4899', '#14B8A6', '#F97316', '#6366F1', '#84CC16'
        ]
        
        for cluster_id in sorted(set(clusters)):
            cluster_papers = [p for p in papers_with_embeddings if p.get('cluster') == cluster_id]
            cluster_info.append({
                'id': int(cluster_id),
                'label': cluster_labels.get(cluster_id, "Unknown"),
                'color': cluster_colors[cluster_id % len(cluster_colors)],
                'paper_count': len(cluster_papers)
            })
        
        result = {
            'papers': papers_with_embeddings,
            'clusters': cluster_info,
            'metadata': {
                'total_papers': len(papers_with_embeddings),
                'total_citations': sum(p.get('citations') or 0 for p in papers_with_embeddings),
                'processing_timestamp': np.datetime64('now').astype(str)
            }
        }
        
        # Only persist to the default network file when explicitly asked.
        # Visitor-facing endpoints (/api/generate-network) must NOT overwrite
        # the site's default network -- they cache per-author elsewhere.
        if persist_default:
            output_file = Path("data/processed/papers_with_ml.json")
            with open(output_file, 'w') as f:
                json.dump(result, f, indent=2)
            logger.info(f"Wrote default network to {output_file}")
        else:
            logger.info("Skipping default network write (persist_default=False)")

        logger.info("ML processing complete!")
        return result


if __name__ == "__main__":
    # For testing
    processor = MLProcessor()
    
    # Load latest papers
    with open("data/processed/papers_latest.json") as f:
        papers = json.load(f)
    
    result = processor.process_papers(papers)
    print(f"Processed {len(result['papers'])} papers into {len(result['clusters'])} clusters")