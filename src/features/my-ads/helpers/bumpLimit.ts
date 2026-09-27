import { MONETIZATION_MATRIX } from '@/data/monetization';

const MAX_BUMPS_PER_DAY = MONETIZATION_MATRIX.freeLimits.bumpDailyLimit;
const keyFor = (id: string, day: string) => `bump_${id}_${day}`;
const today = () => new Date().toISOString().slice(0, 10);

export const BUMP_DAILY_LIMIT = MAX_BUMPS_PER_DAY;

export function getBumpCount(listingId: string): number {
  try {
    const raw = localStorage.getItem(keyFor(listingId, today()));
    const n = Number(raw);
    return Number.isFinite(n) && n >= 0 ? n : 0;
  } catch { return 0; }
}

export function canBump(listingId: string): boolean {
  return getBumpCount(listingId) < MAX_BUMPS_PER_DAY;
}

export function recordBump(listingId: string): void {
  try {
    localStorage.setItem(keyFor(listingId, today()), String(getBumpCount(listingId) + 1));
  } catch { /* quota — ignore */ }
}
