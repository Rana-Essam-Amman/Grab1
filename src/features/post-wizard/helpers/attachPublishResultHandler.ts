import { toast } from 'sonner';

interface PublishResult {
  success: boolean;
  error: string | null;
}

type PublishFlow = 'manual' | 'ai';

export function attachPublishResultHandler(
  promise: Promise<PublishResult>,
  flow: PublishFlow,
  isArabic: boolean,
  navigateTo: (screen: string) => void
): void {
  promise
    .then((result) => {
      if (result.success) return;
      const raw = result.error || (isArabic ? 'فشل نشر الإعلان' : 'Failed to publish');

      // Manual flow: rate-limit translation takes precedence.
      if (flow === 'manual' && (raw.includes('Rate limit') || raw.includes('ACTIVE_LISTING_CAP_REACHED'))) {
        toast.error(isArabic
          ? 'لقد وصلت للحد الأقصى لعدد الإعلانات المسموح بها حالياً. يرجى المحاولة لاحقاً.'
          : 'You have reached the maximum allowed listings. Please try again later.');
        return;
      }

      // Both flows: RLS requires phone, navigate to profile.
      if (raw.toLowerCase().includes('row-level security')) {
        toast.error(isArabic ? 'يجب إضافة رقم هاتف أولاً' : 'Phone required');
        navigateTo('profile');
        return;
      }

      toast.error(raw);
    })
    .catch((err) => {
      console.error('[PUBLISH ERROR]', err);
      toast.error(isArabic ? 'فشل نشر الإعلان' : 'Failed to publish');
    });
}
