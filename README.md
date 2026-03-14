# $ZYRA — Token landing & chat

One-page site for the $ZYRA token (Pump Fun). Chat with Zyra; see contract, fees, tokenized agent info.

## Deploy on Vercel (two options)

### Option A — Standalone repo (recommended: no root directory)

1. **Create a new repo** on GitHub: [New repository](https://github.com/new), name e.g. **zyra-token-site**, leave it empty (no README).
2. **Push the token-site-only branch into it as `main`:**
   ```bash
   cd /Users/mx/zyra   # or wherever you cloned zyra
   git push https://github.com/GHX5T-SOL/zyra-token-site.git zyra-token-site-only:main
   ```
   That branch has **only** the token site at repo root, so you don’t set Root Directory.
3. In **Vercel** → Import **zyra-token-site**. The root is the Next.js app; deploy.

### Option B — From main zyra repo

1. In **Vercel** → Import **GHX5T-SOL/zyra**.
2. Set **Root Directory** to: **`zyra-token-site`** (type it; it’s the folder name in the repo).
3. Deploy.

---

## Make the chat work (live Zyra)

For users to actually chat with Zyra (AI), do the following.

### 1. Expose the OpenClaw gateway publicly

The gateway runs on your server at `http://127.0.0.1:18789`. Vercel must be able to call it.

- **If you use Cloudflare Tunnel:** Add a public hostname, e.g. `gateway.zyra.incrypt.network` → `http://127.0.0.1:18789`.
- **Or use ngrok:** `ngrok http 18789` and use the HTTPS URL.

### 2. Enable the HTTP chat endpoint on the gateway

On the server:

```bash
# Edit openclaw.json: under "gateway" add:
# "http": { "endpoints": { "chatCompletions": { "enabled": true } } }
# Then:
systemctl --user restart openclaw-gateway
```

### 3. Set Vercel environment variables

In the Vercel project → **Settings → Environment Variables**:

| Name | Value |
|------|--------|
| `OPENCLAW_GATEWAY_URL` | Your public gateway URL, e.g. `https://gateway.zyra.incrypt.network` (no trailing slash) |
| `OPENCLAW_GATEWAY_TOKEN` | The gateway auth token from `~/.openclaw/openclaw.json` → `gateway.auth.token` |

Redeploy the project so the new env vars are used. Chat will then proxy to Zyra.

---

## Replace contract address

In `app/page.tsx`, set `CONTRACT_PLACEHOLDER` to your Pump Fun mint address (Solana base58) when the token is launched.

## Avatar

3D avatar from [incryptX/public/avatars](https://github.com/GHX5T-SOL/incryptX/tree/main/public/avatars). To use a video instead, add a `<video autoPlay loop muted playsInline src="…" />` in the hero in `app/page.tsx`.

## Local

```bash
npm install
npm run dev
```

Open http://localhost:3000. For local chat, create `.env.local` with `OPENCLAW_GATEWAY_URL` and `OPENCLAW_GATEWAY_TOKEN` (and ensure the gateway is reachable from your machine).
