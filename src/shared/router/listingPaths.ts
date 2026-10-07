import { slugify } from '@/shared/lib/slugify';

const MARKETS = ['JO', 'SA', 'LB', 'PS', 'SY'] as const;
export type ListingMarket = (typeof MARKETS)[number];

export interface ListingPathInput {
  readonly id: string;
  readonly title: string;
  readonly countryCode: string;
  readonly categorySlug: string;
}

/** /{market}/{category}/{slug}-{id} */
export function buildListingPath(input: ListingPathInput): string {
  const market = (input.countryCode || 'JO').toLowerCase();
  const category = (input.categorySlug || 'other').toLowerCase();
  const slug = slugify(input.title);
  return `/${market}/${category}/${slug}-${input.id}`;
}

export interface ParsedListingPath {
  readonly market: string;
  readonly category: string;
  readonly slug: string;
  readonly id: string;
}

/**
 * Parses /{market}/{category}/{slug}-{id}
 * Returns null if the shape doesn't match.
 */

const UUID_LENGTH = 36; // 8-4-4-4-12 including dashes
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function parseListingPath(path: string): ParsedListingPath | null {
  const parts = path.split('/').filter(Boolean);
  if (parts.length !== 3) return null;

  const [marketRaw, categoryRaw, tail] = parts;
  const market = marketRaw.toUpperCase();
  if (!MARKETS.includes(market as ListingMarket)) return null;

  // UUID is fixed 36 chars. Slice from the END — the leading dashes inside
  // the UUID make lastIndexOf('-') unreliable.
  // Shape: {slug}-{uuid}  →  min length = 1 + 1 + 36 = 38
  if (tail.length < UUID_LENGTH + 2) return null;

  const id = tail.slice(-UUID_LENGTH);
  if (!UUID_RE.test(id)) return null;

  // Everything before the final dash is the slug (may be empty).
  const slug = tail.slice(0, tail.length - UUID_LENGTH - 1);
  if (!slug) return null;

  return { market, category: categoryRaw.toLowerCase(), slug, id };
}
