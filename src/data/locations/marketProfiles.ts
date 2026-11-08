import type { MarketProfile, CanonicalIdentitySlot } from './types';

/**
 * Presentation-only Market Profiles for FOX's six markets.
 *
 * Uniform 3-level model:
 *   Level 1 = City / Region / Governorate (maps to city_slug)
 *   Level 2 = District (maps to district_slug)
 *   Level 3 = Neighbourhood (maps to neighborhood_slug, optional)
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
        labelEn: 'Area',
        labelAr: 'المنطقة',
        canonicalSlot: 'district_slug',
        optional: false,
      },
      {
        levelIndex: 3,
        labelEn: 'Neighbourhood',
        labelAr: 'الحي',
        canonicalSlot: 'neighborhood_slug',
        optional: true,
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
        labelEn: 'Area',
        labelAr: 'المنطقة',
        canonicalSlot: 'district_slug',
        optional: false,
      },
      {
        levelIndex: 3,
        labelEn: 'Neighbourhood',
        labelAr: 'الحي',
        canonicalSlot: 'neighborhood_slug',
        optional: true,
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
        labelEn: 'Area',
        labelAr: 'المنطقة',
        canonicalSlot: 'district_slug',
        optional: false,
      },
      {
        levelIndex: 3,
        labelEn: 'Neighbourhood',
        labelAr: 'الحي',
        canonicalSlot: 'neighborhood_slug',
        optional: true,
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
        labelEn: 'Area',
        labelAr: 'المنطقة',
        canonicalSlot: 'district_slug',
        optional: false,
      },
      {
        levelIndex: 3,
        labelEn: 'Neighbourhood',
        labelAr: 'الحي',
        canonicalSlot: 'neighborhood_slug',
        optional: true,
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
        labelEn: 'Area',
        labelAr: 'المنطقة',
        canonicalSlot: 'district_slug',
        optional: false,
      },
      {
        levelIndex: 3,
        labelEn: 'Neighbourhood',
        labelAr: 'الحي',
        canonicalSlot: 'neighborhood_slug',
        optional: true,
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
      {
        levelIndex: 3,
        labelEn: 'Neighbourhood',
        labelAr: 'الحي',
        canonicalSlot: 'neighborhood_slug',
        optional: true,
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
