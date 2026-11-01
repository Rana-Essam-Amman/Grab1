import { describe, it, expect } from 'vitest';
import { resolveGeoLocation } from '../geoResolver';
import { isWithinMarketBounds } from '../marketBounds';
import { CITY_COORDS } from '@/data/locations/coords';
import { getCountryGeo } from '@/data/locations/registry';
import { getGeoAdapter } from '../adapters';
import type { MarketCode } from '../geo.types';
import '@/data/locations/index';

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

  describe('Adversarial Overlap Boundary Tests', () => {
    it('adversarial test: Palestine vs Jordan border region cannot cross-resolve', () => {
      const jerichoCoords = { lat: 31.8667, lng: 35.4500 };
      expect(isWithinMarketBounds('PS', jerichoCoords)).toBe(true);
      expect(isWithinMarketBounds('JO', jerichoCoords)).toBe(false);

      const resInJO = resolveGeoLocation({ targetMarket: 'JO', coordinates: jerichoCoords });
      expect(resInJO.needsManualSelection).toBe(true);
      expect(resInJO.confidence).toBe('unresolved');

      const karamehCoords = { lat: 31.95, lng: 35.58 };
      expect(isWithinMarketBounds('JO', karamehCoords)).toBe(true);
      expect(isWithinMarketBounds('PS', karamehCoords)).toBe(false);

      const resInPS = resolveGeoLocation({ targetMarket: 'PS', coordinates: karamehCoords });
      expect(resInPS.needsManualSelection).toBe(true);
      expect(resInPS.confidence).toBe('unresolved');
    });

    it('adversarial test: Lebanon vs Syria border region cannot cross-resolve', () => {
      const zahleCoords = { lat: 33.8463, lng: 35.9020 };
      expect(isWithinMarketBounds('LB', zahleCoords)).toBe(true);
      expect(isWithinMarketBounds('SY', zahleCoords)).toBe(false);

      const resInSY = resolveGeoLocation({ targetMarket: 'SY', coordinates: zahleCoords });
      expect(resInSY.needsManualSelection).toBe(true);
      expect(resInSY.confidence).toBe('unresolved');

      const dimasCoords = { lat: 33.57, lng: 36.08 };
      expect(isWithinMarketBounds('SY', dimasCoords)).toBe(true);
      expect(isWithinMarketBounds('LB', dimasCoords)).toBe(false);

      const resInLB = resolveGeoLocation({ targetMarket: 'LB', coordinates: dimasCoords });
      expect(resInLB.needsManualSelection).toBe(true);
      expect(resInLB.confidence).toBe('unresolved');
    });
  });

  describe('Provider Country Validation (FIX 2)', () => {
    it('rejects foreign country with coordinates even if city name matches', () => {
      const res = resolveGeoLocation({
        targetMarket: 'JO',
        externalResult: {
          provider: 'google',
          lat: 33.8938,
          lng: 35.5018,
          address: {
            city: 'Amman',
            country: 'Lebanon',
            country_code: 'lb',
          },
        },
      });

      expect(res.countryCode).toBe('JO');
      expect(res.needsManualSelection).toBe(true);
      expect(res.confidence).toBe('fallback');
    });

    it('rejects foreign country without coordinates', () => {
      const res = resolveGeoLocation({
        targetMarket: 'SA',
        externalResult: {
          provider: 'nominatim',
          address: {
            city: 'Riyadh',
            country: 'United Arab Emirates',
            country_code: 'ae',
          },
        },
      });

      expect(res.countryCode).toBe('SA');
      expect(res.needsManualSelection).toBe(true);
      expect(res.confidence).toBe('fallback');
    });

    it('rejects conflicting provider country and coordinates', () => {
      const res = resolveGeoLocation({
        targetMarket: 'JO',
        coordinates: { lat: 31.9539, lng: 35.9106 },
        externalResult: {
          provider: 'google',
          address: {
            city: 'Amman',
            country: 'United States',
            country_code: 'us',
          },
        },
      });

      expect(res.countryCode).toBe('JO');
      expect(res.needsManualSelection).toBe(true);
      expect(res.confidence).toBe('fallback');
    });

    it('handles missing country metadata safely', () => {
      const res = resolveGeoLocation({
        targetMarket: 'JO',
        coordinates: { lat: 31.9539, lng: 35.9106 },
        externalResult: {
          provider: 'google',
          address: {
            city: 'Amman',
          },
        },
      });

      expect(res.countryCode).toBe('JO');
      expect(res.governorateSlug).toBe('amman');
      expect(res.needsManualSelection).toBe(false);
    });

    it('handles ambiguous provider response with fallback to manual selection', () => {
      const res = resolveGeoLocation({
        targetMarket: 'KW',
        externalResult: {
          provider: 'google',
          address: {
            road: 'Unknown Highway Intersection',
            formatted_address: 'Route 80, Desert Section',
          },
        },
      });

      expect(res.countryCode).toBe('KW');
      expect(res.needsManualSelection).toBe(true);
      expect(res.confidence).toBe('fallback');
    });
  });

  describe('Coordinate-to-Canonical Governorates Mapping (FIX 3)', () => {
    it('guarantees every anchor coordinate across all 6 markets maps to a validated canonical governorate slug', () => {
      for (const m of markets) {
        const adapter = getGeoAdapter(m);
        const geo = getCountryGeo(m)!;
        const validGovSlugs = new Set(geo.governorates.map((g) => g.slug));
        const coords = CITY_COORDS[m] || {};

        for (const [cityName, pos] of Object.entries(coords)) {
          const nearest = adapter.getNearestCity(pos);
          expect(nearest).not.toBeNull();
          expect(validGovSlugs.has(nearest!.slug)).toBe(true);
        }
      }
    });
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
