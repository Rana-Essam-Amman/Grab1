/**
 * Image URL helper for card thumbnails.
 *
 * IMPORTANT: The Supabase transform endpoint (/render/image/public/...)
 * strips EXIF orientation metadata, which causes portrait photos taken on
 * phones (stored as landscape pixels + EXIF rotate flag) to render rotated
 * or cropped.
 *
 * Therefore: for card thumbnails we use the ORIGINAL URL — EXIF is
 * preserved, browser auto-rotates correctly. WebP optimization is skipped
 * for cards (acceptable — thumbnails are 136px, the win is negligible).
 *
 * Source: https://stackoverflow.com/questions/77402332/nuxt3-nuxtimg-image-rotate-90-when-i-use-nuxtimg
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

  // Supabase Storage: RETURN ORIGINAL URL — do NOT use transform.
  // Transform strips EXIF → portrait photos appear rotated/cropped.
  if (SUPABASE_OBJECT_RE.test(url)) {
    return url;
  }

  return url;
}
