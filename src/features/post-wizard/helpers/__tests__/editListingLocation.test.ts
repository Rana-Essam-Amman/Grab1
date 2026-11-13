import { describe, it, expect } from 'vitest';
import { getMarketProfile } from '@/data/locations/marketProfiles';
import '@/data/locations/JO.geo';
import '@/data/locations/SA.geo';
import '@/data/locations/KW.geo';
import {
  loadEditLocation, sameEditLocation, clearEditLocation,
  selectGovernorate, selectDistrict, selectLocality, selectJordanLocation,
  resolveUniqueChildSlug, resolveLegacySafely,
} from '../editListingLocation';

describe('editListingLocation', () => {
  it('loads existing canonical location without inventing', () => {
    const loaded = loadEditLocation({
      city: 'Amman', neighborhood: 'Abdun',
      citySlug: 'amman', districtSlug: 'amman-qasabah', neighborhoodSlug: 'abdun',
    });
    expect(loaded.citySlug).toBe('amman');
    expect(loaded.districtSlug).toBe('amman-qasabah');
    expect(loaded.neighborhoodSlug).toBe('abdun');
  });

  it('handles legacy slugless location safely', () => {
    const loaded = loadEditLocation({ city: 'Amman', neighborhood: 'Al Mansurah' });
    expect(loaded.city).toBe('Amman');
    expect(loaded.citySlug).toBeUndefined();
    expect(loaded.neighborhoodSlug).toBeUndefined();
  });

  it('changing parent clears stale children', () => {
    const next = selectGovernorate(false, { slug: 'zarqa', nameAr: 'الزرقاء', nameEn: 'Zarqa' });
    expect(next.districtSlug).toBe('');
    expect(next.neighborhoodSlug).toBe('');
    expect(next.neighborhood).toBe('');
  });

  it('changing district clears stale locality', () => {
    const prev = { city: 'Amman', neighborhood: 'Old', citySlug: 'amman', districtSlug: 'old', neighborhoodSlug: 'old-n' };
    const next = selectDistrict(prev, false, { slug: 'new-d', nameAr: 'جديد', nameEn: 'New' });
    expect(next.districtSlug).toBe('new-d');
    expect(next.neighborhoodSlug).toBe('');
  });

  it('Jordan picker selection resolves correct canonical fields', () => {
    const selected = selectJordanLocation(false, {
      id: 'v1', nameAr: 'عبدون', nameEn: 'Abdun', parentPathAr: '', parentPathEn: '',
      cityAr: 'العاصمة', cityEn: 'Amman', citySlug: 'amman', districtSlug: 'amman-qasabah',
      neighborhoodSlug: 'abdun', type: 'village',
    });
    expect(selected.city).toBe('Amman');
    expect(selected.citySlug).toBe('amman');
    expect(selected.districtSlug).toBe('amman-qasabah');
    expect(selected.neighborhoodSlug).toBe('abdun');
  });

  it('non-Jordan hierarchy selection works', () => {
    const gov = selectGovernorate(false, { slug: 'riyadh-region', nameAr: 'الرياض', nameEn: 'Riyadh' });
    const dist = selectDistrict(gov, false, { slug: 'riyadh-city', nameAr: 'الرياض', nameEn: 'Riyadh City' });
    const loc = selectLocality(dist, false, { slug: 'al-olaya', nameAr: 'العليا', nameEn: 'Al Olaya' });
    expect(loc.citySlug).toBe('riyadh-region');
    expect(loc.districtSlug).toBe('riyadh-city');
    expect(loc.neighborhoodSlug).toBe('al-olaya');
    expect(loc.neighborhood).toBe('Al Olaya');
  });

  it('unchanged location produces no payload difference', () => {
    const initial = loadEditLocation({ city: 'Amman', neighborhood: 'Abdun', citySlug: 'amman' });
    expect(sameEditLocation(initial, { ...initial })).toBe(true);
  });

  it('Arabic and English labels are preserved in selection', () => {
    const ar = selectGovernorate(true, { slug: 'amman', nameAr: 'عمان', nameEn: 'Amman' });
    const en = selectGovernorate(false, { slug: 'amman', nameAr: 'عمان', nameEn: 'Amman' });
    expect(ar.city).toBe('عمان');
    expect(en.city).toBe('Amman');
  });

  it('invalid or ambiguous selection does not invent slug', () => {
    expect(resolveUniqueChildSlug('JO', 'maan', 'Al Mansurah')).toBeUndefined();
    const legacy = resolveLegacySafely('JO', 'Amman', 'Al Mansurah');
    expect(legacy.citySlug).toBeUndefined();
    expect(legacy.neighborhoodSlug).toBeUndefined();
  });

  it('clear sets empty validated state', () => {
    const cleared = clearEditLocation();
    expect(cleared.city).toBe('');
    expect(cleared.citySlug).toBe('');
    expect(cleared.districtSlug).toBe('');
  });

  it('covers market profiles without hardcoding defaults', () => {
    expect(getMarketProfile('JO')?.visibleLevels).toHaveLength(3);
    expect(getMarketProfile('SA')?.visibleLevels).toHaveLength(3);
    expect(getMarketProfile('KW')?.visibleLevels).toHaveLength(3);
    expect(getMarketProfile('XX')).toBeNull();
  });
});
