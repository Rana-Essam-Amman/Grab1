import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockState = vi.hoisted(() => ({
  channels: [] as Array<{
    name: string;
    handlers: Array<{
      filter: Record<string, string>;
      callback: (payload: {
        eventType: string;
        new: unknown;
        old: unknown;
      }) => void;
    }>;
  }>,
  removeChannel: vi.fn(),
}));

vi.mock('@/shared/lib/supabase', () => ({
  supabase: {
    channel: (name: string) => {
      const channel = {
        name,
        handlers: [] as typeof mockState.channels[number]['handlers'],
        on: (
          _type: string,
          filter: Record<string, string>,
          callback: typeof mockState.channels[number]['handlers'][number]['callback']
        ) => {
          channel.handlers.push({ filter, callback });
          return channel;
        },
        subscribe: () => channel,
      };
      mockState.channels.push(channel);
      return channel;
    },
    removeChannel: mockState.removeChannel,
  },
}));

import { subscribeToUserConversations } from './userConversationRealtime';

const userId = 'user-a';

function row(overrides: Record<string, unknown> = {}) {
  return {
    id: 'conversation-1',
    listing_id: 'listing-1',
    buyer_id: userId,
    seller_id: 'user-b',
    market_code: 'JO',
    created_at: '2026-10-14T10:00:00Z',
    updated_at: '2026-10-14T10:01:00Z',
    ...overrides,
  };
}

function emit(
  channelIndex: number,
  eventType: string,
  value: Record<string, unknown>
) {
  const channel = mockState.channels[channelIndex];
  channel.handlers[0].callback({
    eventType,
    new: eventType === 'DELETE' ? null : value,
    old: eventType === 'DELETE' ? value : null,
  });
}

describe('subscribeToUserConversations', () => {
  beforeEach(() => {
    mockState.channels.length = 0;
    mockState.removeChannel.mockClear();
  });

  it('creates separate buyer and seller filtered subscriptions', () => {
    subscribeToUserConversations(userId, vi.fn());

    expect(mockState.channels).toHaveLength(2);
    expect(mockState.channels[0].name).toContain(':buyer');
    expect(mockState.channels[1].name).toContain(':seller');
    expect(mockState.channels[0].handlers[0].filter).toMatchObject({
      event: '*',
      schema: 'public',
      table: 'conversations',
      filter: `buyer_id=eq.${userId}`,
    });
    expect(mockState.channels[1].handlers[0].filter).toMatchObject({
      event: '*',
      schema: 'public',
      table: 'conversations',
      filter: `seller_id=eq.${userId}`,
    });
  });

  it('deduplicates identical events but allows a newer UPDATE', () => {
    const onChange = vi.fn();
    subscribeToUserConversations(userId, onChange);

    const initial = row();
    emit(0, 'UPDATE', initial);
    emit(1, 'UPDATE', initial);
    expect(onChange).toHaveBeenCalledTimes(1);

    emit(0, 'UPDATE', row({ updated_at: '2026-10-14T10:02:00Z' }));
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it('blocks rows that do not contain the subscribed user', () => {
    const onChange = vi.fn();
    subscribeToUserConversations(userId, onChange);

    emit(0, 'INSERT', row({ buyer_id: 'other-buyer', seller_id: 'other-seller' }));
    emit(1, 'UPDATE', row({ buyer_id: 'other-buyer', seller_id: 'other-seller' }));

    expect(onChange).not.toHaveBeenCalled();
  });

  it('emits DELETE only for an ID previously seen by that channel', () => {
    const onChange = vi.fn();
    subscribeToUserConversations(userId, onChange);

    emit(0, 'DELETE', row({ id: 'never-seen' }));
    expect(onChange).not.toHaveBeenCalled();

    emit(0, 'INSERT', row({ id: 'seen-by-buyer' }));
    emit(0, 'DELETE', row({ id: 'seen-by-buyer' }));

    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange).toHaveBeenLastCalledWith({
      eventType: 'DELETE',
      conversation: null,
    });
  });

  it('does not allow one channel to DELETE an ID seen only by the other', () => {
    const onChange = vi.fn();
    subscribeToUserConversations(userId, onChange);

    emit(0, 'INSERT', row({ id: 'buyer-only' }));
    emit(1, 'DELETE', row({ id: 'buyer-only' }));

    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('unsubscribes both channels', () => {
    const subscription = subscribeToUserConversations(userId, vi.fn());

    subscription.unsubscribe();

    expect(mockState.removeChannel).toHaveBeenCalledTimes(2);
  });
});
