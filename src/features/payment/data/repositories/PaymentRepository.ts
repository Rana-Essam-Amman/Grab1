import type { PurchaseRequest, PurchaseReceipt, PaymentMethod } from '../../domain';

/**
 * Abstract payment contract.
 * Implementations:
 *  - MockPaymentAdapter (local, dev only)
 *  - RevenueCatAdapter (in-app purchases) — future
 *  - StripeAdapter (web) — future
 */
export interface PaymentRepository {
  getAvailableMethods(countryCode: string): Promise<PaymentMethod[]>;
  purchase(request: PurchaseRequest): Promise<PurchaseReceipt>;
  getPurchase(purchaseId: string): Promise<PurchaseReceipt | null>;
  getPurchaseHistory(limit?: number): Promise<PurchaseReceipt[]>;
}
