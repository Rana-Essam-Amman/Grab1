import { MONETIZATION_MATRIX } from '@/data/monetization';
import type { Listing } from '@/types';

/**
 * Bump helpers — pure functions on a listing object.
 *
 * Bump state lives in Supabase (listings.bumps_today + bumps_reset_date).
 * The RPC `bump_listing(uuid)` performs the atomic increment + daily reset.
 * Nothing is stored locally anymore.
 */

const MAX_BUMPS_PER_DAY = MONETIZATION_MATRIX.freeLimits.bumpDailyLimit;
export const BUMP_DAILY_LIMIT = MAX_BUMPS_PER_DAY;

type BumpFields = Pick<Listing, 'bumpsToday' | 'bumpsResetDate'>;

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Today's bump count, accounting for the daily reset boundary. */
export function getBumpCount(listing: BumpFields): number {
  if (!listing.bumpsResetDate || listing.bumpsResetDate !== today()) return 0;
  return listing.bumpsToday ?? 0;
}

/** True if the user still has bumps available today for this listing. */
export function canBump(listing: BumpFields): boolean {
  return getBumpCount(listing) < MAX_BUMPS_PER_DAY;
}
