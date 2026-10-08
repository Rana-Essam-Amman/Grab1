import type { AppNotification } from '../services/notificationsService.types';

export interface NotificationText {
  readonly title: string;
  readonly subtitle: string;
  readonly iconName: 'message' | 'review' | 'listing_status' | 'price_alert' | 'system';
}

export function buildNotificationText(
  n: AppNotification,
  isArabic: boolean
): NotificationText {
  const p = n.payload;
  switch (n.type) {
    case 'message': {
      const who = p.senderName ?? (isArabic ? 'مستخدم' : 'User');
      const preview = p.preview ?? '';
      return {
        title: isArabic ? `رسالة من ${who}` : `Message from ${who}`,
        subtitle: preview,
        iconName: 'message',
      };
    }
    case 'review': {
      const who = p.reviewerName ?? (isArabic ? 'مستخدم' : 'User');
      const rating = typeof p.rating === 'number' ? p.rating : 0;
      return {
        title: isArabic ? `قيّمك ${who}` : `${who} reviewed you`,
        subtitle: isArabic ? `${rating} من 5 نجوم` : `${rating} of 5 stars`,
        iconName: 'review',
      };
    }
    case 'listing_status': {
      const status = p.status ?? '';
      return {
        title: isArabic ? 'تحديث على إعلانك' : 'Listing update',
        subtitle: status,
        iconName: 'listing_status',
      };
    }
    case 'price_alert': {
      return {
        title: p.title ?? (isArabic ? 'تنبيه سعر' : 'Price alert'),
        subtitle: p.body ?? '',
        iconName: 'price_alert',
      };
    }
    case 'system':
    default: {
      return {
        title: p.title ?? (isArabic ? 'إشعار' : 'Notification'),
        subtitle: p.body ?? '',
        iconName: 'system',
      };
    }
  }
}

export function formatNotificationTime(iso: string, isArabic: boolean): string {
  try {
    const d = new Date(iso);
    const diffMs = Date.now() - d.getTime();
    const minutes = Math.floor(diffMs / 60000);
    if (minutes < 1) return isArabic ? 'الآن' : 'just now';
    if (minutes < 60) return isArabic ? `قبل ${minutes} د` : `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return isArabic ? `قبل ${hours} س` : `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return isArabic ? `قبل ${days} ي` : `${days}d ago`;
    return d.toLocaleDateString(isArabic ? 'ar-JO' : 'en-GB', {
      day: 'numeric',
      month: 'short',
    });
  } catch {
    return '';
  }
}
