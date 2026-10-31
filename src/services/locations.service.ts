import { supabase } from '@/shared/lib/supabase';

export interface RecordNeighborhoodParams {
  countryCode: string;
  cityName: string;
  neighborhoodName: string;
}

/**
 * Fire-and-forget crowdsourcing: track neighborhood selections from Live Search.
 * Never throws, never blocks the user. Failures are logged but ignored.
 *
 * Purpose: after ~100 uses of the same neighborhood, it can be promoted to static
 * .geo.ts files, building our dataset organically.
 */
export async function recordNeighborhoodUsage(
  params: RecordNeighborhoodParams
): Promise<void> {
  const { countryCode, cityName, neighborhoodName } = params;

  if (!countryCode || !cityName || !neighborhoodName) return;

  try {
    const { error } = await supabase.rpc('record_neighborhood_usage', {
      p_country_code: countryCode,
      p_city_name: cityName,
      p_neighborhood_name: neighborhoodName,
    });
    if (error) {
      // Silent — the migration might not be applied yet, or network may be down
      console.warn('[crowdsource] neighborhood RPC returned error:', error.message);
    }
  } catch (err) {
    // Completely silent — telemetry must never break UX
    console.warn('[crowdsource] neighborhood tracking failed:', err);
  }
}
