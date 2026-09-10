# Research Network API

ML-enhanced academic citation network visualization API for drjforrest.com

## 🎯 What This Does

- Fetches your Google Scholar profile and papers via SerpApi
- Enriches with Semantic Scholar data (abstracts, embeddings, PDFs)
- Processes with ML: UMAP dimensionality reduction, HDBSCAN clustering, sentiment analysis
- Provides REST API for visualization frontend

## 🚀 Quick Start (5 minutes)

### 1. Clone and Setup

```bash
cd /Users/drjforrest/dev/devprojects/academic-citation-network

# Activate virtual environment
source venv/bin/activate

# Install dependencies (this may take a few minutes)
pip install -r requirements.txt
```

### 2. Configure API Keys

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and add your keys
nano .env
```

**Required API Keys:**
- `SERPAPI_KEY`: Get free key at https://serpapi.com (100 searches/month free)
- `GOOGLE_SCHOLAR_AUTHOR_ID`: Your Google Scholar author ID (from your profile URL)
- `SEMANTIC_SCHOLAR_API_KEY`: Optional but recommended - get at https://www.semanticscholar.org/product/api

**Finding Your Google Scholar ID:**
1. Go to your Google Scholar profile
2. Look at the URL: `https://scholar.google.com/citations?user=XXXXX`
3. Copy the `XXXXX` part after `user=`

### 3. Run Data Collection Pipeline

```bash
# This will:
# 1. Fetch your papers from Google Scholar
# 2. Enrich with Semantic Scholar data
# 3. Process with ML (UMAP, clustering, sentiment)
# 4. Save to data/processed/papers_with_ml.json

python scripts/run_full_pipeline.py
```

**Note:** First run will download ML models (~500MB). This happens once.

### 4. Start the API Server

```bash
# Development server with auto-reload
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Visit:
- API docs: http://localhost:8000/api/docs
- Root endpoint: http://localhost:8000/
- Health check: http://localhost:8000/api/health

## 📡 API Endpoints

### Papers
- `GET /api/papers` - Get all papers (with optional filtering)
  - Query params: `?cluster=0&limit=10`
- `GET /api/papers/{paper_id}` - Get specific paper
- `GET /api/similar/{paper_id}` - Find similar papers
- `POST /api/analyze-text` - Find papers similar to arbitrary text

### Metadata
- `GET /api/metadata` - Dataset metadata and summary
- `GET /api/clusters` - Cluster information

### Health
- `GET /api/health` - Basic health check
- `GET /api/health/detailed` - Detailed system metrics

## 📁 Project Structure

```
academic-citation-network/
├── app/
│   ├── main.py              # FastAPI application
│   ├── config.py            # Settings and configuration
│   ├── routers/             # API endpoints
│   │   ├── health.py        # Health checks
│   │   └── papers.py        # Papers endpoints
│   └── services/            # Business logic
│       ├── data_collector.py  # SerpApi + Semantic Scholar
│       └── ml_processor.py    # UMAP, clustering, sentiment
├── data/
│   ├── raw/                 # Raw API responses
│   └── processed/           # Processed data with ML
├── scripts/
│   └── run_full_pipeline.py # Data collection + ML pipeline
├── requirements.txt         # Python dependencies
├── .env                     # API keys (create from .env.example)
└── README.md
```

## 🔄 Updating Data

Run the pipeline script periodically to update your research network:

```bash
# Manual update
python scripts/run_full_pipeline.py

# Or set up a cron job for weekly updates
crontab -e
# Add: 0 2 * * 0 cd /path/to/project && source venv/bin/activate && python scripts/run_full_pipeline.py
```

## 🐳 Docker Deployment (Optional)

Coming soon - see WARP.md for deployment to home server.

## 🛠 Development

```bash
# Activate virtual environment
source venv/bin/activate

# Run tests (when added)
pytest

# Run with debug logging
LOG_LEVEL=DEBUG uvicorn app.main:app --reload

# Format code
black app/
```

## 📊 Data Flow

1. **Collection** (data_collector.py)
   - Fetch profile from Google Scholar via SerpApi
   - Enrich each paper with Semantic Scholar API
   - Save raw data to `data/raw/`

2. **Processing** (ml_processor.py)
   - Extract/generate embeddings (768-dim vectors)
   - Reduce to 2D with UMAP
   - Cluster with HDBSCAN
   - Analyze sentiment
   - Generate cluster labels
   - Save to `data/processed/papers_with_ml.json`

3. **API** (main.py + routers/)
   - Load processed data
   - Serve via REST endpoints
   - Enable filtering, search, similarity queries

## 🎨 Frontend Integration

See `FRONTEND_INTEGRATION.md` for TypeScript types and React integration examples.

## 💰 Cost

- **SerpApi**: Free tier (100 searches/month)
- **Semantic Scholar**: Free
- **Total**: $0/month

## 🤝 Support

For issues or questions, see WARP.md for project context and architecture.

## 📝 License

MIT
