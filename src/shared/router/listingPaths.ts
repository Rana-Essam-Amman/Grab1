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
export function parseListingPath(path: string): ParsedListingPath | null {
  const parts = path.split('/').filter(Boolean);
  if (parts.length !== 3) return null;

  const [marketRaw, categoryRaw, tail] = parts;
  const market = marketRaw.toUpperCase();
  if (!MARKETS.includes(market as ListingMarket)) return null;

  const dashIdx = tail.lastIndexOf('-');
  if (dashIdx < 1 || dashIdx === tail.length - 1) return null;

  const slug = tail.slice(0, dashIdx);
  const id = tail.slice(dashIdx + 1);
  // UUID check — must look like a UUID to avoid false positives.
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) return null;

  return { market, category: categoryRaw.toLowerCase(), slug, id };
}
