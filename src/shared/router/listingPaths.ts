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

const UUID_LENGTH = 36;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
// Legacy seed IDs look like 'jo-4', 'sa-12' — {market}-{number} at the tail.
const LEGACY_ID_RE = /([a-z]{2}-\d+)$/;

export function parseListingPath(path: string): ParsedListingPath | null {
  const parts = path.split('/').filter(Boolean);
  if (parts.length !== 3) return null;

  const [marketRaw, categoryRaw, tail] = parts;
  const market = marketRaw.toUpperCase();
  if (!MARKETS.includes(market as ListingMarket)) return null;
  const category = categoryRaw.toLowerCase();

  // Preferred: {slug}-{uuid}. Slice from the END.
  if (tail.length >= UUID_LENGTH + 2) {
    const id = tail.slice(-UUID_LENGTH);
    if (UUID_RE.test(id)) {
      const slug = tail.slice(0, tail.length - UUID_LENGTH - 1);
      if (slug) return { market, category, slug, id };
    }
  }

  // Legacy: {slug}-{market}-{number}, e.g. 'kia-...-panoramic-jo-4'.
  const legacy = tail.match(LEGACY_ID_RE);
  if (legacy) {
    const id = legacy[1];
    const slug = tail.slice(0, tail.length - id.length - 1);
    if (slug) return { market, category, slug, id };
  }

  return null;
}
