#!/usr/bin/env python3
"""
Complete Data Pipeline Script
Run this to collect and process all data in one go

Usage:
    python scripts/run_full_pipeline.py
"""

import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

# Import config to load environment variables
from app.config import settings
from app.services.data_collector import DataCollector
from app.services.ml_processor import MLProcessor
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


def main():
    """Run complete data collection and processing pipeline"""
    
    logger.info("=" * 60)
    logger.info("🚀 RESEARCH NETWORK DATA PIPELINE")
    logger.info("=" * 60)
    
    try:
        # Step 1: Collect data
        logger.info("\n📥 STEP 1: Data Collection")
        logger.info("-" * 60)
        collector = DataCollector()
        papers = collector.collect_all_data(persist=True, save_as_latest=True)
        logger.info(f"✅ Collected {len(papers)} papers")
        
        # Step 2: ML Processing
        logger.info("\n🧠 STEP 2: ML Processing")
        logger.info("-" * 60)
        processor = MLProcessor()
        result = processor.process_papers(papers, persist_default=True)
        logger.info(f"✅ Processed {len(result['papers'])} papers")
        logger.info(f"✅ Found {len(result['clusters'])} clusters")
        
        # Summary
        logger.info("\n" + "=" * 60)
        logger.info("📊 SUMMARY")
        logger.info("=" * 60)
        logger.info(f"Total Papers: {result['metadata']['total_papers']}")
        logger.info(f"Total Citations: {result['metadata']['total_citations']}")
        logger.info(f"Clusters Found: {len(result['clusters'])}")
        logger.info("")
        logger.info("Cluster Breakdown:")
        for cluster in result['clusters']:
            logger.info(f"  - {cluster['label']}: {cluster['paper_count']} papers")
        
        logger.info("\n" + "=" * 60)
        logger.info("✅ PIPELINE COMPLETE!")
        logger.info("=" * 60)
        logger.info("Output files:")
        logger.info("  - data/processed/papers_latest.json")
        logger.info("  - data/processed/papers_with_ml.json")
        logger.info("")
        logger.info("You can now start the API server:")
        logger.info("  uvicorn app.main:app --reload")
        
        return 0
        
    except Exception as e:
        logger.error(f"\n❌ Pipeline failed: {e}", exc_info=True)
        return 1


if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)
