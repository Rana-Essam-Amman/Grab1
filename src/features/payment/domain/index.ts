export type PurchaseType = 'featured-ad' | 'turbo-ad' | 'auto-bump' | 'vip-store' | 'ai-credits';

export type PurchaseStatus = 'pending' | 'succeeded' | 'failed' | 'cancelled';

export interface PurchaseRequest {
  readonly type: PurchaseType;
  readonly listingId?: string;
  readonly countryCode: string;
  readonly currency: string;
  readonly amount: number;
  readonly metadata?: Record<string, string>;
}

export interface PurchaseReceipt {
  readonly id: string;
  readonly status: PurchaseStatus;
  readonly type: PurchaseType;
  readonly listingId?: string;
  readonly amount: number;
  readonly currency: string;
  readonly createdAt: string;
  readonly expiresAt?: string;
}

export interface PaymentMethod {
  readonly id: string;
  readonly label: string;
  readonly labelAr: string;
  readonly icon: string;
  readonly available: boolean;
}
