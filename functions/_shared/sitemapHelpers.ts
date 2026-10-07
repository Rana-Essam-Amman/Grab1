const MAX_SLUG_LENGTH = 60;

/**
 * Edge-runtime copy of src/shared/lib/slugify.ts.
 * Pages Functions bundle separately from the SPA — this duplicate is
 * intentional. If slug rules change, update both.
 */
export function slugify(input: string): string {
  if (!input) return 'listing';
  const cleaned = input
    .normalize('NFKD')
    .replace(/[\u064B-\u065F\u0670]/g, '')
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .trim()
    .toLowerCase();

  const slug = cleaned
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  if (!slug) return 'listing';
  if (slug.length <= MAX_SLUG_LENGTH) return slug;
  return slug.slice(0, MAX_SLUG_LENGTH).replace(/-$/, '');
}

export interface SitemapUrl {
  readonly loc: string;
  readonly lastmod: string;
}

export function xmlEscape(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function buildListingLoc(
  origin: string,
  market: string,
  category: string,
  title: string,
  id: string
): string {
  const m = market.toLowerCase();
  const c = (category || 'other').toLowerCase();
  return `${origin}/${m}/${c}/${slugify(title)}-${id}`;
}

export function buildUrlset(urls: readonly SitemapUrl[]): string {
  const body = urls
    .map(
      (u) =>
        `<url><loc>${xmlEscape(u.loc)}</loc><lastmod>${xmlEscape(u.lastmod)}</lastmod></url>`
    )
    .join('');
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</urlset>`;
}

export function buildSitemapIndex(
  origin: string,
  markets: readonly string[]
): string {
  const body = markets
    .map(
      (m) =>
        `<sitemap><loc>${origin}/sitemap-${m.toLowerCase()}.xml</loc></sitemap>`
    )
    .join('');
  return `<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</sitemapindex>`;
}
