# Crypto / Web3 Extension Fields

When the site is detected as a crypto/Web3 project, extract these additional fields into the `extensions.crypto` object.

## Additional Extraction Rules

1. **Contract Address**: Look for `0x`-prefixed 40-character hex strings. Verify it appears in a context suggesting it's a token/contract address (near words like "contract", "token", "address", "CA").

2. **Chain**: Identify the blockchain from context:
   - BSC / BNB Chain: mentions of "BSC", "BNB", "Binance Smart Chain", links to bscscan.com
   - Ethereum: mentions of "ETH", "Ethereum", links to etherscan.io
   - Solana: mentions of "SOL", "Solana", links to solscan.io
   - Base: mentions of "Base", links to basescan.org
   - Arbitrum: mentions of "Arbitrum", "ARB"
   - Polygon: mentions of "Polygon", "MATIC"

3. **Token Symbol**: Look for ticker symbols (usually 2-6 uppercase letters) near the contract address or in the page title.

4. **Tokenomics**: Extract if available:
   - `total_supply`: Total token supply number
   - `buy_tax`: Buy tax percentage
   - `sell_tax`: Sell tax percentage
   - Any other tokenomics data (distribution, vesting, burn rate)

5. **DEX Links**: Collect all links pointing to decentralized exchanges:
   - PancakeSwap, Uniswap, SushiSwap, Raydium, Jupiter
   - DexScreener, DexTools, GeckoTerminal chart links

6. **Audit**: Look for links to audit reports (CertiK, Hacken, PeckShield, etc.)

## Output Format

```json
{
  "extensions": {
    "crypto": {
      "contract_address": "0x...",
      "chain": "BSC",
      "token_symbol": "TOKEN",
      "tokenomics": {
        "total_supply": "1,000,000,000",
        "buy_tax": "5%",
        "sell_tax": "5%"
      },
      "dex_links": [
        "https://pancakeswap.finance/swap?outputCurrency=0x...",
        "https://dexscreener.com/bsc/0x..."
      ],
      "audit": "https://certik.com/projects/..."
    }
  }
}
```
