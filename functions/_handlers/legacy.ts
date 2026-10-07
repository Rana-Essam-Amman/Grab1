import type { Env } from '../_shared/supabaseRest';
import { fetchListingById } from '../_shared/supabaseRest';
import { buildListingPathFromRow } from '../_shared/listingJsonLd';

const LEGACY_LISTING_RE =
  /^\/listing\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i;

export async function handleLegacyRedirect(
  url: URL,
  env: Env
): Promise<Response | null> {
  const legacy = url.pathname.match(LEGACY_LISTING_RE);
  if (!legacy) return null;

  const row = await fetchListingById(legacy[1], env);
  if (!row) return null;

  const target = `${url.origin}${buildListingPathFromRow(row)}`;
  return Response.redirect(target, 301);
}
