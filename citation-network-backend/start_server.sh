#!/bin/bash
# Start the Research Network API server

cd "$(dirname "$0")"

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found"
    echo "📝 Please copy .env.example to .env and add your API keys"
    echo "   cp .env.example .env"
    echo "   nano .env"
    exit 1
fi

# Activate virtual environment
source venv/bin/activate

# Start server
echo "🚀 Starting Research Network API..."
echo "📡 API Docs: http://localhost:8000/api/docs"
echo "🏥 Health: http://localhost:8000/api/health"
echo ""
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
