# Restaurant Extension Fields

When the site is detected as a restaurant or food service website, extract these additional fields into the `extensions.restaurant` object.

## Additional Extraction Rules

1. **Cuisine Type**: Identify the cuisine (Italian, Chinese, Japanese, American, etc.).
2. **Menu Items**: Extract visible menu items with name, price, and description.
3. **Business Hours**: Extract opening hours for each day.
4. **Reservation**: Detect reservation systems and booking links.
5. **Delivery Platforms**: Identify linked delivery services.
6. **Location**: Extract physical address and map links.

## Output Format

```json
{
  "extensions": {
    "restaurant": {
      "cuisine": ["Italian", "Mediterranean"],
      "menu_items": [
        {
          "name": "Margherita Pizza",
          "price": "14.99",
          "currency": "USD",
          "description": "Classic pizza with tomato, mozzarella, and basil"
        }
      ],
      "business_hours": {
        "monday": "11:00 AM - 10:00 PM",
        "tuesday": "11:00 AM - 10:00 PM",
        "wednesday": "11:00 AM - 10:00 PM",
        "thursday": "11:00 AM - 10:00 PM",
        "friday": "11:00 AM - 11:00 PM",
        "saturday": "10:00 AM - 11:00 PM",
        "sunday": "10:00 AM - 9:00 PM"
      },
      "reservation_url": "https://opentable.com/...",
      "delivery_platforms": ["doordash", "ubereats", "grubhub"],
      "location": {
        "address": "123 Main St, City, State 12345",
        "map_url": "https://maps.google.com/..."
      }
    }
  }
}
```
