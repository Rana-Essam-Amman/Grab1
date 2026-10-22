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

  // Phone number fast-path: if query looks like a phone (7+ digits), compare digits only
  const queryDigits = query.replace(/\D/g, '');
  if (queryDigits.length >= 7) {
    const itemObj = item as unknown as Record<string, unknown>;
    const rawPhone = String(item.sellerPhone || itemObj.seller_phone || '').replace(/\D/g, '');
    const qNorm = queryDigits.replace(/^0+/, '');
    const rNorm = rawPhone.replace(/^0+/, '');
    if (rNorm && (rNorm.includes(qNorm) || qNorm.includes(rNorm))) {
      return 100; // Force top match
    }
  }

  const rawTokens = query.split(/\s+/).map((t) => normalizeArabic(t)).filter(Boolean);
  const tokens = rawTokens.filter((t) => t.length >= MIN_QUERY_TOKEN_LENGTH && !SEARCH_STOP_WORDS.has(t));

  if (tokens.length === 0) return 0;

  const title = normalizeArabic(item.title || '');
  const desc = normalizeArabic(item.description || '');
  const catSlug = normalizeArabic(item.categorySlug || '');
  const subSlug = normalizeArabic(item.subcategorySlug || '');
  const sellerName = normalizeArabic(
    item.sellerName ||
    ((item as unknown as Record<string, unknown>).seller_name as string) ||
    ''
  );

  const itemObj = item as unknown as Record<string, unknown>;
  const otherStrings: string[] = [];

  // Removed sellerName and sellerPhone from generic collection to prevent false positives
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
    title, desc, catSlug, subSlug, other, sellerName,
    titlePhon: phoneticKey(item.title || ''),
    descPhon: phoneticKey(item.description || ''),
    otherPhon: phoneticKey(other),
    titleStem: stemText(title),
    descStem: stemText(desc),
    otherStem: stemText(other),
  };

  let totalScore = 0;
  for (const token of tokens) {
    const candidates = getTokenCandidates(token);
    let bestTokenScore = 0;
    for (const candidate of candidates) {
      const candidateScore = scoreCandidate(candidate, fields);
      if (candidateScore > bestTokenScore) bestTokenScore = candidateScore;
    }
    if (bestTokenScore === 0) return 0;
    totalScore += bestTokenScore;
  }

  return totalScore;
};

export const matchSearch = (item: Listing, q: string): boolean => {
  return scoreListing(item, q) > 0;
};
