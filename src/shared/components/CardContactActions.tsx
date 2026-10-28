import React, { useCallback } from 'react';
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
  const isCountryMismatch = listing.countryCode !== browseCountryCode;
  const hasSellerAccount = Boolean(listing.userId);

  const chatState = getChatActionState({
    isAuthenticated,
    isOwner: false,
    isCountryMismatch,
    hasSellerAccount,
  });

  const handleCall = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (isRevealing) return;
    
    capture(EVENTS.CONTACT_SELLER_CLICKED, { method: 'call', source: 'card' });
    toast.loading(isArabic ? 'جاري جلب الرقم...' : 'Fetching...', { id: 'fetch-phone' });
    
    const num = await revealPhone();
    toast.dismiss('fetch-phone');
    
    if (num) {
      window.location.href = `tel:${num}`;
    }
  }, [isRevealing, revealPhone, isArabic]);

  const handleWhatsApp = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (isRevealing) return;
    
    const newWindow = window.open('', '_blank');
    
    capture(EVENTS.CONTACT_SELLER_CLICKED, { method: 'whatsapp', source: 'card' });
    toast.loading(isArabic ? 'جاري جلب الرقم...' : 'Fetching...', { id: 'fetch-phone' });
    
    const num = await revealPhone();
    toast.dismiss('fetch-phone');
    
    if (num) {
      const url = getWhatsAppUrl({ countryCode: listing.countryCode, dialNumber: num, listingTitle: listing.title, isArabic });
      if (newWindow) {
        newWindow.location.href = url;
      } else {
        window.location.href = url;
      }
    } else {
      if (newWindow) newWindow.close();
    }
  }, [isRevealing, revealPhone, listing, isArabic]);

  const handleChat = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
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
    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border" onClick={(e) => e.stopPropagation()}>
      <button
        onClick={handleChat}
        className={`flex-1 h-[44px] rounded-xl flex items-center justify-center gap-1.5 font-bold text-[13px] transition-all shadow-sm ${
          chatState.disabled ? 'bg-canvas text-ink-muted' : 'bg-primary/10 text-primary hover:bg-primary/20 active:scale-95'
        }`}
      >
        <Message size={16} variant="Bold" />
        <span>{isArabic ? 'دردشة' : 'Chat'}</span>
      </button>
      
      <button
        onClick={handleWhatsApp}
        className="flex-1 h-[44px] rounded-xl flex items-center justify-center gap-1.5 font-bold text-[13px] transition-all shadow-sm bg-whatsapp text-white hover:bg-whatsapp-hover active:scale-95"
      >
        <Whatsapp size={16} variant="Bold" />
        <span>{isArabic ? 'واتساب' : 'WhatsApp'}</span>
      </button>
      
      <button
        onClick={handleCall}
        className="flex-1 h-[44px] rounded-xl flex items-center justify-center gap-1.5 font-bold text-[13px] transition-all shadow-sm bg-primary text-white hover:bg-primary/90 active:scale-95"
      >
        <Call size={16} variant="Bold" />
        <span>{isArabic ? 'اتصال' : 'Call'}</span>
      </button>
    </div>
  );
};
