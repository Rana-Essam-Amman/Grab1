import { useEffect } from 'react';
import { useChatStore } from '../store/chat.slice';
import { subscribeToPresence } from '../services/chatRealtime';

/**
 * Manages the global online presence subscription.
 *
 * Mount ONCE at App level. When userId is null (guest / not signed in),
 * no subscription is created. When userId changes, the previous channel
 * is torn down and a fresh one is opened.
 */
export function useOnlinePresence(userId: string | null): void {
  useEffect(() => {
    if (!userId) {
      // Clear stale state on sign-out
      useChatStore.setState({ onlineUserIds: {} });
      return;
    }

    const sub = subscribeToPresence(userId, (onlineUserIds) => {
      const map: Record<string, boolean> = {};
      for (const id of onlineUserIds) map[id] = true;
      useChatStore.setState({ onlineUserIds: map });
    });

    return () => {
      sub.unsubscribe();
    };
  }, [userId]);
}
