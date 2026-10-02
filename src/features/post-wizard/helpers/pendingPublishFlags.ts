import { marketStorage } from '@/shared/lib/marketStorage';
import { isValidMarketCode } from '@/data/markets/config';
import type { MarketCode } from '@/data/markets/types';

type PendingScreen = 'post-ai-review' | 'post-details';

/**
 * Persist a pending-publish flag scoped to the current market.
 * Used before redirecting a visitor to login, so the flow can resume
 * after sign-in — WITHOUT leaking across markets.
 */
export function setPendingPublish(market: string | undefined, screen: PendingScreen): void {
  if (!isValidMarketCode(market)) return;
  const store = marketStorage(market as MarketCode);
  store.set('pending_publish', 'true');
  store.set('pending_publish_screen', screen);
}
