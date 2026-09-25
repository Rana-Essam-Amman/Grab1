export type AuthProviderId =
  | 'google'
  | 'apple'
  | 'email'
  | 'whatsapp'
  | 'sms'
  | 'guest';

export type AuthProviderStatus = 'available' | 'coming_soon' | 'unavailable';

export interface AuthProviderDef {
  readonly id: AuthProviderId;
  readonly labelAr: string;
  readonly labelEn: string;
  readonly status: AuthProviderStatus;
  readonly platforms: readonly ('web' | 'ios' | 'android')[];
}
