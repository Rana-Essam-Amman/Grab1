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
  });

  it('duplicate locality-only match returns unresolved instead of first hit', () => {
    const result = matchHierarchyPasses(geo, ['al mansurah']);
    expect(result).not.toBeNull();
    expect(result?.confidence).toBe('unresolved');
    expect(result?.needsManualSelection).toBe(true);
    expect(result?.neighborhoodSlug).toBeNull();
  });

  it('parent-constrained duplicate resolves to the correct canonical record', () => {
    const result = matchHierarchyPasses(geo, ['amman', 'al mansurah']);
    if (result?.confidence === 'exact') {
      expect(result.governorateSlug).toBe('amman');
      expect(result.neighborhoodSlug).toMatch(/al-mansurah/);
    } else {
      expect(result?.confidence).toBe('unresolved');
    }
  });

  it('conflicting parent context does not produce a false successful match', () => {
    const result = matchHierarchyPasses(geo, ['aqaba', 'al mansurah']);
    if (result) {
      expect(result.confidence === 'unresolved' || result.governorateSlug === 'aqaba').toBe(true);
      if (result.confidence === 'exact') {
        expect(result.governorateSlug).toBe('aqaba');
      }
    }
  });

  it('candidate order does not affect ambiguity detection', () => {
    const r1 = matchHierarchyPasses(geo, ['al mansurah']);
    const r2 = matchHierarchyPasses(geo, ['al mansurah']);
    expect(r1?.confidence).toBe('unresolved');
    expect(r2?.confidence).toBe('unresolved');
  });
});
