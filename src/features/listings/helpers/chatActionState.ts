export interface ChatActionState {
  readonly disabled: boolean;
  readonly hintAr: string;
  readonly hintEn: string;
}

export function getChatActionState(params: {
  readonly isAuthenticated: boolean;
  readonly isOwner: boolean;
  readonly isCountryMismatch: boolean;
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
  return { disabled: false, hintAr: '', hintEn: '' };
}
