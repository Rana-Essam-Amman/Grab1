import { getOpensooqCities, getOpensooqCity, hasOpensooqData } from '@/data/locations/opensooq';
import type { Governorate } from '@/data/locations/types';
import type { AmmanArea } from '@/features/post-wizard/helpers/ammanAreaResolver';

export { hasOpensooqData };

export function opensooqGovernorates(countryCode: string): readonly Governorate[] | null {
  if (!hasOpensooqData(countryCode)) return null;
  return getOpensooqCities(countryCode).map(c => ({
    slug: c.slug,
    nameAr: c.nameAr,
    nameEn: c.nameAr,
    districts: [],
  }));
}

export function opensooqFlatAreas(
  countryCode: string,
  citySlug: string | null,
): readonly AmmanArea[] | null {
  if (!hasOpensooqData(countryCode)) return null;
  if (!citySlug) return [];
  const city = getOpensooqCity(countryCode, citySlug);
  if (!city) return [];
  return city.areas.map(a => ({
    id: `opensooq:${countryCode}:${city.slug}:${a.slug}`,
    slug: a.slug,
    nameAr: a.nameAr,
    nameEn: a.nameAr,
    districtSlug: null,
    neighborhoodSlug: a.slug === 'other' ? null : a.slug,
    source: 'opensooq',
  }));
}
