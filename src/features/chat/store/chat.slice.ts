import { create } from 'zustand';
import type { ChatState } from './chat.slice.types';

/**
 * Pure state container for chat. No async, no side effects.
 *
 * All mutations happen via `useChatStore.setState` from outside actions
 * (chat.slice.actions.load.ts / chat.slice.actions.mutate.ts). This keeps
 * the store trivially testable and lets actions orchestrate service calls
 * without coupling to React.
 */
export const useChatStore = create<ChatState>(() => ({
  conversations: [],
  messagesByConversation: {},
  pendingByConversation: {},
  cursorByConversation: {},
  loadingConversations: false,
  loadingByConversation: {},
  error: null,
}));
