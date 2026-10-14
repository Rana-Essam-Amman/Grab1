export interface ChatActionState {
  readonly disabled: boolean;
  readonly hintAr: string;
  readonly hintEn: string;
}

/**
 * Decides whether the in-app chat button should be enabled.
 *
 * `hasSellerAccount` defaults to true for backwards compatibility.
 * Listings without a canonical seller UUID (e.g. static seed data)
 * should pass false so chat is disabled — those listings cannot
 * support a real conversation.
 */
export function getChatActionState(params: {
  readonly isAuthenticated: boolean;
  readonly isOwner: boolean;
  readonly isCountryMismatch: boolean;
  readonly hasSellerAccount?: boolean;
}): ChatActionState {
  if (params.isCountryMismatch) {
    return {
      disabled: true,
      hintAr: 'الدردشة غير متاحة عبر الأسواق — استخدم واتساب أو الاتصال',
      hintEn: 'Chat not available across markets — use WhatsApp or Call',
    };
  }

  if (params.isOwner) {
    return {
      disabled: true,
      hintAr: 'هذا إعلانك الخاص',
      hintEn: 'This is your own listing',
    };
  }

  if (params.hasSellerAccount === false) {
    return {
      disabled: true,
      hintAr: 'الدردشة غير متاحة لهذا الإعلان',
      hintEn: 'In-app chat is unavailable for this listing',
    };
  }

  return { disabled: false, hintAr: '', hintEn: '' };
}
