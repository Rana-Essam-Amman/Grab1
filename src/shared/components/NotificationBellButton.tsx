import React from 'react';
import { useNotificationsStore } from '@/features/notifications/store/notifications.slice';

export interface NotificationBellButtonProps {
  readonly isArabic: boolean;
  readonly onPress: () => void;
}

/**
 * Visible bell button with unread badge for the header.
 * Facebook/Instagram pattern: numeric cap at 9+, red, only when > 0.
 * Empty spacer slot in the header was intentionally a placeholder for this.
 */
export const NotificationBellButton: React.FC<NotificationBellButtonProps> = ({
  isArabic,
  onPress,
}) => {
  const unreadCount = useNotificationsStore((s) => s.unreadCount);

  return (
    <button
      type="button"
      onClick={onPress}
      className="relative w-10 h-10 shrink-0 flex items-center justify-center text-white hover:bg-white/10 rounded-full transition-colors"
      aria-label={isArabic ? 'الإشعارات' : 'Notifications'}
    >
      <span className="text-xl" aria-hidden="true">🔔</span>
      {unreadCount > 0 && (
        <span
          className="absolute top-0.5 end-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-danger text-white text-[10px] font-black flex items-center justify-center border-2 border-brand shadow-sm"
          aria-label={isArabic ? `${unreadCount} غير مقروء` : `${unreadCount} unread`}
        >
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </button>
  );
};
