// Notifications public API — store, actions, hooks, helpers, types.
//
// IMPORTANT: Do NOT re-export screens from this barrel (Rule #18).
// Notifications is a leaf feature (no imports FROM other features) → no cycles.

// Store
export { useNotificationsStore } from './store/notifications.slice';
export type { NotificationsState } from './store/notifications.slice.types';

// Actions
export {
  loadNotifications,
  resetNotificationsStore,
  markOneRead,
  markAllRead,
  pushNotification,
  applyRealtimeUpdate,
} from './store/notifications.slice.actions';

// Hook
export { useSupabaseNotificationsSync } from './hooks/useSupabaseNotificationsSync';

// Helpers + text types
export {
  buildNotificationText,
  formatNotificationTime,
} from './helpers/notificationText';
export type { NotificationText } from './helpers/notificationText';

// Services
export {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  getUnreadNotificationCount,
} from './services/notificationsService';

// Service types (row + domain)
export type {
  NotificationType,
  NotificationPayload,
  AppNotification,
  NotificationRow,
} from './services/notificationsService.types';

// NOTE: subscribeToNotifications is internal-only (used by the sync hook).
// Keep it out of the public API.
