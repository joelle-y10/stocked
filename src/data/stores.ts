import type { Store } from './types';

/** Canadian grocery chains used for price comparison (CAD). */
export const stores: Store[] = [
  { id: 'costco', name: 'Costco', short: 'Costco', color: '#E31837' },
  // Real Canadian Superstore (Loblaws banner) — always “Superstore”, never mangled names
  { id: 'superstore', name: 'Superstore', short: 'Superstore', color: '#ED1C24' },
  { id: 'walmart', name: 'Walmart', short: 'Walmart', color: '#0071CE' },
  { id: 'nofrills', name: 'No Frills', short: 'No Frills', color: '#FFD200' },
  { id: 'freshco', name: 'FreshCo', short: 'FreshCo', color: '#F7941D' },
  { id: 'foodbasics', name: 'Food Basics', short: 'Basics', color: '#6B2D5B' },
];

/** As-of label for approximate prices shown in the UI. */
export const PRICE_AS_OF = 'July 2026';

export const days = [
  { key: 'monday', label: 'Monday', short: 'Mon' },
  { key: 'tuesday', label: 'Tuesday', short: 'Tue' },
  { key: 'wednesday', label: 'Wednesday', short: 'Wed' },
  { key: 'thursday', label: 'Thursday', short: 'Thu' },
  { key: 'friday', label: 'Friday', short: 'Fri' },
  { key: 'saturday', label: 'Saturday', short: 'Sat' },
  { key: 'sunday', label: 'Sunday', short: 'Sun' },
] as const;

export const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function getStore(id: string) {
  return stores.find((s) => s.id === id);
}
