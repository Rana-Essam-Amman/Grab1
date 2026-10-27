import React, { useCallback, useMemo } from 'react';
import { Call, Whatsapp, Message } from 'iconsax-react';
import { useAuth } from '@/hooks/useAuth';
import { useChat } from '@/hooks/useChat';
import { useUI } from '@/hooks/useUI';
import { useRevealPhone } from '@/features/listings/hooks/useRevealPhone';
import { getChatActionState } from '@/features/listings/helpers/chatActionState';
import { getWhatsAppUrl } from '@/features/listings/helpers/listingDerivedData';
import { capture } from '@/shared/analytics/posthog';
import { EVENTS } from '@/shared/analytics/events';
import { globalStorage } from '@/shared/lib/marketStorage';
import { showChatUnavailable, showChatOpenFailed, showChatCrossMarket } from '@/features/listings/helpers/chatErrorToast';
import { toast } from 'sonner';
import type { Listing } from '@/types';

interface CardContactActionsProps {
  readonly listing: Listing;
  readonly isArabic: boolean;
}

export const CardContactActions: React.FC<CardContactActionsProps> = ({ listing, isArabic }) => {
  const { authStatus, user } = useAuth();
  const { openConversation } = useChat();
  const { navigateTo, setSelectedThreadId, browseCountryCode } = useUI();
  const { revealPhone, isRevealing } = useRevealPhone(listing.id, listing.sellerPhone, isArabic, listing.countryCode);

  const isAuthenticated = authStatus === 'authenticated';
  const isOwner = useMemo(() => {
    if (!user || !listing) return false;
    if (user.id && listing.userId && user.id === listing.userId) return true;
    return !!(user.phone && listing.sellerPhone && user.phone === listing.sellerPhone);
  }, [user, listing]);

  const hasPhone = Boolean(listing.sellerPhone);
  const isCountryMismatch = listing.countryCode !== browseCountryCode;
  const hasSellerAccount = Boolean(listing.userId);

  const chatState = getChatActionState({
    isAuthenticated,
    isOwner,
    isCountryMismatch,
    hasSellerAccount,
  });

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

  const handleChat = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (chatState.disabled) {
      toast.error(isArabic ? chatState.hintAr : chatState.hintEn);
      return;
    }
    capture(EVENTS.CONTACT_SELLER_CLICKED, { method: 'chat', source: 'card' });
    
    if (authStatus === 'unauthenticated' || !user?.id) {
      globalStorage().set('pending_chat_listing', listing.id);
      navigateTo('login');
      return;
    }
    
    try {
      const conv = await openConversation({ listingId: listing.id, buyerId: user.id, sellerId: listing.userId!, marketCode: listing.countryCode }, browseCountryCode);
      if (!conv) { showChatOpenFailed(isArabic); return; }
      setSelectedThreadId(conv.id); navigateTo('thread');
    } catch (err) {
      if ((err instanceof Error ? err.message : '').includes('Cross-market')) showChatCrossMarket(isArabic);
      else showChatOpenFailed(isArabic);
    }
  }, [chatState, authStatus, user, navigateTo, openConversation, setSelectedThreadId, browseCountryCode, isArabic, listing]);

  return (
    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
      <button
        onClick={handleChat}
        disabled={chatState.disabled}
        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${chatState.disabled ? 'bg-canvas text-ink-muted' : 'bg-brand/10 text-brand hover:bg-brand/20 active:scale-95'}`}
        aria-label={isArabic ? 'دردشة' : 'Chat'}
      >
        <Message size={16} variant="Bold" />
      </button>
      
      <button
        onClick={handleWhatsApp}
        disabled={!hasPhone}
        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${!hasPhone ? 'bg-canvas text-ink-muted' : 'bg-whatsapp/10 text-whatsapp hover:bg-whatsapp/20 active:scale-95'}`}
        aria-label={isArabic ? 'واتساب' : 'WhatsApp'}
      >
        <Whatsapp size={16} variant="Bold" />
      </button>
      
      <button
        onClick={handleCall}
        disabled={!hasPhone}
        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${!hasPhone ? 'bg-canvas text-ink-muted' : 'bg-primary/10 text-primary hover:bg-primary/20 active:scale-95'}`}
        aria-label={isArabic ? 'اتصال' : 'Call'}
      >
        <Call size={16} variant="Bold" />
      </button>
    </div>
  );
};
