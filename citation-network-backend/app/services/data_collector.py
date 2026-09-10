"""
Data Collection Service - SerpApi + Semantic Scholar
Supports dynamic author ID for interactive use
"""
import requests
from serpapi import GoogleSearch
from typing import List, Dict, Optional
import logging
from datetime import datetime
import json
from pathlib import Path

from app.config import settings

logger = logging.getLogger(__name__)


class DataCollector:
    """Collect and enrich paper data from multiple sources"""
    
    def __init__(self, author_id: Optional[str] = None):
        """
        Initialize data collector
        
        Args:
            author_id: Google Scholar author ID. If None, uses DEFAULT_GOOGLE_SCHOLAR_AUTHOR_ID from config
        """
        self.serp_api_key = settings.SERPAPI_KEY
        # Use provided author_id, fall back to default from config
        self.gs_author_id = author_id or settings.DEFAULT_GOOGLE_SCHOLAR_AUTHOR_ID
        self.s2_api_key = settings.SEMANTIC_SCHOLAR_API_KEY
        self.data_dir = Path("data")
        self.data_dir.mkdir(exist_ok=True)
        (self.data_dir / "raw").mkdir(exist_ok=True)
        (self.data_dir / "processed").mkdir(exist_ok=True)
    
    def fetch_google_scholar_profile(self, author_id: Optional[str] = None) -> Dict:
        """
        Fetch complete author profile from Google Scholar via SerpApi
        
        Args:
            author_id: Override the default author_id for this fetch
        """
        target_author_id = author_id or self.gs_author_id
        
        if not target_author_id:
            raise ValueError("No Google Scholar author ID provided. Set DEFAULT_GOOGLE_SCHOLAR_AUTHOR_ID in .env or pass author_id parameter.")
        
        logger.info(f"Fetching Google Scholar profile for author: {target_author_id}")
        
        params = {
            "engine": "google_scholar_author",
            "author_id": target_author_id,
            "api_key": self.serp_api_key,
            "num": 100,  # Get all papers
            "hl": "en"
        }
        
        try:
            search = GoogleSearch(params)
            results = search.get_dict()
            
            # Save raw response
            timestamp = datetime.utcnow().isoformat().replace(':', '-')
            raw_file = self.data_dir / "raw" / f"google_scholar_{target_author_id}_{timestamp}.json"
            with open(raw_file, 'w') as f:
                json.dump(results, f, indent=2)
            
            logger.info(f"✅ Fetched {len(results.get('articles', []))} papers from Google Scholar")
            return results
            
        except Exception as e:
            logger.error(f"❌ Error fetching Google Scholar data: {e}")
            raise
    
    def enrich_with_serpapi(self, paper: Dict) -> Optional[Dict]:
        """Fallback: Get paper details from SerpAPI when S2 fails"""
        try:
            params = {
                "engine": "google_scholar",
                "q": paper['title'],
                "api_key": self.serp_api_key,
                "num": 1
            }
            
            search = GoogleSearch(params)
            results = search.get_dict()
            
            if results.get('organic_results') and len(results['organic_results']) > 0:
                serp_data = results['organic_results'][0]
                return {
                    'abstract': serp_data.get('snippet'),
                    'publication_info': serp_data.get('publication_info', {}),
                    'inline_links': serp_data.get('inline_links', {})
                }
        except Exception as e:
            logger.error(f"  ❌ SerpAPI fallback failed: {e}")
        return None
    
    def enrich_with_semantic_scholar(self, papers: List[Dict]) -> List[Dict]:
        """Enrich papers with Semantic Scholar data (embeddings, abstracts)"""
        logger.info(f"Enriching {len(papers)} papers with Semantic Scholar data...")
        
        enriched_papers = []
        base_url = "https://api.semanticscholar.org/graph/v1"
        headers = {}
        
        if self.s2_api_key:
            headers["x-api-key"] = self.s2_api_key
            logger.info("Using Semantic Scholar API key")
        else:
            logger.info("Using Semantic Scholar free tier (rate limited)")
        
        for i, paper in enumerate(papers):
            try:
                # Search for paper by title
                search_url = f"{base_url}/paper/search"
                params = {
                    "query": paper['title'],
                    "fields": "paperId,title,abstract,year,citationCount,embedding,tldr,openAccessPdf,authors",
                    "limit": 1
                }
                
                response = requests.get(search_url, params=params, headers=headers)
                response.raise_for_status()
                
                search_results = response.json()
                
                if search_results.get('data') and len(search_results['data']) > 0:
                    s2_data = search_results['data'][0]
                    
                    # Safely extract nested values with null checks
                    embedding_data = s2_data.get('embedding')
                    embedding_vector = embedding_data.get('vector') if embedding_data else None
                    
                    tldr_data = s2_data.get('tldr')
                    tldr_text = tldr_data.get('text') if tldr_data else None
                    
                    pdf_data = s2_data.get('openAccessPdf')
                    pdf_url = pdf_data.get('url') if pdf_data else None
                    
                    authors_list = s2_data.get('authors', [])
                    s2_author_names = [a.get('name') for a in authors_list if a and a.get('name')]
                    
                    # Merge Google Scholar and Semantic Scholar data
                    enriched_paper = {
                        **paper,
                        's2_paper_id': s2_data.get('paperId'),
                        'abstract': s2_data.get('abstract'),
                        'embedding': embedding_vector,
                        'tldr': tldr_text,
                        'pdf_url': pdf_url,
                        's2_authors': s2_author_names,
                        's2_citation_count': s2_data.get('citationCount')
                    }
                    enriched_papers.append(enriched_paper)
                    logger.info(f"  ✅ Enriched: {paper['title'][:60]}...")
                else:
                    # Keep paper even if not found in S2
                    enriched_papers.append({**paper, 's2_paper_id': None})
                    logger.warning(f"  ⚠️  Not found in S2: {paper['title'][:60]}...")
                
                # Rate limiting (1 req/sec for free tier)
                if not self.s2_api_key and i < len(papers) - 1:
                    import time
                    time.sleep(1)
                    
            except requests.exceptions.HTTPError as e:
                if e.response.status_code == 429:
                    logger.warning(f"  ⚠️  S2 rate limited, trying SerpAPI fallback for '{paper['title'][:60]}...'")
                    # Try SerpAPI fallback
                    serp_data = self.enrich_with_serpapi(paper)
                    if serp_data:
                        enriched_paper = {
                            **paper,
                            's2_paper_id': None,
                            'abstract': serp_data.get('abstract'),
                            'serpapi_enriched': True
                        }
                        enriched_papers.append(enriched_paper)
                        logger.info(f"  ✅ Enriched via SerpAPI: {paper['title'][:60]}...")
                    else:
                        enriched_papers.append({**paper, 's2_paper_id': None})
                else:
                    logger.error(f"  ❌ HTTP error enriching paper '{paper['title'][:60]}...': {e}")
                    # Try SerpAPI fallback for other errors too
                    serp_data = self.enrich_with_serpapi(paper)
                    if serp_data:
                        enriched_papers.append({**paper, 's2_paper_id': None, 'abstract': serp_data.get('abstract'), 'serpapi_enriched': True})
                        logger.info(f"  ✅ Enriched via SerpAPI fallback: {paper['title'][:60]}...")
                    else:
                        enriched_papers.append({**paper, 's2_paper_id': None})
            except Exception as e:
                logger.error(f"  ❌ Error enriching paper '{paper['title'][:60]}...': {e}")
                # Try SerpAPI fallback
                serp_data = self.enrich_with_serpapi(paper)
                if serp_data:
                    enriched_papers.append({**paper, 's2_paper_id': None, 'abstract': serp_data.get('abstract'), 'serpapi_enriched': True})
                    logger.info(f"  ✅ Enriched via SerpAPI fallback: {paper['title'][:60]}...")
                else:
                    enriched_papers.append({**paper, 's2_paper_id': None})
        
        logger.info(f"✅ Successfully enriched {len([p for p in enriched_papers if p.get('s2_paper_id')])} papers")
        return enriched_papers
    
    def collect_all_data(self, author_id: Optional[str] = None, save_as_latest: bool = True) -> List[Dict]:
        """
        Main collection pipeline
        
        Args:
            author_id: Override the default author_id for this collection
            save_as_latest: Whether to save as papers_latest.json (used for API)
        """
        logger.info("🚀 Starting data collection pipeline...")
        
        # Step 1: Fetch from Google Scholar
        gs_data = self.fetch_google_scholar_profile(author_id)
        
        # Extract author info
        author_info = {
            'name': gs_data.get('author', {}).get('name'),
            'affiliations': gs_data.get('author', {}).get('affiliations'),
            'email': gs_data.get('author', {}).get('email'),
            'interests': gs_data.get('author', {}).get('interests', []),
            'cited_by_count': gs_data.get('cited_by', {}).get('table', [{}])[0].get('citations', {}).get('all', 0) if gs_data.get('cited_by') else 0
        }
        
        # Extract papers
        papers = []
        for article in gs_data.get('articles', []):
            paper = {
                'title': article.get('title'),
                'link': article.get('link'),
                'year': article.get('year'),
                'citations': article.get('cited_by', {}).get('value', 0),
                'cited_by_link': article.get('cited_by', {}).get('link'),
                'authors': article.get('authors', ''),
                'publication': article.get('publication', '')
            }
            papers.append(paper)
        
        # Step 2: Enrich with Semantic Scholar
        enriched_papers = self.enrich_with_semantic_scholar(papers)
        
        # Add author info to each paper
        for paper in enriched_papers:
            paper['author_info'] = author_info
        
        # Step 3: Save processed data
        timestamp = datetime.utcnow().isoformat().replace(':', '-')
        target_author = author_id or self.gs_author_id
        processed_file = self.data_dir / "processed" / f"papers_{target_author}_{timestamp}.json"
        with open(processed_file, 'w') as f:
            json.dump(enriched_papers, f, indent=2)
        
        # Also save as "latest" if requested (for API to load)
        if save_as_latest:
            latest_file = self.data_dir / "processed" / "papers_latest.json"
            with open(latest_file, 'w') as f:
                json.dump(enriched_papers, f, indent=2)
            logger.info(f"📄 Saved as papers_latest.json for API")
        
        logger.info(f"✅ Data collection complete! Saved {len(enriched_papers)} papers")
        return enriched_papers


# Convenience function for scripts
def run_collection(author_id: Optional[str] = None):
    """Run the data collection pipeline"""
    collector = DataCollector(author_id=author_id)
    papers = collector.collect_all_data(author_id=author_id)
    return papers


if __name__ == "__main__":
    # Can run directly for testing
    run_collection()
