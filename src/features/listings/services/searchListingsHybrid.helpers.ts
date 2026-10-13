import { supabase } from '@/shared/lib/supabase';
import { logWarning } from '@/shared/lib/errorLogger';

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
 * Convert a UI attribute map into the JSONB array shape the DB expects:
 * [{ key: string, value: string }]. Returns null when no usable attrs.
 */
export function attrsToJsonbArray(
  attrs: Record<string, string> | undefined,
): Array<{ key: string; value: string }> | null {
  if (!attrs) return null;
  const entries = Object.entries(attrs).filter(([k, v]) => k && v);
  if (entries.length === 0) return null;
  return entries.map(([key, value]) => ({ key, value }));
    }
