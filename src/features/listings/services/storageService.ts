import { supabase } from '@/shared/lib/supabase';

export const BUCKET = 'listing-images';

async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  const response = await fetch(dataUrl);
  return response.blob();
}

const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 800;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function uploadOne(dataUrl: string, userId: string): Promise<string> {
  const blob = await dataUrlToBlob(dataUrl);
  const ext = (blob.type.split('/')[1] || 'jpg').split(';')[0];
  const path = `${userId}/${crypto.randomUUID()}.${ext}`;

  let lastError: Error | null = null;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const { error } = await supabase.storage.from(BUCKET).upload(path, blob, {
      contentType: blob.type,
      upsert: false,
    });
    if (!error) {
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
      return data.publicUrl;
    }
    lastError = new Error(error.message);
    // Retry only on transient errors; abort immediately on 4xx auth/content.
    const status = (error as { statusCode?: number | string }).statusCode;
    const statusStr = typeof status === 'string' ? status : String(status ?? '');
    if (/^4\d\d$/.test(statusStr)) break;
    if (attempt < MAX_RETRIES) await sleep(RETRY_DELAY_MS * (attempt + 1));
  }
  throw lastError ?? new Error('upload failed');
}

export interface UploadBatchResult {
  readonly urls: string[];
  readonly failedCount: number;
}

export async function uploadListingImages(
  sources: readonly string[],
  userId: string
): Promise<UploadBatchResult> {
  const urls: string[] = [];
  let failedCount = 0;
  for (const src of sources) {
    // Static assets (/assets/...) already have permanent URLs — keep as-is.
    if (!src.startsWith('data:') && !src.startsWith('blob:')) {
      urls.push(src);
      continue;
    }
    try {
      urls.push(await uploadOne(src, userId));
    } catch {
      failedCount += 1;
    }
  }
  return { urls, failedCount };
}

/**
 * Extract storage path from a public URL.
 * Returns null if URL is not from our bucket (e.g. static asset).
 */
export function extractStoragePath(url: string): string | null {
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return url.slice(idx + marker.length);
}

/**
 * Remove listing images from storage. Best-effort — never throws.
 * Returns count of paths attempted.
 */
export async function removeListingImages(urls: readonly string[]): Promise<number> {
  const paths: string[] = [];
  for (const url of urls) {
    const path = extractStoragePath(url);
    if (path) paths.push(path);
  }
  if (paths.length === 0) return 0;
  try {
    const { error } = await supabase.storage.from(BUCKET).remove(paths);
    if (error) {
      // eslint-disable-next-line no-console
      console.warn('[removeListingImages]', error.message);
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('[removeListingImages] threw', err);
  }
  return paths.length;
}
