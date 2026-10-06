/**
 * Client-side geo detection. Combines:
 *   1. Cloudflare /api/geo (IP-based)
 *   2. Intl.DateTimeFormat timezone
 *   3. navigator.language
 *   4. Fallback 'JO'
 *
 * Returns the best-guess MarketCode and the detection source.
 */

export type MarketCode = 'JO' | 'SA' | 'LB' | 'PS' | 'SY';
export type GeoSource = 'storage' | 'ip' | 'timezone' | 'language' | 'fallback';

export interface GeoResult {
  readonly country: MarketCode;
  readonly source: GeoSource;
  /** True when the detected country is one of the 5 supported markets. */
  readonly isSupported: boolean;
}

const SUPPORTED: readonly MarketCode[] = ['JO', 'SA', 'LB', 'PS', 'SY'];

const TIMEZONE_MAP: Record<string, MarketCode> = {
  'Asia/Amman': 'JO',
  'Asia/Riyadh': 'SA',
  'Asia/Beirut': 'LB',
  'Asia/Gaza': 'PS',
  'Asia/Hebron': 'PS',
  'Asia/Damascus': 'SY',
};

const LANG_MAP: Record<string, MarketCode> = {
  JO: 'JO',
  SA: 'SA',
  LB: 'LB',
  PS: 'PS',
  SY: 'SY',
};

function fromTimezone(): MarketCode | null {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz && TIMEZONE_MAP[tz]) return TIMEZONE_MAP[tz];
  } catch {
    // ignore
  }
  return null;
}

function fromLanguage(): MarketCode | null {
  try {
    const langs = [
      ...(navigator.languages || []),
      navigator.language || '',
    ];
    for (const l of langs) {
      const m = /^[a-z]{2}-([A-Z]{2})/.exec(l);
      if (m && SUPPORTED.includes(m[1] as MarketCode)) {
        return LANG_MAP[m[1]] || null;
      }
    }
  } catch {
    // ignore
  }
  return null;
}

async function fromIp(): Promise<MarketCode | null> {
  try {
    const res = await fetch('/api/geo', { cache: 'force-cache' });
    if (!res.ok) return null;
    const data = await res.json();
    if (data && SUPPORTED.includes(data.country)) {
      return data.country as MarketCode;
    }
  } catch {
    // offline / no function / CORS — ignore
  }
  return null;
}

/**
 * Detect country. Safe to call multiple times; returns promise.
 * Never throws.
 */
export async function detectCountry(): Promise<GeoResult> {
  const ip = await fromIp();
  if (ip) return { country: ip, source: 'ip', isSupported: true };

  const tz = fromTimezone();
  if (tz) return { country: tz, source: 'timezone', isSupported: true };

  const lang = fromLanguage();
  if (lang) return { country: lang, source: 'language', isSupported: true };

  return { country: 'JO', source: 'fallback', isSupported: false };
}
