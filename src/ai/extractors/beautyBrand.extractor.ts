import { BEAUTY_BRANDS } from './data/domain-extractors.data';
import { normalizeArabic } from '@/data/arabicNormalize';
import { fuzzyFindCanonical } from '../lib/fuzzyMatch';

const FLAT: ReadonlyArray<{ term: string; canonical: string }> =
  BEAUTY_BRANDS
    .flatMap((p) =>
      p.aliases.map((a) => ({ term: normalizeArabic(a).toLowerCase(), canonical: p.canonical }))
    )
    .sort((a, b) => b.term.length - a.term.length);

export function extractBeautyBrand(text: string): string | undefined {
  if (!text) return undefined;
  const t = normalizeArabic(text).toLowerCase();
  for (const entry of FLAT) {
    if (entry.term && t.includes(entry.term)) return entry.canonical;
  }
  // Fuzzy fallback.
  return fuzzyFindCanonical(text, FLAT);
}
