import type { ChatMessage, ConversationView } from '../services/chatService.types';

/**
 * A message the user has sent, held locally until the server confirms it.
 * Identified by tempId; replaced by the real row when realtime fires.
 */
export interface PendingMessage {
  readonly tempId: string;
  readonly text: string;
  readonly createdAt: string;
}

/**
 * Chat store state.
 *
 * Invariants:
 * - `messagesByConversation[id]` is always sorted ascending by createdAt.
 * - `pendingByConversation[id]` is always sorted ascending by createdAt.
 * - `cursorByConversation[id]` is null when no more pages are available.
 */
export interface ChatState {
  conversations: ConversationView[];
  messagesByConversation: Record<string, ChatMessage[]>;
  pendingByConversation: Record<string, PendingMessage[]>;
  cursorByConversation: Record<string, string | null>;
  loadingConversations: boolean;
  loadingByConversation: Record<string, boolean>;
  typingByConversation: Record<string, boolean>;
  error: string | null;
}
