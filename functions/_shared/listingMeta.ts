import type { ListingRow } from './supabaseRest';

const MARKET_AR: Record<string, string> = {
  JO: 'الأردن',
  SA: 'السعودية',
  LB: 'لبنان',
  PS: 'فلسطين',
  SY: 'سوريا',
};

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function buildTitle(row: ListingRow): string {
  return `${row.title} — ${row.price} ${row.currency} | FOX Marketplace`;
}

export function buildDescription(row: ListingRow): string {
  const loc = row.city
    ? `${row.city}, ${MARKET_AR[row.country_code] ?? row.country_code}`
    : '';
  const desc = (row.description || '').slice(0, 140).replace(/\s+/g, ' ').trim();
  return `${row.title} — ${row.price} ${row.currency}${loc ? ' · ' + loc : ''}. ${desc}`;
}

/**
 * SSR body HTML for crawlers + no-JS users.
 * Google indexes this static HTML. React hydrates independently on top.
 * Pattern: eBay streaming SSR + Etsy static shell.
 */
export function buildListingBodyHtml(row: ListingRow): string {
  const title = escapeHtml(row.title);
  const price = escapeHtml(`${row.price} ${row.currency}`);
  const city = row.city ? escapeHtml(row.city) : '';
  const market = MARKET_AR[row.country_code] ?? row.country_code;
  const loc = city ? `${city}، ${market}` : market;
  const desc = escapeHtml((row.description || '').slice(0, 800));
  const images = (row.images || [])
    .slice(0, 5)
    .map(
      (u) =>
        `<img src="${escapeHtml(u)}" alt="${title}" loading="eager" width="600" height="600" />`
    )
    .join('');
  return `<article data-ssr-listing="${escapeHtml(row.id)}">
  <header>
    <h1>${title}</h1>
    <p data-ssr-price>${price}</p>
    <p data-ssr-location>${loc}</p>
  </header>
  ${images ? `<figure>${images}</figure>` : ''}
  <section data-ssr-description><p>${desc}</p></section>
</article>`;
}

/**
 * Passive bootstrap data. NOT consumed by React yet.
 * Reserved for future hydration perf work.
 * Safe global: replaces `<` to prevent script-injection breakout.
 */
export function buildBootstrapScript(row: ListingRow): string {
  const safe = {
    id: row.id,
    title: row.title,
    price: row.price,
    currency: row.currency,
    country_code: row.country_code,
    city: row.city,
    description: row.description,
    images: row.images,
    category_slug: row.category_slug,
    status: row.status,
    seller_name: row.seller_name,
    created_at: row.created_at,
  };
  const json = JSON.stringify(safe).replace(/</g, '\\u003c');
  return `<script>window.__FOX_LISTING__=${json}</script>`;
}
