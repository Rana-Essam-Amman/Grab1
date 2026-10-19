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

  const revealPhone = async (): Promise<string | null> => {
    if (phone) return phone;
    if (isRevealing || !listingId) return null;

    setIsRevealing(true);
    try {
      const sessionResult = await ensureAnonymousSessionForPhone();
      if (sessionResult.error) {
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
        const localNumber = formatted.displayFormatted || data;
        setPhone(localNumber);
        return localNumber;
      }
      return null;
    } catch (err) {
      toast.error(isArabic ? 'حدث خطأ غير متوقع.' : 'Unexpected error.');
      return null;
    } finally {
      setIsRevealing(false);
    }
  };

  return { phone, isRevealing, revealPhone };
}
