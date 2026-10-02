// RULE-14-EXCEPTION: Market taxonomy
/**
 * Market-level configuration. One entry per country we operate in.
 *
 * CRITICAL: Markets are FULLY ISOLATED. A user belongs to exactly ONE
 * market. No cross-market visibility, storage, or AI behavior is allowed.
 */

export type MarketCode = 'JO' | 'LB' | 'PS' | 'SY' | 'SA';
export type MarketLocale = 'ar' | 'en';
export type TextDirection = 'rtl' | 'ltr';

export interface MarketConfig {
  readonly code: MarketCode;
  readonly nameAr: string;
  readonly nameEn: string;
  readonly defaultLocale: MarketLocale;
  readonly fallbackLocale: MarketLocale;
  readonly defaultCurrency: string;
  readonly allowedCurrencies: readonly string[];
  readonly direction: TextDirection;
  readonly dialect: 'levantine' | 'gulf';
  /** Whether AI should prioritize English templates for this market. */
  readonly prefersEnglishContent: boolean;
}

/** A value that is explicitly scoped to a specific market. */
export interface MarketScoped<T> {
  readonly market: MarketCode;
  readonly value: T;
}
