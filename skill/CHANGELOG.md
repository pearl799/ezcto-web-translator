# OpenClaw Edition - What's New

This document highlights the key differences between the generic version and the OpenClaw-optimized version.

---

## Major Enhancements

### 1. OpenClaw-Native YAML Frontmatter
**Generic version:**
```yaml
---
name: ezcto-web-translator
description: Translate any website...
---
```

**OpenClaw version:**
```yaml
---
name: ezcto-web-translator-openclaw
version: 1.0.0
triggers:                    # NEW: Auto-trigger conditions
  - user asks to "translate a website"
requires_tools:              # NEW: Tool dependency declaration
  - web_fetch
  - exec
  - filesystem
cost:                        # NEW: Cost estimation
  tokens: 0 (cache hit) / 500-2000
  time_seconds: 1-3 / 5-15
permissions:                 # NEW: Security permissions
  network: [api.ezcto.fun, "*"]
  filesystem: [~/.ezcto/cache/]
---
```

### 2. Structured Workflow with Code Blocks
**Generic:** Narrative text descriptions  
**OpenClaw:** Executable code blocks with error handling

```markdown
### Step 2: Fetch HTML

\`\`\`bash
curl -s -L -o /tmp/page.html "{URL}"
fetch_status=$?
\`\`\`

**Error handling:**
\`\`\`javascript
if (fetch_status !== 0) {
  return {
    "status": "error",
    "error": {
      "code": "fetch_failed",
      "message": "Cannot fetch URL",
      "suggestion": "Check if URL is accessible"
    }
  }
}
\`\`\`
```

### 3. OpenClaw Output Wrapper
**Generic:** Business data only  
**OpenClaw:** Wrapped with metadata and agent suggestions

```json
{
  "skill": "ezcto-web-translator-openclaw",
  "status": "success",
  "result": { /* business data */ },
  "metadata": {
    "source": "cache" | "fresh",
    "token_cost": 0 | 1500,
    "cache_key": "~/.ezcto/cache/..."
  },
  "agent_suggestions": {
    "primary_action": { /* what to do next */ },
    "skills_to_chain": [ /* suggested follow-up skills */ ]
  }
}
```

### 4. Agent Suggestions System
**NEW:** Tells OpenClaw what to do next

```json
{
  "agent_suggestions": {
    "primary_action": {
      "label": "Buy Now",
      "url": "/checkout",
      "purpose": "complete_purchase",
      "priority": "high"
    },
    "next_actions": [
      {
        "action": "visit_url",
        "url": "/reviews",
        "reason": "Check reviews before purchase",
        "priority": 1
      }
    ],
    "skills_to_chain": [
      {
        "skill": "price-tracker",
        "input": "{{ result.extensions.ecommerce.products[0] }}",
        "reason": "Track price history"
      }
    ]
  }
}
```

### 5. Local Markdown Summaries
**NEW:** OpenClaw-friendly cache format

Alongside `{hash}.json`, create `{hash}.meta.md`:

```markdown
---
url: https://pump.fun
site_type: [crypto]
token_cost: 1200
---

# Translation Summary

**Site:** Pump.fun - Meme coin trading
**Type:** crypto

## Quick Facts
- Token: PUMP on Solana
- Contract: PUMPxxx...

## Suggested Next Steps
- Verify contract on Solscan
- Check liquidity
```

### 6. Cache Freshness Hints
**NEW:** Helps OpenClaw's heartbeat daemon

```json
{
  "cache_freshness": {
    "cached_at": "2026-02-16T10:00:00Z",
    "should_refresh_after": "2026-02-17T10:00:00Z",
    "refresh_priority": "high"
  }
}
```

### 7. Enhanced Error Handling
**Generic:** Simple error messages  
**OpenClaw:** Structured errors with recovery suggestions

```json
{
  "status": "error",
  "error": {
    "code": "fetch_failed",
    "message": "Cannot fetch URL",
    "details": {
      "http_status": 404,
      "url": "https://..."
    },
    "suggestion": "Check if URL is correct and accessible"
  }
}
```

### 8. Improved Site Type Detection
**Generic:** 5 signals per type  
**OpenClaw:** 7 signals + context validation

```javascript
// NEW: Context validation for contract addresses
const contractMatches = html.match(/0x[a-fA-F0-9]{40}/g)
for (const addr of contractMatches) {
  const context = getContext(html, addr, 50)
  if (/contract|CA|token address/i.test(context)) {
    return true
  }
}
```

### 9. Extended Crypto Fields
**Generic version:**
- contract_address
- chain
- token_symbol
- tokenomics (basic)
- dex_links
- audit

**OpenClaw version (NEW):**
- whitepaper URL
- roadmap (structured)
- presale info
- social metrics (follower counts)
- token_distribution (detailed array)
- liquidity_locked status

### 10. Form Field Extraction
**Generic:** Only form URL  
**OpenClaw:** Complete field definitions

```json
{
  "actions": [
    {
      "label": "Contact Us",
      "type": "form",
      "method": "POST",
      "fields": [
        {
          "name": "email",
          "type": "email",
          "required": true,
          "placeholder": "your@email.com",
          "validation": "email_format"
        }
      ]
    }
  ]
}
```

### 11. Navigation Context
**NEW:** Breadcrumb and parent pages

```json
{
  "meta": {
    "breadcrumb": [
      {"label": "Home", "url": "/"},
      {"label": "Products", "url": "/products"},
      {"label": "Current Page", "url": "/products/item"}
    ],
    "parent_url": "/products"
  }
}
```

### 12. Technical Metadata
**NEW:** Rendering type and status

```json
{
  "meta": {
    "technical": {
      "rendering_type": "client-side",
      "requires_javascript": true,
      "http_status": 200,
      "page_status": "normal"
    }
  }
}
```

---

## File Structure Comparison

### Generic Version
```
ezcto-web-translator/
├── SKILL.md
├── README.md
└── references/
    ├── translate-prompt.md
    ├── output-schema.md
    ├── site-type-detection.md
    └── extensions/
        ├── crypto-fields.md
        ├── ecommerce-fields.md
        └── restaurant-fields.md
```

### OpenClaw Version (NEW)
```
ezcto-web-translator-openclaw/
├── SKILL.md                          ← OpenClaw YAML format
├── README.md                         ← OpenClaw-specific
├── QUICKSTART.md                     ← NEW: 5-min setup guide
├── CHANGELOG.md                      ← NEW: This file
├── references/
│   ├── translate-prompt.md           ← Enhanced
│   ├── output-schema.md              ← With OpenClaw wrapper
│   ├── site-type-detection.md        ← 7 signals + validation
│   ├── openclaw-integration.md       ← NEW: Integration guide
│   └── extensions/
│       ├── crypto-fields.md          ← Enhanced (10 fields)
│       ├── ecommerce-fields.md       ← Enhanced (8 fields)
│       └── restaurant-fields.md      ← Enhanced (9 fields)
└── examples/
    └── openclaw-output-example.json  ← NEW: Complete example
```

---

## Performance Improvements

| Metric | Generic | OpenClaw |
|--------|---------|----------|
| **Cache hit latency** | ~1s | ~0.5s (local check first) |
| **Agent understanding** | Manual parsing | Direct JSON + suggestions |
| **Error recovery** | Manual | Automated with suggestions |
| **Skill chaining** | Not supported | Native support |
| **Cost tracking** | External | Built-in metadata |

---

## Backward Compatibility

The OpenClaw version is **fully backward compatible** with the generic version:
- All original fields are preserved
- New fields are additive (in `agent_suggestions`, `metadata`, etc.)
- Can be used as a drop-in replacement

---

## Migration Guide

### If you're using the generic version:

1. **Install OpenClaw version alongside:**
   ```bash
   cd ~/.openclaw/skills
   git clone https://github.com/ezcto/web-translator-openclaw
   ```

2. **Update your code to read the new wrapper:**
   ```javascript
   // Old way
   const data = JSON.parse(result)
   console.log(data.meta.title)

   // New way (OpenClaw)
   const response = JSON.parse(result)
   const data = response.result
   console.log(data.meta.title)
   console.log(response.agent_suggestions.primary_action)
   ```

3. **Leverage new features:**
   - Use `agent_suggestions` for next steps
   - Check `metadata.source` to know if cached
   - Read `.meta.md` files for quick summaries

---

## Future Roadmap

Planned enhancements for future releases:

- [ ] Voice/audio extraction (transcripts)
- [ ] Table data extraction (structured)
- [ ] PDF rendering support
- [ ] Multi-language UI support
- [ ] Historical version comparison
- [ ] A/B test detection
- [ ] Cookie consent auto-dismiss
- [ ] Dynamic content polling

---

## Credits

OpenClaw Edition developed by EZCTO Team specifically for the OpenClaw community.

Special thanks to:
- OpenClaw maintainers for the amazing framework
- EZCTO community for feedback and testing
- Claude (Anthropic) for powering translations
