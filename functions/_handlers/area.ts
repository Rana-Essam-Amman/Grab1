import type { Env } from '../_shared/supabaseRest';
import { fetchListingsByMarketArea } from '../_shared/supabaseListings';
import { buildListingLoc } from '../_shared/sitemapHelpers';
import { escapeHtml } from '../_shared/listingMeta';
import { MARKET_AR } from '../_shared/categoryMeta';
import { findDistrict } from '../_shared/geoLookup';

const MARKETS = ['jo', 'sa', 'lb', 'ps', 'sy', 'kw'];

interface AreaInfo {
  readonly nameAr: string;
  readonly nameEn: string;
}

function findArea(market: string, areaSlug: string): AreaInfo | null {
  const d = findDistrict(market, areaSlug);
  if (!d) return null;
  return { nameAr: d.nameAr, nameEn: d.nameEn };
}

export function parseAreaUrl(pathname: string): { market: string; areaSlug: string } | null {
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length !== 3) return null;
  if (parts[1].toLowerCase() !== 'areas') return null;
  const market = parts[0].toLowerCase();
  if (!MARKETS.includes(market)) return null;
  return { market, areaSlug: parts[2].toLowerCase() };
}

function buildAreaBodyHtml(
  origin: string,
  market: string,
  areaSlug: string,
  areaNameAr: string,
  rows: readonly { id: string; title: string; price: string; currency: string; city: string; category_slug: string }[]
): string {
  const top = rows.slice(0, 20);
  const items = top.map((r) => {
    const loc = buildListingLoc(origin, market.toUpperCase(), r.category_slug, r.title, r.id);
    return `<li><a href="${escapeHtml(loc)}">${escapeHtml(r.title)}</a> — ${escapeHtml(r.price)} ${escapeHtml(r.currency)}</li>`;
  }).join('');
  return `<main><h1>${escapeHtml(areaNameAr)} — إعلانات للبيع</h1><ul>${items}</ul></main>`;
}

export async function handleArea(
  url: URL,
  env: Env,
  next: () => Promise<Response>
): Promise<Response | null> {
  const parsed = parseAreaUrl(url.pathname);
  if (!parsed) return null;

  const area = findArea(parsed.market, parsed.areaSlug);
  if (!area) return null;

  const rows = await fetchListingsByMarketArea(parsed.market, parsed.areaSlug, env, 50);
  const marketNameAr = MARKET_AR[parsed.market.toUpperCase()] ?? parsed.market.toUpperCase();
  const title = `${area.nameAr} — إعلانات للبيع في ${marketNameAr} | FOX Marketplace`;
  const description = `تصفح أحدث الإعلانات في ${area.nameAr}, ${marketNameAr}. إعلانات محدّثة يومياً — تواصل مباشر مع البائعين على FOX Marketplace.`;
  const canonical = `${url.origin}/${parsed.market}/areas/${parsed.areaSlug}`;

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'FOX Marketplace', item: url.origin },
      { '@type': 'ListItem', position: 2, name: marketNameAr, item: `${url.origin}/${parsed.market}/` },
      { '@type': 'ListItem', position: 3, name: area.nameAr, item: canonical },
    ],
  };

  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: title,
    description,
    url: canonical,
    inLanguage: 'ar',
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: rows.length,
      itemListElement: rows.slice(0, 50).map((row, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: buildListingLoc(url.origin, parsed.market.toUpperCase(), row.category_slug, row.title, row.id),
        name: row.title,
      })),
    },
  };

  const response = await next();
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('text/html')) return response;

  try {
    const bodyHtml = buildAreaBodyHtml(url.origin, parsed.market, parsed.areaSlug, area.nameAr, rows);
    return new HTMLRewriter()
      .on('title', { element(el) { el.setInnerContent(title); } })
      .on('head', {
        element(el) {
          el.append(
            `<meta name="description" content="${description}">` +
            `<meta property="og:title" content="${title}">` +
            `<meta property="og:description" content="${description}">` +
            `<meta property="og:type" content="website">` +
            `<meta property="og:url" content="${canonical}">` +
            `<link rel="canonical" href="${canonical}">` +
            `<script type="application/ld+json">${JSON.stringify(itemList)}</script>` +
            `<script type="application/ld+json">${JSON.stringify(breadcrumb)}</script>`,
            { html: true }
          );
        },
      })
      .on('div#root', {
        element(el) {
          el.setInnerContent(bodyHtml, { html: true });
        },
      })
      .transform(response);
  } catch {
    return response;
  }
}
