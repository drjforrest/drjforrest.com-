# Cloudflare Zero Trust Setup

## DNS Record to Add in Vercel

Go to your **Vercel dashboard** → **drjforrest.com** → **Settings** → **Domains**

Add this DNS record:

```
Type: CNAME
Name: api
Value: <your-tunnel-id>.cfargotunnel.com
TTL: Auto
```

**OR** if Vercel doesn't show the tunnel yet, you can point it directly to Cloudflare:

```
Type: CNAME  
Name: api
Value: api.drjforrest.com.cdn.cloudflare.net
TTL: Auto
```

## Cloudflare Zero Trust Configuration

### 1. Create Tunnel in Zero Trust UI

1. Go to **Cloudflare Zero Trust** dashboard
2. Navigate to **Access** → **Tunnels**
3. Click **Create a tunnel**
4. Name it: `research-network-api`
5. Install connector on mac-mini (follow their instructions)

### 2. Configure Public Hostname

In your tunnel configuration, add:

```
Public Hostname:
- Subdomain: api
- Domain: drjforrest.com  
- Type: HTTP
- URL: localhost:8700
```

### 3. Save and Deploy

The tunnel will automatically:
- Create the DNS record (if using Cloudflare nameservers)
- Handle SSL certificates
- Proxy traffic to your mac-mini:8700

## Backend CORS Configuration

✅ **Already configured!** The backend now allows:
- `https://drjforrest.com`
- `https://www.drjforrest.com`  
- `https://api.drjforrest.com`
- Local development ports

## Frontend Configuration

Update the API URL in your frontend:

### For Vercel Deployment:

1. **In Vercel Dashboard**:
   - Go to your project → Settings → Environment Variables
   - Add: `NEXT_PUBLIC_API_URL` = `https://api.drjforrest.com`

2. **Or in code** (`src/lib/api/research-network.ts`):
```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
```

## Testing

Once tunnel is running:

1. **Test API directly**:
   ```bash
   curl https://api.drjforrest.com/
   curl https://api.drjforrest.com/api/health
   ```

2. **Test API docs**:
   - Visit: https://api.drjforrest.com/api/docs

3. **Test from frontend**:
   - Deploy frontend with new API_URL
   - Visit https://drjforrest.com/research-network
   - Should load your research network

## Tunnel Service (Keep it Running)

On mac-mini, the Cloudflare connector should run as a service. If you installed via their UI, it's already configured as a launchd service.

To check status:
```bash
sudo launchctl list | grep cloudflared
```

To view logs:
```bash
sudo tail -f /Library/Logs/cloudflared.log
```

## Summary

✅ CORS configured for `https://api.drjforrest.com`  
✅ Backend ready on port 8700  
✅ DNS: Add CNAME `api` → `<tunnel>.cfargotunnel.com` in Vercel  
✅ Cloudflare: Point `api.drjforrest.com` → `localhost:8700`  
✅ Frontend: Set `NEXT_PUBLIC_API_URL=https://api.drjforrest.com`  

Your API will be at: **https://api.drjforrest.com**
