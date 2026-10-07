import { categories } from '@/data/categories';

const MARKETS = ['JO', 'SA', 'LB', 'PS', 'SY'] as const;
type MarketCode = (typeof MARKETS)[number];

const CATEGORY_SLUGS = new Set<string>(categories.map((c) => c.slug));

export interface ParsedCategoryPath {
  readonly market: MarketCode;
  readonly category: string;
}

/** /{market}/{category} */
export function buildCategoryPath(market: string, category: string): string {
  const m = (market || 'JO').toUpperCase();
  const c = (category || 'motors').toLowerCase();
  return `/${m.toLowerCase()}/${c}`;
}

/**
 * Parses /{market}/{category} — exactly 2 segments.
 * Returns null if the shape, market, or category slug does not match.
 * A category URL must never collide with /listing/{id}, /post-ad/*,
 * /profile/edit, /messages/thread (all have 1 or 2 segments but the
 * first segment is not a valid market code).
 */
export function parseCategoryPath(path: string): ParsedCategoryPath | null {
  const parts = path.split('/').filter(Boolean);
  if (parts.length !== 2) return null;

  const [marketRaw, categoryRaw] = parts;
  const market = marketRaw.toUpperCase();
  if (!MARKETS.includes(market as MarketCode)) return null;

  const category = categoryRaw.toLowerCase();
  if (!CATEGORY_SLUGS.has(category)) return null;

  return { market: market as MarketCode, category };
}
