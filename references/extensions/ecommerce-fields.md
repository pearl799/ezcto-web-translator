# E-commerce Extension Fields

When the site is detected as an e-commerce website, extract these additional fields into the `extensions.ecommerce` object.

## Additional Extraction Rules

1. **Products**: Extract visible product listings with name, price, currency, and description.
2. **Categories**: Identify product categories from navigation or sidebar.
3. **Payment Methods**: Detect supported payment methods (credit card, PayPal, crypto, etc.).
4. **Shipping Info**: Extract shipping policies, regions, and estimated delivery times.
5. **Return Policy**: Extract return/refund policy details.

## Output Format

```json
{
  "extensions": {
    "ecommerce": {
      "products": [
        {
          "name": "Product Name",
          "price": "29.99",
          "currency": "USD",
          "description": "Product description",
          "url": "Product page URL"
        }
      ],
      "categories": ["Electronics", "Clothing"],
      "payment_methods": ["credit_card", "paypal", "apple_pay"],
      "shipping": "Free shipping on orders over $50",
      "return_policy": "30-day return policy"
    }
  }
}
```
