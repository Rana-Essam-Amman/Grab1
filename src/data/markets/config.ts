// RULE-14-EXCEPTION: Market taxonomy
import type { MarketConfig, MarketCode, MarketLocale, TextDirection } from './types';

/**
 * THE 5 MARKETS — single source of truth.
 * Markets are FULLY ISOLATED. No behavior may cross this boundary.
 */
export const MARKETS: Record<MarketCode, MarketConfig> = {
  JO: {
    code: 'JO',
    nameAr: 'الأردن',
    nameEn: 'Jordan',
    defaultLocale: 'ar',
    fallbackLocale: 'en',
    defaultCurrency: 'JOD',
    allowedCurrencies: ['JOD'],
    direction: 'rtl',
    dialect: 'levantine',
    prefersEnglishContent: false,
  },
  LB: {
    code: 'LB',
    nameAr: 'لبنان',
    nameEn: 'Lebanon',
    defaultLocale: 'ar',
    fallbackLocale: 'en',
    defaultCurrency: 'USD',
    allowedCurrencies: ['USD', 'LBP'],
    direction: 'rtl',
    dialect: 'levantine',
    // Lebanon is bilingual; AI may prioritize English content.
    prefersEnglishContent: true,
  },
  PS: {
    code: 'PS',
    nameAr: 'فلسطين',
    nameEn: 'Palestine',
    defaultLocale: 'ar',
    fallbackLocale: 'en',
    defaultCurrency: 'ILS',
    allowedCurrencies: ['ILS', 'JOD', 'USD'],
    direction: 'rtl',
    dialect: 'levantine',
    prefersEnglishContent: false,
  },
  SY: {
    code: 'SY',
    nameAr: 'سوريا',
    nameEn: 'Syria',
    defaultLocale: 'ar',
    fallbackLocale: 'en',
    defaultCurrency: 'SYP',
    allowedCurrencies: ['SYP', 'USD'],
    direction: 'rtl',
    dialect: 'levantine',
    prefersEnglishContent: false,
  },
  SA: {
    code: 'SA',
    nameAr: 'السعودية',
    nameEn: 'Saudi Arabia',
    defaultLocale: 'ar',
    fallbackLocale: 'en',
    defaultCurrency: 'SAR',
    allowedCurrencies: ['SAR'],
    direction: 'rtl',
    dialect: 'gulf',
    prefersEnglishContent: false,
  },
};

export const DEFAULT_MARKET_CODE: MarketCode = 'JO';

export const ALL_MARKET_CODES: readonly MarketCode[] = ['JO', 'LB', 'PS', 'SY', 'SA'];

/** Type guard — narrows a string to a valid MarketCode. */
export function isValidMarketCode(code: unknown): code is MarketCode {
  return typeof code === 'string' && (ALL_MARKET_CODES as readonly string[]).includes(code);
}

/** Return market config; throws on unknown code (fail-fast, no silent fallback). */
export function getMarket(code: MarketCode): MarketConfig {
  const market = MARKETS[code];
  if (!market) {
    throw new Error(`[Markets] Unknown market code "${code}"`);
  }
  return market;
}

/** Safe variant — returns default for unknown, logs warning. */
export function getMarketSafe(code: string | undefined | null): MarketConfig {
  if (isValidMarketCode(code)) return MARKETS[code];
  return MARKETS[DEFAULT_MARKET_CODE];
}

export function getMarketLocale(code: MarketCode): MarketLocale {
  return MARKETS[code].defaultLocale;
}

export function getMarketDirection(code: MarketCode): TextDirection {
  return MARKETS[code].direction;
}
