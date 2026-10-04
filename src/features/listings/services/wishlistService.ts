/**
 * Wishlist persistence — Supabase-backed.
 *
 * Replaces the localStorage implementation (src/services/listing.service.ts).
 * Market-scoped: each entry carries market_code so a user's JO and SA 
 * wishlists stay isolated.
 *
 * Never throws — returns { data, error } shape like other services.
 */
import { supabase } from '@/shared/lib/supabase';
import type { MarketCode } from '@/data/markets/types';

interface WishlistRow {
  readonly user_id: string;
  readonly listing_id: string;
  readonly market_code: MarketCode;
  readonly created_at: string;
}

export interface WishlistEntry {
  readonly listingId: string;
  readonly marketCode: MarketCode;
  readonly createdAt: string;
}

function rowToEntry(row: WishlistRow): WishlistEntry {
  return {
    listingId: row.listing_id,
    marketCode: row.market_code,
    createdAt: row.created_at,
  };
}

/**
 * Fetch the user's wishlist.
 * If marketCode is provided → returns only that market's entries.
 * Otherwise → returns all entries across markets (ordered newest first).
 */
export async function fetchWishlist(
  userId: string,
  marketCode?: MarketCode
): Promise<{ data: WishlistEntry[] | null; error: string | null }> {
  if (!userId) return { data: null, error: 'Missing userId' };
  try {
    let query = supabase
      .from('wishlists')
      .select('user_id, listing_id, market_code, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (marketCode) {
      query = query.eq('market_code', marketCode);
    }

    const { data, error } = await query;
    if (error) return { data: null, error: error.message };
    return { data: (data || []).map((r) => rowToEntry(r as WishlistRow)), error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

/** Add listing to wishlist. Idempotent — re-adding is a no-op (upsert). */
export async function addToWishlist(
  userId: string,
  listingId: string,
  marketCode: MarketCode
): Promise<{ error: string | null }> {
  if (!userId || !listingId) return { error: 'Missing userId or listingId' };
  try {
    const { error } = await supabase
      .from('wishlists')
      .upsert(
        { user_id: userId, listing_id: listingId, market_code: marketCode },
        { onConflict: 'user_id,listing_id' }
      );
    return { error: error ? error.message : null };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

/** Remove a listing from wishlist. Idempotent. */
export async function removeFromWishlist(
  userId: string,
  listingId: string
): Promise<{ error: string | null }> {
  if (!userId || !listingId) return { error: 'Missing userId or listingId' };
  try {
    const { error } = await supabase
      .from('wishlists')
      .delete()
      .eq('user_id', userId)
      .eq('listing_id', listingId);
    return { error: error ? error.message : null };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

/** Clear the entire wishlist for a specific market. */
export async function clearWishlistForMarket(
  userId: string,
  marketCode: MarketCode
): Promise<{ error: string | null }> {
  if (!userId) return { error: 'Missing userId' };
  try {
    const { error } = await supabase
      .from('wishlists')
      .delete()
      .eq('user_id', userId)
      .eq('market_code', marketCode);
    return { error: error ? error.message : null };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Unknown error' };
  }
}
