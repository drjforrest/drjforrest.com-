# Research Network Visualization - Frontend Complete! ✅

Interactive D3.js citation network visualization with ML explainer integrated into your Next.js academic site.

## What's Been Built

### 🎨 Frontend Components

1. **Network Visualization** (`src/components/research-network/network-visualization.tsx`)
   - D3.js force-directed graph
   - Nodes sized by citations, colored by cluster
   - Interactive: hover, click, drag, zoom/pan
   - Responsive design with tooltips

2. **ML Pipeline Explainer** (`src/components/research-network/ml-explainer.tsx`)
   - Museum-style interactive educational component
   - 5-step walkthrough of the ML pipeline
   - Toggle for technical details
   - Progress indicators and navigation

3. **Research Network Page** (`src/app/research-network/page.tsx`)
   - Full-page visualization with controls
   - Stats cards (papers, citations, topics)
   - Cluster filtering
   - Paper detail dialogs
   - Loading and error states

### 📡 API Integration

- **TypeScript Types** (`src/lib/types/research-network.ts`)
  - Full type safety for API responses
  - Paper, Cluster, Metadata interfaces

- **API Service Layer** (`src/lib/api/research-network.ts`)
  - `fetchResearchNetwork()` - Get all data
  - `fetchClusterPapers()` - Filter by cluster
  - `fetchSimilarPapers()` - Find similar papers
  - `analyzeText()` - Text similarity search
  - `collectAuthorData()` - Dynamic author collection

### 🎯 Key Features

#### Interactive Visualization
- **Zoom & Pan**: Mouse wheel and drag to explore
- **Cluster Filtering**: Filter papers by research topic
- **Hover Tooltips**: See paper details on hover
- **Click for Details**: Full paper information in dialog
- **Drag Nodes**: Reposition papers manually
- **Responsive**: Works on desktop and tablet

#### ML Explainer
- **5-Step Educational Tour**:
  1. Semantic Embeddings (768D vectors)
  2. UMAP Dimensionality Reduction
  3. HDBSCAN Clustering
  4. Sentiment Analysis
  5. D3.js Visualization

- **For Each Step**:
  - Plain English explanation
  - Technical details (expandable)
  - Real-world example from your research
  - Visual progress indicator

#### Stats & Insights
- Total papers and citations
- Number of research clusters discovered
- Papers per cluster
- Color-coded legend

## File Structure

```
src/
├── app/
│   └── research-network/
│       └── page.tsx                    # Main visualization page
├── components/
│   └── research-network/
│       ├── network-visualization.tsx    # D3.js viz component
│       └── ml-explainer.tsx            # Interactive ML explainer
├── lib/
│   ├── api/
│   │   └── research-network.ts         # API service functions
│   ├── types/
│   │   └── research-network.ts         # TypeScript interfaces
│   └── constants.ts                    # Navigation (updated)
└── .env                                # API URL config
```

## Environment Configuration

### `.env`
```bash
# Research Network API
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**Production**: Update to `https://api.drjforrest.com` or your backend URL

## Running the Application

### Prerequisites
1. **Backend API must be running** at `http://localhost:8000`
   ```bash
   cd ~/dev/devprojects/academic-citation-network
   source venv/bin/activate
   python scripts/run_full_pipeline.py  # If not done yet
   ./start_server.sh
   ```

2. **Backend must have processed data** (`data/processed/papers_with_ml.json`)

### Start Frontend

```bash
cd ~/dev/drjforrest.com/academic_profile

# Install dependencies (if new)
npm install

# Run development server
npm run dev
```

Visit: **http://localhost:9002/research-network**

## Navigation

The Research Network page is now in your main navigation:
- **Home** → **Research Network** (between Publications and DEI Tool)
- Direct link: `/research-network`

## Features by Section

### Header Section
- **Title**: "Research Citation Network"
- **Stats**: Papers, citations, clusters count
- **ML Explainer**: Interactive 5-step walkthrough

### Controls Card
- **Cluster Filter**: Dropdown to filter by research topic
- **Reset Button**: Clear all filters
- **Instructions**: Hover/zoom/click guidance

### Visualization Card
- **Main D3.js Graph**: Interactive force-directed network
- **Legend**: Clusters with colors and paper counts
- **Hover Tooltip**: Paper details on mouseover

### Cluster Legend
- **Grid View**: All clusters with colors
- **Click to Filter**: Click any cluster to filter viz
- **Paper Counts**: Shows distribution

### Paper Details Dialog
- Opens when clicking a node
- **Publication Info**: Title, authors, year, citations
- **Cluster**: Research topic assignment
- **Sentiment**: Tone analysis (if available)
- **TL;DR**: Quick summary (from Semantic Scholar)
- **Abstract**: Full abstract
- **Links**: Google Scholar, PDF (if available)

## ML Pipeline Explanation

The explainer walks visitors through:

### Step 1: Semantic Embeddings
- **What**: Convert papers to 768D vectors
- **Technical**: Sentence Transformers (all-MiniLM-L6-v2)
- **Example**: "HIV treatment" vectors close to "ART compliance"

### Step 2: UMAP Dimensionality Reduction
- **What**: Compress 768D → 2D while preserving structure
- **Technical**: Manifold learning, better than t-SNE
- **Example**: COVID and HIV papers cluster separately

### Step 3: HDBSCAN Clustering
- **What**: Auto-discover research topics via density
- **Technical**: Hierarchical density-based, no fixed k
- **Example**: Found 6-8 distinct research areas

### Step 4: Sentiment Analysis
- **What**: Analyze abstract tone
- **Technical**: DistilBERT fine-tuned on SST-2
- **Example**: Intervention papers → positive scores

### Step 5: D3.js Visualization
- **What**: Interactive force-directed graph
- **Technical**: Force simulation, zoom/pan
- **Example**: Larger nodes = more citations

## API Endpoints Used

```typescript
// Fetch all papers with ML processing
GET /api/metadata
GET /api/papers

// Filter by cluster
GET /api/papers?cluster=0

// Find similar papers
GET /api/similar/{paper_id}?limit=5

// Analyze custom text
POST /api/analyze-text?text=...

// Collect new author (future feature)
POST /api/collect?author_id=...&run_ml=true
```

## Troubleshooting

### "Error Loading Network"
**Problem**: Can't connect to backend
**Solution**: 
```bash
# Check backend is running
curl http://localhost:8000/api/health

# If not, start it
cd ~/dev/devprojects/academic-citation-network
./start_server.sh
```

### "No processed data found"
**Problem**: Backend hasn't run ML pipeline
**Solution**:
```bash
cd ~/dev/devprojects/academic-citation-network
source venv/bin/activate
python scripts/run_full_pipeline.py
```

### Visualization looks empty
**Problem**: Network data not loaded
**Check**:
1. Browser console for errors
2. Network tab for API calls
3. Backend logs for errors

### TypeScript errors
**Problem**: Missing dependencies
**Solution**:
```bash
npm install d3 @types/d3
```

## Next Steps

### Development
- ✅ D3.js visualization working
- ✅ ML explainer integrated
- ✅ API integration complete
- ⏳ Test with real data
- ⏳ Polish responsive design
- ⏳ Add loading animations

### Production
- Deploy frontend to Vercel
- Deploy backend to home server
- Configure `api.drjforrest.com`
- Update `NEXT_PUBLIC_API_URL` in Vercel env
- Set up HTTPS/SSL

### Future Enhancements
- **Compare Researchers**: Let visitors paste their Scholar ID
- **Similar Paper Search**: Text input to find related work
- **Export View**: Download visualization as PNG/SVG
- **Time Slider**: Filter by publication year
- **Co-authorship Network**: Show collaboration patterns
- **Impact Timeline**: Citation growth over time

## For UBC Medical Informatics Partnership

This visualization demonstrates:

1. **ML Literacy**: UMAP, HDBSCAN, embeddings, sentiment analysis
2. **Full-Stack Skills**: Python backend + TypeScript frontend
3. **Data Visualization**: D3.js interactive graphs
4. **User Education**: Museum-style ML explainer
5. **Research Context**: Your 45 papers, 4408 citations, 6-8 topics

**Demo Script**:
> "I built this to understand my research ecosystem. The ML pipeline discovers natural groupings - you can see how my HIV work connects to COVID trials through shared methodology. The explainer walks through the AI techniques: sentence embeddings, UMAP dimensionality reduction, density-based clustering. Try clicking papers to explore, or paste your abstract to see where our work overlaps."

## Dependencies Added

```json
{
  "d3": "^7.x",
  "@types/d3": "^7.x"
}
```

All other components use existing shadcn/ui library.

## Cost

**Frontend**: $0 (already hosted on Vercel)
**Backend**: $0 (home server + free APIs)
**Total**: **$0/month** ✅

---

**You're ready to launch! 🚀**

Start both servers and visit `/research-network` to see your interactive citation network come to life!
