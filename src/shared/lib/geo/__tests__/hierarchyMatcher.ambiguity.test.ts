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
    // "Al Mansurah" under Taybeh (Irbid) is uniquely identified by the district token
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
    // Abdun is under Amman Qasabah, not under Taybeh
    const result = matchHierarchyPasses(geo, ['taybeh', 'abdun']);
    expect(result).not.toBeNull();
    expect(result?.confidence).toBe('unresolved');
    expect(result?.needsManualSelection).toBe(true);
    expect(result?.governorateSlug).toBeNull();
    expect(result?.districtSlug).toBeNull();
    expect(result?.neighborhoodSlug).toBeNull();
  });

  it('candidate-order independence: same semantic result regardless of token order', () => {
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
});
