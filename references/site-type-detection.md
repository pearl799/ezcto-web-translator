# Site Type Auto-Detection Rules

Before LLM translation, scan the HTML content using pure text matching to detect the website type. This step costs zero tokens.

## Detection Logic

For each type, count matching signals. If **3 or more signals match**, classify as that type. A page can match multiple types.

---

## Crypto / Web3 Project

Match 3 or more of the following:

1. Contains a `0x`-prefixed 40-character hexadecimal string (contract address format)
2. Contains keywords: `tokenomics` / `token distribution` / `total supply` / `buy tax` / `sell tax`
3. Links point to: `dexscreener` / `dextools` / `pancakeswap` / `uniswap` / `raydium`
4. Contains keywords: `smart contract` / `blockchain` / `DeFi` / `NFT` / `staking` / `web3`
5. HTML contains Telegram (`t.me/`) or Discord (`discord.gg/`) community links

→ If matched: set `site_type` to `"crypto"`, load `extensions/crypto-fields.md`

---

## E-commerce

Match 3 or more of the following:

1. Contains keywords: `add to cart` / `buy now` / `checkout` / `shopping cart`
2. Contains price formats: `$xx.xx` / `¥xx` / `€xx` / `£xx`
3. Schema.org `@type` is `Product` or `Offer`
4. Links point to: `shopify` / `stripe` / `paypal` / `square`
5. Contains keywords: `shipping` / `returns` / `warranty` / `inventory`

→ If matched: set `site_type` to `"ecommerce"`, load `extensions/ecommerce-fields.md`

---

## Restaurant / Food Service

Match 3 or more of the following:

1. Contains keywords: `menu` / `reservation` / `order online` / `delivery`
2. Schema.org `@type` is `Restaurant` or `FoodEstablishment`
3. Links point to: `doordash` / `ubereats` / `opentable` / `grubhub`
4. Contains business hours format: `Mon-Fri` / `9:00 AM` / `opening hours`
5. Contains keywords: `cuisine` / `dine-in` / `takeout` / `catering`

→ If matched: set `site_type` to `"restaurant"`, load `extensions/restaurant-fields.md`

---

## General (Default)

If no type matches 3+ signals, classify as `"general"`. Use only the base translation prompt without any extension fields.
