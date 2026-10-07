import { fetchListingById, type Env } from './_shared/supabaseRest';
import { escapeHtml, buildTitle, buildDescription } from './_shared/listingMeta';
import { buildJsonLd, buildListingPathFromRow } from './_shared/listingJsonLd';
import {
  fetchActiveListingsByMarket,
  fetchListingsByMarketCategory,
} from './_shared/supabaseListings';
import {
  buildListingLoc,
  buildUrlset,
  buildSitemapIndex,
  type SitemapUrl,
} from './_shared/sitemapHelpers';
import {
  categoryTitle,
  categoryDescription,
  MARKET_EN,
  CATEGORY_META,
} from './_shared/categoryMeta';

const MARKETS = ['jo', 'sa', 'lb', 'ps', 'sy'];
const CATEGORY_SLUGS = Object.keys(CATEGORY_META);
const XML_HEADERS = {
  'content-type': 'application/xml; charset=utf-8',
  'cache-control': 'public, max-age=3600',
} as const;
const SITEMAP_MARKET_RE = /^\/sitemap-(jo|sa|lb|ps|sy)\.xml$/;
const LEGACY_LISTING_RE = /^\/listing\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i;

function parseCategoryUrl(pathname: string): { market: string; category: string } | null {
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length !== 2) return null;
  const market = parts[0].toUpperCase();
  if (!['JO', 'SA', 'LB', 'PS', 'SY'].includes(market)) return null;
  const category = parts[1].toLowerCase();
  if (!CATEGORY_SLUGS.includes(category)) return null;
  return { market, category };
}

function parseSeoPath(pathname: string): string | null {

  const parts = pathname.split('/').filter(Boolean);
  if (parts.length !== 3) return null;
  if (!MARKETS.includes(parts[0].toLowerCase())) return null;
  const tail = parts[2];
  const UUID_LENGTH = 36;
  const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (tail.length < UUID_LENGTH + 2) return null;
  const id = tail.slice(-UUID_LENGTH);
  if (!UUID_RE.test(id)) return null;
  return id;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url);

  // Sitemap index
  if (url.pathname === '/sitemap.xml') {
    return new Response(buildSitemapIndex(url.origin, MARKETS), {
      headers: XML_HEADERS,
    });
  }

  // Per-market sitemap
  const sm = url.pathname.match(SITEMAP_MARKET_RE);
  if (sm) {
    const market = sm[1];
    const rows = await fetchActiveListingsByMarket(market, context.env);
    const urls: SitemapUrl[] = rows.map((row) => ({
      loc: buildListingLoc(url.origin, market, row.category_slug, row.title, row.id),
      lastmod: row.updated_at,
    }));
    return new Response(buildUrlset(urls), { headers: XML_HEADERS });
  }

  // Category page — 2 segments /{market}/{category}
  const cat = parseCategoryUrl(url.pathname);
  if (cat) {
    const rows = await fetchListingsByMarketCategory(cat.market, cat.category, context.env, 50);
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
          url: `${url.origin}/${cat.market.toLowerCase()}/${cat.category}/${row.id}`,
          name: row.title,
        })),
      },
    };

    const response = await context.next();
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

  // Legacy /listing/{uuid} → 301 to SEO URL
  const legacy = url.pathname.match(LEGACY_LISTING_RE);
  if (legacy) {
    const legacyId = legacy[1];
    const row = await fetchListingById(legacyId, context.env);
    if (row) {
      const target = `${url.origin}${buildListingPathFromRow(row)}`;
      return Response.redirect(target, 301);
    }
    // Not found → fall through to SPA (renders its own 404)
  }

  const response = await context.next();

  const id = parseSeoPath(url.pathname);
  if (!id) return response;

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('text/html')) return response;

  const listing = await fetchListingById(id, context.env);
  if (!listing) return response;

  const title = escapeHtml(buildTitle(listing));
  const description = escapeHtml(buildDescription(listing));
  const ogImage = listing.images && listing.images.length > 0 ? listing.images[0] : '';

  try {
    return new HTMLRewriter()
      .on('title', {
        element(el) {
          el.setInnerContent(buildTitle(listing));
        },
      })
      .on('head', {
        element(el) {
          el.append(
            `<meta name="description" content="${description}">` +
            `<meta property="og:title" content="${title}">` +
            `<meta property="og:description" content="${description}">` +
            `<meta property="og:type" content="product">` +
            `<meta property="og:url" content="${escapeHtml(url.toString())}">` +
            (ogImage ? `<meta property="og:image" content="${escapeHtml(ogImage)}">` : '') +
            `<meta name="twitter:card" content="summary_large_image">` +
            `<link rel="canonical" href="${escapeHtml(url.origin + url.pathname)}">` +
            `${buildJsonLd(listing, url.origin)}`,
            { html: true }
          );
        },
      })
      .transform(response);
  } catch {
    return response;
  }
};
