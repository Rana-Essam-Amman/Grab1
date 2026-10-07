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
