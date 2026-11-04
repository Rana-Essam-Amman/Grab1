import { describe, it, expect } from 'vitest';
import {
  searchLocationsCanonical,
  resolveLocationCanonical,
} from '../locationSearch';
import { getMarketProfile } from '@/data/locations/marketProfiles';
import { matchHierarchyPasses } from '../adapters/hierarchyMatcher';
import { getCountryGeo } from '@/data/locations/registry';

describe('unified location search — six markets', () => {
  it('Arabic and English search parity for JO governorate and locality', () => {
    const ar = searchLocationsCanonical('JO', 'عمان');
    expect(ar.status).toBe('ambiguous');
    expect(ar.candidates.some((c) => c.slug === 'amman' && c.canonicalSlot === 'city_slug')).toBe(true);

    // "Amman" also names a locality under Amman Qasabah, so it must stay ambiguous.
    const en = searchLocationsCanonical('JO', 'Amman');
    expect(en.status).toBe('ambiguous');
    expect(en.candidates.some((c) => c.slug === 'amman' && c.canonicalSlot === 'city_slug')).toBe(true);
    expect(en.candidates.some((c) => c.neighborhoodSlug === 'amman')).toBe(true);

    const locEn = searchLocationsCanonical('JO', 'abdun');
    const locAr = searchLocationsCanonical('JO', 'عبدون');
    expect(locEn.resolved?.neighborhoodSlug).toBe('abdun');
    expect(locAr.resolved?.neighborhoodSlug).toBe('abdun');
    expect(locEn.resolved?.citySlug).toBe('amman');
    expect(locEn.resolved?.districtSlug).toBe('amman-qasabah');
  });

  it('search results include complete parent context and correct slots', () => {
    const area = searchLocationsCanonical('JO', 'amman-qasabah');
    expect(area.resolved?.canonicalSlot).toBe('district_slug');
    expect(area.resolved?.citySlug).toBe('amman');
    expect(area.resolved?.districtSlug).toBe('amman-qasabah');
    expect(area.resolved?.neighborhoodSlug).toBeNull();
    expect(area.resolved?.parentPath.citySlug).toBe('amman');

    const locality = searchLocationsCanonical('SA', 'al-olaya');
    expect(locality.resolved?.canonicalSlot).toBe('district_slug');
    expect(locality.resolved?.citySlug).toBe('riyadh-region');
    expect(locality.resolved?.districtSlug).toBe('riyadh-city');
    expect(locality.resolved?.neighborhoodSlug).toBe('al-olaya');
  });

  it('district result never places district slug in citySlug', () => {
    const result = searchLocationsCanonical('JO', 'amman-qasabah');
    expect(result.resolved?.citySlug).not.toBe(result.resolved?.districtSlug);
    expect(result.resolved?.citySlug).toBe('amman');
  });

  it('duplicate locality without parent context is ambiguous', () => {
    const result = resolveLocationCanonical('JO', 'Al Mansurah');
    expect(result.status).toBe('ambiguous');
    expect(result.confidence).toBe('unresolved');
    expect(result.resolved).toBeNull();
    expect(result.candidates.length).toBeGreaterThan(1);
  });

  it('duplicate locality with valid parent context resolves exactly', () => {
    const result = resolveLocationCanonical('JO', 'Al Mansurah', { districtSlug: 'taybeh' });
    expect(result.status).toBe('unique');
    expect(result.resolved?.citySlug).toBe('irbid');
    expect(result.resolved?.districtSlug).toBe('taybeh');
    expect(result.resolved?.neighborhoodSlug).toBe('al-mansurah');
    expect(result.resolved?.canonicalSlot).toBe('district_slug');
  });

  it('conflicting parent context returns unresolved', () => {
    const result = resolveLocationCanonical('JO', 'Al Mansurah', { citySlug: 'aqaba' });
    expect(result.status).toBe('ambiguous');
    expect(result.confidence).toBe('unresolved');
    expect(result.resolved).toBeNull();
  });

  it('unknown market and empty query return no results', () => {
    expect(searchLocationsCanonical('XX', 'Amman').status).toBe('none');
    expect(resolveLocationCanonical('XX', 'Amman').candidates).toEqual([]);
    expect(searchLocationsCanonical('JO', '   ').status).toBe('none');
    expect(resolveLocationCanonical('JO', '').status).toBe('none');
  });

  it('Kuwait stays two-level and does not fabricate a neighborhood', () => {
    const profile = getMarketProfile('KW');
    expect(profile?.visibleLevels).toHaveLength(2);
    const gov = searchLocationsCanonical('KW', 'al-asimah');
    expect(gov.resolved?.canonicalSlot).toBe('city_slug');
    expect(gov.resolved?.neighborhoodSlug).toBeNull();
    const area = searchLocationsCanonical('KW', 'al-kuwait-city');
    expect(area.resolved?.canonicalSlot).toBe('district_slug');
    expect(area.resolved?.citySlug).toBe('al-asimah');
    expect(area.resolved?.districtSlug).toBe('al-kuwait-city');
    expect(area.resolved?.neighborhoodSlug).toBeNull();
    expect(searchLocationsCanonical('KW', 'nonexistent-village').status).toBe('none');
  });

  it('covers PS, LB, and SY with parent-preserving results', () => {
    const ps = searchLocationsCanonical('PS', 'jenin');
    expect(ps.status).not.toBe('none');
    expect(ps.candidates.every((c) => c.marketCode === 'PS')).toBe(true);

    const lb = searchLocationsCanonical('LB', 'achrafieh');
    expect(lb.resolved?.citySlug).toBe('beirut');
    expect(lb.resolved?.districtSlug).toBe('beirut-city');
    expect(lb.resolved?.neighborhoodSlug).toBe('achrafieh');

    const sy = searchLocationsCanonical('SY', 'al-midan');
    expect(sy.resolved?.citySlug).toBe('damascus');
    expect(sy.resolved?.districtSlug).toBe('damascus-city');
    expect(sy.resolved?.neighborhoodSlug).toBe('al-midan');
  });

  it('JO profile label remains Area and profiles are unchanged', () => {
    const jo = getMarketProfile('JO');
    expect(jo?.visibleLevels[1].labelEn).toBe('Neighbourhood');
    expect(jo?.visibleLevels[1].labelAr).toBe('الحي');
    expect(jo?.visibleLevels[1].canonicalSlot).toBe('district_slug');
    expect(getMarketProfile('SA')?.visibleLevels.map((l) => l.labelEn)).toEqual([
      'Region',
      'City',
    ]);
  });

  it('preserves hierarchyMatcher fail-closed behavior', () => {
    const geo = getCountryGeo('JO');
    expect(geo).not.toBeNull();
    const unique = matchHierarchyPasses(geo!, ['abdun']);
    expect(unique?.neighborhoodSlug).toBe('abdun');
    const ambiguous = matchHierarchyPasses(geo!, ['al mansurah']);
    expect(ambiguous?.confidence).toBe('unresolved');
    const constrained = matchHierarchyPasses(geo!, ['taybeh', 'al mansurah']);
    expect(constrained?.neighborhoodSlug).toBe('al-mansurah');
  });

  it('search and resolve agree that Amman is ambiguous', () => {
    const searched = searchLocationsCanonical('JO', 'Amman');
    const resolved = resolveLocationCanonical('JO', 'Amman');
    expect(searched.status).toBe('ambiguous');
    expect(resolved.status).toBe('ambiguous');
    expect(resolved.confidence).toBe('unresolved');
    expect(resolved.resolved).toBeNull();
    expect(resolved.candidates.length).toBeGreaterThan(1);
  });

  it('search and resolve agree on ambiguity for the same query and parent context', () => {
    const parent = { districtSlug: 'taybeh' };
    const searched = searchLocationsCanonical('JO', 'Al Mansurah', parent);
    const resolved = resolveLocationCanonical('JO', 'Al Mansurah', parent);
    expect(searched.status).toBe('unique');
    expect(resolved.status).toBe('unique');
    expect(resolved.resolved?.neighborhoodSlug).toBe(searched.resolved?.neighborhoodSlug);
    expect(resolved.resolved?.citySlug).toBe(searched.resolved?.citySlug);
    expect(resolved.resolved?.districtSlug).toBe(searched.resolved?.districtSlug);

    const ambiguousSearch = searchLocationsCanonical('JO', 'Amman');
    const ambiguousResolve = resolveLocationCanonical('JO', 'Amman');
    expect(ambiguousSearch.status).toBe(ambiguousResolve.status);
    expect(ambiguousResolve.resolved).toBeNull();
  });

  it('unique locality abdun still resolves and conflicting parent never resolves a candidate', () => {
    const unique = resolveLocationCanonical('JO', 'abdun');
    expect(unique.status).toBe('unique');
    expect(unique.resolved?.neighborhoodSlug).toBe('abdun');
    expect(unique.resolved?.citySlug).toBe('amman');
    expect(unique.resolved?.districtSlug).toBe('amman-qasabah');

    const conflict = resolveLocationCanonical('JO', 'Al Mansurah', { citySlug: 'aqaba' });
    expect(conflict.resolved).toBeNull();
    expect(conflict.status).not.toBe('unique');
  });

  it('search and resolve agree across conflict, disambiguation, ambiguity, and unknown query', () => {
    const conflictParent = { citySlug: 'aqaba' };
    const conflictSearch = searchLocationsCanonical('JO', 'Al Mansurah', conflictParent);
    const conflictResolve = resolveLocationCanonical('JO', 'Al Mansurah', conflictParent);
    expect(conflictSearch.status).toBe('ambiguous');
    expect(conflictSearch.confidence).toBe('unresolved');
    expect(conflictSearch.resolved).toBeNull();
    expect(conflictResolve.status).toBe(conflictSearch.status);
    expect(conflictResolve.confidence).toBe(conflictSearch.confidence);
    expect(conflictResolve.resolved).toBeNull();

    const validParent = { districtSlug: 'taybeh' };
    const validSearch = searchLocationsCanonical('JO', 'Al Mansurah', validParent);
    const validResolve = resolveLocationCanonical('JO', 'Al Mansurah', validParent);
    expect(validSearch.status).toBe('unique');
    expect(validResolve.status).toBe('unique');
    expect(validResolve.resolved?.citySlug).toBe('irbid');
    expect(validResolve.resolved?.districtSlug).toBe('taybeh');
    expect(validResolve.resolved?.neighborhoodSlug).toBe('al-mansurah');
    expect(validResolve.resolved?.neighborhoodSlug).toBe(validSearch.resolved?.neighborhoodSlug);

    const ammanSearch = searchLocationsCanonical('JO', 'Amman');
    const ammanResolve = resolveLocationCanonical('JO', 'Amman');
    expect(ammanSearch.status).toBe('ambiguous');
    expect(ammanResolve.status).toBe('ambiguous');
    expect(ammanResolve.resolved).toBeNull();

    const unknown = 'definitely-not-a-place-xyz';
    expect(searchLocationsCanonical('JO', unknown).status).toBe('none');
    expect(resolveLocationCanonical('JO', unknown).status).toBe('none');
    expect(searchLocationsCanonical('JO', unknown).resolved).toBeNull();
    expect(resolveLocationCanonical('JO', unknown).resolved).toBeNull();
  });
});
