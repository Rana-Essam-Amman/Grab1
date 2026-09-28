import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useUI } from '@/hooks/useUI';
import { useChat } from '@/hooks/useChat';
import { useAuth } from '@/hooks/useAuth';
import { useListings } from '@/hooks/useListings';
import { getFormattedLocalPhone } from '@/shared/lib/phoneFormatting';
import { ThreadHeader } from '../components/ThreadHeader';
import { ThreadMessageFlow } from '../components/ThreadMessageFlow';
import { ThreadInputBar } from '../components/ThreadInputBar';

export const ThreadScreen: React.FC = () => {
  const { isArabic, goBack, selectedThreadId, setSelectedListingId, navigateTo, browseCountryCode } = useUI();
  const { conversations, sendChatMessage } = useChat();
  const { authStatus } = useAuth();

  // Redirect Guest/Visitor instantly
  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      navigateTo('login');
    }
  }, [authStatus, navigateTo]);

  const [inputText, setInputText] = useState('');
  const { getListing } = useListings();

  const thread = useMemo(
    () => conversations.find((c) => c.id === selectedThreadId),
    [conversations, selectedThreadId]
  );

  const listing = useMemo(
    () => (thread ? getListing(thread.listingId) : undefined),
    [thread, getListing]
  );

  const formattedPhone = useMemo(() => {
    if (!thread?.sellerPhone) return { dialNumber: '', displayFormatted: '' };
    return getFormattedLocalPhone(thread.sellerPhone, listing?.countryCode);
  }, [thread?.sellerPhone, listing?.countryCode]);

  // Strict anti-spam message limit constraint to save transaction costs
  const MAX_MESSAGES = 6;
  const isMessageLimitReached = useMemo(
    () => (thread ? thread.messages.length >= MAX_MESSAGES : false),
    [thread]
  );

  const handleSend = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!thread || isMessageLimitReached || !inputText.trim()) return;
    try {
      sendChatMessage(thread.id, inputText.trim(), browseCountryCode);
      setInputText('');
    } catch (error) {
      console.error('[Chat] Failed to send message:', error);
      setInputText('');
    }
  }, [thread, isMessageLimitReached, inputText, sendChatMessage, browseCountryCode]);

  const handleViewListing = useCallback(() => {
    if (thread) {
      setSelectedListingId(thread.listingId);
      navigateTo('listing-detail');
    }
  }, [thread, setSelectedListingId, navigateTo]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  }, []);

  const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    (e.target as HTMLImageElement).src =
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect width="40" height="40" fill="%23E5E7EB"/></svg>';
  }, []);

  if (authStatus === 'unauthenticated') {
    return null;
  }

  if (!selectedThreadId || !thread) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-surface p-6">
        <p className="text-ink-soft text-center">
          {isArabic ? 'المحادثة غير متوفرة' : 'Conversation not available'}
        </p>
        <button
          onClick={() => navigateTo('messages')}
          className="px-6 py-3 rounded-xl bg-brand text-white font-medium"
        >
          {isArabic ? 'العودة للرسائل' : 'Back to Messages'}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-surface" dir={isArabic ? "rtl" : "ltr"}>
      <ThreadHeader
        isArabic={isArabic}
        goBack={goBack}
        handleViewListing={handleViewListing}
        imageUrl={thread.imageUrl}
        title={thread.title}
        handleImageError={handleImageError}
        dialNumber={formattedPhone.dialNumber}
      />

      <ThreadMessageFlow
        messages={thread.messages}
        isArabic={isArabic}
      />

      <ThreadInputBar
        isMessageLimitReached={isMessageLimitReached}
        isArabic={isArabic}
        formattedPhone={formattedPhone}
        inputText={inputText}
        handleInputChange={handleInputChange}
        handleSend={handleSend}
      />
    </div>
  );
};
