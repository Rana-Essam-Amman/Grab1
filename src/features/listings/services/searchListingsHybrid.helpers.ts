import { supabase } from '@/shared/lib/supabase';
import { logWarning } from '@/shared/lib/errorLogger';
import { getListingFields } from '@/data/listingFields';

const HYBRID_TIMEOUT_MS = 4000;

/**
 * Fetch a 384-dim query embedding via the embed-query edge function.
 * Returns null on any error (network, timeout, bad shape) so the caller
 * can degrade to FTS-only. Never throws.
 */
export async function fetchQueryVector(query: string): Promise<number[] | null> {
  const supaUrl = import.meta.env.VITE_SUPABASE_URL as string;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
  if (!supaUrl || !anonKey) return null;

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), HYBRID_TIMEOUT_MS);
    const res = await fetch(`${supaUrl}/functions/v1/embed-query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${anonKey}`,
        'apikey': anonKey,
      },
      body: JSON.stringify({ query }),
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!res.ok) {
      void logWarning({ message: `embed-query HTTP ${res.status}` });
      return null;
    }
    const payload = (await res.json()) as { embedding?: unknown };
    const embedding = payload.embedding;
    if (!Array.isArray(embedding) || embedding.length !== 384) {
      void logWarning({ message: 'embed-query returned invalid embedding shape' });
      return null;
    }
    return embedding as number[];
  } catch {
    void logWarning({ message: 'embed-query network failure or timeout' });
    return null;
  }
}

/**
 * Map a raw query to its implied category slug via detect_query_category.
 * Returns null when no category match exists or the RPC errors.
 */
export async function detectCategory(query: string): Promise<string | null> {
  try {
    const { data, error } = await supabase.rpc('detect_query_category', {
      p_query: query,
    });
    if (error) return null;
    return typeof data === 'string' && data.length > 0 ? data : null;
  } catch {
    return null;
  }
}

/**
 * Convert a UI attribute map into the JSONB array shape the DB expects.
 * Sends the canonical slug as `value`, AND all forms (slug, labelAr, labelEn)
 * as `aliases`. The RPC matches ANY alias against the stored value, so
 * filtering works regardless of how the data was saved (Arabic, English, slug).
 *
 * This is the SINGLE SOURCE OF TRUTH for sending attributes to the DB.
 * No value translation happens here — the server compares against aliases.
 */
export function attrsToJsonbArray(
  attrs: Record<string, string> | undefined,
  categorySlug?: string | null,
  subcategorySlug?: string | null,
): Array<{ key: string; value: string; aliases?: string[] }> | null {
  if (!attrs) return null;
  const entries = Object.entries(attrs).filter(([k, v]) => k && v);
  if (entries.length === 0) return null;

  const fields = categorySlug ? getListingFields(categorySlug, subcategorySlug ?? undefined) : [];

  return entries.map(([key, value]) => {
    const field = fields.find((f) => f.key === key);
    if (field?.options) {
      const option = field.options.find(
        (o) => o.value === value || o.labelAr === value || o.labelEn === value,
      );
      if (option) {
        const aliases = Array.from(
          new Set([option.value, option.labelAr, option.labelEn].filter(Boolean))
        );
        return { key, value: option.value, aliases };
      }
    }
    return { key, value };
  });
}

// Frontend rate limit: max 30 searches per rolling 60-second window.
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 30;
const searchTimestamps: number[] = [];

export function checkRateLimit(): boolean {
  const now = Date.now();
  const cutoff = now - RATE_LIMIT_WINDOW_MS;
  while (searchTimestamps.length > 0 && searchTimestamps[0] < cutoff) {
    searchTimestamps.shift();
  }
  if (searchTimestamps.length >= RATE_LIMIT_MAX) return false;
  searchTimestamps.push(now);
  return true;
}
