import { supabase } from '@/shared/lib/supabase';

const BUCKET = 'listing-images';

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
