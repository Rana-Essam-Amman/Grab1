import { MONETIZATION_MATRIX } from '@/data/monetization';
import { marketStorage } from '@/shared/lib/marketStorage';
import { isValidMarketCode } from '@/data/markets/config';
import type { MarketCode } from '@/data/markets/types';
import { getBrowseCountryCode } from '@/shared/store-getters/ui.getter';

const MAX_BUMPS_PER_DAY = MONETIZATION_MATRIX.freeLimits.bumpDailyLimit;

export const BUMP_DAILY_LIMIT = MAX_BUMPS_PER_DAY;

/**
 * Bump counters are MARKET-SCOPED and routed through marketStorage so they:
 *   - never collide across markets on the same device
 *   - are cleaned up on account deletion (registered in userDataRegistry)
 *   - never bypass the storage helper (self-enforcing via `storage/useScoped` test)
 */
function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function keyFor(listingId: string): string {
  return `bump_${listingId}_${today()}`;
}

function getStore() {
  const market = getBrowseCountryCode();
  if (!isValidMarketCode(market)) return null;
  return marketStorage(market as MarketCode);
}

export function getBumpCount(listingId: string): number {
  try {
    const store = getStore();
    if (!store) return 0;
    const raw = store.get<string | number>(keyFor(listingId));
    const n = typeof raw === 'number' ? raw : Number(raw);
    return Number.isFinite(n) && n >= 0 ? n : 0;
  } catch {
    return 0;
  }
}

export function canBump(listingId: string): boolean {
  return getBumpCount(listingId) < MAX_BUMPS_PER_DAY;
}

export function recordBump(listingId: string): void {
  try {
    const store = getStore();
    if (!store) return;
    store.set(keyFor(listingId), getBumpCount(listingId) + 1);
  } catch {
    /* quota — ignore */
  }
}
