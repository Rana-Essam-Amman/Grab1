import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useUI } from '@/hooks/useUI';
import { useChat } from '@/hooks/useChat';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/features/auth/store/auth.slice';
import { useListings } from '@/hooks/useListings';
import {
  markMessagesRead as markMessagesReadAction,
} from '../store/chat.slice.actions.mutate';
import {
  loadInitialMessages as loadInitialMessagesAction,
} from '../store/chat.slice.actions.load';
import { subscribeToMessages } from '../services/chatRealtime';
import { applyMessageUpdate, reconcileConfirmedMessage } from '../store/chat.slice.actions.mutate';
import { getFormattedLocalPhone } from '@/shared/lib/phoneFormatting';
import { useTypingIndicator } from '../hooks/useTypingIndicator';
import { ThreadHeader } from '../components/ThreadHeader';
import { ThreadMessageFlow } from '../components/ThreadMessageFlow';
import { ThreadInputBar } from '../components/ThreadInputBar';

export const ThreadScreen: React.FC = () => {
  const { isArabic, goBack, selectedThreadId, setSelectedListingId, navigateTo, browseCountryCode } = useUI();
  const { conversations, sendChatMessage, isTyping } = useChat();
  const { authStatus } = useAuth();
  const currentUserId = useAuthStore((s) => s.user?.id ?? null);
  const { notifyTyping } = useTypingIndicator(selectedThreadId ?? null, currentUserId);

  useEffect(() => {
    if (authStatus === 'unauthenticated') navigateTo('login');
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

  const SOFT_LIMIT = 30;
  const isMessageLimitReached = useMemo(
    () => (thread ? thread.messages.length >= SOFT_LIMIT : false),
    [thread]
  );

  useEffect(() => {
    if (!selectedThreadId || authStatus !== 'authenticated') return;
    void loadInitialMessagesAction(selectedThreadId);
    const sub = subscribeToMessages(selectedThreadId, (payload) => {
      if (payload.eventType === 'INSERT') {
        reconcileConfirmedMessage(selectedThreadId, payload.message.senderId, payload.message);
      } else {
        applyMessageUpdate(selectedThreadId, payload.message);
      }
    });
    return () => sub.unsubscribe();
  }, [selectedThreadId, authStatus]);

  useEffect(() => {
    if (!selectedThreadId || authStatus !== 'authenticated') return;
    if (!thread) return;
    void markMessagesReadAction(selectedThreadId);
  }, [selectedThreadId, authStatus, thread]);

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
    if (e.target.value.trim().length > 0) notifyTyping();
  }, [notifyTyping]);

  const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    (e.target as HTMLImageElement).src =
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect width="40" height="40" fill="%23E5E7EB"/></svg>';
  }, []);

  if (authStatus === 'unauthenticated') return null;

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
        isTyping={selectedThreadId ? isTyping(selectedThreadId) : false}
      />
      <ThreadMessageFlow
        messages={thread.messages}
        isArabic={isArabic}
        isPending={(id) => id.startsWith('pending-')}
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
