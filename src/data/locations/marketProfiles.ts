import type { MarketProfile, CanonicalIdentitySlot } from './types';

/**
 * Presentation-only Market Profiles for FOX's six markets.
 *
 * Uniform 2-level model matching OpenSooq:
 *   Level 1 = City / Region (maps to city_slug)
 *   Level 2 = Neighbourhood / Area (maps to district_slug)
 *
 * Note: individual villages (neighborhood_slug) are merged into the level-2
 * list inside useLocationPick, so the user sees one combined list.
 */

const PROFILES: readonly MarketProfile[] = [
  {
    marketCode: 'JO',
    visibleLevels: [
      {
        levelIndex: 1,
        labelEn: 'City',
        labelAr: 'المدينة',
        canonicalSlot: 'city_slug',
        optional: false,
      },
      {
        levelIndex: 2,
        labelEn: 'Neighbourhood',
        labelAr: 'الحي',
        canonicalSlot: 'district_slug',
        optional: false,
      },
    ],
  },
  {
    marketCode: 'SA',
    visibleLevels: [
      {
        levelIndex: 1,
        labelEn: 'Region',
        labelAr: 'المنطقة',
        canonicalSlot: 'city_slug',
        optional: false,
      },
      {
        levelIndex: 2,
        labelEn: 'City',
        labelAr: 'المدينة',
        canonicalSlot: 'district_slug',
        optional: false,
      },
    ],
  },
  {
    marketCode: 'PS',
    visibleLevels: [
      {
        levelIndex: 1,
        labelEn: 'Area',
        labelAr: 'المنطقة',
        canonicalSlot: 'city_slug',
        optional: false,
      },
      {
        levelIndex: 2,
        labelEn: 'City',
        labelAr: 'المدينة',
        canonicalSlot: 'district_slug',
        optional: false,
      },
    ],
  },
  {
    marketCode: 'LB',
    visibleLevels: [
      {
        levelIndex: 1,
        labelEn: 'Governorate',
        labelAr: 'المحافظة',
        canonicalSlot: 'city_slug',
        optional: false,
      },
      {
        levelIndex: 2,
        labelEn: 'District',
        labelAr: 'القضاء',
        canonicalSlot: 'district_slug',
        optional: false,
      },
    ],
  },
  {
    marketCode: 'SY',
    visibleLevels: [
      {
        levelIndex: 1,
        labelEn: 'Governorate',
        labelAr: 'المحافظة',
        canonicalSlot: 'city_slug',
        optional: false,
      },
      {
        levelIndex: 2,
        labelEn: 'City',
        labelAr: 'المدينة',
        canonicalSlot: 'district_slug',
        optional: false,
      },
    ],
  },
  {
    marketCode: 'KW',
    visibleLevels: [
      {
        levelIndex: 1,
        labelEn: 'Governorate',
        labelAr: 'المحافظة',
        canonicalSlot: 'city_slug',
        optional: false,
      },
      {
        levelIndex: 2,
        labelEn: 'Area',
        labelAr: 'المنطقة',
        canonicalSlot: 'district_slug',
        optional: false,
      },
    ],
  },
] as const;

const PROFILE_BY_CODE: Readonly<Record<string, MarketProfile>> = Object.fromEntries(
  PROFILES.map((p) => [p.marketCode, p])
);

const VALID_SLOTS: readonly CanonicalIdentitySlot[] = [
  'city_slug',
  'district_slug',
  'neighborhood_slug',
] as const;

export function getMarketProfile(marketCode: string): MarketProfile | null {
  return PROFILE_BY_CODE[marketCode] ?? null;
}

export function getAllMarketProfiles(): readonly MarketProfile[] {
  return PROFILES;
}

export function isValidCanonicalSlot(slot: string): slot is CanonicalIdentitySlot {
  return (VALID_SLOTS as readonly string[]).includes(slot);
}
