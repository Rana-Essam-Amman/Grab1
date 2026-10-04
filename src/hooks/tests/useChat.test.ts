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

  it('exposes openConversation and sendChatMessage functions', () => {
    const { result } = renderHook(() => useChat());
    expect(typeof result.current.openConversation).toBe('function');
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

  it('openConversation is an async function', () => {
    const { result } = renderHook(() => useChat());
    expect(typeof result.current.openConversation).toBe('function');
    expect(result.current.openConversation.constructor.name).toBe('AsyncFunction');
  });
});
