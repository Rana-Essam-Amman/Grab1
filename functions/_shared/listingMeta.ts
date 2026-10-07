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
  const price = `${row.price} ${row.currency}`;
  return `${row.title} — ${price} | FOX Marketplace`;
}

export function buildDescription(row: ListingRow): string {
  const loc = row.city ? `${row.city}, ${MARKET_AR[row.country_code] ?? row.country_code}` : '';
  const desc = (row.description || '').slice(0, 140).replace(/\s+/g, ' ').trim();
  return `${row.title} — ${row.price} ${row.currency}${loc ? ' · ' + loc : ''}. ${desc}`;
}

export function buildJsonLd(row: ListingRow, origin: string): string {
  const image = row.images && row.images.length > 0 ? row.images[0] : `${origin}/assets/icons/logo.png`;
  const payload = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: row.title,
    description: row.description,
    image,
    sku: row.id,
    offers: {
      '@type': 'Offer',
      price: row.price,
      priceCurrency: row.currency,
      availability:
        row.status === 'active'
          ? 'https://schema.org/InStock'
          : 'https://schema.org/SoldOut',
      url: `${origin}/listing/${row.id}`,
    },
  };
  return JSON.stringify(payload);
}
