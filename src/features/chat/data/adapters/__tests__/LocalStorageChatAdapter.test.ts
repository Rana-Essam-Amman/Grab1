import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LocalStorageChatAdapter } from '../LocalStorageChatAdapter';
import type { Conversation } from '../../../domain';

describe('LocalStorageChatAdapter', () => {
  let adapter: LocalStorageChatAdapter;
  let storage: Record<string, string>;

  beforeEach(() => {
    storage = {};
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(
      (key: string) => storage[key] ?? null,
    );
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(
      (key: string, value: string) => { storage[key] = value; },
    );
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(
      (key: string) => { delete storage[key]; },
    );
    adapter = new LocalStorageChatAdapter();
  });

  const sampleConversation: Conversation = {
    id: 'thread-1',
    listingId: 'listing-1',
    title: 'Rolex Submariner',
    imageUrl: 'https://example.com/img.jpg',
    sellerPhone: '0791234567',
    messages: [],
  };

  it('returns empty array when no data exists', async () => {
    const all = await adapter.getAll();
    expect(all).toEqual([]);
  });

  it('creates and retrieves a conversation', async () => {
    await adapter.create(sampleConversation);
    const retrieved = await adapter.getById('thread-1');
    expect(retrieved?.title).toBe('Rolex Submariner');
  });

  it('returns null for missing conversation', async () => {
    const result = await adapter.getById('missing');
    expect(result).toBeNull();
  });

  it('finds conversation by listingId', async () => {
    await adapter.create(sampleConversation);
    const found = await adapter.getByListingId('listing-1');
    expect(found?.id).toBe('thread-1');
  });

  it('does not duplicate conversations on create', async () => {
    await adapter.create(sampleConversation);
    await adapter.create(sampleConversation);
    const all = await adapter.getAll();
    expect(all.length).toBe(1);
  });

  it('appends a message to an existing conversation', async () => {
    await adapter.create(sampleConversation);
    await adapter.appendMessage('thread-1', {
      id: 'm1',
      text: 'hello',
      fromBuyer: true,
      timestamp: '2026-09-16T12:00:00Z',
    });
    const conv = await adapter.getById('thread-1');
    expect(conv?.messages.length).toBe(1);
    expect(conv?.messages[0].text).toBe('hello');
  });

  it('deletes a conversation', async () => {
    await adapter.create(sampleConversation);
    await adapter.delete('thread-1');
    const all = await adapter.getAll();
    expect(all).toEqual([]);
  });

  it('handles corrupt storage gracefully', async () => {
    storage['chat_conversations_v1'] = 'not-valid-json';
    const all = await adapter.getAll();
    expect(all).toEqual([]);
  });
});
