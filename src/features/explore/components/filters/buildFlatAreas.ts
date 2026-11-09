import { stripAdminWords } from '@/shared/lib/geo/stripAdminWords';
import { normalizeArabic } from '@/shared/lib/arabicNormalize';
import { slugify } from '@/shared/lib/slugify';
import type { Governorate } from '@/data/locations/types';
import type { AmmanArea } from '@/features/post-wizard/helpers/ammanAreaResolver';
import { JO_OPENSOOQ_AREAS } from '@/data/locations/JO_OPENSOOQ_AREAS';

function opensooqSlug(nameEn: string, nameAr: string): string {
  const base = /[a-zA-Z]/.test(nameEn) ? nameEn : nameAr;
  return slugify(base);
}

export function buildFlatAreasForGovernorate(
  gov: Governorate,
): readonly AmmanArea[] {
  const areas: AmmanArea[] = [];
  const seen = new Set<string>();

  const pushUnique = (a: AmmanArea): void => {
    const key = normalizeArabic(stripAdminWords(a.nameAr))
      .replace(/\s+/g, ' ')
      .trim();
    if (seen.has(key)) return;
    seen.add(key);
    areas.push(a);
  };

  for (const d of gov.districts ?? []) {
    if (d.slug === 'unverified') continue;
    const villages = d.villages ?? [];

    // Always add the parent district as a candidate.
    // pushUnique() will dedupe it if a village already has the same name.
    pushUnique({
      id: `district:${d.slug}`,
      slug: d.slug,
      nameAr: stripAdminWords(d.nameAr),
      nameEn: stripAdminWords(d.nameEn),
      districtSlug: d.slug,
      neighborhoodSlug: null,
      source: 'geonames-district',
    });

    // Then add all villages (pushUnique dedupes).
    for (const v of villages) {
      pushUnique({
        id: `village:${d.slug}:${v.slug}`,
        slug: v.slug,
        nameAr: stripAdminWords(v.nameAr),
        nameEn: stripAdminWords(v.nameEn),
        districtSlug: d.slug,
        neighborhoodSlug: v.slug,
        source: 'geonames-village',
      });
    }
  }

  // OpenSooq extras: same dedupe key, so GeoNames wins; missing names are added as custom.
  const extras = JO_OPENSOOQ_AREAS[gov.slug] ?? [];
  for (const extra of extras) {
    const slug = opensooqSlug(extra.nameEn, extra.nameAr);
    pushUnique({
      id: `opensooq:${gov.slug}:${slug}`,
      slug,
      nameAr: extra.nameAr,
      nameEn: extra.nameEn,
      districtSlug: null,
      neighborhoodSlug: null,
      source: 'opensooq',
    });
  }

  return areas;
}
