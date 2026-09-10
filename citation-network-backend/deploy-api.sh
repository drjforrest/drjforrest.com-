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
SERVER_HOST="Contabo-vps6"
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

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

if [ ! -d "app" ] || [ ! -f "requirements.txt" ]; then
    print_error "Run this from citation-network-backend (app/ and requirements.txt required)"
    exit 1
fi

print_status "Preparing backend for deployment to ${SERVER_HOST}..."

# Check if production .env exists
if [ ! -f ".env.production" ]; then
    print_warning ".env.production not found - will use existing .env on server or create new"
fi

print_status "Ensuring ${SERVER_PATH} exists on ${SERVER_HOST}"
ssh "${SERVER_USER}@${SERVER_HOST}" "sudo mkdir -p ${SERVER_PATH} && sudo chown -R ${SERVER_USER}:${SERVER_USER} /var/www/citation-network"

UNIT_SRC="$(cd "$SCRIPT_DIR/.." && pwd)/deploy/citation-network.service"
if [ -f "$UNIT_SRC" ]; then
    print_status "Installing systemd unit citation-network.service"
    scp -o Ciphers=aes256-gcm@openssh.com "$UNIT_SRC" "${SERVER_USER}@${SERVER_HOST}:/tmp/citation-network.service"
    ssh "${SERVER_USER}@${SERVER_HOST}" '
        sudo mv /tmp/citation-network.service /etc/systemd/system/citation-network.service
        sudo systemctl daemon-reload
        sudo systemctl enable citation-network
    '
fi

print_status "Syncing source → ${SERVER_HOST}:${SERVER_PATH}"
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
print_status "  - API (internal): http://127.0.0.1:8001"
print_status "  - Health: ssh ${SERVER_HOST} 'curl -sS http://127.0.0.1:8001/api/health'"
print_status "  - Via site: https://drjforrest.com/citation-api/api/health"
print_status ""
print_status "Monitor logs:"
print_status "  ssh ${SERVER_USER}@${SERVER_HOST} \"sudo journalctl -u citation-network -f\""
print_status ""
print_status "🎉 Deployment complete!"
