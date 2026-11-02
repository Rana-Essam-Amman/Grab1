import { describe, it, expect } from 'vitest';
import { resolveGeoLocation } from '../geoResolver';
import { isWithinMarketBounds } from '../marketBounds';
import { isProviderCountryMatching } from '../providerValidation';
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

  describe('Provider Country Validation (FIX 1 & 2)', () => {
    it('CRITICAL: USA vs SA must reject and never substring match "sa" in "usa"', () => {
      const check = isProviderCountryMatching('SA', {
        provider: 'google',
        address: { country: 'USA' },
      });
      expect(check.matches).toBe(false);
      expect(check.isVerified).toBe(false);

      const res = resolveGeoLocation({
        targetMarket: 'SA',
        externalResult: {
          provider: 'google',
          address: {
            city: 'Riyadh',
            country: 'USA',
          },
        },
      });
      expect(res.countryCode).toBe('SA');
      expect(res.needsManualSelection).toBe(true);
      expect(res.confidence).toBe('fallback');
    });

    it('CRITICAL: United States vs SA must reject', () => {
      const check = isProviderCountryMatching('SA', {
        provider: 'google',
        address: { country: 'United States' },
      });
      expect(check.matches).toBe(false);

      const res = resolveGeoLocation({
        targetMarket: 'SA',
        externalResult: {
          provider: 'google',
          address: { country: 'United States', city: 'Riyadh' },
        },
      });
      expect(res.needsManualSelection).toBe(true);
    });

    it('CRITICAL: United Arab Emirates vs SA must reject', () => {
      const check = isProviderCountryMatching('SA', {
        provider: 'nominatim',
        address: { country: 'United Arab Emirates', country_code: 'ae' },
      });
      expect(check.matches).toBe(false);

      const res = resolveGeoLocation({
        targetMarket: 'SA',
        externalResult: {
          provider: 'nominatim',
          address: { city: 'Riyadh', country: 'United Arab Emirates', country_code: 'ae' },
        },
      });
      expect(res.needsManualSelection).toBe(true);
    });

    it('Saudi Arabia vs SA must accept', () => {
      const check = isProviderCountryMatching('SA', {
        provider: 'google',
        address: { country: 'Saudi Arabia', country_code: 'sa' },
      });
      expect(check.matches).toBe(true);
      expect(check.isVerified).toBe(true);
    });

    it('SA vs SA must accept', () => {
      const check = isProviderCountryMatching('SA', {
        provider: 'google',
        address: { country_code: 'sa' },
      });
      expect(check.matches).toBe(true);
    });

    it('Exact Arabic Saudi Arabia aliases must accept', () => {
      const check1 = isProviderCountryMatching('SA', {
        provider: 'google',
        address: { country: 'المملكة العربية السعودية' },
      });
      expect(check1.matches).toBe(true);

      const check2 = isProviderCountryMatching('SA', {
        provider: 'google',
        address: { country: 'السعودية' },
      });
      expect(check2.matches).toBe(true);
    });

    it('Missing country metadata must remain unverified and hasMetadata false', () => {
      const check = isProviderCountryMatching('SA', {
        provider: 'google',
        address: { city: 'Riyadh' },
      });
      expect(check.matches).toBe(false);
      expect(check.isVerified).toBe(false);
      expect(check.hasMetadata).toBe(false);
    });

    it('Conflicting country metadata must reject even with target coordinates', () => {
      const res = resolveGeoLocation({
        targetMarket: 'JO',
        coordinates: { lat: 31.9539, lng: 35.9106 },
        externalResult: {
          provider: 'google',
          address: {
            city: 'Amman',
            country: 'France',
            country_code: 'fr',
          },
        },
      });
      expect(res.countryCode).toBe('JO');
      expect(res.needsManualSelection).toBe(true);
    });

    it('All six FOX markets are validated against their canonical names', () => {
      expect(isProviderCountryMatching('JO', { provider: 'google', address: { country_code: 'jo' } }).matches).toBe(true);
      expect(isProviderCountryMatching('SA', { provider: 'google', address: { country_code: 'sa' } }).matches).toBe(true);
      expect(isProviderCountryMatching('PS', { provider: 'google', address: { country_code: 'ps' } }).matches).toBe(true);
      expect(isProviderCountryMatching('LB', { provider: 'google', address: { country_code: 'lb' } }).matches).toBe(true);
      expect(isProviderCountryMatching('SY', { provider: 'google', address: { country_code: 'sy' } }).matches).toBe(true);
      expect(isProviderCountryMatching('KW', { provider: 'google', address: { country_code: 'kw' } }).matches).toBe(true);

      // Negative checks
      expect(isProviderCountryMatching('JO', { provider: 'google', address: { country_code: 'sa' } }).matches).toBe(false);
      expect(isProviderCountryMatching('KW', { provider: 'google', address: { country_code: 'kwx' } }).matches).toBe(false);
    });
  });

  describe('Coordinate-to-Canonical Governorates Mapping (FIX 3)', () => {
    it('guarantees every anchor coordinate across all 6 markets maps to a validated canonical governorate slug', () => {
      for (const m of markets) {
        const adapter = getGeoAdapter(m);
        const geo = getCountryGeo(m)!;
        const validGovSlugs = new Set(geo.governorates.map((g) => g.slug));
        const coords = CITY_COORDS[m] || {};

        for (const [, pos] of Object.entries(coords)) {
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

  describe('Canonical Default-Capital Slugs (FIX 2)', () => {
    it('verifies that every market default capital resolves to an existing canonical governorate in the registry', () => {
      const allMarkets: MarketCode[] = ['JO', 'SA', 'PS', 'LB', 'SY', 'KW'];
      for (const m of allMarkets) {
        const adapter = getGeoAdapter(m);
        const cap = adapter.getDefaultCapital();
        const geo = getCountryGeo(m)!;
        const exists = geo.governorates.some((g) => g.slug === cap.slug);
        expect(exists).toBe(true);
      }
    });

    it('specifically verifies Kuwait default capital resolves to canonical al-asimah and not manufactured slug', () => {
      const adapter = getGeoAdapter('KW');
      const cap = adapter.getDefaultCapital();
      expect(cap.slug).toBe('al-asimah');
    });
  });

  describe('MultiPolygon Geometry & Boundary Safety (FIX 4)', () => {
    it('verifies Palestine West Bank and Gaza Strip separately in MultiPolygon', () => {
      // Gaza City (Gaza component)
      const gazaCoords = { lat: 31.5017, lng: 34.4668 };
      expect(isWithinMarketBounds('PS', gazaCoords)).toBe(true);

      // Ramallah (West Bank component)
      const ramallahCoords = { lat: 31.9038, lng: 35.2034 };
      expect(isWithinMarketBounds('PS', ramallahCoords)).toBe(true);
    });

    it('rejects inverted latitude and longitude coordinates', () => {
      // Amman inverted: lat 35.9106, lng 31.9539
      const inverted = { lat: 35.9106, lng: 31.9539 };
      expect(isWithinMarketBounds('JO', inverted)).toBe(false);
    });

    it('rejects completely out-of-range coordinates', () => {
      expect(isWithinMarketBounds('JO', { lat: 95.0, lng: 35.0 })).toBe(false);
      expect(isWithinMarketBounds('JO', { lat: 31.0, lng: 200.0 })).toBe(false);
    });
  });
