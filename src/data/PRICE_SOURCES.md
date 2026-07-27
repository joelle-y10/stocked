# Price sources (Stockd)

Approximate **CAD** shelf prices for Canadian chains, researched and refreshed **July 2026**.
Not a live API feed — normalized to the package units used in the app. Figures may lag real flyers by days or weeks.

## Primary references (July 2026 refresh)

1. **eezly — Victoria, BC grocery prices (July 2026)**
   - Superstore vs Walmart basket staples (chicken/kg, ground beef/kg, milk 4 L, eggs, bread, bananas/kg, pasta)
   - https://eezly.com/blog/prices-victoria-2026-07/

2. **eezly — BC multi-store basket (June 2026)**
   - FreshCo, No Frills, Superstore, Walmart, Wholesale Club optimal route
   - Illustrative staples: milk 4 L ~$5.69, chicken ~$12.99–13.50/kg, bread ~$2.79, eggs ~$3.89–3.95, lean ground beef ~$11–11.50/kg
   - https://eezly.com/blog/bc-grocery-prices-june-2026-save-on-shopping/

3. **Frugal Living — No Frills vs Walmart vs Superstore (2025–2026)**
   - Regular-price category winners (bread, milk, eggs, pasta, beans, bananas, blueberries, coffee)
   - Confirms Walmart strength on pantry; No Frills on produce/protein sales; Superstore mid-pack + PC Optimum
   - https://frugalliving.ca/no-frills-vs-walmart-canada-vs-superstore-which-is-cheapest-for-your-weekly-groceries-in-2026/

4. **Statistics Canada** — Monthly average retail prices (Food Price Data Hub / Table 18-10-0245-01)
   - National averages for eggs, milk, butter, bread, rice, bananas, chicken, potatoes (May 2026 release noted 2026-07-02)
   - Used as national anchors; store columns are relative to discounter / big-box spreads from sources above
   - https://www.statcan.gc.ca/en/topics-start/food-price
   - https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=1810024501
   - https://www150.statcan.gc.ca/n1/daily-quotidien/260702/dq260702a-eng.htm

5. **Narcity Canada** (Jul 2025) — flyer/shelf comparison across No Frills, Walmart, Costco, FreshCo, Superstore, Food Basics peers
   - Bread, berries, potatoes, cheese, pasta, oatmeal, coffee unit-price patterns
   - https://www.narcity.com/cheapest-grocery-stores-in-canada-prices-products-compare

6. **Tawcan** — Costco vs Superstore vs Walmart unit-price showdown (chicken, salmon, broccoli, rice, pasta, avocado, spinach)
   - https://tawcan.com/does-costco-cost-more-costco-vs-superstore-vs-walmart-showdown/

7. **GroceryPulse / moneyGenius** — discounter ranking context (Food Basics, No Frills, FreshCo often cheapest baskets; Walmart competitive)
   - Used for relative ranking of Food Basics vs other discounters, not exact SKUs

## Stores in the app

| Id | Banner | Notes |
| --- | --- | --- |
| `costco` | Costco | Per comparable unit (membership; large packs) |
| `superstore` | **Superstore** (Real Canadian Superstore / Loblaws) | Never “Super Rich” or other mangled names |
| `walmart` | Walmart Canada | Strong on pantry / packaged goods |
| `nofrills` | No Frills | Discounter + price match culture |
| `freshco` | FreshCo | Empire discount banner |
| `foodbasics` | Food Basics | Metro discount banner (Ontario-heavy) |

## Method

- Prefer **generic / private-label** regular prices when known.
- Convert per-kg research to app units (e.g. lb) where needed (`÷ 2.2046`).
- Costco figures are **per comparable unit**.
- Prices are rounded to the nearest cent and labeled **approximate · as of July 2026** in the UI.
- Regional variation is real — treat columns as a Canada-wide planning aid, not a quote for your postal code.
