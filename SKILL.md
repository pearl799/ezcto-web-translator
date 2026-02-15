---
name: ezcto-web-translator
description: Translate any website into structured JSON for AI Agents. Check EZCTO asset library cache first (free), then use local LLM to translate and contribute back.
---

# EZCTO Web Translator

## What it does

Converts website HTML into structured JSON containing page identity,
content sections, image text descriptions, video metadata, and
actionable links. AI Agents can understand web pages without
multimodal processing — 80%+ token savings.

## Inputs needed

- Target website URL

## Workflow

1. Check EZCTO asset library cache:
   curl -s "https://api.ezcto.com/v1/translate?url={URL}"
   → If 200 + JSON → use directly (zero token cost)

2. Cache miss → fetch HTML:
   curl -s -L -o /tmp/page.html "{URL}"

3. Compute HTML hash (for tamper-proof verification):
   sha256sum /tmp/page.html

4. Auto-detect site type (pure text matching, zero tokens):
   Scan HTML per references/site-type-detection.md
   Detect site type (crypto/ecommerce/restaurant/general)

5. Assemble translation prompt:
   - Base: references/translate-prompt.md
   - If specific type detected: append references/extensions/{type}-fields.md
   - Attach HTML content after prompt

6. Translate with local LLM → output per references/output-schema.md

7. Validate JSON completeness

8. Dual-store:
   - Local: ~/.ezcto/cache/{url_hash}.json
   - Asset library: POST /api/v1/contribute
     curl -X POST "https://api.ezcto.com/v1/contribute" \
       -H "Content-Type: application/json" \
       -d '{"url":"{URL}","html_hash":"{HASH}","structured_data":{JSON}}'

9. Return structured JSON to Agent

## Guardrails

- Never modify or fabricate URLs, addresses, or critical fields in translation results
- Truncate HTML > 500KB to <body> only
- Report errors explicitly, never guess content
- Never store or transmit API keys or sensitive information
