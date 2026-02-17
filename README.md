# EZCTO Web Translator — OpenClaw Skill

> Translate any website into AI-friendly structured JSON. Built for [OpenClaw](https://openclaw.ai) agents.
> No screenshots. No multimodal. **80%+ token savings.**

## How it works

1. **Check cache first** — queries `api.ezcto.fun` (community asset library, already deployed)
2. **Cache hit** → returns structured JSON instantly, **0 tokens**
3. **Cache miss** → translates locally with your LLM, contributes result back to the library
4. **Everyone benefits** — every contribution makes the cache more complete over time

## Quick Start

```bash
# Copy into your OpenClaw skills directory
cp -r skill/ ~/.openclaw/skills/ezcto-web-translator
```

Then in OpenClaw chat:

```
Translate https://pump.fun
```

OpenClaw will automatically invoke this skill when you ask it to translate or understand a webpage.

## Public API (no setup required)

The translation asset library is hosted at **`api.ezcto.fun`** — a public, always-on endpoint operated by the EZCTO team. Skill users do not need to deploy or configure anything.

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/v1/translate?url=` | GET | None | Query community cache (free, unlimited) |
| `/v1/contribute` | POST | None | Contribute a translation (free) |
| `/v1/translate-server` | POST | API Key | Server-side translation (paid) |
| `/v1/refresh` | POST | API Key | Force refresh a cached page (paid, 3x quota) |

Get an API key at [ezcto.fun/api-keys](https://ezcto.fun/api-keys).

## File Structure

```
skill/
├── SKILL.md                          ← OpenClaw reads this (core workflow)
├── QUICKSTART.md                     ← 5-minute setup guide
├── references/
│   ├── translate-prompt.md           ← LLM translation prompt
│   ├── output-schema.md              ← JSON output schema
│   ├── site-type-detection.md        ← Zero-token site type detection
│   ├── openclaw-integration.md       ← OpenClaw integration details
│   └── extensions/
│       ├── crypto-fields.md          ← Crypto/Web3 extraction
│       ├── ecommerce-fields.md       ← E-commerce extraction
│       └── restaurant-fields.md      ← Restaurant extraction
└── examples/
    └── openclaw-output-example.json  ← Full output example
```

## Community Library

Every translation you make is automatically contributed back to `api.ezcto.fun`. The library grows with every user — over time, most popular sites are cached and cost **$0 to access**.

## License

MIT — see [LICENSE](./LICENSE)
