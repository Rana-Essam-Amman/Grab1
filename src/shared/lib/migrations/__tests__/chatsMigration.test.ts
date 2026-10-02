import { describe, it, expect, beforeEach } from 'vitest';
import { migrateChatsToMarket } from '../chatsMigration';
import { scopedKey } from '@/data/markets/storage';

describe('Chats migration — global → market-scoped', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('no-op when no legacy data exists', () => {
    const r = migrateChatsToMarket('JO');
    expect(r.migrated).toBe(false);
    expect(r.reason).toBe('no-legacy-data');
  });

  it('migrates legacy conversations to scoped key', () => {
    const chats = JSON.stringify([{ id: 'c1', listingId: 'l1', messages: [] }]);
    localStorage.setItem('catch_chat_conversations_v1', chats);

    const r = migrateChatsToMarket('JO');
    expect(r.migrated).toBe(true);
    expect(localStorage.getItem(scopedKey('JO', 'chat_conversations_v1'))).toBe(chats);
    expect(localStorage.getItem('catch_chat_conversations_v1')).toBeNull();
  });

  it('rejects invalid market codes', () => {
    localStorage.setItem('catch_chat_conversations_v1', '[]');
    const r = migrateChatsToMarket('XX');
    expect(r.migrated).toBe(false);
    expect(r.reason).toBe('invalid-market');
    expect(localStorage.getItem('catch_chat_conversations_v1')).toBe('[]');
  });

  it('is idempotent', () => {
    localStorage.setItem('catch_chat_conversations_v1', '[]');
    migrateChatsToMarket('SA');
    const r2 = migrateChatsToMarket('SA');
    expect(r2.migrated).toBe(false);
    expect(r2.reason).toBe('already-migrated');
  });

  it('preserves conversations byte-for-byte', () => {
    const chats = '[{"id":"c1","text":"مرحبا"}]';
    localStorage.setItem('catch_chat_conversations_v1', chats);
    migrateChatsToMarket('LB');
    expect(localStorage.getItem(scopedKey('LB', 'chat_conversations_v1'))).toBe(chats);
  });
});
