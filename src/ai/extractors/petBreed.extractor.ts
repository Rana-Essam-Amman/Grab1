import { PET_BREEDS } from './data/domain-extractors.data';
import { normalizeArabic } from '@/data/arabicNormalize';

const FLAT: ReadonlyArray<{ term: string; canonical: string }> =
  PET_BREEDS
    .flatMap((p) =>
      p.aliases.map((a) => ({ term: normalizeArabic(a).toLowerCase(), canonical: p.canonical }))
    )
    .sort((a, b) => b.term.length - a.term.length);

export function extractPetBreed(text: string): string | undefined {
  if (!text) return undefined;
  const t = normalizeArabic(text).toLowerCase();
  for (const entry of FLAT) {
    if (entry.term && t.includes(entry.term)) return entry.canonical;
  }
  return undefined;
}
