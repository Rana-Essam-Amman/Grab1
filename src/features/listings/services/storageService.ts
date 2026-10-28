import { supabase } from '@/shared/lib/supabase';

export const BUCKET = 'listing-images';

async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  const response = await fetch(dataUrl);
  return response.blob();
}

export async function readImageDimensions(src: string): Promise<{ width: number; height: number }> {
  const response = await fetch(src);
  const blob = await response.blob();
  const bitmap = await createImageBitmap(blob);
  const dims = { width: bitmap.width, height: bitmap.height };
  bitmap.close();
  return dims;
}

const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 800;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface UploadedOne {
  readonly url: string;
  readonly width: number;
  readonly height: number;
}

async function uploadOne(dataUrl: string, userId: string): Promise<UploadedOne> {
  const dims = await readImageDimensions(dataUrl);
  const blob = await dataUrlToBlob(dataUrl);
  const ext = (blob.type.split('/')[1] || 'jpg').split(';')[0];
  const path = `${userId}/${crypto.randomUUID()}.${ext}`;

  let lastError: Error | null = null;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const { error } = await supabase.storage.from(BUCKET).upload(path, blob, {
      contentType: blob.type,
      upsert: false,
      cacheControl: '31536000',
    });
    if (!error) {
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
      return { url: data.publicUrl, width: dims.width, height: dims.height };
    }
    lastError = new Error(error.message);
    const status = (error as { statusCode?: number | string }).statusCode;
    const statusStr = typeof status === 'string' ? status : String(status ?? '');
    if (/^4\d\d$/.test(statusStr)) break;
    if (attempt < MAX_RETRIES) await sleep(RETRY_DELAY_MS * (attempt + 1));
  }
  throw lastError ?? new Error('upload failed');
}

export interface UploadBatchResult {
  readonly urls: string[];
  readonly dims: ReadonlyArray<{ readonly width: number; readonly height: number } | null>;
  readonly failedCount: number;
  readonly lastError?: string; // أضفنا ده عشان نرجع نص الخطأ
}

export async function uploadListingImages(
  sources: readonly string[],
  userId: string
): Promise<UploadBatchResult> {
  const urls: string[] = [];
  const dims: Array<{ width: number; height: number } | null> = [];
  let failedCount = 0;
  let lastError: string | undefined = undefined; // متغير لتخزين الخطأ

  for (const src of sources) {
    if (!src.startsWith('data:') && !src.startsWith('blob:')) {
      urls.push(src);
      try {
        const d = await readImageDimensions(src);
        dims.push(d);
      } catch (err) {
         
        console.warn('[uploadListingImages] dims read failed for URL', src, err);
        dims.push(null);
      }
      continue;
    }
    try {
      const result = await uploadOne(src, userId);
      urls.push(result.url);
      dims.push({ width: result.width, height: result.height });
    } catch (err) {
      failedCount += 1;
      lastError = err instanceof Error ? err.message : String(err); // سجلنا الخطأ هنا
    }
  }
  return { urls, dims, failedCount, lastError };
}

export function extractStoragePath(url: string): string | null {
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return url.slice(idx + marker.length);
}

export interface RemoveImagesResult {
  readonly deleted: number;
  readonly failed: number;
  readonly error: string | null;
}

export async function removeListingImages(urls: readonly string[]): Promise<RemoveImagesResult> {
  const paths: string[] = [];
  for (const url of urls) {
    const path = extractStoragePath(url);
    if (path) paths.push(path);
  }
  if (paths.length === 0) return { deleted: 0, failed: 0, error: null };
  try {
    const { data, error } = await supabase.storage.from(BUCKET).remove(paths);
    if (error) {
       
      console.warn('[removeListingImages]', error.message);
      return { deleted: 0, failed: paths.length, error: error.message };
    }
    const deleted = Array.isArray(data) ? data.length : paths.length;
    return { deleted, failed: paths.length - deleted, error: null };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
     
    console.warn('[removeListingImages] threw', err);
    return { deleted: 0, failed: paths.length, error: msg };
  }
}
