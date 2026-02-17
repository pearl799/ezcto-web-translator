# EZCTO API Gateway — Cloudflare Worker

> Cloudflare Worker for EZCTO: Translation Asset Library API + Generated Site Content Negotiation

## What it does

This Worker handles two core responsibilities:

**A. Translation Asset Library API** (`api.ezcto.fun`)
- `GET /v1/translate?url=` — Query community translation cache (free, unlimited)
- `POST /v1/contribute` — Contribute a translation back to the community (free)
- `POST /v1/translate-server` — Server-side translation (paid, API key required)
- `POST /v1/refresh` — Force refresh a cached translation (paid, 3x quota)

**B. Generated Site Content Negotiation** (`{subdomain}.ezcto.fun`)
- Returns `index.html` for browsers
- Returns `content.md` when `Accept: text/markdown` (AI agents)
- Returns `schema.json` when `Accept: application/json` (structured data)
- Serves static assets from Cloudflare R2

## Project Structure

```
worker/
├── wrangler.toml               ← Cloudflare config (R2/KV/routes)
├── package.json
├── tsconfig.json
├── .dev.vars                   ← Local env vars (not committed)
└── src/
    ├── index.ts                ← Main router
    ├── types.ts                ← TypeScript types
    ├── api/
    │   ├── translate.ts        ← GET /v1/translate
    │   ├── contribute.ts       ← POST /v1/contribute
    │   ├── server-translate.ts ← POST /v1/translate-server
    │   └── refresh.ts          ← POST /v1/refresh
    ├── content-negotiation/
    │   └── handler.ts          ← Subdomain content negotiation
    └── utils/
        ├── cors.ts             ← CORS headers
        ├── response.ts         ← Unified response helpers
        └── trpc.ts             ← tRPC proxy (unwrap result.data.json)
```

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create KV Namespace

```bash
wrangler kv namespace create SLUG_KV
# Copy the output ID into wrangler.toml
```

### 3. Configure wrangler.toml

Replace the placeholder values in `wrangler.toml`:

```toml
[[kv_namespaces]]
binding = "SLUG_KV"
id = "your-actual-kv-namespace-id"       # ← paste here
preview_id = "your-preview-kv-id"        # ← paste here (can be same)
```

### 4. Create local env file

```bash
cp .dev.vars.example .dev.vars
# Edit .dev.vars to point BACKEND_URL to your local EZCTO backend
```

### 5. Run locally

```bash
npm run dev
# Worker available at http://localhost:8787
```

## Deployment

```bash
npm run deploy
```

Then configure DNS in your Cloudflare dashboard:
- `api.ezcto.fun` → Worker Route
- `*.ezcto.fun` → Worker Route

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `BACKEND_URL` | EZCTO 2.0 backend URL | `https://ezcto.fun` |
| `CUSTOM_DOMAIN` | Root domain | `ezcto.fun` |

## API Examples

### Query translation cache
```bash
curl "https://api.ezcto.fun/v1/translate?url=https://pump.fun"
```

### Contribute a translation
```bash
curl -X POST "https://api.ezcto.fun/v1/contribute" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "html_hash": "<sha256-of-html>",
    "structured_data": { ... },
    "contributor_id": "your-id"
  }'
```

### Request AI-friendly content (from an agent)
```bash
# Get Markdown version of a generated site
curl "https://mytoken.ezcto.fun" -H "Accept: text/markdown"

# Get JSON schema
curl "https://mytoken.ezcto.fun" -H "Accept: application/json"
```

## Architecture

The Worker acts as a **lightweight proxy layer** between clients and the EZCTO 2.0 backend (Express + tRPC). It handles:
- REST → tRPC format conversion
- tRPC response unwrapping (`result.data.json`)
- CORS headers for all endpoints
- Input validation before forwarding to backend
- Graceful degradation when backend is unavailable

## License

MIT
