import type { Listing } from '@/types';

// Registered lazily to avoid cross-store import (same pattern as chat.slice.deps)
let _listingsGetter: (() => Listing[]) | null = null;

export function registerListingsGetterForMonetization(getter: () => Listing[]): void {
  _listingsGetter = getter;
}

export function getListingsSnapshot(): Listing[] {
  return _listingsGetter ? _listingsGetter() : [];
}
