import { create } from 'zustand';
import { Conversation, Listing } from '@/types';
import { getListingsSnapshot } from './chat.slice.deps';
import { ChatState, MAX_CHAT_MESSAGES } from './chat.slice.types';
import { initialConversations } from './chat.slice.helpers';
import type { ChatRepository } from '../data/repositories/ChatRepository';
import { LocalStorageChatAdapter } from '../data/adapters/LocalStorageChatAdapter';
import { getBrowseCountryCode } from '@/shared/store-getters/ui.getter';

export type { ChatState };

const chatRepository: ChatRepository = new LocalStorageChatAdapter(() => getBrowseCountryCode());

export const useChatStore = create<ChatState>()((set, get) => ({
  conversations: initialConversations,

  startOrOpenConversation: (listing: Listing, activeCountry?: string) => {
    if (activeCountry && listing.countryCode && listing.countryCode !== activeCountry) {
      throw new Error(
        `Access Denied: Cross-market chat handshakes are strictly forbidden.`
      );
    }

    const { conversations } = get();
    const existing = conversations.find((c) => c.listingId === listing.id);
    if (existing) return existing.id;

    const newThread: Conversation = {
      id: `thread-${crypto.randomUUID()}`,
      listingId: listing.id,
      title: listing.title,
      imageUrl: listing.imageUrl,
      sellerPhone: listing.sellerPhone,
      messages: [],
    };

    set({ conversations: [newThread, ...conversations] });
    chatRepository.create(newThread).catch(console.error);

    return newThread.id;
  },

  sendChatMessage: (threadId: string, text: string, activeCountry?: string) => {
    const { conversations } = get();
    const thread = conversations.find((c) => c.id === threadId);
    if (!thread) return;
    if (thread.messages.length >= MAX_CHAT_MESSAGES) return;

    if (activeCountry && thread.listingId) {
      const listings = getListingsSnapshot();
      const listing = listings.find((l) => l.id === thread.listingId);
      if (listing && listing.countryCode && listing.countryCode !== activeCountry) {
        return;
      }
    }

    const message = {
      id: `m-${crypto.randomUUID()}`,
      text,
      fromBuyer: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newConversations = conversations.map((c) =>
      c.id === threadId
        ? { ...c, messages: [...c.messages, message] }
        : c
    );

    set({ conversations: newConversations });
    chatRepository.appendMessage(threadId, message).catch(console.error);
  },
}));

// Initial load
chatRepository.getAll().then((conversations) => {
  if (conversations && conversations.length > 0) {
    useChatStore.setState({ conversations: conversations as unknown as Conversation[] });
  }
});

