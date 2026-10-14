import { toast } from 'sonner';

/**
 * Centralized user-facing messages for chat initiation failures.
 * Extracted so useListingDetail.ts (Rule 14 hook limit = 100 lines)
 * stays within budget when the handleStartChat error paths grow.
 */
export function showChatUnavailable(isArabic: boolean): void {
  toast.error(
    isArabic
      ? 'الدردشة غير متاحة لهذا الإعلان'
      : 'In-app chat is unavailable for this listing',
  );
}

export function showChatSignInRequired(isArabic: boolean): void {
  toast.error(
    isArabic ? 'يرجى تسجيل الدخول لبدء الدردشة' : 'Please sign in to start a chat',
  );
}

export function showChatOpenFailed(isArabic: boolean): void {
  toast.error(
    isArabic ? 'تعذر فتح الدردشة — حاول مرة أخرى' : 'Could not open chat — please retry',
  );
}

export function showChatCrossMarket(isArabic: boolean): void {
  toast.error(
    isArabic ? 'الدردشة غير متاحة عبر الأسواق' : 'Chat not available across markets',
  );
}
