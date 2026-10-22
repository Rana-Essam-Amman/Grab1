import type { CountryGeo, Governorate, District, Village, RefugeeCamp, Landmark } from './types';

export interface UnifiedLocation {
  readonly countryCode: string;
  readonly governorateSlug: string | null;
  readonly citySlug: string | null;
  readonly neighborhood: string | null;
  readonly village: Village | null;
  readonly camp: RefugeeCamp | null;
  readonly landmark: Landmark | null;
}

const REGISTRY: Record<string, CountryGeo> = {};

export function registerCountry(geo: CountryGeo): void {
  REGISTRY[geo.countryCode] = geo;
}

export function getCountryGeo(countryCode: string): CountryGeo | null {
  return REGISTRY[countryCode] ?? null;
}

export function getAllGovernorates(countryCode: string): readonly Governorate[] {
  return REGISTRY[countryCode]?.governorates ?? [];
}

export function getAllDistricts(countryCode: string, governorateSlug: string): readonly District[] {
  const gov = REGISTRY[countryCode]?.governorates.find((g) => g.slug === governorateSlug);
  return gov?.districts ?? [];
}

export function getAllVillages(countryCode: string, governorateSlug: string): readonly Village[] {
  const gov = REGISTRY[countryCode]?.governorates.find((g) => g.slug === governorateSlug);
  if (!gov) return [];
  return gov.districts.flatMap((d) => d.villages);
}

export function getAllCamps(countryCode: string): readonly RefugeeCamp[] {
  return REGISTRY[countryCode]?.refugeeCamps ?? [];
}

export function getAllLandmarks(countryCode: string): readonly Landmark[] {
  return REGISTRY[countryCode]?.landmarks ?? [];
}

export function searchLocations(countryCode: string, query: string): UnifiedLocation[] {
  const geo = REGISTRY[countryCode];
  if (!geo || !query.trim()) return [];
  const q = query.toLowerCase().trim();
  const results: UnifiedLocation[] = [];

  for (const gov of geo.governorates) {
    if (gov.nameAr.includes(q) || gov.nameEn.toLowerCase().includes(q) || gov.slug.includes(q)) {
      results.push({
        countryCode, governorateSlug: gov.slug, citySlug: null,
        neighborhood: null, village: null, camp: null, landmark: null,
      });
    }
    for (const d of gov.districts) {
      if (d.nameAr.includes(q) || d.nameEn.toLowerCase().includes(q)) {
        results.push({
          countryCode, governorateSlug: gov.slug, citySlug: d.slug,
          neighborhood: null, village: null, camp: null, landmark: null,
        });
      }
      for (const v of d.villages) {
        if (v.nameAr.includes(q) || v.nameEn.toLowerCase().includes(q)) {
          results.push({
            countryCode, governorateSlug: gov.slug, citySlug: d.slug,
            neighborhood: null, village: v, camp: null, landmark: null,
          });
        }
      }
    }
  }

  for (const c of geo.refugeeCamps) {
    if (c.nameAr.includes(q) || c.nameEn.toLowerCase().includes(q)) {
      results.push({
        countryCode, governorateSlug: c.governorateSlug, citySlug: null,
        neighborhood: null, village: null, camp: c, landmark: null,
      });
    }
  }

  for (const l of geo.landmarks) {
    if (l.nameAr.includes(q) || l.nameEn.toLowerCase().includes(q)) {
      results.push({
        countryCode, governorateSlug: null, citySlug: l.citySlug,
        neighborhood: null, village: null, camp: null, landmark: l,
      });
    }
  }

  return results;
}
