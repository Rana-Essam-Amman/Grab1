import type { MarketCountry } from '../entities/User';

export interface RegisterInput {
  name: string;
  phone: string;
  countryCode: MarketCountry;
  activeMarket: MarketCountry;
}

export type CanRegisterReason =
  | 'empty-name'
  | 'name-too-short'
  | 'empty-phone'
  | 'invalid-phone-format'
  | 'market-mismatch';

export interface CanRegisterResult {
  allowed: boolean;
  reason?: CanRegisterReason;
}

const PHONE_PATTERNS: Record<MarketCountry, RegExp> = {
  JO: /^07[789]\d{7}$/,
  SA: /^05\d{8}$/,
  PS: /^05\d{8}$/,
  LB: /^(03|70|71|76|78|79|81)\d{6}$/,
  SY: /^09\d{8}$/,
};

export function canRegister(input: RegisterInput): CanRegisterResult {
  const name = input.name.trim();
  const phone = input.phone.trim();

  if (name.length === 0) return { allowed: false, reason: 'empty-name' };
  if (name.length < 2) return { allowed: false, reason: 'name-too-short' };
  if (phone.length === 0) return { allowed: false, reason: 'empty-phone' };

  if (input.countryCode !== input.activeMarket) {
    return { allowed: false, reason: 'market-mismatch' };
  }

  const pattern = PHONE_PATTERNS[input.countryCode];
  if (!pattern.test(phone)) {
    return { allowed: false, reason: 'invalid-phone-format' };
  }

  return { allowed: true };
}
