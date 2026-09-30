import { supabase } from '@/shared/lib/supabase';

const BUCKET = 'listing-images';

async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  const response = await fetch(dataUrl);
  return response.blob();
}

async function uploadOne(dataUrl: string, userId: string): Promise<string> {
  const blob = await dataUrlToBlob(dataUrl);
  const ext = (blob.type.split('/')[1] || 'jpg').split(';')[0];
  const path = `${userId}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, blob, {
    contentType: blob.type,
    upsert: false,
  });
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
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
