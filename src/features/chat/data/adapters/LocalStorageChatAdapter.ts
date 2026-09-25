import type { Conversation, ChatMessage } from '../../domain';
import type { ChatRepository } from '../repositories/ChatRepository';
import { globalStorage } from '@/shared/lib/marketStorage';

const STORAGE_KEY = 'chat_conversations_v1';

/**
 * LocalStorage implementation of ChatRepository.
 * Safe for Sandbox / offline / SSR environments.
 */
export class LocalStorageChatAdapter implements ChatRepository {
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
      const parsed = globalStorage().get<unknown>(STORAGE_KEY);
      if (!Array.isArray(parsed)) return [];
      return parsed as Conversation[];
    } catch {
      return [];
    }
  }

  private _write(conversations: Conversation[]): void {
    globalStorage().set(STORAGE_KEY, conversations);
  }
}
