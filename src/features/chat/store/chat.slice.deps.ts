import type { Listing } from '@/types';

// Registered lazily to avoid circular dependency
let _listingsGetter: (() => Listing[]) | null = null;

export function registerListingsGetter(getter: () => Listing[]): void {
  _listingsGetter = getter;
}

export function getListingsSnapshot(): Listing[] {
  return _listingsGetter ? _listingsGetter() : [];
}
