import { supabase } from '@/shared/lib/supabase';
import type { Conversation, ConversationRow } from './chatService.types';

type EventType = 'INSERT' | 'UPDATE' | 'DELETE';
type ChangeHandler = (payload: {
  eventType: EventType;
  conversation: Conversation | null;
}) => void;

export interface ConversationSubscription {
  readonly unsubscribe: () => void;
}

function toConversation(row: ConversationRow): Conversation {
  return {
    id: row.id,
    listingId: row.listing_id,
    buyerId: row.buyer_id,
    sellerId: row.seller_id,
    marketCode: row.market_code,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/** Subscribe through separate buyer and seller filters. */
export function subscribeToUserConversations(
  userId: string,
  onChange: ChangeHandler
): ConversationSubscription {
  const seenByChannel = [new Set<string>(), new Set<string>()];
  const lastEventVersion = new Map<string, string>();
  const channels = [
    { role: 'buyer', filter: `buyer_id=eq.${userId}` },
    { role: 'seller', filter: `seller_id=eq.${userId}` },
  ].map(({ role, filter }, index) =>
    supabase
      .channel(`user-conversations:${userId}:${role}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'conversations', filter },
        (payload) => {
          const isDelete = payload.eventType === 'DELETE';
          const row = (isDelete ? payload.old : payload.new) as
            | ConversationRow
            | null;
          if (!row?.id) return;
          if (row.buyer_id !== userId && row.seller_id !== userId) return;

          const seen = seenByChannel[index];
          if (isDelete) {
            if (!seen.has(row.id)) return;
          } else {
            seen.add(row.id);
          }

          const eventType: EventType =
            payload.eventType === 'INSERT' ||
            payload.eventType === 'UPDATE' ||
            payload.eventType === 'DELETE'
              ? payload.eventType
              : 'INSERT';
          const version = row.updated_at ?? '';
          const dedupKey = `${eventType}:${row.id}`;
          if (lastEventVersion.get(dedupKey) === version) return;
          lastEventVersion.set(dedupKey, version);

          if (isDelete) {
            seen.delete(row.id);
            onChange({ eventType: 'DELETE', conversation: null });
          } else {
            onChange({ eventType, conversation: toConversation(row) });
          }
        }
      )
      .subscribe()
  );

  return {
    unsubscribe: () => {
      channels.forEach((channel) => {
        void supabase.removeChannel(channel);
      });
    },
  };
}
