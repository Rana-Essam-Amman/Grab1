export type MarketCode = 'JO' | 'SA' | 'LB' | 'PS' | 'SY';

export interface ChatMessageRow {
  readonly id: string;
  readonly conversation_id: string;
  readonly sender_id: string;
  readonly text: string;
  readonly deleted_at: string | null;
  readonly read_at: string | null;
  readonly created_at: string;
}

export interface ConversationRow {
  readonly id: string;
  readonly listing_id: string;
  readonly buyer_id: string;
  readonly seller_id: string;
  readonly market_code: MarketCode;
  readonly created_at: string;
  readonly updated_at: string;
}

export interface ChatMessage {
  readonly id: string;
  readonly conversationId: string;
  readonly senderId: string;
  readonly text: string;
  readonly isDeleted: boolean;
  readonly readAt: string | null;
  readonly createdAt: string;
}

export interface Conversation {
  readonly id: string;
  readonly listingId: string;
  readonly buyerId: string;
  readonly sellerId: string;
  readonly marketCode: MarketCode;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface CreateConversationInput {
  readonly listingId: string;
  readonly buyerId: string;
  readonly sellerId: string;
  readonly marketCode: MarketCode;
}

/** Listing snapshot for enriched conversation views. */
export interface ListingSnapshot {
  readonly id: string;
  readonly title: string;
  readonly imageUrl: string;
  readonly sellerPhone: string;
  readonly countryCode: MarketCode;
}

/** Conversation + joined listing data for UI rendering. */
export interface ConversationView extends Conversation {
  readonly listing: ListingSnapshot | null;
}
