import React, { useCallback } from 'react';
import { ArrowLeft, ArrowRight, TickCircle, Tag, Message, Star1, InfoCircle } from 'iconsax-react';
import { Button } from '@/shared/ui/Button';
import { EmptyState } from '@/shared/ui/EmptyState';
import { Icon } from '@iconify/react';
import { BrandMark } from '@/shared/components/BrandMark';
import { useUI } from '@/hooks/useUI';
import {
  useNotificationsStore,
  markOneRead,
  markAllRead,
  buildNotificationText,
  formatNotificationTime,
  type AppNotification,
} from '@/features/notifications';

const ICON_BG: Record<string, string> = {
  message: 'bg-info/15 text-info',
  review: 'bg-warning/15 text-warning',
  listing_status: 'bg-success/15 text-success',
  price_alert: 'bg-accent/15 text-accent-strong',
  system: 'bg-line/40 text-ink-muted',
};

function NotificationIcon({ type }: { readonly type: string }): React.ReactElement {
  if (type === 'message') return <Message size={18} variant="Linear" />;
  if (type === 'review') return <Star1 size={18} variant="Bold" />;
  if (type === 'listing_status') return <TickCircle size={18} variant="Linear" />;
  if (type === 'price_alert') return <Tag size={18} variant="Linear" />;
  return <InfoCircle size={18} variant="Linear" />;
}

export const NotificationsScreen: React.FC = () => {
  const { isArabic, goBack } = useUI();
  const notifications = useNotificationsStore((s) => s.notifications);
  const unreadCount = useNotificationsStore((s) => s.unreadCount);
  const loading = useNotificationsStore((s) => s.loading);

  const handleRowClick = useCallback((n: AppNotification) => {
    if (!n.readAt) void markOneRead(n.id);
  }, []);

  const handleMarkAll = useCallback(() => {
    void markAllRead();
  }, []);

  return (
    <div data-testid="notifications-screen" className="flex flex-col min-h-screen bg-surface pb-12" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="px-4 py-3 bg-brand border-b border-white/10 flex items-center justify-between sticky top-0 z-20">
        <Button variant="ghost" size="icon" onClick={goBack} aria-label="Back" className="w-10 h-10 rounded-full bg-surface/15 hover:bg-surface/25 flex items-center justify-center p-0">
          {isArabic ? <ArrowRight size={18} variant="Linear" color="#FFFFFF" /> : <ArrowLeft size={18} variant="Linear" color="#FFFFFF" />}
        </Button>
        <h1 className="text-base font-bold text-white flex-1 text-center">{isArabic ? 'الإشعارات' : 'Notifications'}</h1>
        {unreadCount > 0 ? (
          <button data-testid="notifications-mark-all" onClick={handleMarkAll} className="text-[11px] font-bold text-white/90 hover:text-white cursor-pointer select-none w-16 text-center">
            {isArabic ? 'تعليم الكل' : 'Mark all'}
          </button>
        ) : (
          <BrandMark isArabic={isArabic} />
        )}
      </div>

      {loading && notifications.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <Icon icon="svg-spinners:ring-resize" width={28} height={28} />
        </div>
      ) : notifications.length === 0 ? (
        <div data-testid="notifications-empty" className="flex-1 flex flex-col items-center justify-center p-8">
          <EmptyState
            icon={<Icon icon="fluent-emoji:bell" width={48} height={48} />}
            title={isArabic ? 'لا توجد إشعارات' : 'No Notifications'}
            description={
              isArabic
                ? 'ستظهر هنا التنبيهات المتعلقة بإعلاناتك ورسائلك.'
                : 'Alerts about your listings and messages will appear here.'
            }
          />
        </div>
      ) : (
        <div data-testid="notifications-list" className="p-4 flex flex-col gap-3">
          {notifications.map((n) => {
            const txt = buildNotificationText(n, isArabic);
            const unread = !n.readAt;
            return (
              <button
                key={n.id}
                data-testid="notification-row"
                data-notification-id={n.id}
                data-unread={unread}
                type="button"
                onClick={() => handleRowClick(n)}
                className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 cursor-pointer text-start select-none ${
                  unread ? 'bg-surface border-primary/40 shadow-xs' : 'bg-surface border-border'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${ICON_BG[txt.iconName] ?? ICON_BG.system}`}>
                  <NotificationIcon type={txt.iconName} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-bold leading-snug mb-1 ${unread ? 'text-ink' : 'text-ink-muted'}`}>
                    {txt.title}
                  </p>
                  {txt.subtitle && (
                    <p className="text-[11px] text-ink-muted leading-snug truncate" dir="auto">
                      {txt.subtitle}
                    </p>
                  )}
                  <span className="text-[10px] text-ink-muted mt-1 block">
                    {formatNotificationTime(n.createdAt, isArabic)}
                  </span>
                </div>
                {unread && (
                  <span data-testid="notification-unread-dot" className="w-2.5 h-2.5 rounded-full bg-primary mt-1 shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
