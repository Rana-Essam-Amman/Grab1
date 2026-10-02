import { normalizeArabic } from '@/data/arabicNormalize';

/**
 * Arabic-aware weighted edit distance with Damerau transposition.
 * Costs reflect real Arabic spelling confusions.
 */
const ALEF = /[أإآا]/g;

const PAIR_COST: Record<string, number> = {
  'ىا': 0.15, 'اى': 0.15,
  'ىي': 0.15, 'يى': 0.15,
  'ةه': 0.15, 'هة': 0.15,
  'كق': 0.3, 'قك': 0.3,
  'سص': 0.35, 'صس': 0.35,
  'طت': 0.4, 'تط': 0.4,
  'ذز': 0.4, 'زد': 0.4,
};

/** Minimal folding — only alif variants. Preserves ى/ي/ة for cost table. */
function fold(s: string): string {
  return s.replace(ALEF, 'ا');
}

/** Length-scaled threshold. */
function limit(len: number): number {
  return len <= 5 ? 1.0 : 1.5;
}

export function weightedDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;

  const d: number[] = new Array(n + 1);
  for (let j = 0; j <= n; j++) d[j] = j;

  for (let i = 1; i <= m; i++) {
    let prev = d[0];
    d[0] = i;
    for (let j = 1; j <= n; j++) {
      const tmp = d[j];
      const ai = a[i - 1];
      const bj = b[j - 1];
      const subCost = ai === bj ? 0 : (PAIR_COST[ai + bj] ?? 1);
      let cur = Math.min(d[j] + 1, d[j - 1] + 1, prev + subCost);
      // Damerau transposition
      if (i > 1 && j > 1 && ai === b[j - 2] && a[i - 2] === bj) {
        cur = Math.min(cur, (d[j - 2] ?? 0) + 1);
      }
      d[j] = cur;
      prev = tmp;
    }
  }
  return d[n];
}

const MIN_LEN = 4;
const MAX_LEN = 8;
const WORD_SPLIT = /[\s،,.;:!?()[\]{}"']+/;

const STOPWORDS = new Set<string>([
  'دينار', 'دولار', 'ريال', 'شيكل', 'درهم', 'ليره', 'ليرة', 'جنيه', 'يورو',
  'متر', 'مترمربع', 'كم', 'كيلو', 'كيلومتر', 'سنه', 'سنة', 'سنوات', 'سنين', 'شهر', 'اشهر',
  'في', 'من', 'على', 'الى', 'عن', 'مع', 'بسعر', 'سعر', 'السعر', 'الثمن',
  'للبيع', 'للايجار', 'معروض', 'معروضه', 'متوفر', 'متوفره',
  'جديد', 'جديده', 'مستعمل', 'مستعمله', 'نظيف', 'نظيفه',
]);

/**
 * Return true if `needle` fuzzy-matches any word in `haystack`.
 * Uses minimal fold (alif only) — does NOT call normalizeArabic globally.
 */
export function fuzzyContains(haystack: string, needle: string): boolean {
  if (!haystack || !needle) return false;
  const needleFolded = fold(needle.toLowerCase().trim());
  if (needleFolded.length < MIN_LEN) return false;
  const hayFolded = fold(haystack.toLowerCase());
  const words = hayFolded.split(WORD_SPLIT).filter(Boolean);
  const threshold = limit(needleFolded.length);
  for (const w of words) {
    if (STOPWORDS.has(w)) continue;
    if (w.length < MIN_LEN || w.length > MAX_LEN) continue;
    if (needleFolded.length < MIN_LEN || needleFolded.length > MAX_LEN) continue;
    if (w[0] !== needleFolded[0]) continue;
    if (Math.abs(w.length - needleFolded.length) > 1) continue;
    if (weightedDistance(w, needleFolded) <= threshold) return true;
  }
  return false;
}

/**
 * Best canonical from a flat dict. Dict terms are pre-normalized with
 * normalizeArabic (ى→ي), so we re-fold the input with the same rule first.
 * Then apply the minimal-fold algorithm.
 */
export function fuzzyFindCanonical<T extends { term: string; canonical: string }>(
  text: string,
  dict: readonly T[]
): string | undefined {
  if (!text || dict.length === 0) return undefined;
  const normHay = normalizeArabic(text).toLowerCase();
  const rawHay = text.toLowerCase();
  const words = normHay.split(WORD_SPLIT).filter(Boolean);

  let bestDist = Infinity;
  let bestCanonical: string | undefined;
  let bestLen = 0;

  for (const entry of dict) {
    const rawTerm = entry.term;
    if (rawTerm.length < MIN_LEN || rawTerm.length > MAX_LEN) continue;
    const termFolded = fold(rawTerm);

    for (const normWord of words) {
      if (STOPWORDS.has(normWord)) continue;
      // Try both normalized and raw forms of the input word.
      const candidates = new Set<string>([normWord, fold(normWord)]);
      // Also look at raw input (un-normalized) at the same token position.
      for (const raw of rawHay.split(WORD_SPLIT)) {
        if (STOPWORDS.has(raw)) continue;
        candidates.add(fold(raw));
      }
      for (const w of candidates) {
        if (w.length < MIN_LEN || w.length > MAX_LEN) continue;
        if (w[0] !== termFolded[0]) continue;
        if (Math.abs(w.length - termFolded.length) > 1) continue;
        const dist = weightedDistance(w, termFolded);
        const threshold = limit(Math.max(w.length, termFolded.length));
        if (dist <= threshold && (dist < bestDist || (dist === bestDist && termFolded.length > bestLen))) {
          bestDist = dist;
          bestLen = termFolded.length;
          bestCanonical = entry.canonical;
        }
      }
    }
  }
  return bestCanonical;
}

/** Kept for API compat — not used by the new algorithm. */
export function levenshtein(a: string, b: string, max: number): number {
  const d = weightedDistance(a, b);
  return d > max ? max + 1 : Math.round(d);
}
