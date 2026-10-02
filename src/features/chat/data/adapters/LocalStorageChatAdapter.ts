import type { Conversation, ChatMessage } from '../../domain';
import type { ChatRepository } from '../repositories/ChatRepository';
import { globalStorage, marketStorage } from '@/shared/lib/marketStorage';
import { z } from 'zod';
import type { MarketCode } from '@/data/markets/types';
import { isValidMarketCode } from '@/data/markets/config';

const STORAGE_KEY = 'chat_conversations_v1';

const CHAT_MESSAGE_SCHEMA = z.object({
  id: z.string(),
  text: z.string(),
  fromBuyer: z.boolean(),
  timestamp: z.string(),
});

const CONVERSATION_SCHEMA = z.object({
  id: z.string(),
  listingId: z.string(),
  title: z.string(),
  imageUrl: z.string(),
  sellerPhone: z.string(),
  messages: z.array(CHAT_MESSAGE_SCHEMA),
});

const CONVERSATIONS_ARRAY_SCHEMA = z.array(CONVERSATION_SCHEMA);

/**
 * Chats are MARKET-SCOPED. A conversation created in JO must never be
 * readable from LB. Market is resolved lazily on every operation.
 */
export class LocalStorageChatAdapter implements ChatRepository {
  constructor(private readonly resolveMarket: () => string | undefined = () => undefined) {}

  private getStore() {
    const m = this.resolveMarket();
    return isValidMarketCode(m) ? marketStorage(m as MarketCode) : globalStorage();
  }

  async getAll(): Promise<Conversation[]> {
    return this._read();
  }

  async getById(id: string): Promise<Conversation | null> {
    const all = await this._read();
    return all.find((c) => c.id === id) ?? null;
  }

  async getByListingId(listingId: string): Promise<Conversation | null> {
    const all = await this._read();
    return all.find((c) => c.listingId === listingId) ?? null;
  }

  async create(conversation: Conversation): Promise<void> {
    const all = await this._read();
    const exists = all.some((c) => c.id === conversation.id);
    if (exists) return;
    const updated = [conversation, ...all];
    this._write(updated);
  }

  async appendMessage(
    conversationId: string,
    message: ChatMessage,
  ): Promise<void> {
    const all = await this._read();
    const updated = all.map((c) =>
      c.id === conversationId
        ? { ...c, messages: [...c.messages, message] }
        : c,
    );
    this._write(updated);
  }

  async delete(conversationId: string): Promise<void> {
    const all = await this._read();
    this._write(all.filter((c) => c.id !== conversationId));
  }

  private async _read(): Promise<Conversation[]> {
    try {
      const parsed = this.getStore().get<unknown>(STORAGE_KEY);
      const result = CONVERSATIONS_ARRAY_SCHEMA.safeParse(parsed);
      return result.success ? result.data : [];
    } catch {
      return [];
    }
  }

  private _write(conversations: Conversation[]): void {
    this.getStore().set(STORAGE_KEY, conversations);
  }
}
