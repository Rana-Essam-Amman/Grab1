import { useEffect } from 'react';
import { useAuthStore } from '@/features/auth';
import { loadConversationsForUser, resetChatStore } from '../store/chat.slice.actions.load';

/**
 * Sync conversations with Supabase on auth changes.
 *
 * - When a user id is present  → load their conversations.
 * - When a user id is absent  → reset the chat store (privacy on logout).
 *
 * Mirrors the useSupabaseWishlistSync pattern.
 */
export function useSupabaseChatSync(): void {
  const userId = useAuthStore((s) => s.user?.id ?? null);

  useEffect(() => {
    if (!userId) {
      resetChatStore();
      return;
    }
    void loadConversationsForUser(userId);
  }, [userId]);
}
