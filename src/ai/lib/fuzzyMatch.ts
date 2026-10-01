import { normalizeArabic } from '@/data/arabicNormalize';

/**
 * Bounded Levenshtein distance with early-exit.
 * Returns edit distance, capped at `max`. Returns max+1 if exceeded.
 */
export function levenshtein(a: string, b: string, max: number): number {
  if (a === b) return 0;
  const la = a.length;
  const lb = b.length;
  if (Math.abs(la - lb) > max) return max + 1;
  if (la === 0) return lb;
  if (lb === 0) return la;

  let prev: number[] = new Array(lb + 1);
  let curr: number[] = new Array(lb + 1);
  for (let j = 0; j <= lb; j++) prev[j] = j;

  for (let i = 1; i <= la; i++) {
    curr[0] = i;
    let rowMin = i;
    for (let j = 1; j <= lb; j++) {
      const cost = a.charCodeAt(i - 1) === b.charCodeAt(j - 1) ? 0 : 1;
      const v = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
      curr[j] = v;
      if (v < rowMin) rowMin = v;
    }
    if (rowMin > max) return max + 1;
    [prev, curr] = [curr, prev];
  }
  return prev[lb];
}

const MIN_FUZZY_LEN = 4;
const WORD_SPLIT = /[\s،,.;:!?()[\]{}"']+/;

/**
 * True if `haystack` contains a word whose normalized Levenshtein distance
 * to `needle` is ≤ threshold. Queries < MIN_FUZZY_LEN rejected.
 * Threshold: len 4-5 → 1 edit; len ≥ 6 → 2 edits.
 */
export function fuzzyContains(haystack: string, needle: string): boolean {
  if (!haystack || !needle) return false;
  const normNeedle = normalizeArabic(needle).toLowerCase().trim();
  if (normNeedle.length < MIN_FUZZY_LEN) return false;

  const threshold = normNeedle.length >= 6 ? 2 : 1;
  const normHay = normalizeArabic(haystack).toLowerCase();
  if (normHay.includes(normNeedle)) return true;

  const words = normHay.split(WORD_SPLIT);
  for (const w of words) {
    if (!w) continue;
    if (Math.abs(w.length - normNeedle.length) > threshold) continue;
    if (levenshtein(w, normNeedle, threshold) <= threshold) return true;
  }
  return false;
}

/**
 * Best fuzzy canonical from a pre-normalized dict.
 * Dict is expected sorted longest-first by caller.
 */
export function fuzzyFindCanonical<T extends { term: string; canonical: string }>(
  text: string,
  dict: readonly T[]
): string | undefined {
  if (!text || dict.length === 0) return undefined;
  const normHay = normalizeArabic(text).toLowerCase();
  const words = normHay.split(WORD_SPLIT).filter(Boolean);

  for (const entry of dict) {
    const term = entry.term;
    if (term.length < MIN_FUZZY_LEN) continue;
    const threshold = term.length >= 6 ? 2 : 1;
    for (const w of words) {
      if (Math.abs(w.length - term.length) > threshold) continue;
      if (levenshtein(w, term, threshold) <= threshold) return entry.canonical;
    }
  }
  return undefined;
}
