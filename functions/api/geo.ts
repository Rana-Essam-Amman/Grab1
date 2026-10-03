/**
 * Cloudflare Pages Function — /api/geo
 *
 * Reads CF-IPCountry from Cloudflare headers and returns it as JSON.
 * No external API calls. No cost. Works on the free tier.
 *
 * Response:
 *   { country: 'JO' | 'SA' | 'LB' | 'PS' | 'SY' | null, source: 'ip' }
 *
 * Supported countries fallback to null → client uses timezone/language.
 */

type Env = Record<string, never>;

type PagesFunction<E = unknown> = (context: {
  request: Request;
  env: E;
}) => Response | Promise<Response>;

const SUPPORTED = ['JO', 'SA', 'LB', 'PS', 'SY'] as const;

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const request = context.request as Request & {
    cf?: { country?: string };
  };
  const headerCountry = request.headers.get('CF-IPCountry');
  const cfCountry = request.cf?.country;
  const raw = (cfCountry || headerCountry || '').toUpperCase();
  const country = SUPPORTED.includes(raw as typeof SUPPORTED[number]) ? raw : null;

  return new Response(
    JSON.stringify({ country, source: 'ip' }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300',
        'Access-Control-Allow-Origin': '*',
      },
    }
  );
};
