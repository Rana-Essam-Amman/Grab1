import { supabase } from '@/shared/lib/supabase';
import type {
  AppNotification,
  NotificationPayload,
  NotificationRow,
} from './notificationsService.types';

export interface RealtimeNotificationEvent {
  readonly eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  readonly notification: AppNotification | null;
}

function rowToNotification(row: NotificationRow): AppNotification {
  return {
    id: row.id,
    userId: row.user_id,
    type: row.type,
    payload: (row.payload ?? {}) as NotificationPayload,
    readAt: row.read_at,
    createdAt: row.created_at,
  };
}

export function subscribeToNotifications(
  userId: string,
  onChange: (event: RealtimeNotificationEvent) => void
): { unsubscribe: () => void } {
  const channel = supabase
    .channel(`notifications:${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        if (payload.eventType === 'DELETE') {
          onChange({ eventType: 'DELETE', notification: null });
          return;
        }
        const row = payload.new as NotificationRow | null;
        if (!row?.id) return;
        onChange({
          eventType: payload.eventType === 'UPDATE' ? 'UPDATE' : 'INSERT',
          notification: rowToNotification(row),
        });
      }
    )
    .subscribe();

  return {
    unsubscribe: () => {
      void supabase.removeChannel(channel);
    },
  };
}
