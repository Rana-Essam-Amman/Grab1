// Chat public API — store, hooks, services, types.
//
// IMPORTANT: Do NOT re-export screens from this barrel.
// Screens are lazy-loaded by exact path in App.tsx (Rule #18).
// Do NOT re-export useChat (mocked via direct path in tests — Rule #18b).

// Store
export { useChatStore } from './store/chat.slice';
export { registerListingsGetter } from './store/chat.slice.deps';
export type { ChatState, PendingMessage } from './store/chat.slice.types';

// Hooks (not mocked directly)
export { useSupabaseChatSync } from './hooks/useSupabaseChatSync';
export { useOnlinePresence } from './hooks/useOnlinePresence';

// Services + types
export type {
  ChatMessage,
  ConversationView,
} from './services/chatService.types';

// Domain
export type { Conversation } from './domain/entities/Conversation';
