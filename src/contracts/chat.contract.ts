import type { Conversation, Listing } from '@/types';

export interface ChatStoreContract {
  conversations: Conversation[];
  startOrOpenConversation: (listing: Listing, activeCountry?: string) => string;
  sendChatMessage: (threadId: string, text: string) => void;
}
