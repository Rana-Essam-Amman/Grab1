import { describe, it, expect } from 'vitest';
import { resolveGeoLocation } from '../geoResolver';
import { getGeoAdapter } from '../adapters';

describe('GeoResolver — Saudi Arabia (SA) Acceptance Tests', () => {
  const adapter = getGeoAdapter('SA');

  it('1. Correct country detection', () => {
    const res = resolveGeoLocation({ targetMarket: 'SA', textQuery: 'Riyadh' });
    expect(res.countryCode).toBe('SA');
  });

  it('2. Correct administrative hierarchy resolution', () => {
    const res = resolveGeoLocation({
      targetMarket: 'SA',
      textQuery: 'الدرعية',
    });
    expect(res.countryCode).toBe('SA');
    expect(res.governorateSlug).toBe('riyadh-region');
    expect(res.districtSlug).toBe('al-diriyah');
    expect(res.districtAr).toBe('الدرعية');
    expect(res.needsManualSelection).toBe(false);
  });

  it('3. Arabic and English input normalization', () => {
    const resAr = resolveGeoLocation({ targetMarket: 'SA', textQuery: 'الرياض' });
    const resEn = resolveGeoLocation({ targetMarket: 'SA', textQuery: 'Riyadh' });
    expect(resAr.governorateSlug).toBe('riyadh-region');
    expect(resEn.governorateSlug).toBe('riyadh-region');
  });

  it('4. Locality and landmark matching', () => {
    const res = resolveGeoLocation({
      targetMarket: 'SA',
      textQuery: 'المملكة سنتر',
    });
    expect(res.countryCode).toBe('SA');
    expect(res.neighborhoodSlug).toBe('kingdom-centre');
    expect(res.confidence).toBe('exact');
  });

  it('5. Valid coordinates inside Saudi Arabia market', () => {
    const res = resolveGeoLocation({
      targetMarket: 'SA',
      coordinates: { lat: 21.5433, lng: 39.1728 },
    });
    expect(res.countryCode).toBe('SA');
    expect(res.governorateEn).toBe('Jeddah');
    expect(res.resolutionSource).toBe('gps');
    expect(res.needsManualSelection).toBe(false);
  });

  it('6. Coordinates outside Saudi Arabia market boundaries', () => {
    const res = resolveGeoLocation({
      targetMarket: 'SA',
      coordinates: { lat: 33.8938, lng: 35.5018 },
    });
    expect(res.countryCode).toBe('SA');
    expect(res.confidence).toBe('unresolved');
    expect(res.needsManualSelection).toBe(true);
    expect(res.governorateSlug).toBe(adapter.getDefaultCapital().slug);
  });

  it('7. Ambiguous Google/Nominatim results', () => {
    const res = resolveGeoLocation({
      targetMarket: 'SA',
      externalResult: {
        provider: 'google',
        address: { formatted_address: 'Unknown Street SA 999' },
      },
    });
    expect(res.needsManualSelection).toBe(true);
  });

  it('8. Unknown or unsupported locality fallback', () => {
    const res = resolveGeoLocation({
      targetMarket: 'SA',
      textQuery: 'NonExistentCitySA',
    });
    expect(res.needsManualSelection).toBe(true);
    expect(res.governorateSlug).toBe(adapter.getDefaultCapital().slug);
  });

  it('9. Correct canonical IDs and slugs', () => {
    const res = resolveGeoLocation({
      targetMarket: 'SA',
      textQuery: 'Dammam',
    });
    expect(res.governorateSlug).toBe('eastern-province');
    expect(res.governorateEn).toBe('Eastern Province');
  });

  it('10. No cross-market result leakage', () => {
    const res = resolveGeoLocation({
      targetMarket: 'SA',
      textQuery: 'عمان العبدلي',
    });
    expect(res.countryCode).toBe('SA');
    expect(res.needsManualSelection).toBe(true);
  });
});
