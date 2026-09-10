"""
Papers API endpoints
"""
from fastapi import APIRouter, HTTPException, Query
from typing import Optional, List
import json
from pathlib import Path
import logging

router = APIRouter()
logger = logging.getLogger(__name__)


def load_processed_data():
    """Load the latest processed papers data"""
    data_file = Path("data/processed/papers_with_ml.json")
    
    if not data_file.exists():
        raise HTTPException(
            status_code=404,
            detail="No processed data found. Please run the data pipeline first: python scripts/run_full_pipeline.py"
        )
    
    try:
        with open(data_file, 'r') as f:
            return json.load(f)
    except Exception as e:
        logger.error(f"Error loading data: {e}")
        raise HTTPException(status_code=500, detail="Error loading data")


@router.get("/papers")
async def get_all_papers(
    cluster: Optional[int] = Query(None, description="Filter by cluster ID"),
    limit: Optional[int] = Query(None, description="Limit number of results")
):
    """Get all papers with optional filtering"""
    data = load_processed_data()
    papers = data.get('papers', [])
    
    # Filter by cluster if specified
    if cluster is not None:
        papers = [p for p in papers if p.get('cluster') == cluster]
    
    # Limit results if specified
    if limit:
        papers = papers[:limit]
    
    return {
        "papers": papers,
        "count": len(papers),
        "total_available": len(data.get('papers', []))
    }


@router.get("/papers/{paper_id}")
async def get_paper(paper_id: str):
    """Get a specific paper by its Semantic Scholar ID or title"""
    data = load_processed_data()
    papers = data.get('papers', [])
    
    # Search by S2 paper ID or title
    for paper in papers:
        if paper.get('s2_paper_id') == paper_id or paper.get('title') == paper_id:
            return paper
    
    raise HTTPException(status_code=404, detail="Paper not found")


@router.get("/clusters")
async def get_clusters():
    """Get cluster information"""
    data = load_processed_data()
    
    return {
        "clusters": data.get('clusters', []),
        "count": len(data.get('clusters', []))
    }


@router.get("/metadata")
async def get_metadata():
    """Get dataset metadata"""
    data = load_processed_data()
    
    return {
        "metadata": data.get('metadata', {}),
        "clusters": data.get('clusters', []),
        "total_papers": len(data.get('papers', []))
    }


@router.get("/similar/{paper_id}")
async def find_similar_papers(
    paper_id: str,
    limit: int = Query(5, description="Number of similar papers to return")
):
    """Find papers similar to a given paper based on embeddings"""
    data = load_processed_data()
    papers = data.get('papers', [])
    
    # Find the target paper
    target_paper = None
    for paper in papers:
        if paper.get('s2_paper_id') == paper_id or paper.get('title') == paper_id:
            target_paper = paper
            break
    
    if not target_paper:
        raise HTTPException(status_code=404, detail="Paper not found")
    
    if not target_paper.get('embedding'):
        raise HTTPException(status_code=400, detail="Paper has no embedding")
    
    # Calculate cosine similarity with all other papers
    import numpy as np
    from sklearn.metrics.pairwise import cosine_similarity
    
    target_embedding = np.array(target_paper['embedding']).reshape(1, -1)
    similarities = []
    
    for paper in papers:
        if paper == target_paper:
            continue
        
        if paper.get('embedding'):
            paper_embedding = np.array(paper['embedding']).reshape(1, -1)
            similarity = cosine_similarity(target_embedding, paper_embedding)[0][0]
            
            similarities.append({
                'paper': {
                    'title': paper.get('title'),
                    's2_paper_id': paper.get('s2_paper_id'),
                    'year': paper.get('year'),
                    'citations': paper.get('citations'),
                    'cluster': paper.get('cluster'),
                    'cluster_label': paper.get('cluster_label')
                },
                'similarity': float(similarity)
            })
    
    # Sort by similarity and return top N
    similarities.sort(key=lambda x: x['similarity'], reverse=True)
    
    return {
        "target_paper": {
            "title": target_paper.get('title'),
            "s2_paper_id": target_paper.get('s2_paper_id')
        },
        "similar_papers": similarities[:limit]
    }


@router.get("/preview-author")
async def preview_author(
    query: str = Query(..., description="Author name, ORCID, OpenAlex URL, or Google Scholar URL"),
    offset: int = Query(0, ge=0, description="Next candidate if the first match is wrong"),
):
    """Resolve an author and return 1–2 papers so a human can confirm authorship."""
    from app.services.data_collector import DataCollector

    try:
        collector = DataCollector(author_id=query)
        preview = collector.preview_author(query=query, offset=offset)
        if not preview.get("sample_papers"):
            raise HTTPException(
                status_code=404,
                detail="This author record has no public papers to confirm.",
            )
        return preview
    except HTTPException:
        raise
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc))
    except Exception as exc:
        logger.error(f"Error previewing author: {exc}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(exc))


@router.post("/generate-network")
async def generate_research_network(
    author_id: str = Query(..., description="Confirmed OpenAlex author id (A…), or a name/ORCID/URL"),
):
    """
    Ephemeral demo network. Does not write to disk or replace the default graph.
    """
    from app.services.data_collector import DataCollector
    from app.services.ml_processor import MLProcessor
    from datetime import datetime, timezone

    try:
        logger.info("Generating ephemeral research network for author: %s", author_id)

        collector = DataCollector(author_id=author_id)
        papers = collector.collect_all_data(author_id=author_id, persist=False)

        if not papers or len(papers) < 3:
            raise HTTPException(
                status_code=400,
                detail=f"Not enough papers found for author (found {len(papers)}). Minimum 3 required.",
            )

        processor = MLProcessor()
        result = processor.process_papers(papers, persist_default=False)
        result["author"] = {
            "id": author_id,
            "info": papers[0].get("author_info", {}),
            "generated_at": datetime.now(timezone.utc).isoformat(),
            "ephemeral": True,
        }
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error generating research network: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/collect")
async def collect_author_data(
    author_id: str = Query(..., description="Author name, ORCID, OpenAlex URL, or Google Scholar URL"),
    run_ml: bool = Query(False, description="Also run ML processing after collection")
):
    """Collect papers for an author from OpenAlex."""
    from app.services.data_collector import DataCollector
    
    try:
        logger.info(f"Starting collection for author: {author_id}")
        
        # Collect data
        collector = DataCollector(author_id=author_id)
        papers = collector.collect_all_data(author_id=author_id, persist=False)
        
        result = {
            "status": "success",
            "author_id": author_id,
            "papers_collected": len(papers),
            "author_info": papers[0].get('author_info') if papers else None
        }
        
        # Optionally run ML processing
        if run_ml:
            from app.services.ml_processor import MLProcessor
            logger.info("Running ML processing...")
            processor = MLProcessor()
            processed_result = processor.process_papers(papers, persist_default=False)
            result["ml_processing"] = "complete"
            result["clusters_found"] = len(processed_result.get('clusters', []))
        
        return result
        
    except Exception as e:
        logger.error(f"Error collecting author data: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/analyze-text")
async def analyze_text(text: str = Query(..., description="Text to analyze and find similar papers")):
    """
    Analyze arbitrary text and find the most similar papers
    Useful for finding papers related to a specific topic or abstract
    """
    from sentence_transformers import SentenceTransformer
    import numpy as np
    from sklearn.metrics.pairwise import cosine_similarity
    
    # Load model
    model = SentenceTransformer('all-MiniLM-L6-v2')
    text_embedding = model.encode([text])[0].reshape(1, -1)
    
    # Load papers
    data = load_processed_data()
    papers = data.get('papers', [])
    
    # Calculate similarities
    similarities = []
    for paper in papers:
        if paper.get('embedding'):
            paper_embedding = np.array(paper['embedding']).reshape(1, -1)
            similarity = cosine_similarity(text_embedding, paper_embedding)[0][0]
            
            similarities.append({
                'paper': {
                    'title': paper.get('title'),
                    's2_paper_id': paper.get('s2_paper_id'),
                    'year': paper.get('year'),
                    'citations': paper.get('citations'),
                    'cluster': paper.get('cluster'),
                    'cluster_label': paper.get('cluster_label'),
                    'abstract': paper.get('abstract', '')[:200] + '...' if paper.get('abstract') else None
                },
                'similarity': float(similarity)
            })
    
    # Sort and return top 10
    similarities.sort(key=lambda x: x['similarity'], reverse=True)
    
    return {
        "query_text": text[:100] + '...' if len(text) > 100 else text,
        "similar_papers": similarities[:10]
    }
