import { Conversation, Listing } from '@/types';

export const MAX_CHAT_MESSAGES = 6;

export interface ChatState {
  conversations: Conversation[];
  startOrOpenConversation: (listing: Listing, activeCountry?: string) => string;
  sendChatMessage: (threadId: string, text: string, activeCountry?: string) => void;
}

