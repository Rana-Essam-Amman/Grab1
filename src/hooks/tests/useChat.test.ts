import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useChat, useConversations } from '../useChat';
import { useChatStore } from '@/features/chat/store/chat.slice';

describe('useChat', () => {
  beforeEach(() => {
    useChatStore.setState({ conversations: [] });
  });

  it('starts with empty conversations array', () => {
    const { result } = renderHook(() => useChat());
    expect(result.current.conversations).toEqual([]);
  });

  it('exposes startOrOpenConversation and sendChatMessage functions', () => {
    const { result } = renderHook(() => useChat());
    expect(typeof result.current.startOrOpenConversation).toBe('function');
    expect(typeof result.current.sendChatMessage).toBe('function');
  });

  it('useConversations selector returns the same array', () => {
    const { result } = renderHook(() => useConversations());
    expect(Array.isArray(result.current)).toBe(true);
  });

  it('sendChatMessage is callable and does not crash on empty store', () => {
    const { result } = renderHook(() => useChat());
    expect(() => {
      act(() => {
        result.current.sendChatMessage('nonexistent-thread', 'hello');
      });
    }).not.toThrow();
  });

  it('startOrOpenConversation returns an id or object (callable)', () => {
    const { result } = renderHook(() => useChat());
    let returned: unknown = 'NOT_CALLED';
    const mockListing = {
      id: 'listing-1',
      title: 'Test Listing',
      imageUrl: '/test.jpg',
      sellerPhone: '123456',
      countryCode: 'JO',
    } as never;
    act(() => {
      returned = result.current.startOrOpenConversation(mockListing, 'JO');
    });
    expect(returned).not.toBe('NOT_CALLED');
    expect(typeof returned).toBe('string');
  });
});
