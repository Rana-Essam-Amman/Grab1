import type { PaymentRepository } from '../repositories/PaymentRepository';
import type { PurchaseRequest, PurchaseReceipt, PaymentMethod } from '../../domain';

const STORAGE_KEY = 'payment_receipts_v1';

const METHODS: Record<string, PaymentMethod[]> = {
  JO: [
    { id: 'card', label: 'Credit / Debit Card', labelAr: 'بطاقة ائتمان', icon: 'card', available: true },
    { id: 'apple-pay', label: 'Apple Pay', labelAr: 'Apple Pay', icon: 'apple', available: true },
    { id: 'google-pay', label: 'Google Pay', labelAr: 'Google Pay', icon: 'google', available: true },
    { id: 'zain-cash', label: 'Zain Cash', labelAr: 'زين كاش', icon: 'wallet', available: false },
  ],
  SA: [
    { id: 'card', label: 'Credit / Debit Card', labelAr: 'بطاقة ائتمان', icon: 'card', available: true },
    { id: 'mada', label: 'Mada', labelAr: 'مدى', icon: 'card', available: true },
    { id: 'apple-pay', label: 'Apple Pay', labelAr: 'Apple Pay', icon: 'apple', available: true },
    { id: 'stc-pay', label: 'STC Pay', labelAr: 'STC Pay', icon: 'wallet', available: false },
  ],
  LB: [
    { id: 'card', label: 'Credit / Debit Card', labelAr: 'بطاقة ائتمان', icon: 'card', available: true },
    { id: 'apple-pay', label: 'Apple Pay', labelAr: 'Apple Pay', icon: 'apple', available: true },
  ],
  PS: [
    { id: 'card', label: 'Credit / Debit Card', labelAr: 'بطاقة ائتمان', icon: 'card', available: true },
  ],
  SY: [
    { id: 'card', label: 'Credit / Debit Card', labelAr: 'بطاقة ائتمان', icon: 'card', available: true },
  ],
};

export class MockPaymentAdapter implements PaymentRepository {
  async getAvailableMethods(countryCode: string): Promise<PaymentMethod[]> {
    return METHODS[countryCode] || METHODS.JO;
  }

  async purchase(request: PurchaseRequest): Promise<PurchaseReceipt> {
    await new Promise((r) => setTimeout(r, 400));

    const receipt: PurchaseReceipt = {
      id: `mock-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      status: 'succeeded',
      type: request.type,
      listingId: request.listingId,
      amount: request.amount,
      currency: request.currency,
      createdAt: new Date().toISOString(),
      expiresAt: this.computeExpiry(request.type),
    };

    this.appendHistory(receipt);
    return receipt;
  }

  async getPurchase(purchaseId: string): Promise<PurchaseReceipt | null> {
    const all = this.readHistory();
    return all.find((r) => r.id === purchaseId) || null;
  }

  async getPurchaseHistory(limit = 20): Promise<PurchaseReceipt[]> {
    return this.readHistory().slice(0, limit);
  }

  private computeExpiry(type: string): string | undefined {
    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;
    switch (type) {
      case 'featured-ad':
        return new Date(now + 7 * day).toISOString();
      case 'turbo-ad':
        return new Date(now + 3 * 60 * 60 * 1000).toISOString();
      case 'auto-bump':
        return new Date(now + 30 * day).toISOString();
      case 'vip-store':
        return new Date(now + 30 * day).toISOString();
      default:
        return undefined;
    }
  }

  private readHistory(): PurchaseReceipt[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private appendHistory(receipt: PurchaseReceipt): void {
    try {
      const history = this.readHistory();
      localStorage.setItem(STORAGE_KEY, JSON.stringify([receipt, ...history].slice(0, 50)));
    } catch {
      // storage quota — ignore
    }
  }
}
