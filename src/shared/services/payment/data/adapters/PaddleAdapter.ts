import type { PaymentRepository } from '../repositories/PaymentRepository';
import type {
  PurchaseRequest,
  PurchaseReceipt,
  PaymentMethod,
  PurchaseType,
} from '../../domain';

const PADDLE_SCRIPT = 'https://cdn.paddle.com/paddle/v2/paddle.js';

declare global {
  interface Window {
    Paddle?: {
      Initialize: (opts: { token: string }) => void;
      Checkout: { open: (opts: Record<string, unknown>) => void };
    };
  }
}

const METHODS: Record<string, PaymentMethod[]> = {
  JO: [
    { id: 'card', label: 'Credit / Debit Card', labelAr: 'بطاقة ائتمان', icon: 'card', available: true },
    { id: 'apple-pay', label: 'Apple Pay', labelAr: 'Apple Pay', icon: 'apple', available: true },
    { id: 'google-pay', label: 'Google Pay', labelAr: 'Google Pay', icon: 'google', available: true },
    { id: 'paypal', label: 'PayPal', labelAr: 'PayPal', icon: 'paypal', available: true },
  ],
  SA: [
    { id: 'card', label: 'Credit / Debit Card', labelAr: 'بطاقة ائتمان', icon: 'card', available: true },
    { id: 'apple-pay', label: 'Apple Pay', labelAr: 'Apple Pay', icon: 'apple', available: true },
    { id: 'google-pay', label: 'Google Pay', labelAr: 'Google Pay', icon: 'google', available: true },
    { id: 'paypal', label: 'PayPal', labelAr: 'PayPal', icon: 'paypal', available: true },
  ],
  LB: [
    { id: 'card', label: 'Credit / Debit Card', labelAr: 'بطاقة ائتمان', icon: 'card', available: true },
    { id: 'apple-pay', label: 'Apple Pay', labelAr: 'Apple Pay', icon: 'apple', available: true },
    { id: 'paypal', label: 'PayPal', labelAr: 'PayPal', icon: 'paypal', available: true },
  ],
  PS: [
    { id: 'card', label: 'Credit / Debit Card', labelAr: 'بطاقة ائتمان', icon: 'card', available: true },
    { id: 'paypal', label: 'PayPal', labelAr: 'PayPal', icon: 'paypal', available: true },
  ],
  SY: [
    { id: 'card', label: 'Credit / Debit Card', labelAr: 'بطاقة ائتمان', icon: 'card', available: true },
  ],
};

function loadPaddleScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${PADDLE_SCRIPT}"]`)) {
      resolve();
      return;
    }
    const s = document.createElement('script');
    s.src = PADDLE_SCRIPT;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('Failed to load Paddle.js'));
    document.head.appendChild(s);
  });
}

function parsePriceMap(): Partial<Record<PurchaseType, string>> {
  const raw = import.meta.env.VITE_PADDLE_PRICE_MAP;
  if (typeof raw !== 'string' || raw.length === 0) return {};
  try {
    return JSON.parse(raw) as Partial<Record<PurchaseType, string>>;
  } catch {
    return {};
  }
}

export class PaddleAdapter implements PaymentRepository {
  private initialized = false;
  private readonly token: string;
  private readonly priceMap: Partial<Record<PurchaseType, string>>;

  constructor() {
    const t = import.meta.env.VITE_PADDLE_CLIENT_TOKEN;
    this.token = typeof t === 'string' ? t : '';
    this.priceMap = parsePriceMap();
    if (!this.token) {
      throw new Error('VITE_PADDLE_CLIENT_TOKEN missing — cannot use PaddleAdapter');
    }
  }

  async getAvailableMethods(countryCode: string): Promise<PaymentMethod[]> {
    return METHODS[countryCode] || METHODS.JO;
  }

  async purchase(request: PurchaseRequest): Promise<PurchaseReceipt> {
    const priceId = this.priceMap[request.type];
    if (!priceId) {
      throw new Error(`No Paddle price configured for ${request.type}`);
    }
    await this.ensurePaddle();
    const paddle = window.Paddle;
    if (!paddle) throw new Error('Paddle.js unavailable after init');

    paddle.Checkout.open({
      items: [{ priceId, quantity: 1 }],
      customData: {
        listingId: request.listingId ?? '',
        productType: request.type,
        countryCode: request.countryCode,
      },
      settings: {
        displayMode: 'overlay',
        successUrl: `${window.location.origin}/my-ads?payment=success&type=${request.type}`,
      },
    });

    // Overlay-based checkout: real confirmation arrives via webhook → DB.
    // This receipt is a placeholder until the webhook lands.
    return {
      id: `paddle-pending-${Date.now()}`,
      status: 'pending',
      type: request.type,
      listingId: request.listingId,
      amount: request.amount,
      currency: request.currency,
      createdAt: new Date().toISOString(),
    };
  }

  async getPurchase(_purchaseId: string): Promise<PurchaseReceipt | null> {
    // Transactions are read from Supabase premium_transactions in a follow-up PR.
    return null;
  }

  async getPurchaseHistory(_limit = 20): Promise<PurchaseReceipt[]> {
    // Follow-up: query Supabase premium_transactions via RLS.
    return [];
  }

  private async ensurePaddle(): Promise<void> {
    if (this.initialized) return;
    await loadPaddleScript();
    const paddle = window.Paddle;
    if (!paddle) throw new Error('Paddle.js failed to expose window.Paddle');
    paddle.Initialize({ token: this.token });
    this.initialized = true;
  }
}
