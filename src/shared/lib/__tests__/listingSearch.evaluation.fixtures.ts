import type { Listing } from '@/types';

/**
 * Phase 1 evaluation fixtures.
 *
 * These fixtures are used only by client-side helper tests.
 * They are NOT evidence of PostgreSQL / search_listings RPC behavior.
 * Server-side contract expectations live in the companion RPC specification.
 */

export type EvaluationListing = Listing & {
  /** Optional structured fields used by scoreListing via collectSearchStrings. */
  make?: string;
  year?: string;
};

function listing(partial: Partial<EvaluationListing> & Pick<EvaluationListing, 'id' | 'title'>): EvaluationListing {
  return {
    id: partial.id,
    title: partial.title,
    description: partial.description ?? '',
    price: partial.price ?? '0',
    currency: partial.currency ?? 'JOD',
    countryCode: partial.countryCode ?? 'JO',
    city: partial.city ?? 'Amman',
    neighborhood: partial.neighborhood ?? '',
    categorySlug: partial.categorySlug ?? 'motors',
    subcategorySlug: partial.subcategorySlug ?? 'cars',
    imageUrl: '',
    images: [],
    sellerPhone: '',
    sellerName: '',
    createdAt: partial.createdAt ?? '2026-10-01',
    views: 0,
    status: partial.status ?? 'active',
    attributes: partial.attributes ?? [],
    make: partial.make,
    year: partial.year,
  };
}

export const EVALUATION_LISTINGS: readonly EvaluationListing[] = [
  listing({
    id: 'jo-toyota-camry-2018',
    title: 'Toyota Camry 2018',
    description: 'Clean Toyota Camry, low mileage, one owner.',
    price: '12000',
    countryCode: 'JO',
    city: 'Amman',
    neighborhood: 'Abdoun',
    make: 'Toyota',
    year: '2018',
    attributes: [{ label: 'model', value: 'Camry' }, { label: 'year', value: '2018' }],
  }),
  listing({
    id: 'jo-toyota-camry-ar',
    title: 'تويوتا كامري 2018',
    description: 'سيارة تويوتا كامري بحالة ممتازة',
    price: '11500',
    countryCode: 'JO',
    city: 'عمّان',
    neighborhood: 'عبدون',
    make: 'تويوتا',
    year: '2018',
  }),
  listing({
    id: 'sa-kia-cerato',
    title: 'Kia Cerato 2020',
    description: 'Kia Cerato full option, Saudi plates.',
    price: '45000',
    currency: 'SAR',
    countryCode: 'SA',
    city: 'Riyadh',
    neighborhood: 'Olaya',
    make: 'Kia',
    year: '2020',
  }),
  listing({
    id: 'sa-kia-ar',
    title: 'كيا سيراتو 2020',
    description: 'كيا سيراتو فول اوبشن',
    price: '44000',
    currency: 'SAR',
    countryCode: 'SA',
    city: 'الرياض',
    neighborhood: 'العليا',
    make: 'كيا',
    year: '2020',
  }),
  listing({
    id: 'jo-samsung-tv',
    title: 'Samsung 55 inch TV',
    description: 'Samsung Smart TV, barely used.',
    price: '250',
    countryCode: 'JO',
    city: 'Amman',
    categorySlug: 'electronics',
    subcategorySlug: 'tv',
    make: 'Samsung',
  }),
  listing({
    id: 'jo-sam-the-seller',
    title: 'Handmade wooden table by Sam',
    description: 'Solid wood table. Seller name Sam is not a brand.',
    price: '80',
    countryCode: 'JO',
    city: 'Amman',
    categorySlug: 'furniture',
    subcategorySlug: 'tables',
  }),
  listing({
    id: 'jo-draft-toyota',
    title: 'Toyota draft listing',
    description: 'Should not be publicly searchable.',
    countryCode: 'JO',
    status: 'pending',
  }),
  listing({
    id: 'ps-numeric-fragment',
    title: 'iPhone 14 Pro Max',
    description: 'Apple iPhone model 14, 256GB.',
    price: '700',
    currency: 'ILS',
    countryCode: 'PS',
    city: 'Ramallah',
    categorySlug: 'mobiles',
    subcategorySlug: 'phones',
    attributes: [{ label: 'storage', value: '256GB' }],
  }),
  listing({
    id: 'jo-punctuation',
    title: 'Toyota, Camry — 2.5L',
    description: 'Punctuation and mixed whitespace:   extra   spaces.',
    countryCode: 'JO',
  }),
  listing({
    id: 'lb-unrelated',
    title: 'Apartment for rent in Beirut',
    description: 'Two bedroom apartment near the sea.',
    price: '900',
    currency: 'USD',
    countryCode: 'LB',
    city: 'Beirut',
    categorySlug: 'real-estate',
    subcategorySlug: 'for-rent',
  }),
];

export interface EvaluationCase {
  readonly id: string;
  readonly query: string;
  readonly market?: Listing['countryCode'];
  readonly scenario: string;
  readonly rationale: string;
  /** Listing ids that the product requirement considers relevant. */
  readonly expectedRelevantIds: readonly string[];
  /** Listing ids that must not be returned. */
  readonly expectedExcludedIds: readonly string[];
  /** Whether this case is expected to expose a current client-side gap. */
  readonly knownClientGap?: boolean;
}

export const EVALUATION_CASES: readonly EvaluationCase[] = [
  {
    id: 'toyota-exact-en',
    query: 'Toyota',
    market: 'JO',
    scenario: 'exact English brand',
    rationale: 'English brand query must find English Toyota listings in the selected market.',
    expectedRelevantIds: ['jo-toyota-camry-2018', 'jo-punctuation'],
    expectedExcludedIds: ['sa-kia-cerato', 'jo-draft-toyota', 'lb-unrelated'],
  },
  {
    id: 'toyota-ar',
    query: 'تويوتا',
    market: 'JO',
    scenario: 'Arabic brand against Arabic listing',
    rationale: 'Arabic brand spelling must match Arabic title content.',
    expectedRelevantIds: ['jo-toyota-camry-ar'],
    expectedExcludedIds: ['jo-samsung-tv', 'lb-unrelated'],
  },
  {
    id: 'toyota-cross-script',
    query: 'تويوتا',
    market: 'JO',
    scenario: 'cross-script brand',
    rationale: 'Observed client behavior: phoneticKey bridges تويوتا and Toyota even without a synonym group. This is not a client gap on this fixture.',
    expectedRelevantIds: ['jo-toyota-camry-ar', 'jo-toyota-camry-2018'],
    expectedExcludedIds: ['sa-kia-cerato'],
  },
  {
    id: 'kia-en',
    query: 'Kia',
    market: 'SA',
    scenario: 'English brand, market isolation',
    rationale: 'Kia query in SA must not return JO Toyota or LB real-estate.',
    expectedRelevantIds: ['sa-kia-cerato'],
    expectedExcludedIds: ['jo-toyota-camry-2018', 'lb-unrelated'],
  },
  {
    id: 'kia-ar',
    query: 'كيا',
    market: 'SA',
    scenario: 'Arabic brand',
    rationale: 'Arabic Kia spelling must match the Arabic Kia listing.',
    expectedRelevantIds: ['sa-kia-ar'],
    expectedExcludedIds: ['jo-toyota-camry-2018'],
  },
  {
    id: 'camry-en',
    query: 'Camry',
    market: 'JO',
    scenario: 'English model',
    rationale: 'Model name Camry must match the English Camry listing.',
    expectedRelevantIds: ['jo-toyota-camry-2018', 'jo-punctuation'],
    expectedExcludedIds: ['sa-kia-cerato'],
  },
  {
    id: 'camry-ar',
    query: 'كامري',
    market: 'JO',
    scenario: 'Arabic model',
    rationale: 'Arabic Camry spelling must match the Arabic Camry listing.',
    expectedRelevantIds: ['jo-toyota-camry-ar'],
    expectedExcludedIds: ['jo-samsung-tv'],
  },
  {
    id: 'prefix-toy',
    query: 'toy',
    market: 'JO',
    scenario: 'prefix substring',
    rationale: 'Prefix fragment of Toyota must retrieve the Toyota listing.',
    expectedRelevantIds: ['jo-toyota-camry-2018'],
    expectedExcludedIds: ['jo-samsung-tv'],
  },
  {
    id: 'middle-yot',
    query: 'yot',
    market: 'JO',
    scenario: 'middle-of-token substring',
    rationale: 'Middle fragment yot must retrieve Toyota. Client includes() supports this; RPC prefix-FTS path may not.',
    expectedRelevantIds: ['jo-toyota-camry-2018'],
    expectedExcludedIds: ['jo-samsung-tv', 'jo-sam-the-seller'],
  },
  {
    id: 'suffix-ota',
    query: 'ota',
    market: 'JO',
    scenario: 'suffix substring',
    rationale: 'Suffix fragment ota must retrieve Toyota.',
    expectedRelevantIds: ['jo-toyota-camry-2018'],
    expectedExcludedIds: ['jo-samsung-tv'],
  },
  {
    id: 'short-1-s',
    query: 's',
    market: 'JO',
    scenario: 'one-character query',
    rationale: 'Single character must not treat every listing as equally relevant. Product requires controlled false positives.',
    expectedRelevantIds: [],
    expectedExcludedIds: ['jo-samsung-tv', 'jo-sam-the-seller', 'jo-toyota-camry-2018'],
    knownClientGap: true,
  },
  {
    id: 'short-2-sa',
    query: 'sa',
    market: 'JO',
    scenario: 'two-character query',
    rationale: 'Two-character fragment should not indiscriminately match Samsung and Sam.',
    expectedRelevantIds: [],
    expectedExcludedIds: ['jo-samsung-tv', 'jo-sam-the-seller'],
    knownClientGap: true,
  },
  {
    id: 'short-3-sam',
    query: 'Sam',
    market: 'JO',
    scenario: 'three-character false-positive pattern',
    rationale: 'Previously observed pattern: short query Sam must not return unrelated listings merely because a permissive similarity score exceeds a threshold. Client includes() will match Samsung and the Sam table; that is the defect to record.',
    expectedRelevantIds: [],
    expectedExcludedIds: ['jo-samsung-tv', 'jo-sam-the-seller'],
    knownClientGap: true,
  },
  {
    id: 'numeric-2018',
    query: '2018',
    market: 'JO',
    scenario: 'numeric fragment',
    rationale: 'Year fragment 2018 must retrieve the 2018 Camry listings.',
    expectedRelevantIds: ['jo-toyota-camry-2018', 'jo-toyota-camry-ar'],
    expectedExcludedIds: ['sa-kia-cerato'],
  },
  {
    id: 'punctuation-whitespace',
    query: '  Camry  ',
    market: 'JO',
    scenario: 'punctuation and whitespace',
    rationale: 'Leading/trailing whitespace must not prevent a match.',
    expectedRelevantIds: ['jo-toyota-camry-2018', 'jo-punctuation'],
    expectedExcludedIds: ['sa-kia-cerato'],
  },
  {
    id: 'empty-query',
    query: '   ',
    market: 'JO',
    scenario: 'empty / whitespace-only',
    rationale: 'Whitespace-only query must not be treated as a selective search. Client scoreListing returns 1 for empty query.',
    expectedRelevantIds: [],
    expectedExcludedIds: [],
    knownClientGap: true,
  },
  {
    id: 'multi-term',
    query: 'Toyota Camry',
    market: 'JO',
    scenario: 'multi-term relevance',
    rationale: 'Both tokens must match. A listing matching only one term should rank below a listing matching both.',
    expectedRelevantIds: ['jo-toyota-camry-2018', 'jo-punctuation'],
    expectedExcludedIds: ['jo-samsung-tv'],
  },
  {
    id: 'market-isolation',
    query: 'Kia',
    market: 'JO',
    scenario: 'market isolation',
    rationale: 'JO market must not return the SA Kia listing when market filter is applied.',
    expectedRelevantIds: [],
    expectedExcludedIds: ['sa-kia-cerato'],
  },
  {
    id: 'eligibility-draft',
    query: 'Toyota',
    market: 'JO',
    scenario: 'active-listing eligibility',
    rationale: 'Pending/draft listings must be excluded by the server contract. Client helper does not enforce status; the gap is recorded.',
    expectedRelevantIds: ['jo-toyota-camry-2018', 'jo-punctuation'],
    expectedExcludedIds: ['jo-draft-toyota'],
    knownClientGap: true,
  },
];
