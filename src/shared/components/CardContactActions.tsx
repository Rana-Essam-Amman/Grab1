import React, { useCallback } from 'react';
import { Call, Whatsapp } from 'iconsax-react';
import { useRevealPhone } from '@/features/listings/hooks/useRevealPhone';
import { getWhatsAppUrl } from '@/features/listings/helpers/listingDerivedData';
import { capture } from '@/shared/analytics/posthog';
import { EVENTS } from '@/shared/analytics/events';
import { toast } from 'sonner';
import type { Listing } from '@/types';

interface CardContactActionsProps {
  readonly listing: Listing;
  readonly isArabic: boolean;
}

export const CardContactActions: React.FC<CardContactActionsProps> = ({ listing, isArabic }) => {
  const { revealPhone, isRevealing } = useRevealPhone(listing.id, listing.sellerPhone, isArabic, listing.countryCode);

  const handleCall = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (isRevealing) return;
    capture(EVENTS.CONTACT_SELLER_CLICKED, { method: 'call', source: 'card' });
    const num = await revealPhone();
    if (num) {
      window.location.href = `tel:${num}`;
    } else {
      toast.error(isArabic ? 'البائع لم يضع رقم هاتف' : 'Seller has no phone number');
    }
  }, [isRevealing, revealPhone, isArabic]);

  const handleWhatsApp = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (isRevealing) return;
    capture(EVENTS.CONTACT_SELLER_CLICKED, { method: 'whatsapp', source: 'card' });
    const num = await revealPhone();
    if (num) {
      window.open(getWhatsAppUrl({ countryCode: listing.countryCode, dialNumber: num, listingTitle: listing.title, isArabic }), '_blank');
    } else {
      toast.error(isArabic ? 'البائع لم يضع رقم هاتف' : 'Seller has no phone number');
    }
  }, [isRevealing, revealPhone, listing, isArabic]);

  return (
    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border" onClick={(e) => e.stopPropagation()}>
      <button
        onClick={handleCall}
        className="flex-1 h-[44px] rounded-xl flex items-center justify-center gap-2 font-bold text-[14px] transition-all shadow-sm bg-primary text-white hover:bg-primary/90 active:scale-95"
      >
        <Call size={18} variant="Bold" />
        <span>{isArabic ? 'اتصال' : 'Call'}</span>
      </button>

      <button
        onClick={handleWhatsApp}
        className="flex-1 h-[44px] rounded-xl flex items-center justify-center gap-2 font-bold text-[14px] transition-all shadow-sm bg-whatsapp text-white hover:bg-whatsapp-hover active:scale-95"
      >
        <Whatsapp size={18} variant="Bold" />
        <span>{isArabic ? 'واتساب' : 'WhatsApp'}</span>
      </button>
    </div>
  );
};
