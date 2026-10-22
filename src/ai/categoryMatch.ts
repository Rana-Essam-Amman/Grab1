import { getCountryAliases } from '@/shared/lib/locationAliases';
import { expandQueryCity } from '@/data/locations/aliases';
import { getAllGovernorates, getAllCamps, getAllLandmarks } from '@/data/locations/registry';
export enum MismatchPolicy {
  silent = 'silent',
  confirm = 'confirm',
}

import { normalizeArabic } from '@/data/arabicNormalize';

export const mismatchPolicy: MismatchPolicy = MismatchPolicy.confirm;

export type { CategoryHint } from './categoryMatch.types';
import type { CategoryHint } from './categoryMatch.types';

export { textSignals } from '@/data/categorySignals';
import { textSignals } from '@/data/categorySignals';

export interface CategoryMatch {
  chosenCategory: string;
  chosenSub: string;
  effectiveCategory: string;
  effectiveSub: string;
  mismatch: boolean;
  suggested?: CategoryHint;
}

export function hintFromNote(raw: string): CategoryHint | null {
  // Normalize both sides so hamza/yaa/taa-marbuta variants match.
  // e.g. "آيفون" and "ايفون" both become "ايفون".
  const t = normalizeArabic(raw);
  for (const [key, val] of Object.entries(textSignals)) {
    if (t.includes(normalizeArabic(key))) {
      return val;
    }
  }
  return null;
}

export function matchCategory({
  chosenCategory,
  chosenSub,
  note,
  visionHint,
}: {
  chosenCategory: string;
  chosenSub: string;
  note: string;
  visionHint?: CategoryHint;
}): CategoryMatch {
  const hinted = visionHint || hintFromNote(note);
  if (!hinted || hinted.categorySlug === chosenCategory) {
    return {
      chosenCategory,
      chosenSub,
      effectiveCategory: chosenCategory,
      effectiveSub: chosenSub,
      mismatch: false,
    };
  }

  const silent = mismatchPolicy === MismatchPolicy.silent;

  // If the user has NO preference, trust the hint (no conflict).
  if (!chosenCategory) {
    return {
      chosenCategory,
      chosenSub,
      effectiveCategory: hinted.categorySlug,
      effectiveSub: hinted.subcategorySlug,
      mismatch: false,
      suggested: hinted,
    };
  }

  // User chose something different from the hint.
  // - silent mode → trust hint (override user choice)
  // - confirm mode → trust user choice, surface suggested for UI
  return {
    chosenCategory,
    chosenSub,
    effectiveCategory: silent ? hinted.categorySlug : chosenCategory,
    effectiveSub: silent ? hinted.subcategorySlug : chosenSub,
    mismatch: true,
    suggested: hinted,
  };
}


const COUNTRY_CODES = ['JO', 'LB', 'PS', 'SY', 'SA'] as const;

export function detectCountryHint(query: string): string | null {
  const q = query.trim().toLowerCase();
  if (!q) return null;
  for (const code of COUNTRY_CODES) {
    const aliases = getCountryAliases(code);
    for (const a of aliases) {
      if (a && q.includes(a.toLowerCase())) return code;
    }
  }
  return null;
}


export function getLocationQueryVariants(query: string): string[] {
  return expandQueryCity(query);
}


export interface GeoHint {
  readonly countryCode: string;
  readonly governorateSlug: string | null;
  readonly cityName: string | null;
  readonly campSlug: string | null;
  readonly landmarkSlug: string | null;
  readonly matchedName: string;
}

const GEO_COUNTRY_CODES = ['JO', 'LB', 'PS', 'SY', 'SA'] as const;

export function detectGeoHint(query: string): GeoHint | null {
  const q = query.trim();
  if (!q) return null;
  const lower = q.toLowerCase();

  for (const code of GEO_COUNTRY_CODES) {
    for (const gov of getAllGovernorates(code)) {
      if (
        gov.nameAr.includes(q) ||
        lower.includes(gov.nameEn.toLowerCase()) ||
        lower.includes(gov.slug)
      ) {
        return {
          countryCode: code,
          governorateSlug: gov.slug,
          cityName: gov.nameEn,
          campSlug: null,
          landmarkSlug: null,
          matchedName: gov.nameAr,
        };
      }
    }

    for (const camp of getAllCamps(code)) {
      if (
        camp.nameAr.includes(q) ||
        lower.includes(camp.nameEn.toLowerCase()) ||
        lower.includes(camp.slug)
      ) {
        return {
          countryCode: code,
          governorateSlug: camp.governorateSlug,
          cityName: null,
          campSlug: camp.slug,
          landmarkSlug: null,
          matchedName: camp.nameAr,
        };
      }
    }

    for (const lm of getAllLandmarks(code)) {
      if (
        lm.nameAr.includes(q) ||
        lower.includes(lm.nameEn.toLowerCase()) ||
        lower.includes(lm.slug)
      ) {
        return {
          countryCode: code,
          governorateSlug: null,
          cityName: lm.citySlug,
          campSlug: null,
          landmarkSlug: lm.slug,
          matchedName: lm.nameAr,
        };
      }
    }
  }

  return null;
}
