import { useEffect, useRef } from 'react';
import { useUIStore } from '@/store/ui.slice';
import type { MarketCode } from '@/shared/lib/marketGate';

const VALID_MARKETS: MarketCode[] = ['JO', 'SA', 'LB', 'PS', 'SY', 'KW'];
const GEO_API_URL = 'https://ipapi.co/country_code/';
const FETCH_TIMEOUT_MS = 3000;

function isValidMarket(code: string): code is MarketCode {
  return VALID_MARKETS.includes(code as MarketCode);
}

function hasStoredCountry(): boolean {
  try {
    const stored = globalThis.localStorage?.getItem('catch_browse_country');
    return typeof stored === 'string' && isValidMarket(stored);
  } catch {
    return false;
  }
}

export function useGeoLocation(): void {
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const store = useUIStore.getState();
    if (store.browseMarketOverride) return;
    if (hasStoredCountry()) return;

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    fetch(GEO_API_URL, { signal: controller.signal })
      .then((res) => (res.ok ? res.text() : Promise.reject(new Error('geo-fetch-failed'))))
      .then((text) => {
        const latestStore = useUIStore.getState();
        if (latestStore.browseMarketOverride) return;
        if (hasStoredCountry()) return;

        const code = (text || '').trim().toUpperCase();
        if (!isValidMarket(code)) return;

        useUIStore.setState({ geoCountryCode: code });
        latestStore.setBrowseLocation(code, '', '');
      })
      .catch(() => {
        /* silent — default JO fallback stays */
      })
      .finally(() => window.clearTimeout(timeoutId));

    return () => {
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, []);
}
