export type MarketCountry = 'JO' | 'SA' | 'PS' | 'LB' | 'SY';

export interface User {
  readonly id: string;
  readonly phone: string;
  readonly countryCode: MarketCountry;
  readonly name: string;
  readonly avatarUrl?: string;
  readonly isVerified: boolean;
}
