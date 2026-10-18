import { useState } from 'react';
import { supabase } from '@/shared/lib/supabase';
import { toast } from 'sonner';

export function useRevealPhone(listingId: string | undefined, initialPhone: string | undefined, isArabic: boolean) {
  const [phone, setPhone] = useState<string | null>(initialPhone || null);
  const [isRevealing, setIsRevealing] = useState(false);

  const revealPhone = async (): Promise<string | null> => {
    if (phone) return phone;
    if (isRevealing || !listingId) return null;
    
    setIsRevealing(true);
    try {
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
        setPhone(data);
        return data;
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
