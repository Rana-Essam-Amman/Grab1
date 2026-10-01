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
