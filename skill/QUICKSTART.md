# Quick Start Guide - OpenClaw Edition

Get started with EZCTO Web Translator for OpenClaw in 5 minutes.

---

## Installation

### Option 1: Clone into OpenClaw skills directory
```bash
cd ~/.openclaw/skills
git clone https://github.com/ezcto/web-translator-openclaw ezcto-web-translator-openclaw
```

### Option 2: Copy manually
```bash
cp -r ezcto-web-translator-openclaw ~/.openclaw/skills/
```

### Verify installation
```bash
openclaw skills list | grep ezcto-web-translator
# Should show: ✓ ezcto-web-translator-openclaw (enabled)
```

---

## Enable Required Tools

Edit your OpenClaw config:
```bash
nano ~/.openclaw/config.yaml
```

Ensure these tools are enabled:
```yaml
tools:
  web_fetch: enabled
  exec: enabled
  filesystem: enabled
```

Restart OpenClaw:
```bash
openclaw restart
```

---

## First Test

Start OpenClaw:
```bash
openclaw
```

Try these examples:

### Test 1: Simple translation (cache hit)
```
You: Translate https://ezcto.fun

OpenClaw: ✓ Translated ezcto.fun
          Source: cache (0 tokens, 1.2s)
          Site type: general
          Title: EZCTO - Web Translator for AI Agents
          Primary action: Try Translator

          Cached at: ~/.ezcto/cache/abc123.json
          View summary: cat ~/.ezcto/cache/abc123.meta.md
```

### Test 2: Crypto site (fresh translation)
```
You: What's on https://pump.fun?

OpenClaw: ✓ Translated pump.fun
          Source: fresh translation (1,234 tokens, 5.4s)
          Site type: crypto

          Key findings:
          - Token: PUMP on Solana
          - Contract: PUMPxxx...
          - Total supply: 1B tokens
          - DEX: Raydium, Jupiter
          - Community: 8.5K Telegram members

          Suggested next steps:
          1. Verify contract on Solscan
          2. Check liquidity on DexScreener
          3. Analyze community sentiment

          Use /chain to execute suggested skills automatically.
```

### Test 3: E-commerce site
```
You: Translate https://www.shopify.com

OpenClaw: ✓ Translated shopify.com
          Site type: ecommerce

          Products found: 8
          Featured: Shopify Plus ($2,000/month)
          Payment methods: Credit card, PayPal

          Primary action: Start Free Trial
```

---

## Verify Cache

Check what's been cached:
```bash
ls -lh ~/.ezcto/cache/

# View a translation (JSON)
cat ~/.ezcto/cache/*.json | jq '.meta.title'

# View markdown summary
cat ~/.ezcto/cache/*.meta.md
```

---

## Skill Chaining (Advanced)

Let OpenClaw execute multi-step workflows:

```
You: Research this crypto token: https://pump.fun/coin/abc123

OpenClaw: Executing research workflow...

          Step 1/4: Translating website ✓
          Step 2/4: Checking blockchain data ✓
          Step 3/4: Analyzing sentiment ✓
          Step 4/4: Generating report ✓

          Research complete! See: ~/reports/pump-abc123.md
```

---

## Configuration (Optional)

### Custom cache location
```bash
export EZCTO_CACHE_DIR=~/my-custom-cache
```

### Disable contribution to asset library
```bash
export EZCTO_CONTRIBUTE=false
```

### Custom API endpoint
```bash
export EZCTO_API_URL=https://my-proxy.example.com
```

---

## Troubleshooting

### Issue: Skill not found
```bash
# Check skill is in the right place
ls ~/.openclaw/skills/ezcto-web-translator-openclaw/SKILL.md

# Restart OpenClaw
openclaw restart
```

### Issue: "exec tool not enabled"
```bash
# Edit config
nano ~/.openclaw/config.yaml

# Set: exec: enabled
# Save and restart OpenClaw
```

### Issue: Cache directory error
```bash
mkdir -p ~/.ezcto/cache
chmod 755 ~/.ezcto/cache
```

### Issue: Translation fails
```bash
# Check logs
tail -f ~/.openclaw/logs/skills/ezcto-web-translator-openclaw.log

# Test URL manually
curl -s "https://api.ezcto.fun/v1/translate?url=YOUR_URL"
```

---

## Next Steps

- **Read full docs:** `less SKILL.md`
- **Explore examples:** `ls examples/`
- **Customize detection:** Edit `references/site-type-detection.md`
- **Add new site types:** Create `references/extensions/yourtype-fields.md`
- **Join community:** https://discord.gg/ezcto

---

## Cost Tracking

View your usage:
```bash
openclaw stats skills --filter ezcto-web-translator-openclaw
```

Expected output:
```
ezcto-web-translator-openclaw
  Invocations: 45
  Cache hits: 33 (73%)
  Total tokens: 12,500 (avg 277 per call)
  Total cost: $0.037
  Avg latency: 3.2s
```

---

## Support

- **GitHub Issues:** https://github.com/ezcto/web-translator-openclaw/issues
- **Discord:** https://discord.gg/ezcto
- **Email:** support@ezcto.fun
- **Docs:** https://ezcto.fun/docs
