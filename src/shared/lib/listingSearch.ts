import type { Listing } from '@/types';
import { normalizeArabic } from '@/data/arabicNormalize';
import { expandWithSynonyms } from '@/data/arabicSynonyms';
import { phoneticKey } from './phoneticKey';
import { stemArabic, stemText } from './arabicStemmer';

export const parsePrice = (p: unknown): number =>
  Number(String(p).replace(/,/g, '').trim());

export const matchPrice = (
  item: Listing,
  min: number | null,
  max: number | null,
): boolean => {
  if (min === null && max === null) return true;
  const p = parsePrice(item.price);
  if (isNaN(p)) return true;
  return !(
    (min !== null && min > 0 && p < min) ||
    (max !== null && max > 0 && p > max)
  );
};

export const matchNeighborhood = (
  item: Listing,
  target: string,
): boolean => {
  const t = target.trim().toLowerCase();
  const n = (item.neighborhood || '').trim().toLowerCase();
  const c = (item.city || '').trim().toLowerCase();

  return (
    n === t ||
    c === t ||
    n.includes(t) ||
    t.includes(n) ||
    c.includes(t) ||
    t.includes(c)
  );
};

const SEARCH_STOP_WORDS = new Set([
  'في', 'من', 'على', 'الى', 'إلى', 'او', 'أو', 'و', 'مع', 'عن',
  'هذا', 'هذه', 'ذلك',
  'a', 'an', 'the', 'of', 'in', 'on', 'at', 'with', 'for', 'and', 'or',
]);

/**
 * Tokens shorter than 3 characters are excluded from search matching.
 * This prevents broad, unrelated matches for queries such as "s" and "sa".
 */
const MIN_QUERY_TOKEN_LENGTH = 3;

/**
 * Explicit cross-script brand aliases.
 *
 * Keep these narrowly scoped to avoid creating broad phonetic matches.
 * Add more aliases only with regression tests.
 */
const BRAND_TOKEN_ALIASES: Readonly<Record<string, readonly string[]>> = {
  kia: ['كيا'],
  كيا: ['kia'],
};

const collectSearchStrings = (
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

/**
 * Build candidate spellings for ONE original query token.
 *
 * OR applies within this list: matching any candidate is sufficient.
 * The original query tokens themselves are still required independently.
 */
const getTokenCandidates = (token: string): string[] => {
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

/**
 * Score one candidate spelling against the listing.
 * Returns 0 when this spelling does not match.
 */
const scoreCandidate = (
  candidate: string,
  fields: {
    title: string;
    desc: string;
    catSlug: string;
    subSlug: string;
    other: string;
    titlePhon: string;
    descPhon: string;
    otherPhon: string;
    titleStem: string;
    descStem: string;
    otherStem: string;
  },
): number => {
  const t = candidate;
  const tStem = stemArabic(t);

  let score = 0;

  if (
    fields.title.includes(t) ||
    (tStem.length >= 2 && fields.titleStem.includes(tStem))
  ) {
    score += 10;
  }

  if (fields.catSlug.includes(t) || fields.subSlug.includes(t)) {
    score += 8;
  }

  if (
    fields.desc.includes(t) ||
    (tStem.length >= 2 && fields.descStem.includes(tStem))
  ) {
    score += 5;
  }

  if (
    fields.other.includes(t) ||
    (tStem.length >= 2 && fields.otherStem.includes(tStem))
  ) {
    score += 3;
  }

  // Use phonetic matching only when direct matching found nothing.
  if (score === 0) {
    const key = phoneticKey(t);

    if (key.length >= 2) {
      if (fields.titlePhon.includes(key)) {
        score = 6;
      } else if (fields.descPhon.includes(key)) {
        score = 4;
      } else if (fields.otherPhon.includes(key)) {
        score = 2;
      }
    }
  }

  return score;
};

export const scoreListing = (
  item: Listing,
  q: string,
): number => {
  const query = (q || '').trim();
  if (!query) return 0;

  const rawTokens = query
    .split(/\s+/)
    .map((token) => normalizeArabic(token))
    .filter(Boolean);

  const tokens = rawTokens.filter(
    (token) =>
      token.length >= MIN_QUERY_TOKEN_LENGTH &&
      !SEARCH_STOP_WORDS.has(token),
  );

  if (tokens.length === 0) return 0;

  const title = normalizeArabic(item.title || '');
  const desc = normalizeArabic(item.description || '');
  const catSlug = normalizeArabic(item.categorySlug || '');
  const subSlug = normalizeArabic(item.subcategorySlug || '');

  const itemObj = item as unknown as Record<string, unknown>;
  const otherStrings: string[] = [];

  collectSearchStrings(
    {
      city: item.city,
      neighborhood: item.neighborhood,
      price: item.price,
      currency: item.currency,
      make: itemObj.make,
      year: itemObj.year,
      attributes: itemObj.attributes,
      generated: itemObj.generated,
    },
    otherStrings,
  );

  const other = normalizeArabic(otherStrings.join(' '));

  const fields = {
    title,
    desc,
    catSlug,
    subSlug,
    other,
    titlePhon: phoneticKey(item.title || ''),
    descPhon: phoneticKey(item.description || ''),
    otherPhon: phoneticKey(other),
    titleStem: stemText(title),
    descStem: stemText(desc),
    otherStem: stemText(other),
  };

  let totalScore = 0;

  // AND across original query tokens:
  // every meaningful original token must match.
  for (const token of tokens) {
    const candidates = getTokenCandidates(token);
    let bestTokenScore = 0;

    // OR within one token:
    // use the best matching original spelling, synonym, or alias.
    for (const candidate of candidates) {
      const candidateScore = scoreCandidate(candidate, fields);

      if (candidateScore > bestTokenScore) {
        bestTokenScore = candidateScore;
      }
    }

    // A missing original query token rejects the listing.
    if (bestTokenScore === 0) return 0;

    // Add only the best score for this original token.
    // Synonyms cannot inflate the score by matching repeatedly.
    totalScore += bestTokenScore;
  }

  return totalScore;
};

export const matchSearch = (
  item: Listing,
  q: string,
): boolean => scoreListing(item, q) > 0;

const PREMIUM_BOOST_MS = 3 * 60 * 60 * 1000; // 3 hours

export const sortListingsByPriority = (
  a: Listing,
  b: Listing,
): number => {
  const aBase = new Date(a.lastBumpedAt || a.createdAt || 0).getTime();
  const bBase = new Date(b.lastBumpedAt || b.createdAt || 0).getTime();

  const aEffective = aBase + (a.isPremium ? PREMIUM_BOOST_MS : 0);
  const bEffective = bBase + (b.isPremium ? PREMIUM_BOOST_MS : 0);

  return bEffective - aEffective;
};
