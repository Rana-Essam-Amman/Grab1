import { useRef, useState } from 'react';
import { supabase } from '@/shared/lib/supabase';
import { toast } from 'sonner';
import { getFormattedLocalPhone } from '@/shared/lib/phoneFormatting';
import { ensureAnonymousSessionForPhone } from '@/features/auth/services/anonymousSession';

interface RevealState {
  readonly listingId: string | undefined;
  readonly phone: string | null;
  readonly isRevealing: boolean;
}

export function useRevealPhone(
  listingId: string | undefined,
  initialPhone: string | undefined,
  isArabic: boolean,
  countryCode?: string
) {
  const [state, setState] = useState<RevealState>({
    listingId,
    phone: initialPhone || null,
    isRevealing: false,
  });
  const listingIdRef = useRef(listingId);
  const tokenRef = useRef(0);
  listingIdRef.current = listingId;

  const isCurrent = state.listingId === listingId;
  const phone = isCurrent ? state.phone : (initialPhone || null);
  const isRevealing = isCurrent && state.isRevealing;

  const isStale = (token: number, requestedId: string): boolean =>
    token !== tokenRef.current || listingIdRef.current !== requestedId;

  const revealPhone = async (): Promise<string | null> => {
    const requestedId = listingId;
    if (!requestedId) return null;
    if (isCurrent && phone) return phone;
    if (isRevealing) return null;

    const token = ++tokenRef.current;
    setState({ listingId: requestedId, phone: initialPhone || null, isRevealing: true });
    try {
      const sessionResult = await ensureAnonymousSessionForPhone();
      if (isStale(token, requestedId)) return null;
      if (sessionResult.error) {
        toast.error(isArabic ? 'فشل الاتصال بالسيرفر.' : 'Connection failed.');
        return null;
      }

      const { data, error } = await supabase.rpc('get_listing_phone', { p_listing_id: requestedId });
      if (isStale(token, requestedId)) return null;

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
        const dialableNumber = formatted.dialNumber || data;
        setState({ listingId: requestedId, phone: dialableNumber, isRevealing: false });
        return dialableNumber;
      }
      return null;
    } catch {
      if (isStale(token, requestedId)) return null;
      toast.error(isArabic ? 'حدث خطأ غير متوقع.' : 'Unexpected error.');
      return null;
    } finally {
      if (!isStale(token, requestedId)) {
        setState((current) => current.listingId === requestedId ? { ...current, isRevealing: false } : current);
      }
    }
  };

  return { phone, isRevealing, revealPhone };
}
