# $ZYRA — Token landing & chat

One-page site for the $ZYRA token (Pump Fun). Chat with Zyra, see contract, fees, and tokenized agent info.

## Deploy on Vercel

1. Push this folder to a repo or import into Vercel.
2. In Vercel project **Settings → Environment Variables** add (optional, for live chat):
   - `OPENCLAW_GATEWAY_URL` — e.g. `https://your-gateway.example.com`
   - `OPENCLAW_GATEWAY_TOKEN` — gateway auth token
3. Deploy. The app uses the Next.js build.

## Replace contract address

In `app/page.tsx`, set `CONTRACT_PLACEHOLDER` to your Pump Fun mint address (Solana base58) when the token is launched.

## Avatar & video

The 3D avatar is loaded from [incryptX/public/avatars](https://github.com/GHX5T-SOL/incryptX/tree/main/public/avatars) (Ready Player Me). To use a greeting video instead (or above the chat), add a `<video>` in `app/page.tsx` (e.g. in the hero) with `autoPlay loop muted playsInline` and your video URL. If the GLB fails to load (CORS), host `incrypt_ai_avatar.glb` on your own domain and update `components/AvatarScene.tsx` (GLB_URL).

## Local

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).
