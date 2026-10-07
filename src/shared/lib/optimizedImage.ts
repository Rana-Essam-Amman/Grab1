/**
 * Converts a Supabase Storage public URL into an optimized render URL.
 * Adds width/quality/format params so Supabase serves WebP.
 * Falls back to the original URL for any non-Supabase URL.
 *
 * Docs: https://supabase.com/docs/guides/storage/serving/image-transformations
 */
export interface OptimizedImageOptions {
  readonly width?: number;
  readonly quality?: number;
  readonly format?: 'webp' | 'avif' | 'origin';
}

const SUPABASE_OBJECT_RE =
  /\/storage\/v1\/object\/public\/([^/]+)\/(.+)$/;

export function toOptimizedImageUrl(
  url: string,
  opts: OptimizedImageOptions = {}
): string {
  if (!url) return url;

  const match = url.match(SUPABASE_OBJECT_RE);
  if (!match) return url;

  const [, bucket, path] = match;
  const originMatch = url.match(/^(https?:\/\/[^/]+)/);
  if (!originMatch) return url;

  const width = opts.width ?? 800;
  const quality = opts.quality ?? 75;
  const format = opts.format ?? 'webp';

  return `${originMatch[1]}/storage/v1/render/image/public/${bucket}/${path}?width=${width}&quality=${quality}&format=${format}`;
}
