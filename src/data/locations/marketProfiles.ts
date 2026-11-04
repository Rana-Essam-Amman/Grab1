import type { MarketProfile, CanonicalIdentitySlot } from './types';

/**
 * Presentation-only Market Profiles for FOX's six markets.
 *
 * These describe user-facing visible levels and their labels,
 * mapping each to an existing canonical identity slot
 * (city_slug / district_slug / neighborhood_slug).
 *
 * They do NOT encode official administrative parent-child facts,
 * do NOT duplicate the location catalog, and do NOT alter
 * persisted identity or resolver behavior.
 *
 * Labels are FOX presentation metadata only.
 */

const PROFILES: readonly MarketProfile[] = [
  {
    marketCode: 'JO',
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
        labelEn: 'Locality / Neighborhood',
        labelAr: 'الحي / المنطقة',
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
        labelEn: 'City',
        labelAr: 'المدينة',
        canonicalSlot: 'district_slug',
        optional: false,
      },
      {
        levelIndex: 3,
        labelEn: 'Neighborhood',
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
        labelEn: 'District',
        labelAr: 'المنطقة الفرعية',
        canonicalSlot: 'district_slug',
        optional: false,
      },
      {
        levelIndex: 3,
        labelEn: 'Locality',
        labelAr: 'المحلية',
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
        labelEn: 'Area',
        labelAr: 'المنطقة',
        canonicalSlot: 'city_slug',
        optional: false,
      },
      {
        levelIndex: 2,
        labelEn: 'District',
        labelAr: 'المنطقة الفرعية',
        canonicalSlot: 'district_slug',
        optional: false,
      },
      {
        levelIndex: 3,
        labelEn: 'Locality',
        labelAr: 'المحلية',
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
        labelEn: 'Area',
        labelAr: 'المنطقة',
        canonicalSlot: 'city_slug',
        optional: false,
      },
      {
        levelIndex: 2,
        labelEn: 'District',
        labelAr: 'المنطقة الفرعية',
        canonicalSlot: 'district_slug',
        optional: false,
      },
      {
        levelIndex: 3,
        labelEn: 'Locality',
        labelAr: 'المحلية',
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
        labelEn: 'Residential Area',
        labelAr: 'المنطقة السكنية',
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

/**
 * Returns the presentation profile for a known market, or null for unknown codes.
 * Fails safely (returns null) consistent with getCountryGeo.
 */
export function getMarketProfile(marketCode: string): MarketProfile | null {
  return PROFILE_BY_CODE[marketCode] ?? null;
}

/**
 * Returns all defined market profiles. Exactly one per supported market.
 */
export function getAllMarketProfiles(): readonly MarketProfile[] {
  return PROFILES;
}

/**
 * Validates that a profile only references known canonical identity slots.
 */
export function isValidCanonicalSlot(slot: string): slot is CanonicalIdentitySlot {
  return (VALID_SLOTS as readonly string[]).includes(slot);
}
