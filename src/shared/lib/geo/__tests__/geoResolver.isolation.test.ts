import { describe, it, expect } from 'vitest';
import { resolveGeoLocation } from '../geoResolver';
import { isWithinMarketBounds } from '../marketBounds';
import type { MarketCode } from '../geo.types';

describe('GeoResolver — Cross-Market Isolation & Safety Tests', () => {
  const markets: MarketCode[] = ['JO', 'SA', 'PS', 'LB', 'SY', 'KW'];

  const marketCoordinates: Record<MarketCode, { lat: number; lng: number; city: string }> = {
    JO: { lat: 31.9539, lng: 35.9106, city: 'Amman' },
    SA: { lat: 24.7136, lng: 46.6753, city: 'Riyadh' },
    PS: { lat: 31.7683, lng: 35.2137, city: 'Jerusalem' },
    LB: { lat: 33.8938, lng: 35.5018, city: 'Beirut' },
    SY: { lat: 33.5138, lng: 36.2765, city: 'Damascus' },
    KW: { lat: 29.3759, lng: 47.9774, city: 'Kuwait City' },
  };

  it('strictly isolates coordinate resolution to target market bounds', () => {
    for (const targetMarket of markets) {
      for (const [coordMarket, sample] of Object.entries(marketCoordinates) as [MarketCode, { lat: number; lng: number }][]) {
        if (targetMarket === coordMarket) {
          expect(isWithinMarketBounds(targetMarket, sample)).toBe(true);
        } else {
          const res = resolveGeoLocation({
            targetMarket,
            coordinates: sample,
          });

          if (!isWithinMarketBounds(targetMarket, sample)) {
            expect(res.confidence).toBe('unresolved');
            expect(res.needsManualSelection).toBe(true);
          }
        }
      }
    }
  });

  it('rejects foreign Google/Nominatim queries and prevents cross-market entity contamination', () => {
    for (const targetMarket of markets) {
      for (const [foreignMarket, sample] of Object.entries(marketCoordinates)) {
        if (targetMarket === foreignMarket) continue;

        const res = resolveGeoLocation({
          targetMarket,
          externalResult: {
            provider: 'google',
            address: {
              city: sample.city,
              country: foreignMarket,
            },
          },
        });

        expect(res.countryCode).toBe(targetMarket);
        expect(res.needsManualSelection).toBe(true);
      }
    }
  });

  it('never invents or assumes Jordan defaults when resolving in another market', () => {
    const nonJordanMarkets: MarketCode[] = ['SA', 'PS', 'LB', 'SY', 'KW'];

    for (const market of nonJordanMarkets) {
      const res = resolveGeoLocation({
        targetMarket: market,
        textQuery: 'NonExistentLocalityName',
      });

      expect(res.countryCode).toBe(market);
      expect(res.governorateSlug).not.toBe('amman');
      expect(res.needsManualSelection).toBe(true);
    }
  });
});
