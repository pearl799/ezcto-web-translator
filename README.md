# EZCTO — AI Web Translator & API Gateway

> Translate any website into AI-friendly structured JSON. Built for OpenClaw agents and the EZCTO ecosystem.

## What's in this repo

```
ezcto-monorepo/
├── skill/      ← OpenClaw Skill: web page translator for AI agents
└── worker/     ← Cloudflare Worker: translation asset library API + content negotiation
```

### `skill/` — OpenClaw Web Translator

An AI Agent skill that converts any website HTML into structured JSON — without screenshots or multimodal processing. **80%+ token savings**.

- ✅ Cache-first: checks EZCTO asset library before translating (0 tokens if cached)
- ✅ Zero-token site detection: auto-detects crypto/ecommerce/restaurant sites
- ✅ Community-powered: your translations are shared back to the library
- ✅ OpenClaw-native: triggers, tool dependencies, agent suggestions all built-in

→ [Full docs](./skill/README.md)

### `worker/` — Cloudflare Worker API Gateway

The Worker deployed at `api.ezcto.fun` that powers:
- **Translation asset library**: community cache of web translations
- **Content negotiation**: serves AI-friendly Markdown/JSON for EZCTO-generated sites

→ [Full docs](./worker/README.md)

## Quick Start

### Use the Skill (OpenClaw)

```bash
# Copy the skill into your OpenClaw skills directory
cp -r skill ~/.openclaw/skills/ezcto-web-translator

# In OpenClaw chat:
# "Translate https://pump.fun"
```

### Deploy the Worker (Cloudflare)

```bash
cd worker
npm install
# Configure wrangler.toml with your KV namespace ID
npm run dev       # Local test
npm run deploy    # Deploy to Cloudflare
```

## How the community library works

1. You translate a new site → result is automatically contributed to `api.ezcto.fun`
2. Next time anyone needs that site → they get it instantly (0 tokens)
3. Over time, the library grows → cache hit rate increases → cost approaches zero

This is the **Web Translation Commons** — every contribution makes AI web access faster and cheaper for everyone.

## License

MIT — see [LICENSE](./LICENSE)
