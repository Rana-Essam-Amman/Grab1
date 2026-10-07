import { fetchListingById, type Env } from './_shared/supabaseRest';
import { escapeHtml, buildTitle, buildDescription, buildJsonLd } from './_shared/listingMeta';

const MARKETS = ['jo', 'sa', 'lb', 'ps', 'sy'];

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
  const response = await context.next();
  const url = new URL(context.request.url);

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
            `<script type="application/ld+json">${buildJsonLd(listing, url.origin)}</script>`,
            { html: true }
          );
        },
      })
      .transform(response);
  } catch {
    return response;
  }
};
