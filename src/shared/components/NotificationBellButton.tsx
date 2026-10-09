import React from 'react';
import { useNotificationsStore } from '@/features/notifications/store/notifications.slice';

export interface NotificationBellButtonProps {
  readonly isArabic: boolean;
  readonly onPress: () => void;
}

/**
 * Bell with unread badge. Uses physical positioning (top/right) flipped for RTL.
 * Avoids logical `end-*` which may not compile in Tailwind v4.
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
      data-testid="header-bell"
    >
      <span className="text-xl" aria-hidden="true">🔔</span>
      {unreadCount > 0 && (
        <span
          data-testid="header-bell-badge"
          data-unread-count={unreadCount}
          style={{
            position: 'absolute',
            top: '-2px',
            right: '-2px',
            minWidth: '18px',
            height: '18px',
            padding: '0 5px',
            borderRadius: '9999px',
            backgroundColor: '#DC2626',
            color: '#FFFFFF',
            fontSize: '10px',
            fontWeight: 900,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid #0F1E3D',
            boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
            zIndex: 20,
            lineHeight: 1,
          }}
        >
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </button>
  );
};
