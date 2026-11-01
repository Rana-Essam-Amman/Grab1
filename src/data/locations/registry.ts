import type { CountryGeo, Governorate, District, Village, RefugeeCamp, Landmark } from './types';
import { normalizeArabic } from '@/data/arabicNormalize';

export interface UnifiedLocation {
  readonly countryCode: string;
  readonly governorateSlug: string | null;
  readonly citySlug: string | null;
  readonly neighborhood: string | null;
  readonly village: Village | null;
  readonly camp: RefugeeCamp | null;
  readonly landmark: Landmark | null;
}

export type LocationKind = 'governorate' | 'district' | 'village' | 'camp' | 'landmark';

export interface LocationSearchResult {
  readonly id: string;
  readonly kind: LocationKind;
  readonly countryCode: string;
  readonly slug: string;
  readonly nameAr: string;
  readonly nameEn: string;
  readonly parentPathAr: readonly string[];
  readonly parentPathEn: readonly string[];
  readonly governorateSlug: string | null;
  readonly districtSlug: string | null;
  readonly villageSlug: string | null;
  readonly cityEn: string | null;
  readonly cityAr: string | null;
  readonly neighborhoodEn: string | null;
  readonly neighborhoodAr: string | null;
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

function matchesQuery(nameAr: string, nameEn: string, slug: string, rawQuery: string, normQuery: string): boolean {
  const arNorm = normalizeArabic(nameAr);
  const enNorm = nameEn.toLowerCase();
  const slugNorm = slug.toLowerCase();
  const qLower = rawQuery.toLowerCase();
  return arNorm.includes(normQuery) || enNorm.includes(qLower) || slugNorm.includes(qLower) || nameAr.includes(rawQuery);
}

export function searchLocationsHierarchical(countryCode: string, query: string): LocationSearchResult[] {
  const geo = REGISTRY[countryCode];
  if (!geo || !query.trim()) return [];
  const raw = query.trim();
  const norm = normalizeArabic(raw);
  if (!norm && !raw) return [];
  const results: LocationSearchResult[] = [];

  for (const gov of geo.governorates) {
    if (matchesQuery(gov.nameAr, gov.nameEn, gov.slug, raw, norm)) {
      results.push({
        id: `${countryCode}/${gov.slug}`,
        kind: 'governorate',
        countryCode,
        slug: gov.slug,
        nameAr: gov.nameAr,
        nameEn: gov.nameEn,
        parentPathAr: [gov.nameAr],
        parentPathEn: [gov.nameEn],
        governorateSlug: gov.slug,
        districtSlug: null,
        villageSlug: null,
        cityEn: gov.nameEn,
        cityAr: gov.nameAr,
        neighborhoodEn: null,
        neighborhoodAr: null,
      });
    }
    for (const d of gov.districts) {
      if (matchesQuery(d.nameAr, d.nameEn, d.slug, raw, norm)) {
        results.push({
          id: `${countryCode}/${gov.slug}/${d.slug}`,
          kind: 'district',
          countryCode,
          slug: d.slug,
          nameAr: d.nameAr,
          nameEn: d.nameEn,
          parentPathAr: [gov.nameAr, d.nameAr],
          parentPathEn: [gov.nameEn, d.nameEn],
          governorateSlug: gov.slug,
          districtSlug: d.slug,
          villageSlug: null,
          cityEn: gov.nameEn,
          cityAr: gov.nameAr,
          neighborhoodEn: d.nameEn,
          neighborhoodAr: d.nameAr,
        });
      }
      for (const v of d.villages) {
        if (matchesQuery(v.nameAr, v.nameEn, v.slug, raw, norm)) {
          results.push({
            id: `${countryCode}/${gov.slug}/${d.slug}/${v.slug}`,
            kind: 'village',
            countryCode,
            slug: v.slug,
            nameAr: v.nameAr,
            nameEn: v.nameEn,
            parentPathAr: [gov.nameAr, d.nameAr, v.nameAr],
            parentPathEn: [gov.nameEn, d.nameEn, v.nameEn],
            governorateSlug: gov.slug,
            districtSlug: d.slug,
            villageSlug: v.slug,
            cityEn: gov.nameEn,
            cityAr: gov.nameAr,
            neighborhoodEn: v.nameEn,
            neighborhoodAr: v.nameAr,
          });
        }
      }
    }
  }

  for (const c of geo.refugeeCamps) {
    if (matchesQuery(c.nameAr, c.nameEn, c.slug, raw, norm)) {
      const gov = geo.governorates.find((g) => g.slug === c.governorateSlug);
      const pathAr = gov ? [gov.nameAr, c.nameAr] : [c.nameAr];
      const pathEn = gov ? [gov.nameEn, c.nameEn] : [c.nameEn];
      results.push({
        id: `${countryCode}/camp/${c.governorateSlug}/${c.slug}`,
        kind: 'camp',
        countryCode,
        slug: c.slug,
        nameAr: c.nameAr,
        nameEn: c.nameEn,
        parentPathAr: pathAr,
        parentPathEn: pathEn,
        governorateSlug: c.governorateSlug,
        districtSlug: null,
        villageSlug: null,
        cityEn: gov?.nameEn ?? null,
        cityAr: gov?.nameAr ?? null,
        neighborhoodEn: c.nameEn,
        neighborhoodAr: c.nameAr,
      });
    }
  }

  for (const l of geo.landmarks) {
    if (matchesQuery(l.nameAr, l.nameEn, l.slug, raw, norm)) {
      let govName: { ar: string; en: string; slug: string } | null = null;
      for (const gov of geo.governorates) {
        if (gov.districts.some((d) => d.slug === l.citySlug) || gov.slug === l.citySlug) {
          govName = { ar: gov.nameAr, en: gov.nameEn, slug: gov.slug };
          break;
        }
      }
      const pathAr = govName ? [govName.ar, l.nameAr] : [l.nameAr];
      const pathEn = govName ? [govName.en, l.nameEn] : [l.nameEn];
      results.push({
        id: `${countryCode}/landmark/${l.citySlug}/${l.slug}`,
        kind: 'landmark',
        countryCode,
        slug: l.slug,
        nameAr: l.nameAr,
        nameEn: l.nameEn,
        parentPathAr: pathAr,
        parentPathEn: pathEn,
        governorateSlug: govName?.slug ?? null,
        districtSlug: l.citySlug,
        villageSlug: null,
        cityEn: govName?.en ?? null,
        cityAr: govName?.ar ?? null,
        neighborhoodEn: l.nameEn,
        neighborhoodAr: l.nameAr,
      });
    }
  }

  return results;
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
