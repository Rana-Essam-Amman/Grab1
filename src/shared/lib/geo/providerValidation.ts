import type { MarketCode, ProviderGeocodeResult } from './geo.types';

const MARKET_COUNTRY_NAMES: Record<MarketCode, readonly string[]> = {
  JO: ['jo', 'jordan', 'الأردن', 'الاردن'],
  SA: ['sa', 'sau', 'saudi arabia', 'saudi', 'السعودية', 'السعوديه', 'المملكة العربية السعودية'],
  PS: ['ps', 'pse', 'palestine', 'state of palestine', 'فلسطين', 'الضفة الغربية', 'قطاع غزة'],
  LB: ['lb', 'lbn', 'lebanon', 'لبنان', 'الجمهورية اللبنانية'],
  SY: ['sy', 'syr', 'syria', 'syrian arab republic', 'سوريا', 'سورية'],
  KW: ['kw', 'kwt', 'kuwait', 'الكويت', 'دولة الكويت'],
};

export function isProviderCountryMatching(
  targetMarket: MarketCode,
  providerResult?: ProviderGeocodeResult
): { matches: boolean; hasMetadata: boolean } {
  if (!providerResult?.address) return { matches: true, hasMetadata: false };

  const rawCode = providerResult.address.country_code;
  const rawCountry = providerResult.address.country;

  if (!rawCode && !rawCountry) return { matches: true, hasMetadata: false };

  const allowed = MARKET_COUNTRY_NAMES[targetMarket] || [];
  const normalizedCode = String(rawCode || '').trim().toLowerCase();
  const normalizedCountry = String(rawCountry || '').trim().toLowerCase();

  const codeMatches = !normalizedCode || allowed.includes(normalizedCode);
  const countryMatches =
    !normalizedCountry ||
    allowed.some((a) => normalizedCountry.includes(a) || a.includes(normalizedCountry));

  const matches = Boolean(codeMatches && countryMatches);
  return { matches, hasMetadata: true };
}

export function extractTokensFromProvider(providerResult: ProviderGeocodeResult): string[] {
  const tokens: string[] = [];
  const addr = providerResult.address;
  if (addr) {
    if (addr.village) tokens.push(String(addr.village));
    if (addr.hamlet) tokens.push(String(addr.hamlet));
    if (addr.neighbourhood) tokens.push(String(addr.neighbourhood));
    if (addr.suburb) tokens.push(String(addr.suburb));
    if (addr.quarter) tokens.push(String(addr.quarter));
    if (addr.district) tokens.push(String(addr.district));
    if (addr.town) tokens.push(String(addr.town));
    if (addr.city) tokens.push(String(addr.city));
    if (addr.county) tokens.push(String(addr.county));
    if (addr.state) tokens.push(String(addr.state));
    if (addr.province) tokens.push(String(addr.province));
    if (addr.formatted_address) {
      tokens.push(String(addr.formatted_address));
      tokens.push(...String(addr.formatted_address).split(/[,،]+/));
    }
  }
  if (providerResult.rawQuery) {
    tokens.push(providerResult.rawQuery);
    tokens.push(...providerResult.rawQuery.split(/[,،\s]+/));
  }
  return tokens.map((t) => t.trim()).filter(Boolean);
}
