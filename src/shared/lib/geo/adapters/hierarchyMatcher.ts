import { cleanGeoToken } from './adapterUtils';
import type { CountryGeo } from '@/data/locations/types';
import type { CanonicalLocation, LatLng } from '../geo.types';

export function matchHierarchyPasses(
  geo: CountryGeo,
  cleaned: readonly string[],
  coords?: LatLng
): Omit<CanonicalLocation, 'countryCode'> | null {
  // Pass 1: Hierarchy agreement: Gov + District
  for (const gov of geo.governorates) {
    const gAr = cleanGeoToken(gov.nameAr);
    const gEn = cleanGeoToken(gov.nameEn);
    const hasGov = cleaned.some((t) => t === gAr || t === gEn || t === gov.slug);
    if (!hasGov) continue;

    for (const dist of gov.districts) {
      const dAr = cleanGeoToken(dist.nameAr);
      const dEn = cleanGeoToken(dist.nameEn);
      const hasDist = cleaned.some((t) => t === dAr || t === dEn || t === dist.slug);

      for (const v of dist.villages) {
        const vAr = cleanGeoToken(v.nameAr);
        const vEn = cleanGeoToken(v.nameEn);
        if (cleaned.some((t) => t === vAr || t === vEn || t === v.slug)) {
          return {
            governorateSlug: gov.slug, governorateEn: gov.nameEn, governorateAr: gov.nameAr,
            districtSlug: dist.slug, districtEn: dist.nameEn, districtAr: dist.nameAr,
            neighborhoodSlug: v.slug, neighborhoodEn: v.nameEn, neighborhoodAr: v.nameAr,
            coordinates: coords ?? null, confidence: 'exact',
            resolutionSource: 'canonical_match', needsManualSelection: false,
          };
        }
      }
      if (hasDist) {
        return {
          governorateSlug: gov.slug, governorateEn: gov.nameEn, governorateAr: gov.nameAr,
          districtSlug: dist.slug, districtEn: dist.nameEn, districtAr: dist.nameAr,
          neighborhoodSlug: null, neighborhoodEn: null, neighborhoodAr: null,
          coordinates: coords ?? null, confidence: 'high',
          resolutionSource: 'canonical_match', needsManualSelection: false,
        };
      }
    }
  }

  // Pass 2: District standalone
  for (const gov of geo.governorates) {
    for (const dist of gov.districts) {
      const dAr = cleanGeoToken(dist.nameAr);
      const dEn = cleanGeoToken(dist.nameEn);
      if (cleaned.some((t) => t === dAr || t === dEn || t === dist.slug)) {
        return {
          governorateSlug: gov.slug, governorateEn: gov.nameEn, governorateAr: gov.nameAr,
          districtSlug: dist.slug, districtEn: dist.nameEn, districtAr: dist.nameAr,
          neighborhoodSlug: null, neighborhoodEn: null, neighborhoodAr: null,
          coordinates: coords ?? null, confidence: 'high',
          resolutionSource: 'canonical_match', needsManualSelection: false,
        };
      }
    }
  }

  // Pass 3: Village standalone
  for (const gov of geo.governorates) {
    for (const dist of gov.districts) {
      for (const v of dist.villages) {
        const vAr = cleanGeoToken(v.nameAr);
        const vEn = cleanGeoToken(v.nameEn);
        if (cleaned.some((t) => t === vAr || t === vEn || t === v.slug)) {
          return {
            governorateSlug: gov.slug, governorateEn: gov.nameEn, governorateAr: gov.nameAr,
            districtSlug: dist.slug, districtEn: dist.nameEn, districtAr: dist.nameAr,
            neighborhoodSlug: v.slug, neighborhoodEn: v.nameEn, neighborhoodAr: v.nameAr,
            coordinates: coords ?? null, confidence: 'exact',
            resolutionSource: 'canonical_match', needsManualSelection: false,
          };
        }
      }
    }
  }

  // Pass 4: Governorate standalone
  for (const gov of geo.governorates) {
    const gAr = cleanGeoToken(gov.nameAr);
    const gEn = cleanGeoToken(gov.nameEn);
    if (cleaned.some((t) => t === gAr || t === gEn || t === gov.slug)) {
      return {
        governorateSlug: gov.slug, governorateEn: gov.nameEn, governorateAr: gov.nameAr,
        districtSlug: null, districtEn: null, districtAr: null,
        neighborhoodSlug: null, neighborhoodEn: null, neighborhoodAr: null,
        coordinates: coords ?? null, confidence: 'approximate',
        resolutionSource: 'canonical_match', needsManualSelection: false,
      };
    }
  }

  return null;
}
