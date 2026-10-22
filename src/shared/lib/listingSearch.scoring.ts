import type { Listing } from '@/types';
import { normalizeArabic } from '@/data/arabicNormalize';
import { phoneticKey } from './phoneticKey';
import { stemText } from './arabicStemmer';
import { getFullLocationAliases } from './locationAliases';
import { matchGeoHierarchy } from './geoSearchHelpers';
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

  // Add location aliases (AR ↔ EN ↔ country name + governorate + camp + landmark)
  try {
    const countryAliases = getFullLocationAliases(
      item.countryCode || '',
      item.city || '',
      item.neighborhood || '',
    );
    for (const alias of countryAliases) {
      if (alias) otherStrings.push(alias);
    }
    const geoMatches = matchGeoHierarchy(item.countryCode || '', item.city || '', item.neighborhood || '');
    for (const name of geoMatches) {
      if (name) otherStrings.push(name);
    }
  } catch {
    // safe fallback
  }


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
