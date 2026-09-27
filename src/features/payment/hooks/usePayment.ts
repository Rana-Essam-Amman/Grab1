import { useCallback, useState } from 'react';
import { MockPaymentAdapter } from '../data/adapters/MockPaymentAdapter';
import type { PaymentRepository } from '../data/repositories/PaymentRepository';
import type { PurchaseRequest, PurchaseReceipt, PaymentMethod } from '../domain';

const paymentRepo: PaymentRepository = new MockPaymentAdapter();

export function usePayment() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastReceipt, setLastReceipt] = useState<PurchaseReceipt | null>(null);
  const [error, setError] = useState<string | null>(null);

  const methods = useCallback(async (countryCode: string): Promise<PaymentMethod[]> => {
    return paymentRepo.getAvailableMethods(countryCode);
  }, []);

  const purchase = useCallback(async (request: PurchaseRequest): Promise<PurchaseReceipt | null> => {
    setIsProcessing(true);
    setError(null);
    try {
      const receipt = await paymentRepo.purchase(request);
      setLastReceipt(receipt);
      return receipt;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Payment failed';
      setError(msg);
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const history = useCallback(async (limit?: number) => {
    return paymentRepo.getPurchaseHistory(limit);
  }, []);

  return { purchase, methods, history, isProcessing, lastReceipt, error };
}
