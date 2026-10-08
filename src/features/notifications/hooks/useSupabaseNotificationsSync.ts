import { useEffect } from 'react';
import { useAuthStore } from '@/features/auth/store/auth.slice';
import {
  loadNotifications,
  resetNotificationsStore,
  pushNotification,
  applyRealtimeUpdate,
} from '../store/notifications.slice.actions';
import { subscribeToNotifications } from '../services/notificationsRealtime';

/**
 * Sync notifications with Supabase on auth changes.
 *
 * - When a user id is present  → load + subscribe to realtime.
 * - When a user id is absent  → reset the store (privacy on logout).
 */
export function useSupabaseNotificationsSync(): void {
  const userId = useAuthStore((s) => s.user?.id ?? null);

  useEffect(() => {
    if (!userId) {
      resetNotificationsStore();
      return;
    }

    void loadNotifications();

    const { unsubscribe } = subscribeToNotifications(userId, (event) => {
      if (event.eventType === 'INSERT' && event.notification) {
        pushNotification(event.notification);
      } else if (event.eventType === 'UPDATE' && event.notification) {
        applyRealtimeUpdate(event.notification);
      }
    });

    return () => unsubscribe();
  }, [userId]);
}
