import { useState, useMemo, useCallback } from 'react';
import { useUI } from '@/hooks/useUI';
import { useListings } from '@/hooks/useListings';
import { useChat } from '@/hooks/useChat';
import { useAuth } from '@/hooks/useAuth';
import { isValidMarket } from '@/shared/lib/marketGate';
import { FormattedPhone } from '../helpers/phoneFormatting';
import { useListingDerivedData, getWhatsAppUrl } from '../helpers/listingDerivedData';
import { Listing } from '@/types';
import { ScreenType } from '@/store/ui.slice';

export interface UseListingDetailReturn {
  listing: Listing | null;
  activeCountry: string;
  isCountryMismatch: boolean;
  sanitizedLoc: { city: string; neighborhood: string };
  locationText: string;
  mapUrl: string;
  displayCurrency: string;
  images: string[];
  mapQuery: string;
  formattedPhone: FormattedPhone;
  activePhotoIdx: number;
  setActivePhotoIdx: (idx: number) => void;
  showShare: boolean;
  setShowShare: (v: boolean) => void;
  showReport: boolean;
  setShowReport: (v: boolean) => void;
  handleStartChat: () => void;
  handleCall: () => void;
  handleWhatsApp: () => void;
  handleDelete: () => void;
  handleSelectSeller: () => void;
  isAuthenticated: boolean;
  isOwner: boolean;
  isArabic: boolean;
  goBack: () => void;
  navigateTo: (screen: ScreenType) => void;
}

export function useListingDetail(): UseListingDetailReturn {
  const { isArabic, goBack, selectedListingId, setSelectedThreadId, setSelectedSellerPhone, navigateTo, browseCountryCode } = useUI();
  const { getListing, deleteListing } = useListings();
  const { startOrOpenConversation } = useChat();
  const { authStatus, user } = useAuth();
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [showShare, setShowShare] = useState(false);
  const [showReport, setShowReport] = useState(false);

  const listing = selectedListingId ? getListing(selectedListingId) || null : null;
  const activeCountry = authStatus === 'authenticated' && user?.countryCode && isValidMarket(user.countryCode) ? user.countryCode : browseCountryCode;
  const isCountryMismatch = useMemo(() => Boolean(listing && listing.countryCode !== activeCountry), [listing, activeCountry]);
  const derived = useListingDerivedData(listing, isArabic);
  const isAuthenticated = authStatus === 'authenticated';
  const isOwner = Boolean(user?.phone && listing?.sellerPhone === user.phone);
  const handleSelectSeller = useCallback(() => {
    if (listing?.sellerPhone) {
      setSelectedSellerPhone(listing.sellerPhone);
      navigateTo('seller-profile');
    }
  }, [listing, setSelectedSellerPhone, navigateTo]);

  const handleStartChat = useCallback(() => {
    if (!listing || isCountryMismatch) return;
    if (authStatus === 'unauthenticated') { navigateTo('login'); return; }
    try {
      const threadId = startOrOpenConversation(listing);
      setSelectedThreadId(threadId);
      navigateTo('thread');
    } catch (error) {
      console.error('[Chat] Failed to start conversation:', error);
    }
  }, [listing, isCountryMismatch, authStatus, navigateTo, startOrOpenConversation, setSelectedThreadId]);

  const handleCall = useCallback(() => {
    if (!listing || isCountryMismatch) return;
    if (authStatus === 'unauthenticated') { navigateTo('login'); return; }
    window.location.href = `tel:${derived.formattedPhone.dialNumber}`;
  }, [listing, isCountryMismatch, authStatus, navigateTo, derived.formattedPhone.dialNumber]);

  const handleWhatsApp = useCallback(() => {
    if (!listing || isCountryMismatch) return;
    if (authStatus === 'unauthenticated') { navigateTo('login'); return; }
    const url = getWhatsAppUrl({ countryCode: listing.countryCode, dialNumber: derived.formattedPhone.dialNumber, listingTitle: listing.title });
    window.open(url, '_blank');
  }, [listing, isCountryMismatch, authStatus, navigateTo, derived.formattedPhone.dialNumber]);

  const handleDelete = useCallback(() => {
    if (!listing) return;
    deleteListing(listing.id);
    goBack();
  }, [listing, deleteListing, goBack]);

  return {
    listing, activeCountry, isCountryMismatch, ...derived, activePhotoIdx, setActivePhotoIdx, 
    showShare, setShowShare, showReport, setShowReport, handleStartChat, handleCall, 
    handleWhatsApp, handleDelete, handleSelectSeller, isAuthenticated, isOwner, isArabic, goBack, navigateTo,
  };
}
