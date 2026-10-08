import type { Env } from '../_shared/supabaseRest';
import { fetchListingById } from '../_shared/supabaseRest';
import {
  escapeHtml,
  buildTitle,
  buildDescription,
  buildListingBodyHtml,
  buildBootstrapScript,
} from '../_shared/listingMeta';
import { buildJsonLd } from '../_shared/listingJsonLd';

const MARKETS_LOWER = ['jo', 'sa', 'lb', 'ps', 'sy'];
const UUID_LENGTH = 36;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function parseSeoPath(pathname: string): string | null {
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length !== 3) return null;
  if (!MARKETS_LOWER.includes(parts[0].toLowerCase())) return null;
  const tail = parts[2];
  if (tail.length < UUID_LENGTH + 2) return null;
  const id = tail.slice(-UUID_LENGTH);
  if (!UUID_RE.test(id)) return null;
  return id;
}

export async function handleListing(
  url: URL,
  env: Env,
  next: () => Promise<Response>
): Promise<Response | null> {
  const id = parseSeoPath(url.pathname);
  if (!id) return null;

  const response = await next();
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('text/html')) return response;

  const listing = await fetchListingById(id, env);
  if (!listing) return response;

  const title = escapeHtml(buildTitle(listing));
  const description = escapeHtml(buildDescription(listing));
  const ogImage = listing.images && listing.images.length > 0 ? listing.images[0] : '';

  try {
    const bodyHtml = buildListingBodyHtml(listing);
    const bootstrap = buildBootstrapScript(listing);
    return new HTMLRewriter()
      .on('title', { element(el) { el.setInnerContent(buildTitle(listing)); } })
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
            buildJsonLd(listing, url.origin),
            { html: true }
          );
        },
      })
      .on('div#root', {
        element(el) {
          el.setInnerContent(bodyHtml + bootstrap, { html: true });
        },
      })
      .transform(response);
  } catch {
    return response;
  }
}
