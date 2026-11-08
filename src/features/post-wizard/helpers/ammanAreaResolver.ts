import { JO_AMMAN_OPENSOOQ_AREAS } from '@/data/locations/JO_AMMAN_AREAS';
import { getAllDistricts } from '@/data/locations/registry';
import { normalizeArabic } from '@/shared/lib/arabicNormalize';

const ADMIN_WORDS = ['لواء', 'قصبة', 'قضاء', 'Liwa', 'Qasabah', 'Qada'];

export function stripAdminWords(label: string): string {
  return label.split(/\s+/).filter(t => !ADMIN_WORDS.includes(t)).join(' ').trim() || label;
}

export interface AmmanArea {
  readonly id: string;
  readonly slug: string;
  readonly nameAr: string;
  readonly nameEn: string;
  readonly districtSlug: string | null;
  readonly neighborhoodSlug: string | null;
  readonly source: 'geonames-district' | 'geonames-village' | 'opensooq';
}

function normalizeKey(s: string): string {
  return normalizeArabic(s).replace(/\s+/g, ' ').trim();
}

let cachedAreas: readonly AmmanArea[] | null = null;

export function buildMergedAmmanAreas(): readonly AmmanArea[] {
  if (cachedAreas) return cachedAreas;
  const out: AmmanArea[] = [];
  const seenAr = new Set<string>();
  const seenEn = new Set<string>();
  const add = (area: AmmanArea): boolean => {
    const keyAr = normalizeKey(area.nameAr);
    const keyEn = area.nameEn.toLowerCase().trim();
    if (seenAr.has(keyAr) || seenEn.has(keyEn)) return false;
    seenAr.add(keyAr); seenEn.add(keyEn); out.push(area); return true;
  };
  const districts = getAllDistricts('JO', 'amman');
  for (const d of districts) {
    if (d.slug === 'unverified') continue;
    const villages = d.villages ?? [];
    if (villages.length === 0) {
      add({ id: `district:${d.slug}`, slug: d.slug, nameAr: stripAdminWords(d.nameAr), nameEn: stripAdminWords(d.nameEn), districtSlug: d.slug, neighborhoodSlug: null, source: 'geonames-district' });
    } else {
      for (const v of villages) {
        add({ id: `village:${d.slug}:${v.slug}`, slug: v.slug, nameAr: v.nameAr, nameEn: v.nameEn, districtSlug: d.slug, neighborhoodSlug: v.slug, source: 'geonames-village' });
      }
    }
  }
  for (const a of JO_AMMAN_OPENSOOQ_AREAS) {
    add({ id: `opensooq:${a.slug}`, slug: a.slug, nameAr: a.nameAr, nameEn: a.nameEn, districtSlug: null, neighborhoodSlug: null, source: 'opensooq' });
  }
  cachedAreas = out;
  return out;
}

export function matchOpenSooqToGeoNames(areaNameAr: string, areaNameEn: string): { districtSlug: string; neighborhoodSlug: string | null } | null {
  const districts = getAllDistricts('JO', 'amman');
  const keyAr = normalizeKey(areaNameAr);
  const keyEn = areaNameEn.toLowerCase().trim();
  for (const d of districts) {
    if (d.slug === 'unverified') continue;
    if (normalizeKey(d.nameAr) === keyAr || d.nameEn.toLowerCase().trim() === keyEn) return { districtSlug: d.slug, neighborhoodSlug: null };
    for (const v of (d.villages ?? [])) {
      if (normalizeKey(v.nameAr) === keyAr || v.nameEn.toLowerCase().trim() === keyEn) return { districtSlug: d.slug, neighborhoodSlug: v.slug };
    }
  }
  return null;
}
