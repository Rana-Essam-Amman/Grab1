import { describe, it, expect } from 'vitest';
import { matchHierarchyPasses } from '../adapters/hierarchyMatcher';
import { getCountryGeo } from '@/data/locations/registry';
import '@/data/locations/JO.geo';

describe('hierarchyMatcher — duplicate locality ambiguity (JO)', () => {
  const geo = getCountryGeo('JO');
  if (!geo) throw new Error('JO geo missing');

  it('unique locality-only match resolves successfully', () => {
    const result = matchHierarchyPasses(geo, ['abdun']);
    expect(result).not.toBeNull();
    expect(result?.neighborhoodSlug).toBe('abdun');
    expect(result?.confidence).toBe('exact');
    expect(result?.needsManualSelection).toBe(false);
    expect(result?.governorateSlug).toBe('amman');
    expect(result?.districtSlug).toBe('amman-qasabah');
  });

  it('duplicate locality-only match returns unresolved instead of first hit', () => {
    const result = matchHierarchyPasses(geo, ['al mansurah']);
    expect(result).not.toBeNull();
    expect(result?.confidence).toBe('unresolved');
    expect(result?.needsManualSelection).toBe(true);
    expect(result?.governorateSlug).toBeNull();
    expect(result?.districtSlug).toBeNull();
    expect(result?.neighborhoodSlug).toBeNull();
  });

  it('parent-constrained duplicate resolves to the exact canonical record', () => {
    const result = matchHierarchyPasses(geo, ['taybeh', 'al mansurah']);
    expect(result).not.toBeNull();
    expect(result?.confidence).toBe('exact');
    expect(result?.needsManualSelection).toBe(false);
    expect(result?.governorateSlug).toBe('irbid');
    expect(result?.districtSlug).toBe('taybeh');
    expect(result?.neighborhoodSlug).toBe('al-mansurah');
  });

  it('conflicting governorate + locality returns unresolved (no approximate fallback)', () => {
    const result = matchHierarchyPasses(geo, ['aqaba', 'al mansurah']);
    expect(result).not.toBeNull();
    expect(result?.confidence).toBe('unresolved');
    expect(result?.needsManualSelection).toBe(true);
    expect(result?.governorateSlug).toBeNull();
    expect(result?.districtSlug).toBeNull();
    expect(result?.neighborhoodSlug).toBeNull();
  });

  it('conflicting district + locality returns unresolved (no district-only success)', () => {
    const result = matchHierarchyPasses(geo, ['taybeh', 'abdun']);
    expect(result).not.toBeNull();
    expect(result?.confidence).toBe('unresolved');
    expect(result?.needsManualSelection).toBe(true);
    expect(result?.governorateSlug).toBeNull();
    expect(result?.districtSlug).toBeNull();
    expect(result?.neighborhoodSlug).toBeNull();
  });

  it('conflicting governorate tokens return unresolved', () => {
    const result = matchHierarchyPasses(geo, ['amman', 'aqaba', 'abdun']);
    expect(result).not.toBeNull();
    expect(result?.confidence).toBe('unresolved');
    expect(result?.needsManualSelection).toBe(true);
    expect(result?.governorateSlug).toBeNull();
    expect(result?.districtSlug).toBeNull();
    expect(result?.neighborhoodSlug).toBeNull();
  });

  it('conflicting district tokens return unresolved', () => {
    // taybeh (Irbid) and amman-qasabah (Amman) are different districts; abdun belongs only to the latter
    const result = matchHierarchyPasses(geo, ['taybeh', 'amman-qasabah', 'abdun']);
    expect(result).not.toBeNull();
    expect(result?.confidence).toBe('unresolved');
    expect(result?.needsManualSelection).toBe(true);
    expect(result?.governorateSlug).toBeNull();
    expect(result?.districtSlug).toBeNull();
    expect(result?.neighborhoodSlug).toBeNull();
  });

  it('conflicting governorate and district return unresolved', () => {
    // Aqaba governorate conflicts with Taybeh district (which belongs to Irbid)
    const result = matchHierarchyPasses(geo, ['aqaba', 'taybeh', 'al mansurah']);
    expect(result).not.toBeNull();
    expect(result?.confidence).toBe('unresolved');
    expect(result?.needsManualSelection).toBe(true);
    expect(result?.governorateSlug).toBeNull();
    expect(result?.districtSlug).toBeNull();
    expect(result?.neighborhoodSlug).toBeNull();
  });

  it('multiple recognized locality tokens that identify different records return unresolved', () => {
    const result = matchHierarchyPasses(geo, ['abdun', 'al mansurah']);
    expect(result).not.toBeNull();
    expect(result?.confidence).toBe('unresolved');
    expect(result?.needsManualSelection).toBe(true);
    expect(result?.governorateSlug).toBeNull();
    expect(result?.districtSlug).toBeNull();
    expect(result?.neighborhoodSlug).toBeNull();
  });

  it('multiple aliases for the same canonical entity resolve successfully', () => {
    // "amman" and its Arabic form both identify the same governorate; "abdun" is unique under it
    const result = matchHierarchyPasses(geo, ['amman', 'العاصمة', 'abdun']);
    expect(result).not.toBeNull();
    expect(result?.confidence).toBe('exact');
    expect(result?.needsManualSelection).toBe(false);
    expect(result?.governorateSlug).toBe('amman');
    expect(result?.districtSlug).toBe('amman-qasabah');
    expect(result?.neighborhoodSlug).toBe('abdun');
  });

  it('arbitrary non-geographic tokens do not invalidate an otherwise valid match', () => {
    const result = matchHierarchyPasses(geo, ['abdun', 'randomstreet', 'building42']);
    expect(result).not.toBeNull();
    expect(result?.confidence).toBe('exact');
    expect(result?.needsManualSelection).toBe(false);
    expect(result?.neighborhoodSlug).toBe('abdun');
    expect(result?.governorateSlug).toBe('amman');
  });

  it('token order does not affect the semantic result', () => {
    const r1 = matchHierarchyPasses(geo, ['taybeh', 'al mansurah']);
    const r2 = matchHierarchyPasses(geo, ['al mansurah', 'taybeh']);
    expect(r1?.confidence).toBe('exact');
    expect(r2?.confidence).toBe('exact');
    expect(r1?.neighborhoodSlug).toBe(r2?.neighborhoodSlug);
    expect(r1?.districtSlug).toBe(r2?.districtSlug);
    expect(r1?.governorateSlug).toBe(r2?.governorateSlug);
  });

  it('unique district-only match is preserved', () => {
    const result = matchHierarchyPasses(geo, ['amman-qasabah']);
    expect(result).not.toBeNull();
    expect(result?.confidence).toBe('high');
    expect(result?.needsManualSelection).toBe(false);
    expect(result?.districtSlug).toBe('amman-qasabah');
    expect(result?.governorateSlug).toBe('amman');
    expect(result?.neighborhoodSlug).toBeNull();
  });

  it('unique governorate-only match is preserved', () => {
    const result = matchHierarchyPasses(geo, ['amman']);
    expect(result).not.toBeNull();
    expect(result?.confidence).toBe('approximate');
    expect(result?.needsManualSelection).toBe(false);
    expect(result?.governorateSlug).toBe('amman');
    expect(result?.districtSlug).toBeNull();
    expect(result?.neighborhoodSlug).toBeNull();
  });

  it('repeated unverified district without parent context returns unresolved', () => {
    const result = matchHierarchyPasses(geo, ['unverified']);
    expect(result).not.toBeNull();
    expect(result?.confidence).toBe('unresolved');
    expect(result?.needsManualSelection).toBe(true);
    expect(result?.governorateSlug).toBeNull();
    expect(result?.districtSlug).toBeNull();
    expect(result?.neighborhoodSlug).toBeNull();
  });

  it('governorate plus its own unverified district resolves to that exact path', () => {
    const result = matchHierarchyPasses(geo, ['amman', 'unverified']);
    expect(result).not.toBeNull();
    expect(result?.confidence).toBe('high');
    expect(result?.needsManualSelection).toBe(false);
    expect(result?.governorateSlug).toBe('amman');
    expect(result?.districtSlug).toBe('unverified');
    expect(result?.neighborhoodSlug).toBeNull();
  });

  it('reversed token order for governorate + unverified produces the same result', () => {
    const r1 = matchHierarchyPasses(geo, ['amman', 'unverified']);
    const r2 = matchHierarchyPasses(geo, ['unverified', 'amman']);
    expect(r1?.confidence).toBe('high');
    expect(r2?.confidence).toBe('high');
    expect(r1?.governorateSlug).toBe(r2?.governorateSlug);
    expect(r1?.districtSlug).toBe(r2?.districtSlug);
    expect(r1?.governorateSlug).toBe('amman');
    expect(r1?.districtSlug).toBe('unverified');
  });

  it('amman + unverified + hisban resolves to the exact Amman unverified path', () => {
    // Hisban exists only under Amman unverified in the current JO data
    const result = matchHierarchyPasses(geo, ['amman', 'unverified', 'hisban']);
    expect(result).not.toBeNull();
    expect(result?.confidence).toBe('exact');
    expect(result?.needsManualSelection).toBe(false);
    expect(result?.governorateSlug).toBe('amman');
    expect(result?.districtSlug).toBe('unverified');
    expect(result?.neighborhoodSlug).toBe('hisban');
  });
});
