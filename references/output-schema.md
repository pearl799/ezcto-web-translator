# EZCTO Output JSON Schema

All translation output MUST conform to this schema. Fields marked as **required** must always be present. Optional fields should be included when data is available.

## Schema

```json
{
  "meta": {
    "url": "(required) Original website URL",
    "title": "(required) Page title from <title> or <h1>",
    "description": "(required) Page description from meta description or first paragraph",
    "language": "(required) Page language (ISO 639-1 code, e.g., 'en', 'zh', 'ja')",
    "favicon": "Favicon URL if available",
    "site_type": "(required) Array of detected types: ['general'], ['crypto'], ['ecommerce'], ['restaurant'], etc.",
    "translated_at": "(required) Translation timestamp in ISO 8601 format"
  },
  "navigation": [
    {
      "label": "(required) Navigation item text",
      "url": "(required) Link URL",
      "is_external": "Boolean — true if link points to external domain"
    }
  ],
  "content": [
    {
      "section": "(required) Section name: hero / about / features / pricing / team / faq / footer / etc.",
      "heading": "Section heading text",
      "text": "Section body text content",
      "items": ["List items if the section contains a list"]
    }
  ],
  "entities": {
    "organization": "Organization / company / project name",
    "people": ["List of people mentioned"],
    "contact": {
      "email": "Contact email",
      "phone": "Contact phone",
      "address": "Physical address"
    },
    "social_links": {
      "twitter": "Twitter/X URL",
      "telegram": "Telegram URL",
      "discord": "Discord URL",
      "github": "GitHub URL",
      "linkedin": "LinkedIn URL",
      "facebook": "Facebook URL",
      "instagram": "Instagram URL",
      "youtube": "YouTube URL",
      "medium": "Medium URL",
      "reddit": "Reddit URL"
    }
  },
  "media": {
    "images": [
      {
        "type": "image",
        "role": "logo / hero / team_photo / product / decorative / screenshot / icon / background",
        "url": "(required) Image URL",
        "description": "(required) Text description inferred from alt/context/filename/aria-label",
        "confidence": "(required) high / medium / low — based on signal quality",
        "dimensions": "Width x Height if available in HTML attributes",
        "alt_text": "Original alt attribute value"
      }
    ],
    "videos": [
      {
        "type": "video",
        "role": "trailer / tutorial / demo / presentation / testimonial",
        "url": "(required) Video URL or embed URL",
        "platform": "(required) youtube / vimeo / twitter / tiktok / self-hosted",
        "description": "(required) Text description inferred from title/context",
        "duration": "Video duration if available",
        "thumbnail_description": "Text description of the video thumbnail"
      }
    ]
  },
  "actions": [
    {
      "label": "(required) Button or link text",
      "url": "(required) Target URL",
      "type": "(required) link / button / form",
      "purpose": "(required) Functional description: buy / contact / join_community / download / sign_up / learn_more / etc."
    }
  ],
  "structured_data": {
    "schema_org": "Existing Schema.org / JSON-LD data extracted from the page, if any"
  },
  "extensions": {
    "crypto": {
      "contract_address": "Smart contract address (0x...)",
      "chain": "Blockchain name (Ethereum / BSC / Solana / ...)",
      "token_symbol": "Token ticker symbol",
      "tokenomics": {
        "total_supply": "Total token supply",
        "buy_tax": "Buy tax percentage",
        "sell_tax": "Sell tax percentage"
      },
      "dex_links": ["DEX trading links"],
      "audit": "Audit report URL if available"
    }
  }
}
```

## Field Rules

1. **meta** — Always required. `site_type` should be an array; use `["general"]` if no specific type detected.
2. **navigation** — Extract all visible navigation items. Set `is_external` based on domain comparison.
3. **content** — Group by logical sections. Use descriptive section names.
4. **entities** — Extract what's available. Use `null` for missing fields, not empty strings.
5. **media.images** — Never process images visually. Infer descriptions from HTML text signals only.
6. **media.videos** — Extract metadata from embed URLs and surrounding context.
7. **actions** — Include all interactive elements that an agent might want to trigger.
8. **structured_data** — Pass through any existing Schema.org data verbatim.
9. **extensions** — Only populate when the corresponding site type is detected. Empty object `{}` otherwise.
