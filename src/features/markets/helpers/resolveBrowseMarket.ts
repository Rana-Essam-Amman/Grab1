import type { MarketCode } from '@/data/markets/types';
import { isValidMarket } from '@/shared/lib/marketGate';

export interface ResolveInput {
  readonly authenticated: boolean;
  readonly userCountry: string | null | undefined;
  readonly geoCountry: string | null | undefined;
  readonly storedBrowseMarket: string | null | undefined;
}

export interface ResolveResult {
  readonly market: MarketCode;
  readonly showContextBanner: boolean;
}

const FALLBACK: MarketCode = 'JO';

export function resolveBrowseMarket(input: ResolveInput): ResolveResult {
  const user = input.userCountry && isValidMarket(input.userCountry)
    ? (input.userCountry as MarketCode) : null;
  const geo = input.geoCountry && isValidMarket(input.geoCountry)
    ? (input.geoCountry as MarketCode) : null;
  const stored = input.storedBrowseMarket && isValidMarket(input.storedBrowseMarket)
    ? (input.storedBrowseMarket as MarketCode) : null;

  if (!input.authenticated || !user) {
    return { market: geo ?? FALLBACK, showContextBanner: false };
  }
  if (stored && stored !== user) {
    return { market: stored, showContextBanner: false };
  }
  if (geo && geo !== user) {
    return { market: user, showContextBanner: true };
  }
  return { market: user, showContextBanner: false };
}
