import { useState, useMemo, useCallback } from 'react';
import { devAssertMarketIsolation } from '../helpers/devAssertMarketIsolation';
import { useUI } from '@/hooks/useUI';
import { useListings } from '@/hooks/useListings';
import { useChat } from '@/hooks/useChat';
import { useAuth } from '@/hooks/useAuth';
import { isValidMarket } from '@/shared/lib/marketGate';
import { useListingDerivedData, getWhatsAppUrl } from '../helpers/listingDerivedData';
import { WhatsAppIntent, composeIntentMessage } from '../helpers/whatsappIntents';
import { showChatUnavailable, showChatOpenFailed, showChatCrossMarket } from '../helpers/chatErrorToast';
import { useListingDelete } from './useListingDelete';
import { useRevealPhone } from './useRevealPhone';
import { useFetchMissingListing } from './useFetchMissingListing';
import type { UseListingDetailReturn } from './useListingDetail.types';

export function useListingDetail(): UseListingDetailReturn {
  const { isArabic, goBack, selectedListingId, setSelectedListingId, setSelectedThreadId, setSelectedSellerPhone, navigateTo, browseCountryCode } = useUI();
  const { getListing } = useListings();
  const { openConversation } = useChat();
  const { authStatus, user, isAnonymous } = useAuth();
  
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [showShare, setShowShare] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showWhatsAppSheet, setShowWhatsAppSheet] = useState(false);
  
  const localListing = selectedListingId ? getListing(selectedListingId) || null : null;
  const fetchedListing = useFetchMissingListing(selectedListingId, localListing);
  const listing = localListing || fetchedListing;

  const activeCountry = isValidMarket(browseCountryCode) ? browseCountryCode : 'JO';
  const isCountryMismatch = useMemo(() => Boolean(listing && listing.countryCode !== activeCountry), [listing, activeCountry]);
  devAssertMarketIsolation(listing, activeCountry);
  
  const derived = useListingDerivedData(listing, isArabic);
  const isAuthenticated = authStatus === 'authenticated';
  const { revealPhone, isRevealing: isRevealingPhone } = useRevealPhone(listing?.id, listing?.sellerPhone, isArabic, listing?.countryCode);

  const handleCall = useCallback(async () => {
    const num = await revealPhone();
    if (num) window.location.href = `tel:${num}`;
  }, [revealPhone]);

  const handleWhatsAppDirect = useCallback(async (intent?: WhatsAppIntent) => {
    const num = await revealPhone();
    if (num && listing) {
      const customMessage = intent ? composeIntentMessage(intent.body, listing, isArabic) : undefined;
      window.open(getWhatsAppUrl({ countryCode: listing.countryCode, dialNumber: num, listingTitle: listing.title, isArabic, customMessage }), '_blank');
    }
  }, [revealPhone, listing, isArabic]);

  const isOwner = useMemo(() => {
    if (!user || !listing) return false;
    if (user.id && listing.userId && user.id === listing.userId) return true;
    return !!(user.phone && listing.sellerPhone && user.phone === listing.sellerPhone);
  }, [user, listing]);

  const handleSelectSeller = useCallback(() => {
    if (!listing) return;
    const key = listing.userId || listing.sellerPhone;
    if (key) { setSelectedSellerPhone(key); navigateTo('seller-profile'); }
  }, [listing, setSelectedSellerPhone, navigateTo]);

  const handleStartChat = useCallback(async () => {
    if (!listing) return;
    if (authStatus === 'unauthenticated' || !user?.id || isAnonymous) {
      localStorage.setItem('pending_chat_listing', listing.id);
      navigateTo('login');
      return;
    }
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
  }, [listing, authStatus, navigateTo, openConversation, setSelectedThreadId, user, activeCountry, isOwner, isArabic, isAnonymous]);

  const handleWhatsApp = useCallback(() => handleWhatsAppDirect(), [handleWhatsAppDirect]);
  const handleWhatsAppClick = useCallback(() => { if (listing) setShowWhatsAppSheet(true); }, [listing]);
  const handleWhatsAppIntent = useCallback(async (intent: WhatsAppIntent) => { setShowWhatsAppSheet(false); await handleWhatsAppDirect(intent); }, [handleWhatsAppDirect]);

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
