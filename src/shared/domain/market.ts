/**
 * MarketCountry — shared domain type for market codes.
 *
 * Historically lived in @/features/auth/domain. Moved here so feature domains
 * (listings, explore, etc.) can depend on it without crossing feature boundaries.
 *
 * @see ADR 0001 (multi-market seller)
 */
export type { MarketCode as MarketCountry } from '@/shared/lib/marketGate';
