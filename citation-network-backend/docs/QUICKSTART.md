# 🚀 Quick Start Guide

Get your Research Network API running in 5 minutes!

## Prerequisites

- Python 3.12+ ✅ (you have 3.12.9)
- SerpApi key (free tier: 100 searches/month)
- Your Google Scholar author ID

## Step 1: Get Your API Key (2 minutes)

### SerpApi (Required)
1. Go to https://serpapi.com
2. Sign up for free account
3. Copy your API key from dashboard
4. You get 100 free searches/month (plenty for this project)

### Google Scholar ID (Required)
Your ID: `iHagz9UAAAAJ` ✅

**For others:** Go to your Google Scholar profile, look at URL:
```
https://scholar.google.com/citations?user=YOUR_ID_HERE
```

## Step 2: Configure Environment (1 minute)

```bash
cd /Users/drjforrest/dev/devprojects/academic-citation-network

# Edit .env and add your SerpApi key
nano .env
```

Update this line:
```
SERPAPI_KEY=your_actual_serpapi_key_here
```

Your Scholar ID is already set: `DEFAULT_GOOGLE_SCHOLAR_AUTHOR_ID=iHagz9UAAAAJ` ✅

**Note:** `SEMANTIC_SCHOLAR_API_KEY` is optional - the free tier works fine without it!

## Step 3: Install Dependencies (2 minutes)

```bash
# Activate virtual environment
source venv/bin/activate

# Already done! ✅
# But if you need to reinstall:
pip install -r requirements.txt
```

## Step 4: Collect Your Data (5-10 minutes)

```bash
# Run the data collection pipeline
python scripts/run_full_pipeline.py
```

This will:
1. ✅ Fetch your 45 papers from Google Scholar
2. ✅ Enrich with Semantic Scholar (abstracts, embeddings)
3. ✅ Process with ML (UMAP clustering, sentiment analysis)
4. ✅ Save to `data/processed/papers_with_ml.json`

**First run note:** ML models (~500MB) will download automatically. This only happens once.

## Step 5: Start the API (30 seconds)

```bash
# Easy way
./start_server.sh

# Or manually
source venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Visit:
- **API Docs (interactive):** http://localhost:8000/api/docs
- **Health Check:** http://localhost:8000/api/health
- **Your Papers:** http://localhost:8000/api/papers

## 🎯 Interactive Features

### Collect ANY Author's Data Dynamically

The API can fetch data for ANY Google Scholar author on-demand:

```bash
# Via API (no redeployment needed!)
curl -X POST "http://localhost:8000/api/collect?author_id=AUTHOR_ID_HERE"

# With ML processing
curl -X POST "http://localhost:8000/api/collect?author_id=AUTHOR_ID_HERE&run_ml=true"
```

**Use cases:**
- User pastes their Scholar ID in your frontend
- Fetch collaborator networks dynamically
- Compare multiple researchers
- Build "research similarity" features

### Try These API Endpoints

**Get all your papers:**
```bash
curl http://localhost:8000/api/papers
```

**Find similar papers:**
```bash
curl "http://localhost:8000/api/analyze-text?text=HIV+treatment+adherence+among+MSM"
```

**Get clusters:**
```bash
curl http://localhost:8000/api/clusters
```

**Get metadata:**
```bash
curl http://localhost:8000/api/metadata
```

## 🎨 Next Steps

### For Development
1. ✅ API is running
2. Build frontend visualization (D3.js/React)
3. Connect to `http://localhost:8000/api/papers`
4. See `FRONTEND_INTEGRATION.md` for TypeScript types

### For Production
1. Deploy to your home server (`ssh mac-mini`)
2. Configure `api.drjforrest.com`
3. Set up weekly data refresh cron job
4. See WARP.md for deployment guide

## 💡 Example Workflow

**Scenario:** User wants to see how their research relates to yours

1. User visits your site
2. Pastes their Google Scholar ID in a form
3. Frontend calls: `POST /api/collect?author_id=THEIR_ID`
4. API fetches their papers (takes ~2 mins)
5. Frontend displays network visualization comparing both profiles
6. Shows overlapping research areas via clustering

## 🐛 Troubleshooting

**"No module named 'app'"**
```bash
# Make sure you're in the project root
cd /Users/drjforrest/dev/devprojects/academic-citation-network
source venv/bin/activate
```

**"No processed data found"**
```bash
# Run the pipeline first
python scripts/run_full_pipeline.py
```

**"SERPAPI_KEY not set"**
```bash
# Edit .env and add your key
nano .env
```

**Rate limited by Semantic Scholar**
- Free tier: 1 request/second
- With API key: 10 requests/second
- Papers without S2 data will use generated embeddings (works fine!)

## 📊 What You'll See

After running the pipeline, you'll have:

- **~45 papers** from your Google Scholar profile
- **6-8 research clusters** (HIV, COVID, MSM health, etc.)
- **2D coordinates** for visualization
- **Sentiment scores** for each paper
- **Similar paper recommendations**
- **4408 total citations** across your work

## 🎉 Success Checklist

- ✅ Python 3.12.9 installed
- ✅ Virtual environment activated
- ✅ Dependencies installed
- ✅ .env configured with SerpApi key
- ✅ Your Scholar ID set: `iHagz9UAAAAJ`
- ⏳ Run `python scripts/run_full_pipeline.py`
- ⏳ Start server with `./start_server.sh`
- ⏳ Visit http://localhost:8000/api/docs

**You're ready to go! 🚀**

Next: Build your frontend or test the API with the interactive docs.
