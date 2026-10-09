import { categories } from '@/data/categories';
import { subcategories } from '@/data/subcategories';

const MARKETS = ['JO', 'SA', 'LB', 'PS', 'SY'] as const;
type MarketCode = (typeof MARKETS)[number];

const CATEGORY_SLUGS = new Set<string>(categories.map((c) => c.slug));

// Map every subcategory slug to its parent category slug.
const SUBCATEGORY_TO_PARENT: Record<string, string> = {};
for (const [parent, subs] of Object.entries(subcategories)) {
  for (const sub of subs) SUBCATEGORY_TO_PARENT[sub.slug] = parent;
}

export interface ParsedCategoryPath {
  readonly market: MarketCode;
  readonly category: string;
  readonly subcategory: string | null;
}

/** /{market}/{category-or-subcategory} */
export function buildCategoryPath(market: string, slug: string): string {
  const m = (market || 'JO').toUpperCase();
  const c = (slug || 'motors').toLowerCase();
  return `/${m.toLowerCase()}/${c}`;
}

/**
 * Parses /{market}/{slug} where slug is a top-level category OR a subcategory.
 * Returns null if shape, market, or slug do not match.
 * Never collides with /listing/{id}, /post-ad/*, /messages/thread because
 * the first segment must be a valid market code.
 */
export function parseCategoryPath(path: string): ParsedCategoryPath | null {
  const parts = path.split('/').filter(Boolean);
  if (parts.length !== 2) return null;

  const [marketRaw, slugRaw] = parts;
  const market = marketRaw.toUpperCase();
  if (!MARKETS.includes(market as MarketCode)) return null;

  const slug = slugRaw.toLowerCase();
  if (CATEGORY_SLUGS.has(slug)) {
    return { market: market as MarketCode, category: slug, subcategory: null };
  }
  const parent = SUBCATEGORY_TO_PARENT[slug];
  if (parent) {
    return { market: market as MarketCode, category: parent, subcategory: slug };
  }
  return null;
}
