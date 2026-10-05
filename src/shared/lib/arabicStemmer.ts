import { normalizeArabic } from '@/data/arabicNormalize';

/**
 * Lightweight Arabic stemmer for marketplace search.
 * Strips common prefixes (وال، بال، كال، فال، ال) and plural/feminine suffixes
 * (ات، ين، ون، ه، ة). Aggressive on purpose — recall over precision.
 *
 * "والسيارات" → "سيار"    "السيارة" → "سيار"    "سيارات" → "سيار"
 * "بالعقارات" → "عقار"    "ببيت"    → "بيت"
 *
 * Pure function. Never throws. Returns input unchanged if shorter than MIN.
 */

const PREFIXES = ['وال', 'بال', 'كال', 'فال', 'ال'] as const;
const PLURAL_SUFFIXES = ['ات', 'ين', 'ون', 'ه', 'ة'] as const;
const MIN_REMAINDER = 4;

export function stemArabic(input: string): string {
  if (!input) return '';
  let s = normalizeArabic(input);

  for (const p of PREFIXES) {
    if (s.startsWith(p) && s.length - p.length >= 3) {
      s = s.slice(p.length);
      break;
    }
  }

  for (const suf of PLURAL_SUFFIXES) {
    if (s.endsWith(suf) && s.length - suf.length >= MIN_REMAINDER) {
      s = s.slice(0, -suf.length);
      break;
    }
  }

  return s;
}

/** Apply stemArabic to every whitespace-separated word in a text. */
export function stemText(text: string): string {
  if (!text) return '';
  return text
    .split(/\s+/)
    .map((w) => stemArabic(w) || w)
    .join(' ');
}
