// RULE-14-EXCEPTION: Market isolation guards
import type { MarketCode } from './types';
import { isValidMarketCode } from './config';

/**
 * Market isolation is a RED LINE. These guards fail LOUDLY when any
 * cross-market operation is attempted. They run in development always,
 * and in production for hard violations.
 */

export class MarketViolationError extends Error {
  constructor(
    public readonly expected: MarketCode,
    public readonly actual: string | undefined | null,
    public readonly operation: string
  ) {
    super(
      `[MarketViolation] ${operation}: expected "${expected}", got "${actual ?? 'undefined'}"`
    );
    this.name = 'MarketViolationError';
  }
}

/**
 * Assert that two market codes are identical. Throws otherwise.
 * Use at EVERY boundary where two market-scoped values meet:
 *   - listing → user
 *   - chat → listing
 *   - draft → user
 *   - AI input → active market
 */
export function assertSameMarket(
  expected: MarketCode,
  actual: string | undefined | null,
  operation: string
): asserts actual is MarketCode {
  if (expected !== actual) {
    throw new MarketViolationError(expected, actual, operation);
  }
}

/**
 * Soft check — returns true if same market, false otherwise.
 * For conditional UI (e.g., showing a "switch market" prompt).
 */
export function isSameMarket(
  a: string | undefined | null,
  b: string | undefined | null
): boolean {
  if (!a || !b) return false;
  return a === b;
}

/**
 * Assert a string is a valid market code. Throws otherwise.
 * Use when reading market from URL, storage, or external sources.
 */
export function assertValidMarket(
  value: string | undefined | null,
  operation: string
): asserts value is MarketCode {
  if (!isValidMarketCode(value)) {
    throw new MarketViolationError('JO', value, operation);
  }
}
