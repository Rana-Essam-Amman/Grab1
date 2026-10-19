import { useState, useMemo, useCallback } from 'react';
import { devAssertMarketIsolation } from '../helpers/devAssertMarketIsolation';
import { useUI } from '@/hooks/useUI';
import { useListings } from '@/hooks/useListings';
import { useChat } from '@/hooks/useChat';
import { useAuth } from '@/hooks/useAuth';
import { isValidMarket } from '@/shared/lib/marketGate';
import { FormattedPhone } from '@/shared/lib/phoneFormatting';
import { useListingDerivedData, getWhatsAppUrl } from '../helpers/listingDerivedData';
import { composeIntentMessage, WhatsAppIntent } from '../helpers/whatsappIntents';
import { Listing } from '@/types';
import { ScreenType } from '@/store/ui.slice';
import { showChatUnavailable, showChatOpenFailed, showChatCrossMarket } from '../helpers/chatErrorToast';
import { useListingDelete } from './useListingDelete';
import { useRevealPhone } from './useRevealPhone';

export interface UseListingDetailReturn {
  listing: Listing | null; activeCountry: string; isCountryMismatch: boolean;
  sanitizedLoc: { city: string; neighborhood: string }; locationText: string;
  mapUrl: string; displayCurrency: string; images: string[]; mapQuery: string;
  formattedPhone: FormattedPhone; activePhotoIdx: number; setActivePhotoIdx: (idx: number) => void;
  showShare: boolean; setShowShare: (v: boolean) => void; showReport: boolean; setShowReport: (v: boolean) => void; showWhatsAppSheet: boolean; setShowWhatsAppSheet: (v: boolean) => void;
  handleStartChat: () => void | Promise<void>; handleCall: () => void | Promise<void>; handleWhatsApp: () => void | Promise<void>;
  handleWhatsAppClick: () => void; handleWhatsAppIntent: (intent: WhatsAppIntent) => void;
  handleDelete: () => Promise<void>; handleEdit: () => void; handleSelectSeller: () => void; isAuthenticated: boolean; isDeleting: boolean;
  isOwner: boolean; isArabic: boolean; goBack: () => void; navigateTo: (screen: ScreenType) => void; isRevealingPhone: boolean;
}
export function useListingDetail(): UseListingDetailReturn {
  const { isArabic, goBack, selectedListingId, setSelectedListingId, setSelectedThreadId, setSelectedSellerPhone, navigateTo, browseCountryCode } = useUI();
  const { getListing } = useListings();
  const { openConversation } = useChat();
  const { authStatus, user } = useAuth();
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [showShare, setShowShare] = useState(false); const [showReport, setShowReport] = useState(false); const [showWhatsAppSheet, setShowWhatsAppSheet] = useState(false);
  const listing = selectedListingId ? getListing(selectedListingId) || null : null;
  const activeCountry = isValidMarket(browseCountryCode) ? browseCountryCode : 'JO';
  const isCountryMismatch = useMemo(() => Boolean(listing && listing.countryCode !== activeCountry), [listing, activeCountry]);
  devAssertMarketIsolation(listing, activeCountry);
  const derived = useListingDerivedData(listing, isArabic); const isAuthenticated = authStatus === 'authenticated';
  const { phone: revealedPhone, isRevealing: isRevealingPhone, revealPhone } = useRevealPhone(listing?.id, listing?.sellerPhone, isArabic, listing?.countryCode);
  const isOwner = useMemo(() => {
    if (!user || !listing) return false;
    if (user.id && listing.userId && user.id === listing.userId) return true;
    return !!(user.phone && listing.sellerPhone && user.phone === listing.sellerPhone);
  }, [user, listing]);

  const handleSelectSeller = useCallback(() => {
    if (!listing) return; const key = listing.userId || listing.sellerPhone; if (key) { setSelectedSellerPhone(key); navigateTo('seller-profile'); }
  }, [listing, setSelectedSellerPhone, navigateTo]);

  const handleStartChat = useCallback(async () => {
    if (!listing) return; if (authStatus === 'unauthenticated' || !user?.id) { navigateTo('login'); return; }
    if (isOwner) return;
    if (!listing.userId) { showChatUnavailable(isArabic); return; }
    try {
      const conv = await openConversation({ listingId: listing.id, buyerId: user.id, sellerId: listing.userId, marketCode: listing.countryCode }, activeCountry);
      if (!conv) { showChatOpenFailed(isArabic); return; }
      setSelectedThreadId(conv.id); navigateTo('thread');
    } catch (err) {
      if ((err instanceof Error ? err.message : '').includes('Cross-market')) showChatCrossMarket(isArabic);
      else showChatOpenFailed(isArabic);
    }
  }, [listing, authStatus, navigateTo, openConversation, setSelectedThreadId, user, activeCountry, isOwner, isArabic]);

  const handleCall = useCallback(async () => {
    const num = await revealPhone();
    if (num) window.location.href = `tel:${num}`;
  }, [revealPhone]);

  const handleWhatsApp = useCallback(async () => {
    const num = await revealPhone();
    if (num && listing) window.open(getWhatsAppUrl({ countryCode: listing.countryCode, dialNumber: num, listingTitle: listing.title, isArabic }), '_blank');
  }, [revealPhone, listing, isArabic]);

  const handleWhatsAppClick = useCallback(() => { if (listing) setShowWhatsAppSheet(true); }, [listing]);

  const handleWhatsAppIntent = useCallback(async (intent: WhatsAppIntent) => {
    if (!listing) return;
    setShowWhatsAppSheet(false);
    const num = await revealPhone();
    if (num) window.open(getWhatsAppUrl({ countryCode: listing.countryCode, dialNumber: num, listingTitle: listing.title, isArabic, customMessage: composeIntentMessage(intent.body, listing, isArabic) }), '_blank');
  }, [listing, isArabic, revealPhone]);

  const { handleDelete: handleDeleteRaw, isDeleting } = useListingDelete(isArabic);
  const handleDelete = useCallback(async () => { if (listing) await handleDeleteRaw(listing.id, goBack); }, [listing, handleDeleteRaw, goBack]);
  const handleEdit = useCallback(() => { if (listing) { setSelectedListingId(listing.id); navigateTo('edit-post'); } }, [listing, setSelectedListingId, navigateTo]);

  return {
    listing, activeCountry, isCountryMismatch, ...derived, activePhotoIdx, setActivePhotoIdx,
    showShare, setShowShare, showReport, setShowReport, showWhatsAppSheet, setShowWhatsAppSheet,
    handleStartChat, handleCall, handleWhatsApp, handleWhatsAppClick, handleWhatsAppIntent,
    handleDelete, handleEdit, handleSelectSeller, isAuthenticated, isOwner, isArabic, goBack, navigateTo, isDeleting, isRevealingPhone,
  };
}
