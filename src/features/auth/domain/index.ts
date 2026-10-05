// Auth domain — pure business logic
export type { User, MarketCountry } from './entities/User';

export { canRegister } from './rules/canRegister';
export type { RegisterInput, CanRegisterReason, CanRegisterResult } from './rules/canRegister';

export { canLogin } from './rules/canLogin';
export type { LoginInput, CanLoginReason, CanLoginResult } from './rules/canLogin';

export type { AuthProviderDef } from './entities/AuthProvider';
export { AUTH_PROVIDERS, getProvidersByPlatform } from './rules/authProviders';
