/**
 * Client-side geo detection. Combines:
 *   1. Cloudflare /api/geo (IP-based)
 *   2. Intl.DateTimeFormat timezone
 *   3. navigator.language
 *   4. Fallback 'JO'
 *
 * Returns the best-guess MarketCode, the detection source, and explicit
 * unsupported flag so callers can distinguish:
 *   - "user is outside the 5 supported countries"  → isUnsupported = true
 *   - "we could not detect anything"               → source = 'fallback'
 */

export type MarketCode = 'JO' | 'SA' | 'LB' | 'PS' | 'SY';
export type GeoSource =
  | 'storage'
  | 'ip'
  | 'timezone'
  | 'language'
  | 'fallback'
  | 'unsupported';

export interface GeoResult {
  readonly country: MarketCode;
  readonly source: GeoSource;
  /** True iff `country` came from a real supported detection. */
  readonly isSupported: boolean;
  /** True iff IP detection returned a country outside SUPPORTED (e.g., 'US'). */
  readonly isUnsupported: boolean;
  /** Raw ISO country when isUnsupported (e.g., 'US'), for logging/debugging. */
  readonly detectedIso?: string;
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

type IpResult =
  | { status: 'supported'; country: MarketCode }
  | { status: 'unsupported'; iso: string }
  | { status: 'error' };

async function fromIp(): Promise<IpResult> {
  try {
    const res = await fetch('/api/geo', { cache: 'force-cache' });
    if (!res.ok) return { status: 'error' };
    const data = await res.json();
    if (!data || typeof data.country !== 'string') return { status: 'error' };
    const iso = String(data.country).toUpperCase();
    if (SUPPORTED.includes(iso as MarketCode)) {
      return { status: 'supported', country: iso as MarketCode };
    }
    return { status: 'unsupported', iso };
  } catch {
    // offline / no function / CORS — treat as error
    return { status: 'error' };
  }
}

/**
 * Detect country. Safe to call multiple times; returns promise.
 * Never throws.
 */
export async function detectCountry(): Promise<GeoResult> {
  const ip = await fromIp();

  if (ip.status === 'supported') {
    return {
      country: ip.country,
      source: 'ip',
      isSupported: true,
      isUnsupported: false,
    };
  }

  if (ip.status === 'unsupported') {
    // User is outside the 5 supported markets. Placeholder country = JO,
    // but flagged explicitly so callers do not treat this as a real JO user.
    return {
      country: 'JO',
      source: 'unsupported',
      isSupported: false,
      isUnsupported: true,
      detectedIso: ip.iso,
    };
  }

  // ip.status === 'error' — try timezone, then language, then fallback.
  const tz = fromTimezone();
  if (tz) {
    return {
      country: tz,
      source: 'timezone',
      isSupported: true,
      isUnsupported: false,
    };
  }

  const lang = fromLanguage();
  if (lang) {
    return {
      country: lang,
      source: 'language',
      isSupported: true,
      isUnsupported: false,
    };
  }

  return {
    country: 'JO',
    source: 'fallback',
    isSupported: false,
    isUnsupported: false,
  };
}
