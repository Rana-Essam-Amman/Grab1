import { MONETIZATION_MATRIX } from '../data/monetization';

export interface CheckoutSessionPayload {
  userId: string;
  userEmail?: string;
  countryCode: string;
  itemType: 'TURBO_AD' | 'VIP_SHOP_SUBSCRIPTION';
  listingId?: string;
  amount?: number;
  currency?: string;
}

export interface PaymentResponse {
  success: boolean;
  sessionId?: string;
  checkoutUrl?: string;
  error?: string;
  transactionRef: string;
}

/**
 * Agnostic Payment Gateway Client for Secure Checkout (Stripe / Visa / Mastercard / Google Pay)
 */
export async function initializeSecureCheckout(
  payload: CheckoutSessionPayload
): Promise<PaymentResponse> {
  const timeoutPromise = new Promise<PaymentResponse>((_, reject) => {
    setTimeout(() => {
      reject(new Error('Payment Gateway Timeout: Secure connection took longer than 5 seconds.'));
    }, 5000);
  });

  const paymentExecution = async (): Promise<PaymentResponse> => {
    // 1. Resolve pricing and currency from monetization matrix
    const matrixPkg = MONETIZATION_MATRIX.packages[payload.countryCode] || MONETIZATION_MATRIX.packages['JO'];
    const resolvedAmount =
      payload.amount ||
      (payload.itemType === 'TURBO_AD' ? matrixPkg.turboAdCost : matrixPkg.vipStoreMonthlyCost);
    const resolvedCurrency = payload.currency || matrixPkg.currency;

    const transactionRef = `ctd_tx_${Math.random().toString(36).substring(2, 10)}_${Date.now()}`;

    // 2. Simulate secure Stripe / Google Pay tokenization & session initialization
    await new Promise((res) => setTimeout(res, 800));

    // Return success payment payload with Stripe session credentials
    return {
      success: true,
      sessionId: `cs_test_${Math.random().toString(36).substring(2, 15)}`,
      checkoutUrl: `https://checkout.stripe.com/pay/${transactionRef}`,
      transactionRef,
    };
  };

  try {
    return await Promise.race([paymentExecution(), timeoutPromise]);
  } catch (err: unknown) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.warn('Payment Gateway Error intercepted:', error);
    return {
      success: false,
      error: error.message || 'Payment initialization failed. Please try again.',
      transactionRef: `failed_${Date.now()}`,
    };
  }
}
