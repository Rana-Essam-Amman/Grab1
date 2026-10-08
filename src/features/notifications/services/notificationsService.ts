import { supabase } from '@/shared/lib/supabase';
import type {
  AppNotification,
  NotificationPayload,
  NotificationRow,
} from './notificationsService.types';

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

export async function fetchNotifications(
  limit = 50
): Promise<{ data: AppNotification[]; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('id, user_id, type, payload, read_at, created_at')
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) return { data: [], error: error.message };
    return {
      data: (data ?? []).map((r) => rowToNotification(r as NotificationRow)),
      error: null,
    };
  } catch (err) {
    return { data: [], error: err instanceof Error ? err.message : 'unknown' };
  }
}

export async function markNotificationRead(
  id: string
): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase.rpc('mark_notification_read', {
      p_notification_id: id,
    });
    if (error) return { error: error.message };
    return { error: null };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'unknown' };
  }
}

export async function markAllNotificationsRead(): Promise<{
  count: number;
  error: string | null;
}> {
  try {
    const { data, error } = await supabase.rpc('mark_all_notifications_read');
    if (error) return { count: 0, error: error.message };
    return { count: typeof data === 'number' ? data : 0, error: null };
  } catch (err) {
    return { count: 0, error: err instanceof Error ? err.message : 'unknown' };
  }
}

export async function getUnreadNotificationCount(): Promise<number> {
  try {
    const { data, error } = await supabase.rpc('get_unread_notification_count');
    if (error || typeof data !== 'number') return 0;
    return data;
  } catch {
    return 0;
  }
}
