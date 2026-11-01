import { describe, it, expect } from 'vitest';
import { resolveGeoLocation } from '../geoResolver';
import { getGeoAdapter } from '../adapters';

describe('GeoResolver — Kuwait (KW) Acceptance Tests', () => {
  const adapter = getGeoAdapter('KW');

  it('1. Correct country detection', () => {
    const res = resolveGeoLocation({ targetMarket: 'KW', textQuery: 'Kuwait City' });
    expect(res.countryCode).toBe('KW');
  });

  it('2. Correct administrative hierarchy resolution', () => {
    const res = resolveGeoLocation({
      targetMarket: 'KW',
      textQuery: 'السالمية',
    });
    expect(res.countryCode).toBe('KW');
    expect(res.governorateSlug).toBe('hawalli');
    expect(res.districtSlug).toBe('salmiya');
    expect(res.confidence).toBe('high');
    expect(res.needsManualSelection).toBe(false);
  });

  it('3. Arabic and English input normalization', () => {
    const resAr = resolveGeoLocation({ targetMarket: 'KW', textQuery: 'الأحمدي' });
    const resEn = resolveGeoLocation({ targetMarket: 'KW', textQuery: 'Al Ahmadi' });
    expect(resAr.governorateSlug).toBe('al-ahmadi');
    expect(resEn.governorateSlug).toBe('al-ahmadi');
  });

  it('4. Locality and landmark matching', () => {
    const res = resolveGeoLocation({
      targetMarket: 'KW',
      textQuery: 'أبراج الكويت',
    });
    expect(res.countryCode).toBe('KW');
    expect(res.neighborhoodSlug).toBe('kuwait-towers');
    expect(res.confidence).toBe('exact');
  });

  it('5. Valid coordinates inside Kuwait market', () => {
    const res = resolveGeoLocation({
      targetMarket: 'KW',
      coordinates: { lat: 29.3759, lng: 47.9774 },
    });
    expect(res.countryCode).toBe('KW');
    expect(res.governorateEn).toBe('Kuwait City');
    expect(res.resolutionSource).toBe('gps');
    expect(res.needsManualSelection).toBe(false);
  });

  it('6. Coordinates outside Kuwait market boundaries', () => {
    const res = resolveGeoLocation({
      targetMarket: 'KW',
      coordinates: { lat: 31.9539, lng: 35.9106 },
    });
    expect(res.countryCode).toBe('KW');
    expect(res.confidence).toBe('unresolved');
    expect(res.needsManualSelection).toBe(true);
  });

  it('7. Ambiguous Google/Nominatim results', () => {
    const res = resolveGeoLocation({
      targetMarket: 'KW',
      externalResult: {
        provider: 'google',
        address: { road: 'Unnamed Desert Road' },
      },
    });
    expect(res.needsManualSelection).toBe(true);
  });

  it('8. Unknown or unsupported locality fallback', () => {
    const res = resolveGeoLocation({
      targetMarket: 'KW',
      textQuery: 'FakeDistrictKW',
    });
    expect(res.needsManualSelection).toBe(true);
    expect(res.governorateSlug).toBe(adapter.getDefaultCapital().slug);
  });

  it('9. Correct canonical IDs and slugs', () => {
    const res = resolveGeoLocation({
      targetMarket: 'KW',
      textQuery: 'خيطان',
    });
    expect(res.governorateSlug).toBe('al-farwaniya');
    expect(res.districtSlug).toBe('khaitan');
  });

  it('10. No cross-market result leakage', () => {
    const res = resolveGeoLocation({
      targetMarket: 'KW',
      textQuery: 'عمان إربد',
    });
    expect(res.countryCode).toBe('KW');
    expect(res.needsManualSelection).toBe(true);
  });
});
