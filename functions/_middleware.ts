import { fetchListingById, type Env } from './_shared/supabaseRest';
import { escapeHtml, buildTitle, buildDescription } from './_shared/listingMeta';
import { buildJsonLd } from './_shared/listingJsonLd';
import { fetchActiveListingsByMarket } from './_shared/supabaseListings';
import {
  buildListingLoc,
  buildUrlset,
  buildSitemapIndex,
  type SitemapUrl,
} from './_shared/sitemapHelpers';

const MARKETS = ['jo', 'sa', 'lb', 'ps', 'sy'];
const XML_HEADERS = {
  'content-type': 'application/xml; charset=utf-8',
  'cache-control': 'public, max-age=3600',
} as const;
const SITEMAP_MARKET_RE = /^\/sitemap-(jo|sa|lb|ps|sy)\.xml$/;

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
