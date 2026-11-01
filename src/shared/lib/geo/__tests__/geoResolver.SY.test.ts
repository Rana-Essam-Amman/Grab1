import { describe, it, expect } from 'vitest';
import { resolveGeoLocation } from '../geoResolver';
import { getGeoAdapter } from '../adapters';

describe('GeoResolver — Syria (SY) Acceptance Tests', () => {
  const adapter = getGeoAdapter('SY');

  it('1. Correct country detection', () => {
    const res = resolveGeoLocation({ targetMarket: 'SY', textQuery: 'Damascus' });
    expect(res.countryCode).toBe('SY');
  });

  it('2. Correct administrative hierarchy resolution', () => {
    const res = resolveGeoLocation({
      targetMarket: 'SY',
      textQuery: 'داريا',
    });
    expect(res.countryCode).toBe('SY');
    expect(res.governorateSlug).toBe('rif-dimashq');
    expect(res.districtSlug).toBe('darayya');
    expect(res.needsManualSelection).toBe(false);
  });

  it('3. Arabic and English input normalization', () => {
    const resAr = resolveGeoLocation({ targetMarket: 'SY', textQuery: 'حلب' });
    const resEn = resolveGeoLocation({ targetMarket: 'SY', textQuery: 'Aleppo' });
    expect(resAr.governorateSlug).toBe('aleppo');
    expect(resEn.governorateSlug).toBe('aleppo');
  });

  it('4. Locality and landmark matching', () => {
    const res = resolveGeoLocation({
      targetMarket: 'SY',
      textQuery: 'قلعة حلب',
    });
    expect(res.countryCode).toBe('SY');
    expect(res.neighborhoodSlug).toBe('aleppo-citadel');
    expect(res.confidence).toBe('exact');
  });

  it('5. Valid coordinates inside Syria market', () => {
    const res = resolveGeoLocation({
      targetMarket: 'SY',
      coordinates: { lat: 33.5138, lng: 36.2765 },
    });
    expect(res.countryCode).toBe('SY');
    expect(res.governorateEn).toBe('Damascus');
    expect(res.resolutionSource).toBe('gps');
    expect(res.needsManualSelection).toBe(false);
  });

  it('6. Coordinates outside Syria market boundaries', () => {
    const res = resolveGeoLocation({
      targetMarket: 'SY',
      coordinates: { lat: 29.3759, lng: 47.9774 },
    });
    expect(res.countryCode).toBe('SY');
    expect(res.confidence).toBe('unresolved');
    expect(res.needsManualSelection).toBe(true);
  });

  it('7. Ambiguous Google/Nominatim results', () => {
    const res = resolveGeoLocation({
      targetMarket: 'SY',
      externalResult: {
        provider: 'google',
        address: { formatted_address: 'Somewhere unlisted' },
      },
    });
    expect(res.needsManualSelection).toBe(true);
  });

  it('8. Unknown or unsupported locality fallback', () => {
    const res = resolveGeoLocation({
      targetMarket: 'SY',
      textQuery: 'RandomVillage789',
    });
    expect(res.needsManualSelection).toBe(true);
    expect(res.governorateSlug).toBe(adapter.getDefaultCapital().slug);
  });

  it('9. Correct canonical IDs and slugs', () => {
    const res = resolveGeoLocation({
      targetMarket: 'SY',
      textQuery: 'جبلة',
    });
    expect(res.governorateSlug).toBe('latakia');
    expect(res.districtSlug).toBe('latakia-city');
    expect(res.neighborhoodSlug).toBe('jableh');
  });

  it('10. No cross-market result leakage', () => {
    const res = resolveGeoLocation({
      targetMarket: 'SY',
      textQuery: 'Kuwait Salmiya',
    });
    expect(res.countryCode).toBe('SY');
    expect(res.needsManualSelection).toBe(true);
  });
});
