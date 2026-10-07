import type { Env } from './_shared/supabaseRest';
import { handleSitemap } from './_handlers/sitemap';
import { handleCategory } from './_handlers/category';
import { handleListing } from './_handlers/listing';
import { handleLegacyRedirect } from './_handlers/legacy';

export const onRequest: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url);
  const next = () => context.next();

  // Sitemap routes — highest priority, no HTML needed.
  const sitemap = await handleSitemap(url, context.env);
  if (sitemap) return sitemap;

  // Category pages: /{market}/{category}
  const category = await handleCategory(url, context.env, next);
  if (category) return category;

  // 301: legacy /listing/{uuid} → SEO URL
  const legacy = await handleLegacyRedirect(url, context.env);
  if (legacy) return legacy;

  // Listing pages: /{market}/{category}/{slug}-{id}
  const listing = await handleListing(url, context.env, next);
  if (listing) return listing;

  // Everything else → SPA
  return next();
};
