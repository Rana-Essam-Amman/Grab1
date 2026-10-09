// Auth domain — pure business logic
export type { User } from './entities/User';

/**
 * @deprecated MarketCountry is now in @/shared/domain/market.
 *             This re-export exists for backwards compatibility and will be
 *             removed once all consumers migrate.
 */
export type { MarketCountry } from '@/shared/domain/market';

export { canRegister } from './rules/canRegister';
export type { RegisterInput, CanRegisterReason, CanRegisterResult } from './rules/canRegister';

export { canLogin } from './rules/canLogin';
export type { LoginInput, CanLoginReason, CanLoginResult } from './rules/canLogin';

export type { AuthProviderDef } from './entities/AuthProvider';
export { AUTH_PROVIDERS, getProvidersByPlatform } from './rules/authProviders';
