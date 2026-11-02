import { describe, it, expect } from 'vitest';
import { resolveGeoLocation } from '../geoResolver';
import { getGeoAdapter } from '../adapters';

describe('GeoResolver — Lebanon (LB) Acceptance Tests', () => {
  const adapter = getGeoAdapter('LB');

  it('1. Correct country detection', () => {
    const res = resolveGeoLocation({ targetMarket: 'LB', textQuery: 'Beirut' });
    expect(res.countryCode).toBe('LB');
  });

  it('2. Correct administrative hierarchy resolution', () => {
    const res = resolveGeoLocation({
      targetMarket: 'LB',
      textQuery: 'الحازمية',
    });
    expect(res.countryCode).toBe('LB');
    expect(res.governorateSlug).toBe('mount-lebanon');
    expect(res.districtSlug).toBe('baabda');
    expect(res.neighborhoodSlug).toBe('hazmieh');
    expect(res.confidence).toBe('exact');
  });

  it('3. Arabic and English input normalization', () => {
    const resAr = resolveGeoLocation({ targetMarket: 'LB', textQuery: 'طرابلس' });
    const resEn = resolveGeoLocation({ targetMarket: 'LB', textQuery: 'Tripoli' });
    expect(resAr.governorateSlug).toBe('north-lebanon');
    expect(resEn.governorateSlug).toBe('north-lebanon');
  });

  it('4. Locality and refugee camp matching', () => {
    const res = resolveGeoLocation({
      targetMarket: 'LB',
      textQuery: 'مخيم برج البراجنة',
    });
    expect(res.countryCode).toBe('LB');
    expect(res.neighborhoodSlug).toBe('burj-el-barajneh-camp');
    expect(res.confidence).toBe('exact');
  });

  it('5. Valid coordinates inside Lebanon market', () => {
    const res = resolveGeoLocation({
      targetMarket: 'LB',
      coordinates: { lat: 33.8938, lng: 35.5018 },
    });
    expect(res.countryCode).toBe('LB');
    expect(res.governorateEn).toBe('Beirut');
    expect(res.resolutionSource).toBe('gps');
    expect(res.needsManualSelection).toBe(false);
  });

  it('6. Coordinates outside Lebanon market boundaries', () => {
    const res = resolveGeoLocation({
      targetMarket: 'LB',
      coordinates: { lat: 31.9539, lng: 35.9106 },
    });
    expect(res.countryCode).toBe('LB');
    expect(res.confidence).toBe('unresolved');
    expect(res.needsManualSelection).toBe(true);
  });

  it('7. Ambiguous Google/Nominatim results', () => {
    const res = resolveGeoLocation({
      targetMarket: 'LB',
      externalResult: {
        provider: 'nominatim',
        address: { road: 'Unnamed Mountain Path' },
      },
    });
    expect(res.needsManualSelection).toBe(true);
  });

  it('8. Unknown or unsupported locality fallback', () => {
    const res = resolveGeoLocation({
      targetMarket: 'LB',
      textQuery: 'UnknownValleyXYZ',
    });
    expect(res.needsManualSelection).toBe(true);
    expect(res.governorateSlug).toBe(adapter.getDefaultCapital().slug);
  });

  it('9. Correct canonical IDs and slugs', () => {
    const res = resolveGeoLocation({
      targetMarket: 'LB',
      textQuery: 'صخرة الروشة',
    });
    expect(res.neighborhoodSlug).toBe('raouche');
    expect(res.confidence).toBe('exact');
  });

  it('10. No cross-market result leakage', () => {
    const res = resolveGeoLocation({
      targetMarket: 'LB',
      textQuery: 'Riyadh Olaya',
    });
    expect(res.countryCode).toBe('LB');
    expect(res.governorateSlug).not.toBe('riyadh');
    expect(res.needsManualSelection).toBe(true);
  });
});
