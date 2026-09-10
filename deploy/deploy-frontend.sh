#!/bin/bash
# Forrest Insights frontend deploy → VPS
# Rsync source → ssh build → systemctl restart

set -e

SERVER_USER="admin"
SERVER_HOST="Contabo-vps6"
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
	--exclude '.DS_Store' \
	--exclude '*.log' \
	--exclude 'citation-network-backend/venv' \
	--exclude 'citation-network-backend/.venv' \
	--exclude 'citation-network-backend/data/raw/*' \
	--exclude 'citation-network-backend/data/processed/*' \
	--exclude 'tsconfig.tsbuildinfo' \
	--exclude 'content/radar-downloads/*.dmg' \
	"$PROJECT_ROOT/" "${SERVER_USER}@${SERVER_HOST}:${SERVER_PATH}/"

RADAR_DMGS=("$PROJECT_ROOT"/content/radar-downloads/*.dmg)
if [ -e "${RADAR_DMGS[0]}" ]; then
	info "Copying Radar installer(s) → server (rsync excludes .dmg)"
	ssh "${SERVER_USER}@${SERVER_HOST}" "mkdir -p ${SERVER_PATH}/content/radar-downloads"
	scp -o Ciphers=aes256-gcm@openssh.com \
		"${RADAR_DMGS[@]}" \
		"${SERVER_USER}@${SERVER_HOST}:${SERVER_PATH}/content/radar-downloads/"
else
	warn "No Radar .dmg in content/radar-downloads — portal will show 'no installer'"
fi

# systemd EnvironmentFile is .env. Start from deploy/.env.production (PORT,
# NODE_ENV, RADAR_PORTAL_SECURE, …) then fill any empty keys from .env.local
# so local secrets (e.g. BIBLIOGRAPHY_ACCESS_CODE) reach the VPS without
# overwriting production-only settings.
ENV_TMP="$(mktemp)"
trap 'rm -f "$ENV_TMP"' EXIT
if [ -f "$PROJECT_ROOT/deploy/.env.production" ]; then
	cp "$PROJECT_ROOT/deploy/.env.production" "$ENV_TMP"
else
	warn "deploy/.env.production missing — building .env from .env.local"
	: > "$ENV_TMP"
fi

if [ -f "$PROJECT_ROOT/.env.local" ]; then
	info "Merging .env.local into server .env (fills empty keys only)"
	python3 - "$ENV_TMP" "$PROJECT_ROOT/.env.local" << 'PY'
import sys
from pathlib import Path

def parse(text: str) -> dict[str, str]:
    env: dict[str, str] = {}
    for line in text.splitlines():
        s = line.strip()
        if not s or s.startswith("#") or "=" not in s:
            continue
        key, _, value = s.partition("=")
        env[key] = value
    return env

dest_path = Path(sys.argv[1])
local_env = parse(Path(sys.argv[2]).read_text())
original = dest_path.read_text() if dest_path.stat().st_size else ""
dest_env = parse(original)

filled: list[str] = []
for key, value in local_env.items():
    if value == "":
        continue
    if dest_env.get(key, "") == "":
        dest_env[key] = value
        filled.append(key)

# Keep process settings that must not come from local dev.
dest_env["NODE_ENV"] = "production"
dest_env["PORT"] = "3005"
dest_env["HOSTNAME"] = "127.0.0.1"
dest_env["RADAR_PORTAL_SECURE"] = "1"

out: list[str] = []
seen: set[str] = set()
for line in original.splitlines():
    s = line.strip()
    if s and not s.startswith("#") and "=" in s:
        key, _, _ = s.partition("=")
        out.append(f"{key}={dest_env[key]}")
        seen.add(key)
    else:
        out.append(line)
for key, value in dest_env.items():
    if key not in seen:
        out.append(f"{key}={value}")
dest_path.write_text("\n".join(out) + "\n")
print("filled:", ", ".join(filled) if filled else "(none)")
PY
else
	warn ".env.local missing — server .env will not get local secrets overlay"
fi

info "Copying merged .env → server"
scp -o Ciphers=aes256-gcm@openssh.com \
	"$ENV_TMP" \
	"${SERVER_USER}@${SERVER_HOST}:${SERVER_PATH}/.env"

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
