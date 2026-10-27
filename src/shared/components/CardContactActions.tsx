import React, { useCallback, useMemo } from 'react';
import { Call, Whatsapp } from 'iconsax-react';
import { useAuth } from '@/hooks/useAuth';
import { useUI } from '@/hooks/useUI';
import { useRevealPhone } from '@/features/listings/hooks/useRevealPhone';
import { getWhatsAppUrl } from '@/features/listings/helpers/listingDerivedData';
import { capture } from '@/shared/analytics/posthog';
import { EVENTS } from '@/shared/analytics/events';
import type { Listing } from '@/types';

interface CardContactActionsProps {
  readonly listing: Listing;
  readonly isArabic: boolean;
}

export const CardContactActions: React.FC<CardContactActionsProps> = ({ listing, isArabic }) => {
  const { navigateTo } = useUI();
  const { revealPhone, isRevealing } = useRevealPhone(listing.id, listing.sellerPhone, isArabic, listing.countryCode);
  const hasPhone = Boolean(listing.sellerPhone);

  const handleCall = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!hasPhone || isRevealing) return;
    capture(EVENTS.CONTACT_SELLER_CLICKED, { method: 'call', source: 'card' });
    const num = await revealPhone();
    if (num) window.location.href = `tel:${num}`;
  }, [hasPhone, isRevealing, revealPhone]);

  const handleWhatsApp = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!hasPhone || isRevealing) return;
    capture(EVENTS.CONTACT_SELLER_CLICKED, { method: 'whatsapp', source: 'card' });
    const num = await revealPhone();
    if (num) {
      window.open(getWhatsAppUrl({ countryCode: listing.countryCode, dialNumber: num, listingTitle: listing.title, isArabic }), '_blank');
    }
  }, [hasPhone, isRevealing, revealPhone, listing, isArabic]);

  return (
    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border" onClick={(e) => e.stopPropagation()}>
      <button
        onClick={handleCall}
        disabled={!hasPhone}
        className={`flex-1 h-10 rounded-xl flex items-center justify-center gap-1.5 font-bold text-[13px] transition-all ${!hasPhone ? 'bg-canvas text-ink-muted' : 'bg-danger/10 text-danger hover:bg-danger/20 active:scale-95'}`}
      >
        <Call size={16} variant="Bold" />
        <span>{isArabic ? 'اتصال' : 'Call'}</span>
      </button>
      
      <button
        onClick={handleWhatsApp}
        disabled={!hasPhone}
        className={`flex-1 h-10 rounded-xl flex items-center justify-center gap-1.5 font-bold text-[13px] transition-all ${!hasPhone ? 'bg-canvas text-ink-muted' : 'bg-whatsapp/10 text-whatsapp hover:bg-whatsapp/20 active:scale-95'}`}
      >
        <Whatsapp size={16} variant="Bold" />
        <span>{isArabic ? 'واتساب' : 'WhatsApp'}</span>
      </button>
    </div>
  );
};
