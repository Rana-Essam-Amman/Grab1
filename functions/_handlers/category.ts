import type { Env } from '../_shared/supabaseRest';
import { fetchListingsByMarketCategory } from '../_shared/supabaseListings';
import { buildListingLoc } from '../_shared/sitemapHelpers';
import {
  categoryTitle,
  categoryDescription,
  MARKET_EN,
  CATEGORY_META,
} from '../_shared/categoryMeta';

const MARKETS_UPPER = ['JO', 'SA', 'LB', 'PS', 'SY'];
const CATEGORY_SLUGS = Object.keys(CATEGORY_META);

export function parseCategoryUrl(
  pathname: string
): { market: string; category: string } | null {
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length !== 2) return null;
  const market = parts[0].toUpperCase();
  if (!MARKETS_UPPER.includes(market)) return null;
  const category = parts[1].toLowerCase();
  if (!CATEGORY_SLUGS.includes(category)) return null;
  return { market, category };
}

export async function handleCategory(
  url: URL,
  env: Env,
  next: () => Promise<Response>
): Promise<Response | null> {
  const cat = parseCategoryUrl(url.pathname);
  if (!cat) return null;

  const rows = await fetchListingsByMarketCategory(
    cat.market,
    cat.category,
    env,
    50
  );
  const title = categoryTitle(cat.market, cat.category);
  const description = categoryDescription(cat.market, cat.category);
  const canonical = `${url.origin}/${cat.market.toLowerCase()}/${cat.category}`;
  const marketEn = MARKET_EN[cat.market] ?? cat.market;
  const catMeta = CATEGORY_META[cat.category];

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'FOX Marketplace', item: url.origin },
      { '@type': 'ListItem', position: 2, name: marketEn, item: `${url.origin}/${cat.market.toLowerCase()}/` },
      { '@type': 'ListItem', position: 3, name: catMeta.nameEn, item: canonical },
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
        url: buildListingLoc(url.origin, cat.market, cat.category, row.title, row.id),
        name: row.title,
      })),
    },
  };

  const response = await next();
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('text/html')) return response;

  try {
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
      .transform(response);
  } catch {
    return response;
  }
}
