import { describe, it, expect } from 'vitest';
import { resolveGeoLocation } from '../geoResolver';
import { getGeoAdapter } from '../adapters';

describe('GeoResolver — Jordan (JO) Acceptance Tests', () => {
  const adapter = getGeoAdapter('JO');

  it('1. Correct country detection', () => {
    const res = resolveGeoLocation({ targetMarket: 'JO', textQuery: 'Amman' });
    expect(res.countryCode).toBe('JO');
  });

  it('2. Correct administrative hierarchy resolution', () => {
    const res = resolveGeoLocation({
      targetMarket: 'JO',
      textQuery: 'عمان لواء الجامعة',
    });
    expect(res.countryCode).toBe('JO');
    expect(res.governorateSlug).toBe('amman');
    expect(res.governorateAr).toBe('عمان');
    expect(res.districtSlug).toBe('al-jamiah');
    expect(res.confidence).toBe('high');
    expect(res.needsManualSelection).toBe(false);
  });

  it('3. Arabic and English input normalization', () => {
    const resAr = resolveGeoLocation({ targetMarket: 'JO', textQuery: 'عمان' });
    const resEn = resolveGeoLocation({ targetMarket: 'JO', textQuery: 'Amman' });
    expect(resAr.governorateSlug).toBe('amman');
    expect(resEn.governorateSlug).toBe('amman');
  });

  it('4. Locality and neighborhood matching', () => {
    const res = resolveGeoLocation({
      targetMarket: 'JO',
      textQuery: 'إربد الحصن',
    });
    expect(res.countryCode).toBe('JO');
    expect(res.governorateSlug).toBe('irbid');
    expect(res.neighborhoodSlug).toBe('al-hisn');
    expect(res.confidence).toBe('exact');
  });

  it('5. Valid coordinates inside Jordan market', () => {
    const res = resolveGeoLocation({
      targetMarket: 'JO',
      coordinates: { lat: 31.9539, lng: 35.9106 },
    });
    expect(res.countryCode).toBe('JO');
    expect(res.governorateEn).toBe('Amman');
    expect(res.resolutionSource).toBe('gps');
    expect(res.needsManualSelection).toBe(false);
  });

  it('6. Coordinates outside Jordan market boundaries', () => {
    const res = resolveGeoLocation({
      targetMarket: 'JO',
      coordinates: { lat: 24.7136, lng: 46.6753 },
    });
    expect(res.countryCode).toBe('JO');
    expect(res.confidence).toBe('unresolved');
    expect(res.needsManualSelection).toBe(true);
    expect(res.governorateSlug).toBe(adapter.getDefaultCapital().slug);
  });

  it('7. Ambiguous Google/Nominatim results', () => {
    const res = resolveGeoLocation({
      targetMarket: 'JO',
      externalResult: {
        provider: 'google',
        address: { formatted_address: 'Random Unknown Highway 99' },
      },
    });
    expect(res.needsManualSelection).toBe(true);
  });

  it('8. Unknown or unsupported locality fallback', () => {
    const res = resolveGeoLocation({
      targetMarket: 'JO',
      textQuery: 'FakePlaceInJO999',
    });
    expect(res.needsManualSelection).toBe(true);
    expect(res.governorateSlug).toBe(adapter.getDefaultCapital().slug);
  });

  it('9. Correct canonical IDs and slugs', () => {
    const res = resolveGeoLocation({
      targetMarket: 'JO',
      textQuery: 'الزرقاء',
    });
    expect(res.governorateSlug).toBe('zarqa');
  });

  it('10. No cross-market result leakage', () => {
    const res = resolveGeoLocation({
      targetMarket: 'JO',
      textQuery: 'الرياض الملز',
    });
    expect(res.countryCode).toBe('JO');
    expect(res.needsManualSelection).toBe(true);
  });
});
