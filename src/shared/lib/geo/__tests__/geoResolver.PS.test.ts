import { describe, it, expect } from 'vitest';
import { resolveGeoLocation } from '../geoResolver';
import { getGeoAdapter } from '../adapters';

describe('GeoResolver — Palestine (PS) Acceptance Tests', () => {
  const adapter = getGeoAdapter('PS');

  it('1. Correct country detection', () => {
    const res = resolveGeoLocation({ targetMarket: 'PS', textQuery: 'Jerusalem' });
    expect(res.countryCode).toBe('PS');
  });

  it('2. Correct administrative hierarchy resolution', () => {
    const res = resolveGeoLocation({
      targetMarket: 'PS',
      textQuery: 'بيتا',
    });
    expect(res.countryCode).toBe('PS');
    expect(res.governorateSlug).toBe('nablus');
    expect(res.districtSlug).toBe('nablus-city');
    expect(res.neighborhoodSlug).toBe('beita');
    expect(res.neighborhoodAr).toBe('بيتا');
    expect(res.confidence).toBe('exact');
  });

  it('3. Arabic and English input normalization', () => {
    const resAr = resolveGeoLocation({ targetMarket: 'PS', textQuery: 'القدس' });
    const resEn = resolveGeoLocation({ targetMarket: 'PS', textQuery: 'Jerusalem' });
    expect(resAr.governorateSlug).toBe('jerusalem');
    expect(resEn.governorateSlug).toBe('jerusalem');
  });

  it('4. Locality and refugee camp matching', () => {
    const res = resolveGeoLocation({
      targetMarket: 'PS',
      textQuery: 'مخيم جنين',
    });
    expect(res.countryCode).toBe('PS');
    expect(res.governorateSlug).toBe('jenin');
    expect(res.neighborhoodSlug).toBe('jenin-camp');
    expect(res.confidence).toBe('exact');
  });

  it('5. Valid coordinates inside Palestine market', () => {
    const res = resolveGeoLocation({
      targetMarket: 'PS',
      coordinates: { lat: 31.9038, lng: 35.2034 },
    });
    expect(res.countryCode).toBe('PS');
    expect(res.governorateEn).toBe('Ramallah');
    expect(res.resolutionSource).toBe('gps');
    expect(res.needsManualSelection).toBe(false);
  });

  it('6. Coordinates outside Palestine market boundaries', () => {
    const res = resolveGeoLocation({
      targetMarket: 'PS',
      coordinates: { lat: 33.5138, lng: 36.2765 },
    });
    expect(res.countryCode).toBe('PS');
    expect(res.confidence).toBe('unresolved');
    expect(res.needsManualSelection).toBe(true);
  });

  it('7. Ambiguous Google/Nominatim results', () => {
    const res = resolveGeoLocation({
      targetMarket: 'PS',
      externalResult: {
        provider: 'google',
        address: { formatted_address: 'Some Unknown Unmapped Street' },
      },
    });
    expect(res.countryCode).toBe('PS');
    expect(res.confidence).toBe('fallback');
    expect(res.needsManualSelection).toBe(true);
  });

  it('8. Unknown or unsupported locality fallback', () => {
    const res = resolveGeoLocation({
      targetMarket: 'PS',
      textQuery: 'RandomNonExistentPlace 12345',
    });
    expect(res.needsManualSelection).toBe(true);
    expect(res.governorateSlug).toBe(adapter.getDefaultCapital().slug);
  });

  it('9. Correct canonical IDs and slugs', () => {
    const res = resolveGeoLocation({
      targetMarket: 'PS',
      textQuery: 'حلحول',
    });
    expect(res.governorateSlug).toBe('hebron');
    expect(res.districtSlug).toBe('hebron-city');
    expect(res.neighborhoodSlug).toBe('halhul');
  });

  it('10. No cross-market result leakage', () => {
    const res = resolveGeoLocation({
      targetMarket: 'PS',
      textQuery: 'عمان الأردن',
    });
    expect(res.countryCode).toBe('PS');
    expect(res.governorateSlug).not.toBe('amman');
    expect(res.needsManualSelection).toBe(true);
  });
});
