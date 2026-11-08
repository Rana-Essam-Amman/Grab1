import { getAllDistricts } from '@/data/locations/registry';
import { normalizeArabic } from '@/shared/lib/arabicNormalize';

function normalizeKey(s: string): string {
  return normalizeArabic(s).replace(/\s+/g, ' ').trim();
}

export function matchOpenSooqToGeoNames(
  areaNameAr: string,
  areaNameEn: string
): { districtSlug: string; neighborhoodSlug: string | null } | null {
  const stripAll = (s: string): string => {
    for (const p of ['حي', 'ضاحية', 'منطقة', 'قرية', 'بلدة', 'مخيم']) {
      if (s.startsWith(p + ' ')) return s.slice(p.length + 1).trim();
    }
    return s;
  };
  const targetAr = normalizeKey(stripAll(areaNameAr));
  const targetEn = stripAll(areaNameEn).toLowerCase().trim();
  const districts = getAllDistricts('JO', 'amman');
  let found: { districtSlug: string; neighborhoodSlug: string | null } | null = null;
  let ambiguous = false;
  for (const d of districts) {
    if (d.slug === 'unverified') continue;
    if (normalizeKey(stripAll(d.nameAr)) === targetAr || stripAll(d.nameEn).toLowerCase().trim() === targetEn) {
      if (found && found.districtSlug !== d.slug) ambiguous = true;
      else found = { districtSlug: d.slug, neighborhoodSlug: null };
    }
    for (const v of (d.villages ?? [])) {
      if (normalizeKey(stripAll(v.nameAr)) === targetAr || stripAll(v.nameEn).toLowerCase().trim() === targetEn) {
        if (found && (found.districtSlug !== d.slug || found.neighborhoodSlug !== v.slug)) ambiguous = true;
        else found = { districtSlug: d.slug, neighborhoodSlug: v.slug };
      }
    }
  }
  return ambiguous ? null : found;
}
