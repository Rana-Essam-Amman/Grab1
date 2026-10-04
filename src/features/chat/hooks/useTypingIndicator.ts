import { useEffect, useRef, useCallback } from 'react';
import { useChatStore } from '../store/chat.slice';
import { subscribeToTyping } from '../services/chatRealtime';

/**
 * Manages typing indicator for a conversation.
 *
 * Returns:
 *   - `notifyTyping()`: call this on each input change. Debounced — 
 *     broadcasts at most once per 2s while the user is actively typing.
 *
 * Side effects:
 *   - Subscribes to the OTHER user's typing events and updates the store.
 *   - Auto-clears `typingByConversation[convId]` after 2.5s of silence.
 */
export function useTypingIndicator(
  conversationId: string | null,
  currentUserId: string | null
): { notifyTyping: () => void } {
  const lastSentRef = useRef<number>(0);
  const sendRef = useRef<(() => void) | null>(null);
  const clearTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!conversationId || !currentUserId) return;

    const clearState = () => {
      useChatStore.setState((s) => ({
        typingByConversation: { ...s.typingByConversation, [conversationId]: false },
      }));
    };

    const sub = subscribeToTyping(conversationId, currentUserId, () => {
      useChatStore.setState((s) => ({
        typingByConversation: { ...s.typingByConversation, [conversationId]: true },
      }));
      if (clearTimerRef.current) clearTimeout(clearTimerRef.current);
      clearTimerRef.current = setTimeout(clearState, 2500);
    });

    sendRef.current = sub.sendTyping;

    return () => {
      if (clearTimerRef.current) clearTimeout(clearTimerRef.current);
      clearState();
      sub.unsubscribe();
      sendRef.current = null;
    };
  }, [conversationId, currentUserId]);

  const notifyTyping = useCallback(() => {
    const now = Date.now();
    if (now - lastSentRef.current < 2000) return;
    lastSentRef.current = now;
    sendRef.current?.();
  }, []);

  return { notifyTyping };
}
