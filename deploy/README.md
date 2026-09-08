# VPS Deployment

Moves the Next.js frontend from Vercel onto the Contabo VPS, joining the FastAPI citation-network backend already there.

## Architecture (post-cutover)

```
Internet ──► Caddy (443) ──► drjforrest.com / www ──► localhost:3005  (Next.js, systemd: forrest-frontend)
                          └► citation-network.drjforrest.com ──► localhost:8001 (FastAPI, systemd: citation-network)
```

All three components live on the same VPS (`Contabo-admin`, hostname `vmi3089488`).

## What's in this directory

| File | Purpose |
| --- | --- |
| `forrest-frontend.service` | systemd unit for `next start` on port 3005 |
| `Caddyfile.snippet` | Caddy site block for `drjforrest.com` / `www.drjforrest.com` |
| `deploy-frontend.sh` | Rsync source → SSH build → restart service |
| `.env.production.example` | Template for VPS env vars — copy to `.env.production` (gitignored) |

## One-time VPS setup

Run these once per VPS (not on every deploy).

```bash
ssh Contabo-admin
sudo mkdir -p /var/www/forrest-insights
sudo chown admin:admin /var/www/forrest-insights
exit
```

Install the systemd unit:

```bash
scp deploy/forrest-frontend.service Contabo-admin:/tmp/
ssh Contabo-admin '
  sudo mv /tmp/forrest-frontend.service /etc/systemd/system/
  sudo systemctl daemon-reload
  sudo systemctl enable forrest-frontend
'
```

Add the Caddy block. The contents of `Caddyfile.snippet` should be appended to `/etc/caddy/Caddyfile`:

```bash
ssh Contabo-admin '
  sudo cp /etc/caddy/Caddyfile /etc/caddy/Caddyfile.bak.$(date +%Y%m%d-%H%M%S)
  cat | sudo tee -a /etc/caddy/Caddyfile
' < deploy/Caddyfile.snippet
ssh Contabo-admin 'sudo caddy validate --config /etc/caddy/Caddyfile && sudo systemctl reload caddy'
```

Create the production env file locally and keep it out of git:

```bash
cp deploy/.env.production.example deploy/.env.production
# edit deploy/.env.production with real values
```

## Deploying

```bash
./deploy/deploy-frontend.sh
```

What it does:

1. rsync source to `/var/www/forrest-insights` (skips `node_modules`, `.next`, `.env*`, `*.log`, the backend venv and data dirs)
2. scp `deploy/.env.production` → `/var/www/forrest-insights/.env`
3. SSH in: `npm ci`, `npm run build`, `npm prune --omit=dev`
4. `sudo systemctl restart forrest-frontend`

## Cutover from Vercel — recommended sequence

1. **Stand up the VPS version on a preview host** before touching DNS. Add a temporary block to the Caddyfile for `preview.drjforrest.com` → `localhost:3005` and verify the site works end-to-end (Genkit calls, citation-network API, all pages).
2. **Lower TTL on DNS** for `drjforrest.com` to 5 min, ~24h before cutover, so rollback is fast.
3. **Update DNS** at the registrar: `drjforrest.com` A record → VPS IP; `www` CNAME → `drjforrest.com`. Remove the Vercel records.
4. **Caddy will provision TLS** automatically on first hit. Watch `journalctl -u caddy -f` for the cert issue.
5. **Verify**: home page loads, `/api/...` routes hit the right thing, citation network visualization renders, Genkit AI calls work.
6. **Disable Vercel project** (don't delete yet — keeps rollback option open for a week).
7. **Remove `deployDomain.sh`** (the old Vercel deploy script) once you're confident — currently still in repo root.
8. **Enable HSTS** in the Caddyfile snippet (commented out) after a few days of clean operation.

## Rollback

If something goes wrong after DNS cutover:
- Re-point DNS back to Vercel (TTL was lowered for this reason)
- The Vercel project still works; nothing was destroyed

If the VPS service crashes:
```bash
ssh Contabo-admin 'sudo systemctl status forrest-frontend; sudo journalctl -u forrest-frontend -n 100'
```

## Things to know

- **Cloudflare in front?** If `drjforrest.com` is proxied through Cloudflare, set the SSL/TLS mode to **Full (strict)** so Cloudflare → Caddy stays TLS. Caddy will still issue a Let's Encrypt cert via the HTTP-01 challenge (Cloudflare must be in "DNS only" / grey-cloud during issuance, or use DNS-01).
- **Image optimization** runs on the VPS now. If memory pressure shows up, consider adding the Sharp resize cache to a volume.
- **Build memory**: `next build` can spike to 1–2 GB on a project this size. The VPS has plenty, but if you hit OOM, add `NODE_OPTIONS=--max-old-space-size=2048` to the build step.
- **Backend coexistence**: the citation-network backend is unaffected — it keeps its own deploy script (`citation-network-backend/deploy-api.sh`). The two services are independent.
