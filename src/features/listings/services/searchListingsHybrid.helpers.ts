import { supabase } from '@/shared/lib/supabase';
import { logWarning } from '@/shared/lib/errorLogger';
import { getListingFields } from '@/data/listingFields';
import { getModelBySlug } from '@/data/brands/carModels';

const HYBRID_TIMEOUT_MS = 4000;

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
 * Builds p_attrs payload with aliases for select/cascading fields.
 * - select: aliases from options (value, labelAr, labelEn)
 * - cascading-model: aliases from CAR_MODELS via getModelBySlug (slug, nameAr, nameEn)
 * - cascading-trim: case-insensitive variant (LE ↔ le)
 * Guarantees DB matching regardless of the stored representation.
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
  const makeSlug = attrs.make ?? attrs.brand ?? '';

  return entries.map(([key, value]) => {
    const field = fields.find((f) => f.key === key);

    // Standard select fields: aliases from options
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

    // Cascading-model: resolve aliases from CAR_MODELS
    if (field?.type === 'cascading-model' && makeSlug) {
      const model = getModelBySlug(makeSlug, value);
      if (model) {
        const aliases = Array.from(
          new Set([model.slug, model.nameAr, model.nameEn].filter(Boolean))
        );
        return { key, value: model.slug, aliases };
      }
    }

    // Cascading-trim: case-insensitive variant (LE ↔ le)
    if (field?.type === 'cascading-trim') {
      const aliases = Array.from(new Set([value, value.toLowerCase()]));
      return { key, value, aliases };
    }

    return { key, value };
  });
}

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
