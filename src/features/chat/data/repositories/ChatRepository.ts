import type { Conversation, ChatMessage } from '../../domain';

/**
 * Abstract repository contract for chat persistence.
 * Implementations (localStorage, Firestore) live in ../adapters/.
 */
export interface ChatRepository {
  getAll(): Promise<Conversation[]>;
  getById(id: string): Promise<Conversation | null>;
  getByListingId(listingId: string): Promise<Conversation | null>;

  create(conversation: Conversation): Promise<void>;
  appendMessage(
    conversationId: string,
    message: ChatMessage,
  ): Promise<void>;

  delete(conversationId: string): Promise<void>;
}
