# EZCTO Web Translator — OpenClaw Edition

> Translate any website into structured JSON for OpenClaw agents. Zero screenshots, 80%+ token savings.

[![OpenClaw Compatible](https://img.shields.io/badge/OpenClaw-Compatible-blue)](https://openclaw.ai)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Cost: $0 (cached)](https://img.shields.io/badge/Cost-$0%20cached-green)](https://ezcto.fun)

---

## 🦞 Why This Skill?

**Problem:** OpenClaw agents struggle with web content. Options are:
1. **Screenshots** → Expensive (Claude multimodal = 2000+ tokens per image)
2. **Raw HTML** → Noisy and hard to parse (ads, scripts, boilerplate)
3. **Web scraping** → Fragile and site-specific

**Solution:** This skill translates HTML into clean, structured JSON that OpenClaw can understand directly.

### Before vs After

**Before (screenshot approach):**
```
User: "What's on pump.fun?"
OpenClaw: *takes screenshot* → sends to Claude Vision
Cost: ~3000 tokens | Time: 8 seconds
```

**After (this skill):**
```
User: "What's on pump.fun?"
OpenClaw: *uses ezcto-web-translator-openclaw*
Cost: 0 tokens (cache hit) | Time: 1 second
```

---

## 🚀 Quick Start

### Installation

1. **Clone this skill into your OpenClaw workspace:**
   ```bash
   cd ~/.openclaw/skills
   git clone https://github.com/ezcto/web-translator-openclaw ezcto-web-translator-openclaw
   ```

2. **Or manually copy:**
   ```bash
   cp -r ezcto-web-translator-openclaw ~/.openclaw/skills/
   ```

3. **Verify installation:**
   ```bash
   openclaw skills list | grep ezcto-web-translator
   ```

### First Use

```bash
# Start OpenClaw
openclaw

# In the chat
You: Translate https://ezcto.fun

# OpenClaw will automatically invoke this skill
OpenClaw: ✓ Translated ezcto.fun (cache hit, 0 tokens)
         Site type: general
         Primary action: Explore Translator
         Cached at: ~/.ezcto/cache/abc123.json
```

---

## 📁 File Structure

```
ezcto-web-translator-openclaw/
├── SKILL.md                          ← OpenClaw reads this for workflow
├── README.md                         ← You are here
├── references/
│   ├── translate-prompt.md           ← Base LLM translation prompt
│   ├── output-schema.md              ← JSON output specification
│   ├── site-type-detection.md        ← Zero-token site type detection
│   ├── openclaw-integration.md       ← OpenClaw-specific integration guide
│   └── extensions/
│       ├── crypto-fields.md          ← Crypto/Web3 enhanced extraction
│       ├── ecommerce-fields.md       ← E-commerce enhanced extraction
│       └── restaurant-fields.md      ← Restaurant enhanced extraction
└── examples/
    ├── crypto-example.json           ← Full example: crypto site
    ├── ecommerce-example.json        ← Full example: e-commerce
    └── openclaw-output-example.json  ← OpenClaw wrapper format
```

---

## 🎯 Key Features

### 1. Cache-First Strategy
- Checks EZCTO asset library before translating → **0 tokens if cached**
- Local cache at `~/.ezcto/cache/` → Instant repeat access
- Community contributions → Growing cache coverage

### 2. Zero-Token Site Detection
- Auto-detects crypto/ecommerce/restaurant sites via text pattern matching
- No LLM calls for detection → Pure regex/string matching
- Loads type-specific extraction rules automatically

### 3. OpenClaw-Native Output
- JSON result wrapped with metadata for skill chaining
- Markdown summary at `~/.ezcto/cache/{hash}.meta.md` for quick reference
- Agent suggestions for next actions and skill combinations

### 4. Smart Error Handling
- Structured error codes: `fetch_failed`, `translation_failed`, `validation_failed`
- Recovery suggestions for each error type
- Never silently fails - always returns actionable feedback

---

## 🔧 Configuration

### Environment Variables (Optional)

```bash
# Custom cache location (default: ~/.ezcto/cache/)
export EZCTO_CACHE_DIR=~/custom/cache/path

# Custom EZCTO API endpoint (default: https://api.ezcto.fun)
export EZCTO_API_URL=https://custom-api.example.com

# Cache TTL in hours (default: 24)
export EZCTO_CACHE_TTL=48
```

### OpenClaw Tool Dependencies

This skill requires the following OpenClaw tools to be enabled:

```yaml
# In your ~/.openclaw/config.yaml
tools:
  web_fetch: enabled      # Fetch HTML content
  exec: enabled           # Run curl/sha256sum
  filesystem: enabled     # Read/write cache files
```

**Verify tools are enabled:**
```bash
openclaw tools list | grep -E "web_fetch|exec|filesystem"
```

---

## 📊 Cost Analysis

| Scenario | Tokens | Time | API Calls | Cost |
|----------|--------|------|-----------|------|
| **Cache hit (EZCTO library)** | 0 | ~1s | 1 (cache check) | $0 |
| **Cache hit (local)** | 0 | <0.5s | 0 | $0 |
| **Cache miss (simple page)** | 500-1000 | ~5s | 1 (LLM) + 1 (cache) | ~$0.003 |
| **Cache miss (complex page)** | 1500-2000 | ~10s | 1 (LLM) + 1 (cache) | ~$0.006 |
| **Screenshot alternative** | 3000+ | ~8s | 1 (Vision) | ~$0.09 |

**Savings:** 80-95% token reduction vs multimodal approaches.

---

## 🧪 Testing

### Test Suite

```bash
# Test 1: Cache hit (should be instant)
openclaw chat "Translate https://ezcto.fun"

# Test 2: Crypto site detection
openclaw chat "Translate https://pump.fun"
# Expected: site_type = ["crypto"], extracts contract addresses

# Test 3: E-commerce site
openclaw chat "What's on https://www.shopify.com"
# Expected: site_type = ["ecommerce"], extracts products

# Test 4: Error handling (invalid URL)
openclaw chat "Translate https://this-does-not-exist-12345.com"
# Expected: Returns structured error with code "fetch_failed"

# Test 5: Large HTML (>500KB)
openclaw chat "Translate https://en.wikipedia.org/wiki/Artificial_intelligence"
# Expected: Truncates to <body> only, still succeeds
```

### Verify Cache

```bash
# Check local cache
ls -lh ~/.ezcto/cache/

# Read a cached translation (JSON)
cat ~/.ezcto/cache/*.json | jq .

# Read Markdown summary
cat ~/.ezcto/cache/*.meta.md
```

---

## 🔗 Skill Chaining (Advanced)

OpenClaw can chain this skill with others for powerful workflows:

### Example 1: Price Tracking
```
User: "Track price of this product: https://amazon.com/dp/B08N5WRWNW"

OpenClaw workflow:
1. ezcto-web-translator-openclaw → Extract product details
2. price-tracker skill → Monitor price changes
3. email-notifier skill → Alert on price drop
```

### Example 2: Crypto Research
```
User: "Research this token: https://pump.fun/coin/abc123"

OpenClaw workflow:
1. ezcto-web-translator-openclaw → Extract contract, tokenomics
2. blockchain-explorer skill → Check on-chain data
3. sentiment-analyzer skill → Analyze social mentions
4. markdown-report skill → Generate research report
```

### Example 3: Competitive Analysis
```
User: "Compare these 3 e-commerce sites: [URLs]"

OpenClaw workflow:
1. ezcto-web-translator-openclaw (3x parallel) → Extract all products
2. product-comparison skill → Generate comparison table
3. chart-generator skill → Visualize pricing
```

---

## 🛡️ Security & Privacy

### What This Skill Does
- ✅ Fetches publicly accessible web pages
- ✅ Stores translations locally in `~/.ezcto/cache/`
- ✅ Contributes **non-sensitive** data to EZCTO asset library

### What This Skill Does NOT Do
- ❌ Access password-protected sites (no auth bypass)
- ❌ Store or transmit API keys, passwords, or PII
- ❌ Execute JavaScript or interact with pages (read-only)
- ❌ Modify or fabricate URLs in translation output

### Data Sharing
When you use this skill, **only these data points** are sent to EZCTO API:
1. The URL you asked to translate
2. SHA256 hash of the HTML content
3. The structured JSON translation

**NOT shared:** Your IP, OpenClaw config, other browsing history.

You can disable asset library contribution by setting:
```bash
export EZCTO_CONTRIBUTE=false
```

---

## 🐛 Troubleshooting

### Issue: "Tool 'exec' not enabled"
**Solution:**
```bash
# Edit OpenClaw config
nano ~/.openclaw/config.yaml

# Enable exec tool
tools:
  exec: enabled
```

### Issue: "Cache directory not writable"
**Solution:**
```bash
mkdir -p ~/.ezcto/cache
chmod 755 ~/.ezcto/cache
```

### Issue: "Translation validation failed"
**Cause:** LLM returned malformed JSON (rare with Claude)
**Solution:**
- Check `~/.openclaw/logs/` for the raw LLM output
- Try again (may be transient LLM issue)
- Report to EZCTO if persistent

### Issue: "EZCTO API timeout"
**Solution:**
```bash
# Test API connectivity
curl -s "https://api.ezcto.fun/v1/translate?url=https://ezcto.fun"

# If slow/timeout, skill will automatically fall back to local translation
```

---

## 📚 Learn More

- **EZCTO Website:** https://ezcto.fun
- **API Documentation:** https://ezcto.fun/api-docs
- **OpenClaw Docs:** https://docs.openclaw.ai
- **Report Issues:** https://github.com/ezcto/web-translator-openclaw/issues
- **Community Discord:** https://discord.gg/ezcto

---

## 📜 License

MIT License - see LICENSE file for details.

---

## 🙏 Credits

- Built for [OpenClaw](https://openclaw.ai) by [EZCTO Team](https://ezcto.fun)
- Powered by Claude (Anthropic) for LLM translation
- Community contributions welcome!
