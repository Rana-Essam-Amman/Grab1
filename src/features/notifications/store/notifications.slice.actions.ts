import { useNotificationsStore } from './notifications.slice';
import {
  fetchNotifications,
  markNotificationRead as serviceMark,
  markAllNotificationsRead as serviceMarkAll,
} from '../services/notificationsService';
import type { AppNotification } from '../services/notificationsService.types';

const MAX_KEPT = 100;

export async function loadNotifications(): Promise<void> {
  useNotificationsStore.setState({ loading: true, error: null });
  const { data, error } = await fetchNotifications();
  if (error) {
    useNotificationsStore.setState({ loading: false, error });
    return;
  }
  const unread = data.filter((n) => !n.readAt).length;
  useNotificationsStore.setState({
    notifications: data,
    unreadCount: unread,
    loading: false,
    error: null,
  });
}

export function resetNotificationsStore(): void {
  useNotificationsStore.setState({
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: null,
  });
}

export async function markOneRead(id: string): Promise<void> {
  const { error } = await serviceMark(id);
  if (error) return;
  useNotificationsStore.setState((s) => ({
    notifications: s.notifications.map((n) =>
      n.id === id && !n.readAt ? { ...n, readAt: new Date().toISOString() } : n
    ),
    unreadCount: Math.max(0, s.unreadCount - 1),
  }));
}

export async function markAllRead(): Promise<void> {
  const { error } = await serviceMarkAll();
  if (error) return;
  const now = new Date().toISOString();
  useNotificationsStore.setState((s) => ({
    notifications: s.notifications.map((n) =>
      n.readAt ? n : { ...n, readAt: now }
    ),
    unreadCount: 0,
  }));
}

export function pushNotification(n: AppNotification): void {
  useNotificationsStore.setState((s) => {
    if (s.notifications.some((existing) => existing.id === n.id)) return s;
    const next = [n, ...s.notifications].slice(0, MAX_KEPT);
    return {
      notifications: next,
      unreadCount: n.readAt ? s.unreadCount : s.unreadCount + 1,
    };
  });
}

export function applyRealtimeUpdate(n: AppNotification): void {
  useNotificationsStore.setState((s) => {
    const updated = s.notifications.map((existing) =>
      existing.id === n.id ? n : existing
    );
    return {
      notifications: updated,
      unreadCount: updated.filter((x) => !x.readAt).length,
    };
  });
}
