import { useCallback, useState } from 'react';
import { supabase } from '@/shared/lib/supabase';

const BUCKET = 'avatars';
const MAX_SIZE = 2 * 1024 * 1024; // 2 MB (matches bucket limit)
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp'];

/**
 * Uploads an avatar (base64 data URL) to the avatars bucket and returns
 * its public URL. Enforces size + MIME guards client-side so failures
 * surface as a friendly error instead of a Storage 4xx.
 *
 * Scope: bucket-level RLS allows insert only to avatars/<uid>/*. The
 * path uses userId as the first folder.
 */
export function useAvatarUpload(userId: string | null): {
  upload: (dataUrl: string) => Promise<string | null>;
  uploading: boolean;
  error: string | null;
} {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(async (dataUrl: string): Promise<string | null> => {
    if (!userId) return null;
    setError(null);
    setUploading(true);
    try {
      const blob = await (await fetch(dataUrl)).blob();
      if (blob.size > MAX_SIZE) {
        setError('Image must be under 2 MB');
        return null;
      }
      const mime = blob.type.split(';')[0];
      if (!ALLOWED.includes(mime)) {
        setError('Only JPEG, PNG, or WebP allowed');
        return null;
      }
      const ext = mime.split('/')[1] || 'jpg';
      const path = `${userId}/${crypto.randomUUID()}.${ext}`;

      const { error: upErr } = await supabase.storage
        .from(BUCKET)
        .upload(path, blob, { contentType: mime, upsert: false, cacheControl: '31536000' });

      if (upErr) {
        setError(upErr.message);
        return null;
      }

      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
      return data.publicUrl;
    } catch {
      setError('Upload failed');
      return null;
    } finally {
      setUploading(false);
    }
  }, [userId]);

  return { upload, uploading, error };
}
