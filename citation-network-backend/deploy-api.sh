#!/bin/bash

# Academic Citation Network API Production Deployment Script
# Deploys FastAPI backend to VPS production server
# Backend on port 8001

set -e

echo "🔍 Academic Citation Network API Deployment"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
SERVER_USER="admin"
SERVER_HOST="Contabo-admin"
SERVER_PATH="/var/www/citation-network/app"
BACKEND_PORT="8001"

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we are in the right directory
if [ ! -f "README.md" ]; then
    print_error "This script should be run from the academic-citation-network project root directory"
    exit 1
fi

# Validate project structure
if [ ! -d "app" ]; then
    print_error "app directory not found"
    exit 1
fi

if [ ! -f "requirements.txt" ]; then
    print_error "requirements.txt not found"
    exit 1
fi

print_status "Preparing backend for deployment..."

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Check if production .env exists
if [ ! -f ".env.production" ]; then
    print_warning ".env.production not found - will use existing .env on server or create new"
fi

print_status "📤 Syncing local changes to production..."
rsync -avz -e "ssh -o Ciphers=aes256-gcm@openssh.com" \
    --exclude='.git' \
    --exclude='node_modules' \
    --exclude='venv' \
    --exclude='.venv' \
    --exclude='logs' \
    --exclude='*.log' \
    --exclude='__pycache__' \
    --exclude='*.pyc' \
    --exclude='.env' \
    --exclude='.env.local' \
    --exclude='data/cache' \
    --exclude='data/raw' \
    --exclude='.DS_Store' \
    "$SCRIPT_DIR/" ${SERVER_USER}@${SERVER_HOST}:${SERVER_PATH}/

# Copy production environment file if it exists
if [ -f ".env.production" ]; then
    print_status "Copying production .env file..."
    scp -o Ciphers=aes256-gcm@openssh.com .env.production ${SERVER_USER}@${SERVER_HOST}:${SERVER_PATH}/.env
    print_status "✓ Production .env file copied"
else
    print_warning "⚠ No .env.production file found - using existing .env on server"
fi

print_status "Setting up production environment and restarting services..."
ssh ${SERVER_USER}@${SERVER_HOST} "
    cd ${SERVER_PATH}

    # Ensure Python 3.12 is available
    echo \"Checking Python version....\"
    if command -v python3.12 &> /dev/null; then
        PYTHON_CMD=\"python3.12\"
        echo \"✓ Using Python 3.12\"
    elif python3 --version | grep -q \"3.12\"; then
        PYTHON_CMD=\"python3\"
        echo \"✓ Using Python 3.12 via python3\"
    else
        echo \"⚠ Python 3.12 not found, using system python3\"
        PYTHON_CMD=\"python3\"
    fi

    # Install/update backend dependencies
    echo \"Setting up backend environment...\"
    \\$PYTHON_CMD -m venv .venv 2>/dev/null || true
    source .venv/bin/activate

    echo \"Installing backend dependencies...\"
    pip install --upgrade pip
    pip install -r requirements.txt

    # Check if .env exists
    if [ ! -f .env ]; then
        echo \"⚠ No .env file found - creating from .env.example\"
        if [ -f .env.example ]; then
            cp .env.example .env
            echo \"✓ Created .env from .env.example - PLEASE UPDATE with production values\"
        else
            echo \"✗ ERROR: No .env or .env.example found\"
        fi
    fi

    # Create necessary directories
    mkdir -p data/cache
    mkdir -p data/processed

    # Restart systemd service
    echo \"Restarting citation-network service...\"
    sudo systemctl restart citation-network
    sudo systemctl enable citation-network

    echo \"\"
    echo \"✓ Service restarted successfully\"
    echo \"\"
    echo \"Status:\"
    sudo systemctl status citation-network --no-pager -l || true
"

print_status "Academic Citation Network API has been deployed to production server!"
print_status ""
print_status "Configuration:"
print_status "  - Server: ${SERVER_HOST}"
print_status "  - Path: ${SERVER_PATH}"
print_status "  - Port: ${BACKEND_PORT}"
print_status "  - API: https://citation-network.drjforrest.com"
print_status "  - Docs: https://citation-network.drjforrest.com/docs"
print_status ""
print_status "Monitor logs:"
print_status "  ssh ${SERVER_USER}@${SERVER_HOST} \"sudo journalctl -u citation-network -f\""
print_status ""
print_status "🎉 Deployment complete!"
