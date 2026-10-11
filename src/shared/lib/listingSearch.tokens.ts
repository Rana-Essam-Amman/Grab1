
import { normalizeArabic } from '@/data/arabicNormalize';
import { expandWithSynonyms } from '@/data/arabicSynonyms';

export const SEARCH_STOP_WORDS = new Set([
  'في', 'من', 'على', 'الى', 'إلى', 'او', 'أو', 'و', 'مع', 'عن',
  'هذا', 'هذه', 'ذلك',
  'a', 'an', 'the', 'of', 'in', 'on', 'at', 'with', 'for', 'and', 'or',
]);

export const MIN_QUERY_TOKEN_LENGTH = 3;

const BRAND_TOKEN_ALIASES: Readonly<Record<string, readonly string[]>> = {
  kia: ['كيا'],
  كيا: ['kia'],
};

export const collectSearchStrings = (
  value: unknown,
  out: string[],
): void => {
  if (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    const s = String(value);
    if (s) out.push(s);
    return;
  }

  if (Array.isArray(value)) {
    for (const v of value) collectSearchStrings(v, out);
    return;
  }

  if (value && typeof value === 'object') {
    for (const v of Object.values(value as Record<string, unknown>)) {
      collectSearchStrings(v, out);
    }
  }
};

export const getTokenCandidates = (token: string): string[] => {
  const candidates = new Set<string>([token]);

  for (const synonym of expandWithSynonyms([token])) {
    const normalized = normalizeArabic(synonym);
    if (normalized) candidates.add(normalized);
  }

  for (const alias of BRAND_TOKEN_ALIASES[token] || []) {
    const normalized = normalizeArabic(alias);
    if (normalized) candidates.add(normalized);
  }

  return [...candidates].filter(
    (candidate) => candidate.length >= MIN_QUERY_TOKEN_LENGTH,
  );
};
