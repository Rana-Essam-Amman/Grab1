import type { Env } from '../_shared/supabaseRest';
import {
  fetchActiveListingsByMarket,
} from '../_shared/supabaseListings';
import {
  buildListingLoc,
  buildUrlset,
  buildSitemapIndex,
  type SitemapUrl,
} from '../_shared/sitemapHelpers';
import { CATEGORY_META } from '../_shared/categoryMeta';

const MARKETS = ['jo', 'sa', 'lb', 'ps', 'sy'] as const;
const SITEMAP_MARKET_RE = /^\/sitemap-(jo|sa|lb|ps|sy)\.xml$/;
const CATEGORY_SLUGS = Object.keys(CATEGORY_META);

const XML_HEADERS = {
  'content-type': 'application/xml; charset=utf-8',
  'cache-control': 'public, max-age=3600',
} as const;

export async function handleSitemap(
  url: URL,
  env: Env
): Promise<Response | null> {
  if (url.pathname === '/sitemap.xml') {
    return new Response(buildSitemapIndex(url.origin, MARKETS), {
      headers: XML_HEADERS,
    });
  }

  const sm = url.pathname.match(SITEMAP_MARKET_RE);
  if (!sm) return null;

  const market = sm[1];
  const now = new Date().toISOString().split('T')[0];
  const rows = await fetchActiveListingsByMarket(market, env);

  const categoryUrls: SitemapUrl[] = CATEGORY_SLUGS.map((slug) => ({
    loc: `${url.origin}/${market}/${slug}`,
    lastmod: now,
  }));

  const listingUrls: SitemapUrl[] = rows.map((row) => ({
    loc: buildListingLoc(url.origin, market, row.category_slug, row.title, row.id),
    lastmod: row.updated_at,
  }));

  return new Response(buildUrlset([...categoryUrls, ...listingUrls]), {
    headers: XML_HEADERS,
  });
}
