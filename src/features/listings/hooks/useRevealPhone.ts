import { useState } from 'react';
import { supabase } from '@/shared/lib/supabase';
import { toast } from 'sonner';
import { getFormattedLocalPhone } from '@/shared/lib/phoneFormatting';
import { ensureAnonymousSessionForPhone } from '@/features/auth/services/anonymousSession';

export function useRevealPhone(
  listingId: string | undefined,
  initialPhone: string | undefined,
  isArabic: boolean,
  countryCode?: string
) {
  const [phone, setPhone] = useState<string | null>(initialPhone || null);
  const [isRevealing, setIsRevealing] = useState(false);

  const revealPhone = async (captchaToken?: string): Promise<string | null> => {
    if (phone) return phone;
    if (isRevealing || !listingId) return null;

    setIsRevealing(true);
    try {
      const sessionResult = await ensureAnonymousSessionForPhone(captchaToken);
      if (sessionResult.error) {
        const isCaptchaError = sessionResult.error.toLowerCase().includes('captcha');
        if (isCaptchaError && !captchaToken) {
          throw new Error('CAPTCHA_REQUIRED');
        }
        toast.error(isArabic ? 'فشل الاتصال بالسيرفر.' : 'Connection failed.');
        return null;
      }

      const { data, error } = await supabase.rpc('get_listing_phone', { p_listing_id: listingId });

      if (error) {
        if (error.message.includes('RATE_LIMIT_EXCEEDED')) {
          toast.error(isArabic ? 'لقد وصلت للحد الأقصى لطلب الأرقام اليوم (20 رقم). حاول غداً.' : 'Daily limit for revealing numbers reached (20). Try again tomorrow.');
        } else {
          toast.error(isArabic ? 'فشل جلب الرقم.' : 'Failed to fetch number.');
        }
        return null;
      }

      if (data) {
        const formatted = getFormattedLocalPhone(data, countryCode);
        // Return dialable number (+966..., +962...) so tel: works internationally
        // and WhatsApp works seamlessly.
        const dialableNumber = formatted.dialNumber || data;
        setPhone(dialableNumber);
        return dialableNumber;
      }
      return null;
    } catch (err) {
      if (err instanceof Error && err.message === 'CAPTCHA_REQUIRED') {
        throw err; // Re-throw to let the UI handle the captcha modal
      }
      toast.error(isArabic ? 'حدث خطأ غير متوقع.' : 'Unexpected error.');
      return null;
    } finally {
      setIsRevealing(false);
    }
  };

  return { phone, isRevealing, revealPhone };
}
