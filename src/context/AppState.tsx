import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { groceries, cheapestStore, bestBuyDay, storeLeaderboard } from './../data/groceries';
import { getRecipe } from './../data/recipes';
import type { DayKey, InventoryEntry, MealPlan, StoreId, TripStop } from './../data/types';
import { dayNames, getStore, stores } from './../data/stores';

const PLAN_KEY = 'stocked-meal-plan';
const INV_KEY = 'stocked-inventory';
const FAV_ITEMS_KEY = 'stocked-favorite-items';
/** Multi-store favorites (JSON array of StoreId). */
const FAV_STORES_KEY = 'stocked-favorite-stores';
/** Legacy single-store key — migrated once into FAV_STORES_KEY. */
const FAV_STORE_LEGACY_KEY = 'stocked-favorite-store';

const defaultPlan: MealPlan = {
  monday: 'salmon-dinner',
  tuesday: 'chicken-rice',
  wednesday: 'veggie-stirfry',
  thursday: 'beef-pasta',
  friday: 'roast-chicken',
  saturday: 'tofu-salad',
  sunday: 'spinach-omelette',
};

const defaultInventory: InventoryEntry[] = [
  { itemId: 'rice', qty: 1 },
  { itemId: 'olive-oil', qty: 1 },
  { itemId: 'garlic', qty: 3 },
  { itemId: 'onion', qty: 2 },
  { itemId: 'eggs', qty: 0.5 },
  { itemId: 'soy-sauce', qty: 1 },
  { itemId: 'pasta', qty: 1 },
];

const validStoreIds = new Set(stores.map((s) => s.id));

function loadPlan(): MealPlan {
  try {
    const raw = localStorage.getItem(PLAN_KEY);
    if (raw) return { ...defaultPlan, ...JSON.parse(raw) };
  } catch {
    /* ignore */
  }
  return defaultPlan;
}

function loadInventory(): InventoryEntry[] {
  try {
    const raw = localStorage.getItem(INV_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return defaultInventory.filter((e) => groceries.some((g) => g.id === e.itemId));
}

function loadFavoriteItems(): string[] {
  try {
    const raw = localStorage.getItem(FAV_ITEMS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as string[];
      return parsed.filter((id) => groceries.some((g) => g.id === id));
    }
  } catch {
    /* ignore */
  }
  return [];
}

function loadFavoriteStores(): StoreId[] {
  try {
    const multi = localStorage.getItem(FAV_STORES_KEY);
    if (multi) {
      const parsed = JSON.parse(multi) as string[];
      return parsed.filter((id): id is StoreId => validStoreIds.has(id as StoreId));
    }
    const legacy = localStorage.getItem(FAV_STORE_LEGACY_KEY);
    if (legacy && validStoreIds.has(legacy as StoreId)) {
      return [legacy as StoreId];
    }
  } catch {
    /* ignore */
  }
  return [];
}

export interface MissingItem {
  itemId: string;
  name: string;
  needed: number;
  have: number;
  unit: string;
  forRecipes: { recipeId: string; title: string; day: DayKey }[];
  cheapest: { store: StoreId; price: number };
  bestDay: string;
  bestDayIndex: number;
  tip: string;
  estimatedPrice: number;
  leaderboard: ReturnType<typeof storeLeaderboard>;
}

interface AppStateValue {
  plan: MealPlan;
  inventory: InventoryEntry[];
  setMeal: (day: DayKey, recipeId: string | null) => void;
  setInventoryQty: (itemId: string, qty: number) => void;
  addToInventory: (itemId: string) => void;
  removeFromInventory: (itemId: string) => void;
  toggleHaveItem: (itemId: string, have: boolean, qty?: number) => void;
  missing: MissingItem[];
  inventoryMap: Map<string, number>;
  favoriteItems: Set<string>;
  toggleFavoriteItem: (itemId: string) => void;
  favoriteStores: Set<StoreId>;
  toggleFavoriteStore: (id: StoreId) => void;
  buildTripPlan: (itemIds: string[]) => TripStop[];
}

const AppStateContext = createContext<AppStateValue | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [plan, setPlan] = useState<MealPlan>(loadPlan);
  const [inventory, setInventory] = useState<InventoryEntry[]>(loadInventory);
  const [favoriteItemList, setFavoriteItemList] = useState<string[]>(loadFavoriteItems);
  const [favoriteStoreList, setFavoriteStoreList] = useState<StoreId[]>(loadFavoriteStores);

  useEffect(() => {
    localStorage.setItem(PLAN_KEY, JSON.stringify(plan));
  }, [plan]);

  useEffect(() => {
    localStorage.setItem(INV_KEY, JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem(FAV_ITEMS_KEY, JSON.stringify(favoriteItemList));
  }, [favoriteItemList]);

  useEffect(() => {
    localStorage.setItem(FAV_STORES_KEY, JSON.stringify(favoriteStoreList));
    // Drop legacy single-store key once migrated
    localStorage.removeItem(FAV_STORE_LEGACY_KEY);
  }, [favoriteStoreList]);

  const setMeal = useCallback((day: DayKey, recipeId: string | null) => {
    setPlan((p) => ({ ...p, [day]: recipeId }));
  }, []);

  const setInventoryQty = useCallback((itemId: string, qty: number) => {
    setInventory((prev) => {
      const next = prev.filter((e) => e.itemId !== itemId);
      if (qty > 0) next.push({ itemId, qty });
      return next.sort((a, b) => a.itemId.localeCompare(b.itemId));
    });
  }, []);

  const addToInventory = useCallback((itemId: string) => {
    setInventory((prev) => {
      const existing = prev.find((e) => e.itemId === itemId);
      if (existing) {
        return prev.map((e) => (e.itemId === itemId ? { ...e, qty: e.qty + 1 } : e));
      }
      return [...prev, { itemId, qty: 1 }];
    });
  }, []);

  const removeFromInventory = useCallback((itemId: string) => {
    setInventory((prev) => prev.filter((e) => e.itemId !== itemId));
  }, []);

  const toggleHaveItem = useCallback((itemId: string, have: boolean, qty = 1) => {
    setInventory((prev) => {
      const without = prev.filter((e) => e.itemId !== itemId);
      if (!have) return without;
      return [...without, { itemId, qty }].sort((a, b) => a.itemId.localeCompare(b.itemId));
    });
  }, []);

  const toggleFavoriteItem = useCallback((itemId: string) => {
    setFavoriteItemList((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId],
    );
  }, []);

  const toggleFavoriteStore = useCallback((id: StoreId) => {
    setFavoriteStoreList((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  }, []);

  const inventoryMap = useMemo(() => {
    const m = new Map<string, number>();
    inventory.forEach((e) => m.set(e.itemId, e.qty));
    return m;
  }, [inventory]);

  const favoriteItems = useMemo(() => new Set(favoriteItemList), [favoriteItemList]);
  const favoriteStores = useMemo(() => new Set(favoriteStoreList), [favoriteStoreList]);

  const buildTripPlan = useCallback((itemIds: string[]): TripStop[] => {
    const byStore = new Map<StoreId, TripStop>();
    itemIds.forEach((itemId) => {
      const item = groceries.find((g) => g.id === itemId);
      if (!item) return;
      const [storeId, price] = cheapestStore(item);
      const store = getStore(storeId);
      const existing = byStore.get(storeId) ?? {
        storeId,
        storeName: store?.name ?? storeId,
        items: [],
        subtotal: 0,
      };
      existing.items.push({ itemId, name: item.name, price, unit: item.unit });
      existing.subtotal = +(existing.subtotal + price).toFixed(2);
      byStore.set(storeId, existing);
    });
    return Array.from(byStore.values()).sort((a, b) => b.items.length - a.items.length);
  }, []);

  const missing = useMemo(() => {
    const needed = new Map<
      string,
      { qty: number; forRecipes: MissingItem['forRecipes'] }
    >();

    (Object.entries(plan) as [DayKey, string | null][]).forEach(([day, recipeId]) => {
      if (!recipeId) return;
      const recipe = getRecipe(recipeId);
      if (!recipe) return;
      recipe.ingredients.forEach((ing) => {
        const cur = needed.get(ing.itemId) ?? { qty: 0, forRecipes: [] };
        cur.qty += ing.qty;
        if (!cur.forRecipes.some((f) => f.recipeId === recipeId && f.day === day)) {
          cur.forRecipes.push({ recipeId, title: recipe.title, day });
        }
        needed.set(ing.itemId, cur);
      });
    });

    const list: MissingItem[] = [];
    needed.forEach((val, itemId) => {
      const have = inventoryMap.get(itemId) ?? 0;
      const shortfall = Math.max(0, +(val.qty - have).toFixed(2));
      if (shortfall <= 0.05) return;
      const item = groceries.find((g) => g.id === itemId);
      if (!item) return;
      const [storeId, price] = cheapestStore(item);
      const dayIdx = bestBuyDay(item);
      list.push({
        itemId,
        name: item.name,
        needed: +val.qty.toFixed(2),
        have,
        unit: item.unit,
        forRecipes: val.forRecipes,
        cheapest: { store: storeId, price },
        bestDay: dayNames[dayIdx],
        bestDayIndex: dayIdx,
        tip: item.bestDayHint,
        estimatedPrice: +(
          price *
          Math.ceil(shortfall || 1) *
          (1 - item.weekdaySavings[dayIdx])
        ).toFixed(2),
        leaderboard: storeLeaderboard(item),
      });
    });

    return list.sort((a, b) => a.bestDayIndex - b.bestDayIndex);
  }, [plan, inventoryMap]);

  const value = useMemo(
    () => ({
      plan,
      inventory,
      setMeal,
      setInventoryQty,
      addToInventory,
      removeFromInventory,
      toggleHaveItem,
      missing,
      inventoryMap,
      favoriteItems,
      toggleFavoriteItem,
      favoriteStores,
      toggleFavoriteStore,
      buildTripPlan,
    }),
    [
      plan,
      inventory,
      setMeal,
      setInventoryQty,
      addToInventory,
      removeFromInventory,
      toggleHaveItem,
      missing,
      inventoryMap,
      favoriteItems,
      toggleFavoriteItem,
      favoriteStores,
      toggleFavoriteStore,
      buildTripPlan,
    ],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider');
  return ctx;
}
