import type { ChatMessage } from './ChatMessage';

export interface Conversation {
  readonly id: string;
  readonly listingId: string;
  readonly title: string;
  readonly imageUrl: string;
  readonly sellerPhone: string;
  readonly messages: readonly ChatMessage[];
}
