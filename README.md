# EZCTO Web Translator — OpenClaw Skill

An AI Agent skill that translates any website into structured JSON. No screenshots, no multimodal — 80%+ token savings.

## Quick Start

1. Place this folder in your agent's skill directory
2. The agent reads `SKILL.md` for the complete workflow
3. Reference files in `references/` provide prompts, schemas, and detection rules

## File Structure

```
ezcto-web-translator/
  SKILL.md                          ← Core workflow instructions
  README.md                         ← This file
  references/
    translate-prompt.md             ← Base translation prompt template
    output-schema.md                ← Output JSON structure specification
    site-type-detection.md          ← Site type auto-detection rules
    extensions/
      crypto-fields.md              ← Crypto/Web3 enhanced extraction
      ecommerce-fields.md           ← E-commerce enhanced extraction
      restaurant-fields.md          ← Restaurant enhanced extraction
```

## API Endpoints

| Endpoint | Method | Auth | Cost |
|----------|--------|------|------|
| `/api/v1/translate?url=` | GET | None | Free (cache read) |
| `/api/v1/contribute` | POST | None | Free (contribute) |
| `/api/v1/translate-server` | POST | API Key | Paid (uses quota) |
| `/api/v1/refresh` | POST | API Key | 3x quota cost |

## Learn More

- Website: https://ezcto.com
- Translator: https://ezcto.com/translator
- API Keys: https://ezcto.com/api-keys
