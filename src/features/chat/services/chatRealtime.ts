import { supabase } from '@/shared/lib/supabase';
import type { ChatMessage, ChatMessageRow, Conversation, ConversationRow } from './chatService.types';

function rowToMessage(row: ChatMessageRow): ChatMessage {
  return {
    id: row.id,
    conversationId: row.conversation_id,
    senderId: row.sender_id,
    text: row.deleted_at ? '' : row.text,
    isDeleted: row.deleted_at !== null,
    createdAt: row.created_at,
  };
}

export interface MessageSubscription {
  readonly unsubscribe: () => void;
}

/**
 * Subscribe to messages in a conversation. Fires on INSERT and UPDATE
 * (UPDATE carries soft-delete). Returns a handle to unsubscribe.
 */
export function subscribeToMessages(
  conversationId: string,
  onChange: (payload: { eventType: 'INSERT' | 'UPDATE'; message: ChatMessage }) => void
): MessageSubscription {
  const channel = supabase
    .channel(`messages:${conversationId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`,
      },
      (payload) => {
        const row = (payload.new || payload.old) as ChatMessageRow;
        if (!row?.id) return;
        onChange({
          eventType: payload.eventType === 'UPDATE' ? 'UPDATE' : 'INSERT',
          message: rowToMessage(row),
        });
      }
    )
    .subscribe();

  return {
    unsubscribe: () => {
      supabase.removeChannel(channel);
    },
  };
}

export interface ConversationSubscription {
  readonly unsubscribe: () => void;
}

/**
 * Subscribe to changes on a user's conversations (buyer OR seller).
 */
export function subscribeToUserConversations(
  userId: string,
  onChange: (payload: { eventType: 'INSERT' | 'UPDATE' | 'DELETE'; conversation: Conversation | null }) => void
): ConversationSubscription {
  const channel = supabase
    .channel(`user-conversations:${userId}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'conversations' },
      (payload) => {
        const row = payload.new as ConversationRow | null;
        if (payload.eventType === 'DELETE') {
          onChange({ eventType: 'DELETE', conversation: null });
          return;
        }
        if (!row || !row.id) return;
        if (row.buyer_id !== userId && row.seller_id !== userId) return;
        onChange({
          eventType: payload.eventType === 'UPDATE' ? 'UPDATE' : 'INSERT',
          conversation: {
            id: row.id,
            listingId: row.listing_id,
            buyerId: row.buyer_id,
            sellerId: row.seller_id,
            marketCode: row.market_code,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
          },
        });
      }
    )
    .subscribe();

  return {
    unsubscribe: () => {
      supabase.removeChannel(channel);
    },
  };
}
