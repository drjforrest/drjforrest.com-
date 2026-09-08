#!/bin/bash
# Forrest Insights frontend deploy → VPS
# Rsync source → ssh build → systemctl restart

set -e

SERVER_USER="admin"
SERVER_HOST="Contabo-admin"
SERVER_PATH="/var/www/forrest-insights"
SERVICE_NAME="forrest-frontend"
SERVICE_PORT="3005"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

info()  { echo -e "${GREEN}[INFO]${NC} $1"; }
warn()  { echo -e "${YELLOW}[WARN]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; }

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

if [ ! -f "$PROJECT_ROOT/package.json" ]; then
	error "package.json not found at $PROJECT_ROOT"
	exit 1
fi

info "Stopping ${SERVICE_NAME} before rsync (prevents file-swap-during-run)"
ssh "${SERVER_USER}@${SERVER_HOST}" "
	sudo systemctl stop ${SERVICE_NAME} || true
	# kill any stragglers still bound to our port (e.g., detached children
	# from a previous run that escaped the cgroup)
	stragglers=\$(sudo ss -ltnpH 'sport = :${SERVICE_PORT}' | grep -oE 'pid=[0-9]+' | cut -d= -f2 | sort -u)
	if [ -n \"\$stragglers\" ]; then
		echo \"killing stragglers on :${SERVICE_PORT}: \$stragglers\"
		echo \"\$stragglers\" | xargs -r sudo kill -TERM || true
		sleep 2
		echo \"\$stragglers\" | xargs -r sudo kill -KILL 2>/dev/null || true
	fi
	sudo systemctl reset-failed ${SERVICE_NAME} || true
"

info "Syncing source → ${SERVER_HOST}:${SERVER_PATH}"
rsync -avz --delete \
	-e "ssh -o Ciphers=aes256-gcm@openssh.com" \
	--exclude '.git' \
	--exclude 'node_modules' \
	--exclude '.next' \
	--exclude '.env' \
	--exclude '.env.local' \
	--exclude '.DS_Store' \
	--exclude '*.log' \
	--exclude 'citation-network-backend/venv' \
	--exclude 'citation-network-backend/.venv' \
	--exclude 'citation-network-backend/data/raw/*' \
	--exclude 'citation-network-backend/data/processed/*' \
	--exclude 'tsconfig.tsbuildinfo' \
	"$PROJECT_ROOT/" "${SERVER_USER}@${SERVER_HOST}:${SERVER_PATH}/"

if [ -f "$PROJECT_ROOT/deploy/.env.production" ]; then
	info "Copying .env.production → server"
	scp -o Ciphers=aes256-gcm@openssh.com \
		"$PROJECT_ROOT/deploy/.env.production" \
		"${SERVER_USER}@${SERVER_HOST}:${SERVER_PATH}/.env"
else
	warn "deploy/.env.production missing — using existing .env on server"
fi

info "Installing deps + building on server"
# Note: we deliberately do NOT run 'npm prune --omit=dev' after build.
# 'typescript' is a devDependency, and 'next start' will auto-install it at
# runtime if missing — that install thrashes node_modules while next-server
# is starting and can spawn detached children that squat on the port.
ssh "${SERVER_USER}@${SERVER_HOST}" "
	set -e
	cd ${SERVER_PATH}
	echo '→ npm ci (including devDeps so typescript stays resident)'
	npm ci
	echo '→ next build'
	NODE_ENV=production npm run build
	echo '→ start ${SERVICE_NAME}'
	sudo systemctl start ${SERVICE_NAME}
	sleep 3
	sudo systemctl status ${SERVICE_NAME} --no-pager -l | head -20
	echo '→ verifying port ${SERVICE_PORT} is bound'
	sudo ss -ltnp | grep :${SERVICE_PORT} || (echo 'FATAL: nothing listening on :${SERVICE_PORT}'; exit 1)
"

info "Deployed. Visit https://drjforrest.com"
info "Logs: ssh ${SERVER_HOST} 'sudo journalctl -u ${SERVICE_NAME} -f'"
