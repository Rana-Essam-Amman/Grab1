import type { MarketCode, ProviderGeocodeResult } from './geo.types';
import { MARKET_EXACT_IDENTIFIERS, normalizeCountryString } from './countryIdentifiers';

export interface ProviderValidationResult {
  readonly matches: boolean;
  readonly isVerified: boolean;
  readonly hasMetadata: boolean;
  readonly detectedCountry?: string;
  readonly detectedIso?: string;
}

export function isProviderCountryMatching(
  targetMarket: MarketCode,
  providerResult?: ProviderGeocodeResult
): ProviderValidationResult {
  if (!providerResult?.address) {
    return { matches: false, isVerified: false, hasMetadata: false };
  }

  const rawCode = providerResult.address.country_code;
  const rawCountry = providerResult.address.country;

  const isoCode = rawCode ? String(rawCode).trim().toLowerCase() : undefined;
  const countryName = rawCountry ? normalizeCountryString(String(rawCountry)) : undefined;

  if (!isoCode && !countryName) {
    return { matches: false, isVerified: false, hasMetadata: false };
  }

  const exactSet = MARKET_EXACT_IDENTIFIERS[targetMarket];

  let isoMatches = false;
  if (isoCode) {
    isoMatches = exactSet.has(isoCode);
  }

  let nameMatches = false;
  if (countryName) {
    nameMatches = exactSet.has(countryName);
  }

  if (isoCode && countryName) {
    const valid = isoMatches && nameMatches;
    return {
      matches: valid,
      isVerified: valid,
      hasMetadata: true,
      detectedCountry: countryName,
      detectedIso: isoCode,
    };
  }

  const valid = isoMatches || nameMatches;
  return {
    matches: valid,
    isVerified: valid,
    hasMetadata: true,
    detectedCountry: countryName,
    detectedIso: isoCode,
  };
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
