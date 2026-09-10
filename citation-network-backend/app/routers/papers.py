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


@router.post("/generate-network")
async def generate_research_network(
    author_id: str = Query(..., description="Google Scholar author ID or profile URL"),
    use_cache: bool = Query(True, description="Use cached data if available")
):
    """
    Generate complete research network for any Google Scholar author.
    Accepts either author_id or full Google Scholar URL.
    Returns network data ready for visualization.
    """
    from app.services.data_collector import DataCollector
    from app.services.ml_processor import MLProcessor
    import re
    import hashlib
    from datetime import datetime
    
    try:
        # Extract author_id from URL if needed
        if 'scholar.google' in author_id or author_id.startswith('http'):
            match = re.search(r'user=([^&]+)', author_id)
            if match:
                author_id = match.group(1)
            else:
                raise HTTPException(status_code=400, detail="Could not extract author ID from URL")
        
        logger.info(f"Generating research network for author: {author_id}")
        
        # Check cache
        cache_dir = Path("data/cache")
        cache_dir.mkdir(parents=True, exist_ok=True)
        cache_key = hashlib.md5(author_id.encode()).hexdigest()
        cache_file = cache_dir / f"network_{cache_key}.json"
        
        if use_cache and cache_file.exists():
            # Check if cache is recent (< 24 hours)
            import time
            cache_age = time.time() - cache_file.stat().st_mtime
            if cache_age < 86400:  # 24 hours
                logger.info(f"Using cached data (age: {cache_age/3600:.1f} hours)")
                with open(cache_file, 'r') as f:
                    return json.load(f)
        
        # Collect fresh data
        logger.info("Collecting papers from Google Scholar...")
        collector = DataCollector(author_id=author_id)
        papers = collector.collect_all_data(author_id=author_id, save_as_latest=False)
        
        if not papers or len(papers) < 3:
            raise HTTPException(
                status_code=400, 
                detail=f"Not enough papers found for author (found {len(papers)}). Minimum 3 required."
            )
        
        # Run ML processing
        logger.info(f"Processing {len(papers)} papers with ML pipeline...")
        processor = MLProcessor()
        result = processor.process_papers(papers)
        
        # Add author info and generation timestamp
        result['author'] = {
            'id': author_id,
            'info': papers[0].get('author_info', {}),
            'generated_at': datetime.utcnow().isoformat()
        }
        
        # Cache the result
        with open(cache_file, 'w') as f:
            json.dump(result, f, indent=2)
        logger.info(f"Cached network data to {cache_file}")
        
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error generating research network: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/collect")
async def collect_author_data(
    author_id: str = Query(..., description="Google Scholar author ID"),
    run_ml: bool = Query(False, description="Also run ML processing after collection")
):
    """
    Collect papers for any Google Scholar author
    This allows dynamic collection without redeploying
    """
    from app.services.data_collector import DataCollector
    
    try:
        logger.info(f"Starting collection for author: {author_id}")
        
        # Collect data
        collector = DataCollector(author_id=author_id)
        papers = collector.collect_all_data(author_id=author_id, save_as_latest=(not run_ml))
        
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
            processed_result = processor.process_papers(papers)
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
