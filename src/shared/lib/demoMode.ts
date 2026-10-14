import { seedListings } from '@/data/seedListings';
import type { Listing } from '@/types';

/**
 * Demo mode for testing: brings seed listings back into the store.
 * Activated by either:
 *   - VITE_DEMO_MODE=true (build-time, e.g. Cloudflare preview)
 *   - ?demo=1 in the URL (session-only, works on production)
 *
 * Production default = disabled → store contains real DB listings only.
 */
export function isDemoMode(): boolean {
  if (import.meta.env.VITE_DEMO_MODE === 'true') return true;
  try {
    return new URLSearchParams(window.location.search).get('demo') === '1';
  } catch {
    return false;
  }
}

/**
 * Append seed listings when demo mode is on. Deduped against `listings`
 * so a seed ID that collides with a real ID is skipped.
 * No-op when demo mode is off.
 */
export function withDemoSeeds(listings: Listing[]): Listing[] {
  if (!isDemoMode()) return listings;
  const existing = new Set(listings.map((l) => l.id));
  const seedsToAdd = seedListings.filter((s) => !existing.has(s.id));
  return [...listings, ...seedsToAdd];
}
