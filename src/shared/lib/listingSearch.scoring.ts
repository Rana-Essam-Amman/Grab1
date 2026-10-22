import type { Listing } from '@/types';
import { normalizeArabic } from '@/data/arabicNormalize';
import { phoneticKey } from './phoneticKey';
import { stemText } from './arabicStemmer';
import {
  collectSearchStrings,
  getTokenCandidates,
  MIN_QUERY_TOKEN_LENGTH,
  SEARCH_STOP_WORDS,
} from './listingSearch.tokens';
import { scoreCandidate } from './listingSearch.candidateScore';

export const scoreListing = (item: Listing, q: string): number => {
  const query = (q || '').trim();
  if (!query) return 0;

  const itemObj = item as unknown as Record<string, unknown>;

  // Phone number fast-path: if query looks like a phone (7+ digits), compare digits only
  const queryDigits = query.replace(/\D/g, '');
  if (queryDigits.length >= 7) {
    const rawPhone = String(item.sellerPhone || itemObj.seller_phone || '').replace(/\D/g, '');
    const qNorm = queryDigits.replace(/^0+/, '');
    const rNorm = rawPhone.replace(/^0+/, '');
    if (
      rawPhone &&
      (rawPhone.includes(queryDigits) ||
        queryDigits.includes(rawPhone) ||
        (qNorm && rNorm && (rNorm.includes(qNorm) || qNorm.includes(rNorm))))
    ) {
      return 100; // Force top match
    }
  }

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

  const nonSellerStrings: string[] = [];
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
    nonSellerStrings,
  );

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
      sellerName: item.sellerName || itemObj.seller_name,
      sellerPhone: item.sellerPhone || itemObj.seller_phone,
    },
    otherStrings,
  );

  const cleanOtherStrings = otherStrings.map((s) => s.replace(/\b\+?\d{7,}\b/g, ''));
  const other = normalizeArabic(cleanOtherStrings.join(' '));
  const nonSellerOther = normalizeArabic(nonSellerStrings.join(' '));

  const fields = {
    title,
    desc,
    catSlug,
    subSlug,
    other,
    titlePhon: phoneticKey(item.title || ''),
    descPhon: phoneticKey(item.description || ''),
    otherPhon: phoneticKey(nonSellerOther),
    titleStem: stemText(title),
    descStem: stemText(desc),
    otherStem: stemText(other),
  };

  let totalScore = 0;

  // AND across original query tokens.
  // Every meaningful original token must match.
  for (const token of tokens) {
    const candidates = getTokenCandidates(token);
    let bestTokenScore = 0;

    // OR within one token: use the best spelling or synonym.
    for (const candidate of candidates) {
      const candidateScore = scoreCandidate(candidate, fields);

      if (candidateScore > bestTokenScore) {
        bestTokenScore = candidateScore;
      }
    }

    // Reject listings missing any original query token.
    if (bestTokenScore === 0) return 0;

    // Prevent synonyms from inflating the score.
    totalScore += bestTokenScore;
  }

  return totalScore;
};

export const matchSearch = (
  item: Listing,
  q: string,
): boolean => scoreListing(item, q) > 0;
