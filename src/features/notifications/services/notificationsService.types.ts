export type NotificationType =
  | 'message'
  | 'review'
  | 'listing_status'
  | 'price_alert'
  | 'system';

/**
 * Payload shape varies per type. Only the fields relevant to the type
 * are populated — all are optional. New types add fields without migration.
 */
export interface NotificationPayload {
  readonly conversationId?: string;
  readonly senderId?: string;
  readonly senderName?: string;
  readonly preview?: string;
  readonly listingId?: string;
  readonly listingTitle?: string;
  readonly rating?: number;
  readonly reviewerName?: string;
  readonly status?: string;
  readonly reason?: string;
  readonly title?: string;
  readonly body?: string;
  readonly ctaUrl?: string;
}

export interface AppNotification {
  readonly id: string;
  readonly userId: string;
  readonly type: NotificationType;
  readonly payload: NotificationPayload;
  readonly readAt: string | null;
  readonly createdAt: string;
}

export interface NotificationRow {
  readonly id: string;
  readonly user_id: string;
  readonly type: NotificationType;
  readonly payload: unknown;
  readonly read_at: string | null;
  readonly created_at: string;
}
