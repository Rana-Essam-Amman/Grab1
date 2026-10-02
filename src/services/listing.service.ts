import { z } from 'zod';
import { scopedKey } from '@/data/markets/storage';
import { Listing } from '../types';
import { ListingSchema } from '../schemas/listing.schema';
import { readValidated, writeValidated } from '../shared/lib/safeStorage';
import { seedListings } from '../data/seedListings';
import { executeAutoBumpScheduler as runBumpScheduler } from '../data/monetization';


const ListingsArraySchema = z.array(ListingSchema);
const WishlistArraySchema = z.array(z.string());

export function getListingsFromStorage(): Listing[] {
  // Read and validate using safeStorage with fallback to empty array
  const parsed = readValidated<Listing[]>('catch_listings', ListingsArraySchema, []);
  let rawListings = seedListings;

  if (parsed.length > 0) {
    const userCreated = parsed.filter(pl => pl && !seedListings.some(sl => sl.id === pl.id));
    rawListings = [...userCreated, ...seedListings];
  }

  return executeAutoBumpScheduler(rawListings);
}

export function saveListingsToStorage(listings: Listing[]): void {
  writeValidated('catch_listings', ListingsArraySchema, listings);
}

export function getWishlistKey(market: string): string {
  return scopedKey(market, 'wishlist');
}

function getLegacyWishlistKey(market: string): string {
  return `catch_wishlist_${market}`;
}

export function getWishlistForMarket(market: string): string[] {
  const canonicalKey = getWishlistKey(market);

  const canonical = readValidated<string[] | null>(
    canonicalKey,
    WishlistArraySchema,
    null,
  );
  if (canonical) return canonical;

  const legacyKey = getLegacyWishlistKey(market);
  const legacy = readValidated<string[] | null>(
    legacyKey,
    WishlistArraySchema,
    null,
  );
  if (legacy) {
    writeValidated(canonicalKey, WishlistArraySchema, legacy);
    try { localStorage.removeItem(legacyKey); } catch {}
    return legacy;
  }

  if (market === 'JO') {
    const globalWishlist = readValidated<string[] | null>(
      'catch_wishlist',
      WishlistArraySchema,
      null,
    );
    if (globalWishlist) {
      writeValidated(canonicalKey, WishlistArraySchema, globalWishlist);
      try { localStorage.removeItem('catch_wishlist'); } catch {}
      return globalWishlist;
    }

    const globalFavorites = readValidated<string[] | null>(
      'catch_favorites',
      WishlistArraySchema,
      null,
    );
    if (globalFavorites) {
      writeValidated(canonicalKey, WishlistArraySchema, globalFavorites);
      try { localStorage.removeItem('catch_favorites'); } catch {}
      return globalFavorites;
    }

    return ['jo-1'];
  }

  return [`${market.toLowerCase()}-1`];
}

export function saveWishlistForMarket(market: string, ids: string[]): void {
  writeValidated(getWishlistKey(market), WishlistArraySchema, ids);
}

export function executeAutoBumpScheduler(listings: Listing[]): Listing[] {
  return runBumpScheduler(listings);
}
