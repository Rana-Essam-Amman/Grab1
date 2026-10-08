import type { AppNotification } from '../services/notificationsService.types';

export interface NotificationsState {
  readonly notifications: AppNotification[];
  readonly unreadCount: number;
  readonly loading: boolean;
  readonly error: string | null;
}
