import type { ListingRow } from './supabaseRest';
import { buildListingLoc } from './sitemapHelpers';

const MARKET_EN: Record<string, string> = {
  JO: 'Jordan',
  SA: 'Saudi Arabia',
  LB: 'Lebanon',
  PS: 'Palestine',
  SY: 'Syria',
};

const CATEGORY_EN: Record<string, string> = {
  motors: 'Motors',
  mobiles: 'Mobiles',
  electronics: 'Electronics',
  furniture: 'Furniture',
  fashion: 'Fashion',
  realestate: 'Real Estate',
  property: 'Property',
  jobs: 'Jobs',
  services: 'Services',
  other: 'Other',
};

interface AttributePair {
  readonly key?: string;
  readonly label: string;
  readonly value: string;
}

function safeAttrs(raw: unknown): AttributePair[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (x): x is AttributePair =>
      typeof x === 'object' && x !== null && 'value' in x
  );
}

function findAttr(
  attrs: readonly AttributePair[],
  needles: string[]
): string | null {
  const lower = needles.map((n) => n.toLowerCase());
  for (const a of attrs) {
    const k = (a.key || a.label || '').toLowerCase();
    if (lower.some((n) => k.includes(n))) return a.value;
  }
  return null;
}

export function buildJsonLd(row: ListingRow, origin: string): string {
  const image = row.images && row.images.length > 0
    ? row.images[0]
    : `${origin}/assets/icons/logo.png`;

  const attrs = safeAttrs(row.attributes);
  const brand = findAttr(attrs, ['brand', 'ماركة', 'الشركة']);
  const conditionRaw = findAttr(attrs, ['condition', 'حالة', 'الحالة']);
  const condition = /new|جديد/i.test(conditionRaw || '')
    ? 'https://schema.org/NewCondition'
    : conditionRaw
      ? 'https://schema.org/UsedCondition'
      : undefined;

  const seller = row.seller_name
    ? { '@type': 'Person', name: row.seller_name }
    : undefined;

  const marketEn = MARKET_EN[row.country_code] ?? row.country_code;
  const catEn = CATEGORY_EN[row.category_slug ?? ''] ?? 'Listings';
  const canonicalUrl = buildListingLoc(
    origin,
    row.country_code,
    row.category_slug ?? 'other',
    row.title,
    row.id
  );

  const product: Record<string, unknown> = {
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
      url: canonicalUrl,
      ...(seller ? { seller } : {}),
      ...(condition ? { itemCondition: condition } : {}),
    },
    ...(brand ? { brand: { '@type': 'Brand', name: brand } } : {}),
  };

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'FOX Marketplace', item: origin },
      { '@type': 'ListItem', position: 2, name: marketEn, item: `${origin}/${row.country_code.toLowerCase()}/` },
      { '@type': 'ListItem', position: 3, name: catEn, item: `${origin}/${row.country_code.toLowerCase()}/${row.category_slug ?? 'other'}/` },
      { '@type': 'ListItem', position: 4, name: row.title },
    ],
  };

  return `<script type="application/ld+json">${JSON.stringify(product)}</script>` +
         `<script type="application/ld+json">${JSON.stringify(breadcrumb)}</script>`;
}
