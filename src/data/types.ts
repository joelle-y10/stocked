export type StoreId =
  | 'costco'
  | 'superstore'
  | 'walmart'
  | 'nofrills'
  | 'freshco'
  | 'foodbasics';

export type MealSlot = 'breakfast' | 'lunch' | 'dinner' | 'dessert' | 'drinks';

export type DayKey =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export type TutorialCategory =
  | MealSlot
  | 'tools'
  | 'techniques'
  | 'shopping'
  | 'stores'
  | 'planning'
  | 'waste';

export interface Store {
  id: StoreId;
  name: string;
  short: string;
  color: string;
}

export interface GroceryItem {
  id: string;
  name: string;
  category: string;
  unit: string;
  /** Approximate CAD shelf prices per store (see PRICE_SOURCES.md). */
  prices: Record<StoreId, number>;
  /** Typical % savings by weekday (0=Mon … 6=Sun) relative to list price */
  weekdaySavings: number[];
  bestDayHint: string;
}

export interface Recipe {
  id: string;
  title: string;
  meal: MealSlot;
  /** Total active + passive time (prep + cook), minutes */
  timeMin: number;
  prepMin: number;
  cookMin: number;
  servings: number;
  difficulty: 'easy' | 'medium' | 'advanced';
  blurb: string;
  image: string;
  /** qty = package-relative amount for inventory; displayAmount shown to cooks */
  ingredients: { itemId: string; qty: number; displayAmount: string; note?: string }[];
  steps: string[];
  tools: string[];
  tips?: string[];
  substitutions?: string[];
}

export interface InventoryEntry {
  itemId: string;
  qty: number;
}

export interface Tutorial {
  id: string;
  title: string;
  category: TutorialCategory;
  duration: string;
  level: string;
  summary: string;
  materials: string[];
  tools: string[];
  steps: string[];
  tip: string;
}

export type MealPlan = Record<DayKey, string | null>;

export interface StoreRank {
  storeId: StoreId;
  storeName: string;
  price: number;
  rank: number;
}

export interface TripStop {
  storeId: StoreId;
  storeName: string;
  items: { itemId: string; name: string; price: number; unit: string }[];
  subtotal: number;
}
