import type { GroceryItem, StoreId, StoreRank } from './types';
import { stores } from './stores';

/**
 * Approximate CAD shelf prices for Canadian chains.
 * Sources & methodology: ./PRICE_SOURCES.md
 * As of: July 2026 (research refresh). Not a live API feed.
 */
export const groceries: GroceryItem[] = [
  {
    id: 'chicken-breast',
    name: 'Chicken breast',
    category: 'Meat',
    unit: 'lb',
    // eezly BC Jun 2026 ~$12.99–13.50/kg; Victoria Jul ~$11.99–12.49/kg → ~$5.40–6.10/lb
    prices: { costco: 5.29, superstore: 5.89, walmart: 6.12, nofrills: 5.49, freshco: 5.79, foodbasics: 5.59 },
    weekdaySavings: [0, 0.05, 0.12, 0.08, 0.03, 0.1, 0.15],
    bestDayHint: 'Sunday meat deals at Costco & Superstore often drop 10–15%.',
  },
  {
    id: 'ground-beef',
    name: 'Ground beef (lean)',
    category: 'Meat',
    unit: 'lb',
    // eezly BC Jun: Superstore ~$11.50/kg, Walmart ~$11/kg → ~$5.00–5.25/lb lean
    prices: { costco: 4.99, superstore: 5.22, walmart: 4.99, nofrills: 5.19, freshco: 5.39, foodbasics: 5.09 },
    weekdaySavings: [0.02, 0.04, 0.1, 0.06, 0.02, 0.08, 0.14],
    bestDayHint: 'Weekend family packs tend to clear cheaper.',
  },
  {
    id: 'bacon',
    name: 'Bacon',
    category: 'Meat',
    unit: '375 g',
    prices: { costco: 6.99, superstore: 8.49, walmart: 7.47, nofrills: 7.29, freshco: 7.99, foodbasics: 7.19 },
    weekdaySavings: [0.03, 0.05, 0.08, 0.06, 0.04, 0.1, 0.12],
    bestDayHint: 'Breakfast protein sales often land Friday–Sunday.',
  },
  {
    id: 'salmon',
    name: 'Atlantic salmon fillet',
    category: 'Seafood',
    unit: 'lb',
    prices: { costco: 11.99, superstore: 14.49, walmart: 13.48, nofrills: 13.79, freshco: 14.29, foodbasics: 13.99 },
    weekdaySavings: [0.05, 0.08, 0.15, 0.1, 0.04, 0.06, 0.02],
    bestDayHint: 'Wednesday seafood specials are common at big-box grocers.',
  },
  {
    id: 'eggs',
    name: 'Large eggs (dozen)',
    category: 'Dairy',
    unit: 'dozen',
    // Frugal Living 2025–26: ~$4.47–4.89; eezly Victoria Jul 2026 sale-ish ~$3.99–4.19
    prices: { costco: 4.29, superstore: 4.49, walmart: 4.27, nofrills: 4.19, freshco: 4.39, foodbasics: 3.99 },
    weekdaySavings: [0, 0.02, 0.05, 0.03, 0.02, 0.04, 0.06],
    bestDayHint: 'Prices are steady; watch midweek loss-leader ads.',
  },
  {
    id: 'milk',
    name: 'Milk (4 L bag)',
    category: 'Dairy',
    unit: '4 L',
    // eezly Jun/Jul 2026: Superstore/Walmart ~$5.29–5.69; Frugal: discounters ~$4.97–5.19
    prices: { costco: 5.49, superstore: 5.49, walmart: 5.35, nofrills: 4.99, freshco: 5.29, foodbasics: 4.97 },
    weekdaySavings: [0, 0.01, 0.04, 0.02, 0.01, 0.03, 0.05],
    bestDayHint: 'Often on rotation midweek — check flyer before restocking.',
  },
  {
    id: 'butter',
    name: 'Unsalted butter',
    category: 'Dairy',
    unit: 'lb',
    // Narcity Costco/Walmart butter blocks often undercut conventional banners
    prices: { costco: 4.99, superstore: 6.29, walmart: 5.48, nofrills: 5.49, freshco: 5.99, foodbasics: 5.39 },
    weekdaySavings: [0.02, 0.04, 0.08, 0.05, 0.03, 0.06, 0.1],
    bestDayHint: 'Baking sales cluster around weekends.',
  },
  {
    id: 'cheddar',
    name: 'Sharp cheddar',
    category: 'Dairy',
    unit: 'lb',
    prices: { costco: 6.99, superstore: 7.99, walmart: 7.48, nofrills: 6.29, freshco: 7.29, foodbasics: 6.49 },
    weekdaySavings: [0.03, 0.05, 0.09, 0.06, 0.04, 0.07, 0.11],
    bestDayHint: 'Block cheese clears cheaper toward Sunday.',
  },
  {
    id: 'yogurt',
    name: 'Greek yogurt',
    category: 'Dairy',
    unit: '750 g',
    prices: { costco: 5.49, superstore: 6.49, walmart: 5.47, nofrills: 5.29, freshco: 5.99, foodbasics: 5.19 },
    weekdaySavings: [0.03, 0.05, 0.09, 0.06, 0.04, 0.07, 0.1],
    bestDayHint: 'Dairy case promotions rotate toward weekend.',
  },
  {
    id: 'avocado',
    name: 'Hass avocados',
    category: 'Produce',
    unit: 'each',
    prices: { costco: 1.25, superstore: 1.49, walmart: 0.97, nofrills: 0.88, freshco: 1.19, foodbasics: 0.97 },
    weekdaySavings: [0.05, 0.08, 0.15, 0.12, 0.06, 0.04, 0.02],
    bestDayHint: 'Produce markdowns peak midweek as stock turns.',
  },
  {
    id: 'spinach',
    name: 'Baby spinach',
    category: 'Produce',
    unit: '5 oz',
    prices: { costco: 3.49, superstore: 3.99, walmart: 3.47, nofrills: 2.99, freshco: 3.29, foodbasics: 2.89 },
    weekdaySavings: [0.06, 0.1, 0.18, 0.14, 0.08, 0.05, 0.03],
    bestDayHint: 'Leafy greens often get Wednesday freshness resets.',
  },
  {
    id: 'tomatoes',
    name: 'Roma tomatoes',
    category: 'Produce',
    unit: 'lb',
    prices: { costco: 1.99, superstore: 2.49, walmart: 1.97, nofrills: 1.79, freshco: 2.19, foodbasics: 1.69 },
    weekdaySavings: [0.04, 0.07, 0.14, 0.1, 0.05, 0.03, 0.02],
    bestDayHint: 'Best midweek when stores refresh produce walls.',
  },
  {
    id: 'garlic',
    name: 'Garlic bulb',
    category: 'Produce',
    unit: 'each',
    prices: { costco: 0.59, superstore: 0.89, walmart: 0.67, nofrills: 0.58, freshco: 0.69, foodbasics: 0.55 },
    weekdaySavings: [0, 0.02, 0.05, 0.03, 0.02, 0.01, 0],
    bestDayHint: 'Stable pricing — buy anytime with other produce.',
  },
  {
    id: 'onion',
    name: 'Yellow onion',
    category: 'Produce',
    unit: 'lb',
    prices: { costco: 0.99, superstore: 1.29, walmart: 0.97, nofrills: 0.89, freshco: 1.09, foodbasics: 0.85 },
    weekdaySavings: [0.02, 0.04, 0.08, 0.05, 0.03, 0.02, 0.01],
    bestDayHint: 'Stock up midweek with other staples.',
  },
  {
    id: 'carrots',
    name: 'Carrots',
    category: 'Produce',
    unit: '2 lb',
    prices: { costco: 2.49, superstore: 2.99, walmart: 2.47, nofrills: 2.29, freshco: 2.69, foodbasics: 2.19 },
    weekdaySavings: [0.03, 0.05, 0.1, 0.07, 0.04, 0.03, 0.02],
    bestDayHint: 'Root veg holds well — grab with Wednesday produce runs.',
  },
  {
    id: 'bell-pepper',
    name: 'Bell peppers',
    category: 'Produce',
    unit: 'each',
    prices: { costco: 1.99, superstore: 1.79, walmart: 1.88, nofrills: 1.49, freshco: 1.59, foodbasics: 1.39 },
    weekdaySavings: [0.04, 0.07, 0.12, 0.09, 0.05, 0.03, 0.02],
    bestDayHint: 'Colourful peppers markdown midweek.',
  },
  {
    id: 'bananas',
    name: 'Bananas',
    category: 'Produce',
    unit: 'lb',
    // ~$1.47–1.65/kg nationally → ~$0.67–0.75/lb
    prices: { costco: 0.72, superstore: 0.72, walmart: 0.67, nofrills: 0.68, freshco: 0.75, foodbasics: 0.65 },
    weekdaySavings: [0.05, 0.08, 0.12, 0.1, 0.06, 0.04, 0.02],
    bestDayHint: 'Ripe markdowns appear midweek.',
  },
  {
    id: 'berries',
    name: 'Mixed berries',
    category: 'Produce',
    unit: 'pint',
    // Frugal: No Frills blueberries often ~$3.99
    prices: { costco: 6.99, superstore: 4.49, walmart: 4.97, nofrills: 3.99, freshco: 4.49, foodbasics: 3.89 },
    weekdaySavings: [0.08, 0.12, 0.2, 0.15, 0.1, 0.06, 0.04],
    bestDayHint: 'Berries markdown hard on Wednesdays.',
  },
  {
    id: 'lemons',
    name: 'Lemons',
    category: 'Produce',
    unit: 'each',
    prices: { costco: 0.49, superstore: 0.79, walmart: 0.58, nofrills: 0.55, freshco: 0.69, foodbasics: 0.52 },
    weekdaySavings: [0.03, 0.05, 0.1, 0.08, 0.04, 0.02, 0.01],
    bestDayHint: 'Citrus refreshes midweek — better color and price.',
  },
  {
    id: 'potatoes',
    name: 'Russet potatoes',
    category: 'Produce',
    unit: '5 lb',
    prices: { costco: 3.66, superstore: 3.99, walmart: 3.97, nofrills: 2.49, freshco: 3.79, foodbasics: 2.69 },
    weekdaySavings: [0.02, 0.04, 0.08, 0.05, 0.03, 0.06, 0.09],
    bestDayHint: 'Bag deals with weekend roast specials.',
  },
  {
    id: 'broccoli',
    name: 'Broccoli crowns',
    category: 'Produce',
    unit: 'lb',
    prices: { costco: 1.99, superstore: 2.49, walmart: 1.67, nofrills: 1.79, freshco: 2.29, foodbasics: 1.69 },
    weekdaySavings: [0.05, 0.08, 0.16, 0.12, 0.07, 0.04, 0.02],
    bestDayHint: 'Wednesday produce resets are your friend.',
  },
  {
    id: 'apples',
    name: 'Gala apples',
    category: 'Produce',
    unit: 'lb',
    // eezly Victoria: ~$4.49–4.79/kg → ~$2.04–2.17/lb
    prices: { costco: 1.79, superstore: 2.04, walmart: 2.17, nofrills: 1.89, freshco: 2.09, foodbasics: 1.79 },
    weekdaySavings: [0.04, 0.06, 0.12, 0.09, 0.05, 0.03, 0.02],
    bestDayHint: 'Bag fruit bags with midweek produce runs.',
  },
  {
    id: 'cucumber',
    name: 'English cucumber',
    category: 'Produce',
    unit: 'each',
    // eezly QC discounters often ~$0.98–0.99
    prices: { costco: 1.29, superstore: 1.49, walmart: 1.27, nofrills: 0.99, freshco: 1.19, foodbasics: 0.98 },
    weekdaySavings: [0.04, 0.07, 0.14, 0.1, 0.06, 0.03, 0.02],
    bestDayHint: 'Cucumbers markdown midweek with salad greens.',
  },
  {
    id: 'rice',
    name: 'Jasmine rice',
    category: 'Pantry',
    unit: '2 lb',
    prices: { costco: 3.99, superstore: 5.49, walmart: 4.47, nofrills: 4.29, freshco: 4.99, foodbasics: 4.19 },
    weekdaySavings: [0.02, 0.03, 0.06, 0.04, 0.02, 0.05, 0.08],
    bestDayHint: 'Pantry staples dip on weekend multi-buy promos.',
  },
  {
    id: 'pasta',
    name: 'Spaghetti pasta',
    category: 'Pantry',
    unit: '16 oz',
    // Frugal Living: Walmart Barilla ~$1.97; Superstore higher
    prices: { costco: 1.49, superstore: 2.49, walmart: 1.97, nofrills: 2.29, freshco: 2.49, foodbasics: 1.99 },
    weekdaySavings: [0.03, 0.05, 0.08, 0.06, 0.04, 0.1, 0.12],
    bestDayHint: 'Italian aisle sales spike Friday–Sunday.',
  },
  {
    id: 'olive-oil',
    name: 'Extra virgin olive oil',
    category: 'Pantry',
    unit: '500 ml',
    prices: { costco: 8.99, superstore: 12.99, walmart: 9.97, nofrills: 10.49, freshco: 11.49, foodbasics: 10.29 },
    weekdaySavings: [0.02, 0.04, 0.07, 0.05, 0.03, 0.08, 0.1],
    bestDayHint: 'Watch for warehouse club size drops on weekends.',
  },
  {
    id: 'soy-sauce',
    name: 'Soy sauce',
    category: 'Pantry',
    unit: '15 oz',
    prices: { costco: 2.99, superstore: 3.79, walmart: 2.97, nofrills: 2.79, freshco: 3.29, foodbasics: 2.69 },
    weekdaySavings: [0.01, 0.02, 0.05, 0.03, 0.02, 0.04, 0.06],
    bestDayHint: 'Steady item — pair with produce shopping day.',
  },
  {
    id: 'black-beans',
    name: 'Canned black beans',
    category: 'Pantry',
    unit: '540 ml',
    // Frugal Living: Walmart ~$1.37; No Frills ~$1.49
    prices: { costco: 1.19, superstore: 1.50, walmart: 1.37, nofrills: 1.49, freshco: 1.49, foodbasics: 1.29 },
    weekdaySavings: [0.01, 0.02, 0.04, 0.03, 0.02, 0.05, 0.07],
    bestDayHint: 'Pantry cans often multi-buy on weekends.',
  },
  {
    id: 'canned-tomatoes',
    name: 'Canned diced tomatoes',
    category: 'Pantry',
    unit: '796 ml',
    prices: { costco: 1.49, superstore: 1.79, walmart: 1.47, nofrills: 1.50, freshco: 1.69, foodbasics: 1.39 },
    weekdaySavings: [0.01, 0.02, 0.04, 0.03, 0.02, 0.05, 0.07],
    bestDayHint: 'Sauce staples discount with Italian aisle weekends.',
  },
  {
    id: 'peanut-butter',
    name: 'Peanut butter',
    category: 'Pantry',
    unit: '1 kg',
    prices: { costco: 5.99, superstore: 7.49, walmart: 6.47, nofrills: 6.29, freshco: 6.99, foodbasics: 5.99 },
    weekdaySavings: [0.02, 0.03, 0.06, 0.04, 0.03, 0.07, 0.09],
    bestDayHint: 'Club and discounter jars win on weekend restocks.',
  },
  {
    id: 'honey',
    name: 'Wildflower honey',
    category: 'Pantry',
    unit: '500 g',
    prices: { costco: 6.99, superstore: 8.49, walmart: 7.47, nofrills: 7.29, freshco: 7.99, foodbasics: 7.19 },
    weekdaySavings: [0.02, 0.03, 0.05, 0.04, 0.03, 0.07, 0.09],
    bestDayHint: 'Pair with weekend pantry restock.',
  },
  {
    id: 'bread',
    name: 'Sliced sandwich loaf',
    category: 'Bakery',
    unit: 'loaf',
    // Frugal + eezly: Superstore Wonder often ~$2.79–2.99; Costco multi cheaper/unit
    prices: { costco: 2.33, superstore: 2.99, walmart: 3.19, nofrills: 3.29, freshco: 3.49, foodbasics: 2.89 },
    weekdaySavings: [0.08, 0.1, 0.12, 0.15, 0.1, 0.05, 0.03],
    bestDayHint: 'Bakery markdowns often hit Thursday evenings.',
  },
  {
    id: 'flour',
    name: 'All-purpose flour',
    category: 'Baking',
    unit: '5 lb',
    prices: { costco: 3.49, superstore: 4.49, walmart: 3.47, nofrills: 3.29, freshco: 3.99, foodbasics: 3.19 },
    weekdaySavings: [0.02, 0.03, 0.05, 0.04, 0.03, 0.08, 0.1],
    bestDayHint: 'Baking aisle promotions run into the weekend.',
  },
  {
    id: 'sugar',
    name: 'Granulated sugar',
    category: 'Baking',
    unit: '4 lb',
    prices: { costco: 3.49, superstore: 4.29, walmart: 3.67, nofrills: 3.49, freshco: 3.99, foodbasics: 3.39 },
    weekdaySavings: [0.01, 0.02, 0.04, 0.03, 0.02, 0.06, 0.08],
    bestDayHint: 'Buy with weekend baking sales.',
  },
  {
    id: 'chocolate',
    name: 'Dark chocolate chips',
    category: 'Baking',
    unit: '12 oz',
    prices: { costco: 4.49, superstore: 5.99, walmart: 4.47, nofrills: 4.79, freshco: 5.29, foodbasics: 4.69 },
    weekdaySavings: [0.04, 0.06, 0.08, 0.05, 0.04, 0.12, 0.15],
    bestDayHint: 'Dessert ingredients discount hardest Saturday–Sunday.',
  },
  {
    id: 'coffee',
    name: 'Ground coffee',
    category: 'Drinks',
    unit: '12 oz',
    // Coffee inflation high in 2025–26; Walmart often wins packaged coffee
    prices: { costco: 8.49, superstore: 10.49, walmart: 8.97, nofrills: 9.49, freshco: 9.99, foodbasics: 9.29 },
    weekdaySavings: [0.05, 0.08, 0.1, 0.07, 0.05, 0.09, 0.12],
    bestDayHint: 'Club sizes win on Sunday restock runs.',
  },
  {
    id: 'oats',
    name: 'Rolled oats',
    category: 'Breakfast',
    unit: '42 oz',
    prices: { costco: 5.49, superstore: 6.99, walmart: 5.97, nofrills: 5.79, freshco: 6.49, foodbasics: 5.59 },
    weekdaySavings: [0.02, 0.04, 0.07, 0.05, 0.03, 0.06, 0.09],
    bestDayHint: 'Breakfast aisle BOGOs often land midweek.',
  },
  {
    id: 'cereal',
    name: 'Family cereal',
    category: 'Breakfast',
    unit: '950 g',
    // Frugal Living: Walmart Frosted Flakes ~$6.97 vs No Frills ~$10
    prices: { costco: 6.49, superstore: 8.49, walmart: 6.97, nofrills: 9.99, freshco: 8.99, foodbasics: 7.49 },
    weekdaySavings: [0.04, 0.06, 0.09, 0.07, 0.05, 0.1, 0.12],
    bestDayHint: 'Big-box breakfast aisle wins weekends.',
  },
  {
    id: 'tofu',
    name: 'Firm tofu',
    category: 'Protein',
    unit: '350 g',
    prices: { costco: 2.49, superstore: 2.99, walmart: 2.47, nofrills: 2.29, freshco: 2.69, foodbasics: 2.19 },
    weekdaySavings: [0.02, 0.04, 0.08, 0.06, 0.03, 0.05, 0.07],
    bestDayHint: 'Plant protein sales often midweek.',
  },
  {
    id: 'frozen-peas',
    name: 'Frozen green peas',
    category: 'Frozen',
    unit: '750 g',
    prices: { costco: 2.99, superstore: 3.99, walmart: 2.97, nofrills: 2.79, freshco: 3.49, foodbasics: 2.69 },
    weekdaySavings: [0.02, 0.03, 0.06, 0.04, 0.03, 0.07, 0.09],
    bestDayHint: 'Frozen aisle multi-buys spike on weekends.',
  },
];

export function getGrocery(id: string) {
  return groceries.find((g) => g.id === id);
}

export function cheapestStore(item: GroceryItem): [StoreId, number] {
  return (Object.entries(item.prices) as [StoreId, number][]).sort((a, b) => a[1] - b[1])[0];
}

/** Top N stores by lowest price for an item (default all tracked stores). */
export function storeLeaderboard(item: GroceryItem, limit = stores.length): StoreRank[] {
  return (Object.entries(item.prices) as [StoreId, number][])
    .sort((a, b) => a[1] - b[1])
    .slice(0, limit)
    .map(([storeId, price], i) => ({
      storeId,
      storeName: stores.find((s) => s.id === storeId)?.name ?? storeId,
      price,
      rank: i + 1,
    }));
}

export function bestBuyDay(item: GroceryItem) {
  let best = 0;
  for (let i = 1; i < item.weekdaySavings.length; i++) {
    if (item.weekdaySavings[i] > item.weekdaySavings[best]) best = i;
  }
  return best;
}

/** Rank of a favorite store on an item’s leaderboard, or null if not in top N. */
export function favoriteStoreRank(
  item: GroceryItem,
  favoriteStoreId: StoreId | null,
  limit = stores.length,
): number | null {
  if (!favoriteStoreId) return null;
  const board = storeLeaderboard(item, limit);
  const hit = board.find((r) => r.storeId === favoriteStoreId);
  return hit ? hit.rank : null;
}

/** Ranks for all favorited stores that appear on the leaderboard. */
export function favoriteStoresOnBoard(
  item: GroceryItem,
  favoriteStoreIds: Iterable<StoreId>,
  limit = stores.length,
): { storeId: StoreId; storeName: string; rank: number }[] {
  const favs = new Set(favoriteStoreIds);
  if (favs.size === 0) return [];
  return storeLeaderboard(item, limit)
    .filter((r) => favs.has(r.storeId))
    .map((r) => ({ storeId: r.storeId, storeName: r.storeName, rank: r.rank }));
}
