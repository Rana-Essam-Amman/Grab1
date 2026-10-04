import { supabase } from '@/shared/lib/supabase';
import type {
  ChatMessage,
  ChatMessageRow,
  Conversation,
  ConversationRow,
  ConversationView,
  ListingSnapshot,
  MarketCode,
} from './chatService.types';

export function rowToMessage(row: ChatMessageRow): ChatMessage {
  return {
    id: row.id,
    conversationId: row.conversation_id,
    senderId: row.sender_id,
    text: row.deleted_at ? '' : row.text,
    isDeleted: row.deleted_at !== null,
    readAt: row.read_at,
    createdAt: row.created_at,
  };
}

export function rowToConversation(row: ConversationRow): Conversation {
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

/**
 * Fetch listing snapshots for the given ids. Missing ids are omitted.
 * Uses select with .in() — single query, no full-table scan.
 */
export async function getListingsByIds(
  ids: readonly string[]
): Promise<{ data: Map<string, ListingSnapshot>; error: string | null }> {
  const map = new Map<string, ListingSnapshot>();
  if (ids.length === 0) return { data: map, error: null };
  try {
    const { data, error } = await supabase
      .from('listings')
      .select('id, title, images, seller_phone, country_code')
      .in('id', Array.from(ids));
    if (error) return { data: map, error: error.message };
    (data || []).forEach((row: { id: string; title: string; images: string[] | null; seller_phone: string | null; country_code: MarketCode }) => {
      map.set(row.id, {
        id: row.id,
        title: row.title,
        imageUrl: row.images?.[0] ?? '',
        sellerPhone: row.seller_phone ?? '',
        countryCode: row.country_code,
      });
    });
    return { data: map, error: null };
  } catch (err) {
    return { data: map, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

/** Merge conversations with their listing snapshots. */
export function toViews(
  convs: readonly Conversation[],
  listingMap: Map<string, ListingSnapshot>
): ConversationView[] {
  return convs.map((c) => ({
    ...c,
    listing: listingMap.get(c.listingId) ?? null,
  }));
}
