import { create } from 'zustand';
import type { NotificationsState } from './notifications.slice.types';

/**
 * Pure state container for notifications. No async, no side effects.
 * All mutations happen via notifications.slice.actions.ts.
 */
export const useNotificationsStore = create<NotificationsState>(() => ({
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
}));
