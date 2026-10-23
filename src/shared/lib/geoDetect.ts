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
export type GeoSource = 'storage' | 'ip' | 'timezone' | 'language' | 'fallback' | 'unsupported';

export interface GeoResult {
  readonly country: MarketCode;
  readonly source: GeoSource;
  readonly isSupported: boolean;
  readonly isUnsupported: boolean;
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
  JO: 'JO', SA: 'SA', LB: 'LB', PS: 'PS', SY: 'SY',
};

function fromTimezone(): MarketCode | null {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz && TIMEZONE_MAP[tz]) return TIMEZONE_MAP[tz];
  } catch { /* ignore */ }
  return null;
}

function fromLanguage(): MarketCode | null {
  try {
    const langs = [...(navigator.languages || []), navigator.language || ''];
    for (const l of langs) {
      const m = /^[a-z]{2}-([A-Z]{2})/.exec(l);
      if (m && SUPPORTED.includes(m[1] as MarketCode)) return LANG_MAP[m[1]] || null;
    }
  } catch { /* ignore */ }
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
    return SUPPORTED.includes(iso as MarketCode)
      ? { status: 'supported', country: iso as MarketCode }
      : { status: 'unsupported', iso };
  } catch {
    return { status: 'error' };
  }
}

export async function detectCountry(): Promise<GeoResult> {
  const ip = await fromIp();
  if (ip.status === 'supported') {
    return { country: ip.country, source: 'ip', isSupported: true, isUnsupported: false };
  }
  if (ip.status === 'unsupported') {
    return {
      country: 'JO',
      source: 'unsupported',
      isSupported: false,
      isUnsupported: true,
      detectedIso: ip.iso,
    };
  }
  const tz = fromTimezone();
  if (tz) return { country: tz, source: 'timezone', isSupported: true, isUnsupported: false };
  const lang = fromLanguage();
  if (lang) return { country: lang, source: 'language', isSupported: true, isUnsupported: false };
  return { country: 'JO', source: 'fallback', isSupported: false, isUnsupported: false };
}
