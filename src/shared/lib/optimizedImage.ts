/**
 * Image URL helper for card thumbnails.
 *
 * Supabase Storage URLs are proxied through wsrv.nl for WebP conversion,
 * resizing, and EXIF autorotation.
 *
 * wsrv.nl uses libvips autorot() to physically rotate pixels before stripping
 * metadata, so portrait photos taken on phones render correctly (unlike
 * Supabase's native /render/image/ transform which strips EXIF and can
 * cause rotated or cropped images).
 *
 * Local assets still prefer a .webp sibling when available.
 * External URLs are returned unchanged.
 */
export interface OptimizedImageOptions {
  readonly width?: number;
  readonly quality?: number;
  readonly format?: 'webp' | 'avif' | 'origin';
}

const SUPABASE_OBJECT_RE = /\/storage\/v1\/object\/public\/([^/]+)\/(.+)$/;

export function toOptimizedImageUrl(
  url: string,
  opts: OptimizedImageOptions = {}
): string {
  if (!url) return url;

  // Local assets: prefer WebP when we have one.
  if (url.startsWith('/assets/listings/') && /\.(jpe?g|png)$/i.test(url)) {
    return url.replace(/\.(jpe?g|png)$/i, '.webp');
  }

  // Supabase Storage: proxy through wsrv.nl for WebP + resize + EXIF autorotate.
  // wsrv.nl uses libvips autorot() to physically rotate pixels before stripping metadata,
  // so portrait photos render correctly (unlike Supabase's native transform).
  if (SUPABASE_OBJECT_RE.test(url)) {
    const width = opts.width ?? 600;
    const quality = opts.quality ?? 80;
    const encoded = encodeURIComponent(url);
    return `https://wsrv.nl/?url=${encoded}&w=${width}&output=webp&q=${quality}`;
  }

  return url;
}
