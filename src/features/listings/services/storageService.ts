import { supabase } from '@/shared/lib/supabase';

const BUCKET = 'listing-images';

export interface ImageUploadResult {
  readonly urls: string[];
  readonly failedCount: number;
  readonly lastError: string | null;
}

async function readImageDimensions(src: string): Promise<{ width: number; height: number } | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

export async function uploadListingImages(
  images: readonly string[],
  userId: string
): Promise<ImageUploadResult> {
  const urls: string[] = [];
  const dims: ({ width: number; height: number } | null)[] = [];
  let failedCount = 0;
  let lastError: string | null = null;

  for (const src of images) {
    try {
      const res = await fetch(src);
      const blob = await res.blob();
      const ext = blob.type.split('/')[1] || 'jpg';
      const filename = `${userId}/${crypto.randomUUID()}.${ext}`;

      const { data, error } = await supabase.storage.from(BUCKET).upload(filename, blob, {
        cacheControl: '31536000',
        upsert: false,
      });

      if (error) {
        failedCount++;
        lastError = error.message;
        continue;
      }

      const { data: publicUrlData } = supabase.storage.from(BUCKET).getPublicUrl(data.path);
      urls.push(publicUrlData.publicUrl);

      try {
        const d = await readImageDimensions(src);
        dims.push(d);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn('[uploadListingImages] dims read failed for URL', src, err);
        dims.push(null);
      }
    } catch (err) {
      failedCount++;
      lastError = err instanceof Error ? err.message : 'Unknown error';
    }
  }

  return { urls, failedCount, lastError };
}

export async function removeListingImages(urls: readonly string[]): Promise<{ deleted: number; failed: number; error: string | null }> {
  if (urls.length === 0) return { deleted: 0, failed: 0, error: null };

  const paths = urls.map((url) => {
    const parts = url.split('/');
    return parts.slice(parts.indexOf(BUCKET) + 1).join('/');
  });

  try {
    const { data, error } = await supabase.storage.from(BUCKET).remove(paths);
    if (error) {
      // eslint-disable-next-line no-console
      console.warn('[removeListingImages]', error.message);
      return { deleted: 0, failed: paths.length, error: error.message };
    }
    const deleted = Array.isArray(data) ? data.length : paths.length;
    return { deleted, failed: paths.length - deleted, error: null };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    // eslint-disable-next-line no-console
    console.warn('[removeListingImages] threw', err);
    return { deleted: 0, failed: paths.length, error: msg };
  }
}
