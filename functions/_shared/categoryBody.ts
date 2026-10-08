import type { CategoryListingRow } from './supabaseListings';
import { buildListingLoc } from './sitemapHelpers';
import { escapeHtml } from './listingMeta';

const SSR_BODY_LIMIT = 20;

/**
 * SSR body HTML for category pages. First 20 listings inline.
 * Google indexes this static HTML. React hydrates independently on top.
 * Pattern: eBay category + Etsy static shell.
 */
export function buildCategoryBodyHtml(
  origin: string,
  market: string,
  category: string,
  categoryNameAr: string,
  rows: readonly CategoryListingRow[]
): string {
  const top = rows.slice(0, SSR_BODY_LIMIT);
  const items = top
    .map((row) => {
      const url = buildListingLoc(origin, market, category, row.title, row.id);
      const title = escapeHtml(row.title);
      const price = escapeHtml(`${row.price} ${row.currency}`);
      const city = row.city ? escapeHtml(row.city) : '';
      const img =
        row.images && row.images.length > 0
          ? `<img src="${escapeHtml(row.images[0])}" alt="${title}" loading="lazy" width="300" height="300" />`
          : '';
      return `<li data-ssr-item="${escapeHtml(row.id)}">
  <a href="${escapeHtml(url)}">
    ${img}
    <h3>${title}</h3>
    <p data-ssr-price>${price}</p>
    ${city ? `<p data-ssr-city>${city}</p>` : ''}
  </a>
</li>`;
    })
    .join('');
  return `<section data-ssr-category="${escapeHtml(market.toLowerCase())}/${escapeHtml(category)}">
  <h2>${escapeHtml(categoryNameAr)}</h2>
  <ul data-ssr-listings>${items}</ul>
</section>`;
}
