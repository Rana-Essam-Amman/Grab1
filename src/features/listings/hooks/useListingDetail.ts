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

export interface UseListingDetailReturn {
  listing: Listing | null; activeCountry: string; isCountryMismatch: boolean;
  sanitizedLoc: { city: string; neighborhood: string }; locationText: string;
  mapUrl: string; displayCurrency: string; images: string[]; mapQuery: string;
  formattedPhone: FormattedPhone; activePhotoIdx: number; setActivePhotoIdx: (idx: number) => void;
  showShare: boolean; setShowShare: (v: boolean) => void; showReport: boolean; setShowReport: (v: boolean) => void;
  showWhatsAppSheet: boolean; setShowWhatsAppSheet: (v: boolean) => void;
  handleStartChat: () => void | Promise<void>; handleCall: () => void; handleWhatsApp: () => void;
  handleWhatsAppClick: () => void; handleWhatsAppIntent: (intent: WhatsAppIntent) => void;
  handleDelete: () => Promise<void>; handleSelectSeller: () => void; isAuthenticated: boolean;
  isOwner: boolean; isArabic: boolean; goBack: () => void; navigateTo: (screen: ScreenType) => void;
}

export function useListingDetail(): UseListingDetailReturn {
  const { isArabic, goBack, selectedListingId, setSelectedThreadId, setSelectedSellerPhone, navigateTo, browseCountryCode } = useUI();
  const { getListing, deleteListing } = useListings();
  const { openConversation } = useChat();
  const { authStatus, user } = useAuth();
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [showShare, setShowShare] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showWhatsAppSheet, setShowWhatsAppSheet] = useState(false);

  const listing = selectedListingId ? getListing(selectedListingId) || null : null;
  const activeCountry = authStatus === 'authenticated' && user?.countryCode && isValidMarket(user.countryCode) ? user.countryCode : browseCountryCode;
  const isCountryMismatch = useMemo(() => Boolean(listing && listing.countryCode !== activeCountry), [listing, activeCountry]);

  devAssertMarketIsolation(listing, activeCountry);
  const derived = useListingDerivedData(listing, isArabic);
  const isAuthenticated = authStatus === 'authenticated';
  const isOwner = Boolean(user?.phone && listing?.sellerPhone === user.phone);
  const handleSelectSeller = useCallback(() => {
    if (listing?.sellerPhone) { setSelectedSellerPhone(listing.sellerPhone); navigateTo('seller-profile'); }
  }, [listing, setSelectedSellerPhone, navigateTo]);

  const handleStartChat = useCallback(async () => {
    if (!listing || isCountryMismatch || authStatus === 'unauthenticated' || !user?.id || !listing.userId || listing.userId === user.id) {
      if (authStatus === 'unauthenticated') navigateTo('login');
      return;
    }
    try {
      const conv = await openConversation({ listingId: listing.id, buyerId: user.id, sellerId: listing.userId, marketCode: listing.countryCode }, activeCountry);
      if (conv) { setSelectedThreadId(conv.id); navigateTo('thread'); }
    } catch (error) { console.error('[Chat] Failed:', error); }
  }, [listing, isCountryMismatch, authStatus, navigateTo, openConversation, setSelectedThreadId, user, activeCountry]);

  const handleCall = useCallback(() => {
    if (!listing || isCountryMismatch) return;
    if (authStatus === 'unauthenticated') { navigateTo('login'); return; }
    window.location.href = `tel:${derived.formattedPhone.dialNumber}`;
  }, [listing, isCountryMismatch, authStatus, navigateTo, derived.formattedPhone.dialNumber]);

  const handleWhatsApp = useCallback(() => {
    if (!listing || isCountryMismatch) return;
    if (authStatus === 'unauthenticated') { navigateTo('login'); return; }
    window.open(getWhatsAppUrl({ countryCode: listing.countryCode, dialNumber: derived.formattedPhone.dialNumber, listingTitle: listing.title }), '_blank');
  }, [listing, isCountryMismatch, authStatus, navigateTo, derived.formattedPhone.dialNumber]);

  const handleWhatsAppClick = useCallback(() => {
    if (!listing || isCountryMismatch) return;
    if (authStatus === 'unauthenticated') { navigateTo('login'); return; }
    if (!listing.sellerPhone) { navigateTo('login'); return; }
    setShowWhatsAppSheet(true);
  }, [listing, isCountryMismatch, authStatus, navigateTo]);

  const handleWhatsAppIntent = useCallback((intent: WhatsAppIntent) => {
    if (!listing) return;
    setShowWhatsAppSheet(false);
    window.open(getWhatsAppUrl({ countryCode: listing.countryCode, dialNumber: derived.formattedPhone.dialNumber, listingTitle: listing.title, customMessage: composeIntentMessage(intent.body, listing) }), '_blank');
  }, [listing, derived.formattedPhone.dialNumber]);

  const handleDelete = useCallback(async () => {
    if (!listing) return;
    if ((await deleteListing(listing.id)).success) goBack();
  }, [listing, deleteListing, goBack]);

  return {
    listing, activeCountry, isCountryMismatch, ...derived, activePhotoIdx, setActivePhotoIdx,
    showShare, setShowShare, showReport, setShowReport, showWhatsAppSheet, setShowWhatsAppSheet,
    handleStartChat, handleCall, handleWhatsApp, handleWhatsAppClick, handleWhatsAppIntent,
    handleDelete, handleSelectSeller, isAuthenticated, isOwner, isArabic, goBack, navigateTo,
  };
}
