import { describe, it, expect } from 'vitest';
import {
  MARKETS, getMarketSafe, getMarket, isValidMarketCode,
  DEFAULT_MARKET_CODE, ALL_MARKET_CODES,
} from '../config';

describe('Markets config', () => {
  it('has all 5 MENA markets', () => {
    expect(Object.keys(MARKETS).sort()).toEqual(['JO', 'LB', 'PS', 'SA', 'SY']);
  });

  it('default market is Jordan', () => {
    expect(DEFAULT_MARKET_CODE).toBe('JO');
  });

  it('isValidMarketCode narrows correctly', () => {
    expect(isValidMarketCode('JO')).toBe(true);
    expect(isValidMarketCode('LB')).toBe(true);
    expect(isValidMarketCode('XX')).toBe(false);
    expect(isValidMarketCode(undefined)).toBe(false);
    expect(isValidMarketCode(123)).toBe(false);
  });

  it('getMarket throws on unknown code', () => {
    expect(() => getMarket('XX' as never)).toThrow();
  });

  it('getMarketSafe falls back to default', () => {
    expect(getMarketSafe('XX').code).toBe('JO');
    expect(getMarketSafe(null).code).toBe('JO');
  });

  it('every market has required non-empty fields', () => {
    for (const code of ALL_MARKET_CODES) {
      const m = MARKETS[code];
      expect(m.code).toBe(code);
      expect(m.nameAr.length).toBeGreaterThan(0);
      expect(m.nameEn.length).toBeGreaterThan(0);
      expect(m.allowedCurrencies).toContain(m.defaultCurrency);
    }
  });

  it('Lebanon prefers English content', () => {
    expect(MARKETS.LB.prefersEnglishContent).toBe(true);
  });

  it('Saudi Arabia uses Gulf dialect', () => {
    expect(MARKETS.SA.dialect).toBe('gulf');
  });

  it('Levantine markets share dialect', () => {
    expect(MARKETS.JO.dialect).toBe('levantine');
    expect(MARKETS.LB.dialect).toBe('levantine');
    expect(MARKETS.PS.dialect).toBe('levantine');
    expect(MARKETS.SY.dialect).toBe('levantine');
  });
});
