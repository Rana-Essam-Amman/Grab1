import { Conversation, Listing } from '@/types';

export interface ChatState {
  conversations: Conversation[];
  startOrOpenConversation: (listing: Listing, activeCountry?: string) => string;
  sendChatMessage: (threadId: string, text: string, activeCountry?: string) => void;
}
