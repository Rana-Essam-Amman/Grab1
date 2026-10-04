/**
 * Arabic text normalization + fuzzy match scoring.
 *
 * Used by SearchableDropdown so users can type without strict diacritics:
 *   "ابو نصير" matches "أبو نصير"
 *   "جبيهه"   matches "الجبيهة"
 */

/** Normalize Arabic/Latin: strip diacritics, unify alef/taa/alef-maqsura. */
export function normalizeArabic(text: string): string {
  return text
    .replace(/[\u064B-\u065F\u0670]/g, '')      // tashkeel
    .replace(/[\u0622\u0623\u0625\u0671]/g, '\u0627') // آ أ إ ٱ → ا
    .replace(/\u0629/g, '\u0647')                // ة → ه
    .replace(/\u0649/g, '\u064A')                // ى → ي
    .replace(/\u0624/g, '\u0648')                // ؤ → و
    .replace(/\u0626/g, '\u064A')                // ئ → ي
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

/** Score query vs option: 3=exact, 2=prefix, 1=substring, 0=no match. */
export function matchScore(query: string, option: string): number {
  const q = normalizeArabic(query);
  const o = normalizeArabic(option);
  if (!q) return 1;
  if (q === o) return 3;
  if (o.startsWith(q)) return 2;
  if (o.includes(q)) return 1;
  return 0;
}

/** Find the index range of query within option (normalized), else null. */
export function findMatchRange(
  query: string,
  option: string
): { start: number; end: number } | null {
  const q = normalizeArabic(query);
  if (!q) return null;
  // Normalized length matches original length because we only swap 1:1 chars.
  const o = normalizeArabic(option);
  const idx = o.indexOf(q);
  if (idx === -1) return null;
  return { start: idx, end: idx + q.length };
}
