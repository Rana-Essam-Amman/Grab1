import { describe, it, expect } from 'vitest';
import {
  getMarketProfile,
  getAllMarketProfiles,
  isValidCanonicalSlot,
  getCountryGeo,
} from '../index';
import type { CanonicalIdentitySlot } from '../types';

const SUPPORTED_MARKETS = ['JO', 'SA', 'PS', 'LB', 'SY', 'KW'] as const;
const VALID_SLOTS: readonly CanonicalIdentitySlot[] = [
  'city_slug',
  'district_slug',
  'neighborhood_slug',
];

describe('Market Profiles — Presentation Metadata', () => {
  it('all six markets have exactly one profile', () => {
    const profiles = getAllMarketProfiles();
    expect(profiles).toHaveLength(6);

    const codes = profiles.map((p) => p.marketCode).sort();
    expect(codes).toEqual([...SUPPORTED_MARKETS].sort());

    for (const code of SUPPORTED_MARKETS) {
      const profile = getMarketProfile(code);
      expect(profile).not.toBeNull();
      expect(profile?.marketCode).toBe(code);
    }
  });

  it('every profile references valid existing canonical identity slots', () => {
    for (const profile of getAllMarketProfiles()) {
      for (const level of profile.visibleLevels) {
        expect(VALID_SLOTS).toContain(level.canonicalSlot);
        expect(isValidCanonicalSlot(level.canonicalSlot)).toBe(true);
      }
    }
  });

  it('no profile requires a third level when the market has no third-level catalog', () => {
    // KW catalog has empty villages (no neighborhood-level entries)
    const kw = getMarketProfile('KW');
    expect(kw).not.toBeNull();
    expect(kw?.visibleLevels).toHaveLength(2);
    expect(kw?.visibleLevels.some((l) => l.canonicalSlot === 'neighborhood_slug')).toBe(false);

    // Others have third-level catalog entries
    for (const code of ['JO', 'SA', 'PS', 'LB', 'SY'] as const) {
      const profile = getMarketProfile(code);
      expect(profile?.visibleLevels.length).toBeGreaterThanOrEqual(3);
      expect(profile?.visibleLevels.some((l) => l.canonicalSlot === 'neighborhood_slug')).toBe(true);
    }
  });

  it('JO and SA level mappings remain distinct', () => {
    const jo = getMarketProfile('JO');
    const sa = getMarketProfile('SA');
    expect(jo).not.toBeNull();
    expect(sa).not.toBeNull();

    const joLabels = jo!.visibleLevels.map((l) => l.labelEn);
    const saLabels = sa!.visibleLevels.map((l) => l.labelEn);

    expect(joLabels).toEqual(['Governorate', 'District / Liwa', 'Locality / Neighborhood']);
    expect(saLabels).toEqual(['Region', 'City', 'Neighborhood']);
    expect(joLabels).not.toEqual(saLabels);

    // Both map level1 to city_slug, level2 to district_slug, level3 to neighborhood_slug
    expect(jo!.visibleLevels[0].canonicalSlot).toBe('city_slug');
    expect(sa!.visibleLevels[0].canonicalSlot).toBe('city_slug');
    expect(jo!.visibleLevels[1].canonicalSlot).toBe('district_slug');
    expect(sa!.visibleLevels[1].canonicalSlot).toBe('district_slug');
  });

  it('profiles do not mutate or replace existing canonical geo data', () => {
    // Profiles are separate; registry remains unchanged
    for (const code of SUPPORTED_MARKETS) {
      const geo = getCountryGeo(code);
      expect(geo).not.toBeNull();
      expect(geo?.countryCode).toBe(code);
      expect(geo?.governorates.length).toBeGreaterThan(0);
    }

    // getMarketProfile does not alter registry
    const before = getCountryGeo('JO')?.governorates.length;
    getMarketProfile('JO');
    const after = getCountryGeo('JO')?.governorates.length;
    expect(after).toBe(before);
  });

  it('unknown market codes fail safely', () => {
    expect(getMarketProfile('XX')).toBeNull();
    expect(getMarketProfile('')).toBeNull();
    expect(getMarketProfile('jo')).toBeNull(); // case-sensitive, established convention
  });

  it('visible levels are ordered and map correctly', () => {
    for (const profile of getAllMarketProfiles()) {
      profile.visibleLevels.forEach((level, idx) => {
        expect(level.levelIndex).toBe(idx + 1);
      });
    }
  });
});
