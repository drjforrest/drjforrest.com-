# Deployment Guide

## Backend API Deployment (Mac Mini)

### Prerequisites
1. Ensure `~/production/academic-citation-network-api` directory exists on mac-mini
2. SSH access to mac-mini configured
3. Python 3.12 installed on mac-mini

### Deploy Backend

```bash
cd /Users/drjforrest/dev/devprojects/academic-citation-network
./deploy-api.sh
```

The script will:
- Rsync code to mac-mini
- Install dependencies in a venv
- Start the FastAPI server on port **8700**
- API will be available at: `http://localhost:8700`
- API docs at: `http://localhost:8700/docs`

### After First Deployment

1. **Configure .env on server** (if needed):
```bash
ssh jforrest@mac-mini
cd ~/production/academic-citation-network-api
nano .env
# Update API keys: SERPAPI_KEY, DEEPSEEK_API_KEY, OPENAI_API_KEY
```

2. **Generate initial network data**:
```bash
ssh jforrest@mac-mini
cd ~/production/academic-citation-network-api
source venv/bin/activate
python scripts/run_full_pipeline.py
```

3. **Set up Apache reverse proxy** (if not already configured):
```bash
# Add vhost for api.drjforrest.com or similar
# ProxyPass / http://localhost:8700/
```

### Monitor Logs

```bash
ssh jforrest@mac-mini 'tail -f ~/production/academic-citation-network-api/academic_citation_network_api.log'
```

### Restart Service

```bash
ssh jforrest@mac-mini
cd ~/production/academic-citation-network-api
pkill -f 'uvicorn.*8700'
source venv/bin/activate
nohup python -m uvicorn app.main:app --host 0.0.0.0 --port 8700 > academic_citation_network_api.log 2>&1 &
```

---

## Frontend Deployment (Vercel)

### Prerequisites
1. Vercel CLI installed: `npm i -g vercel`
2. Logged in to Vercel: `vercel login`
3. Update `NEXT_PUBLIC_API_URL` in frontend

### Update API URL

Edit `src/lib/api/research-network.ts` or set environment variable in Vercel:

```bash
# In Vercel dashboard or via CLI:
vercel env add NEXT_PUBLIC_API_URL
# Enter: https://api.drjforrest.com (or your production API URL)
```

### Deploy to Vercel

```bash
cd /Users/drjforrest/dev/drjforrest.com/academic_profile
vercel deploy --prod
```

That's it! Vercel will:
- Build the Next.js app
- Deploy to production
- Provide the production URL

---

## Full Deployment Checklist

- [ ] Backend: Run `./deploy-api.sh` from backend directory
- [ ] Backend: Verify API is running at `http://localhost:8700/docs`
- [ ] Backend: Configure Apache reverse proxy (if needed)
- [ ] Backend: Generate initial network data
- [ ] Frontend: Update `NEXT_PUBLIC_API_URL` to production API
- [ ] Frontend: Run `vercel deploy --prod`
- [ ] Test: Visit frontend and verify network loads
- [ ] Test: Try generating network for another scholar

---

## API Endpoints (Production)

- `GET /api/research-network` - Get default network data
- `POST /api/generate-network?author_id=SCHOLAR_ID` - Generate any scholar's network
- `GET /api/papers` - List all papers
- `GET /api/clusters` - List all clusters
- `GET /docs` - Interactive API documentation

---

## Troubleshooting

### Backend not responding
```bash
ssh jforrest@mac-mini
cd ~/production/academic-citation-network-api
tail -f academic_citation_network_api.log
```

### Port 8700 already in use
```bash
ssh jforrest@mac-mini
lsof -ti:8700 | xargs kill -9
```

### Frontend can't reach API
1. Check CORS settings in backend `.env`
2. Verify `ALLOWED_ORIGINS` includes your frontend domain
3. Check API URL in frontend environment variables

### LLM labels not generating
1. Check `DEEPSEEK_API_KEY` and `OPENAI_API_KEY` in backend `.env`
2. Will fallback to simple word-frequency labels if APIs fail
