import { useUI } from '@/hooks/useUI';
import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Notification as BellIcon, TickCircle, Tag, Message } from 'iconsax-react';
import { Button } from '@/shared/ui/Button';
import { EmptyState } from '@/shared/ui/EmptyState';

export interface Notification {
  id: string;
  titleEn: string;
  titleAr: string;
  timeEn: string;
  timeAr: string;
  read: boolean;
  type: 'price' | 'message' | 'ad';
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    titleEn: 'Price drop alert on Toyota Camry',
    titleAr: 'انخفاض سعر تويوتا كامري في قائمة الإعلانات المفضلة',
    timeEn: '2 hours ago',
    timeAr: 'منذ ساعتين',
    read: false,
    type: 'price',
  },
  {
    id: '2',
    titleEn: 'New message received from Ahmed',
    titleAr: 'تم استلام رسالة جديدة من أحمد بخصوص إعلانك',
    timeEn: 'Yesterday',
    timeAr: 'أمس',
    read: true,
    type: 'message',
  },
  {
    id: '3',
    titleEn: 'Your ad "iPhone 15 Pro" is now active',
    titleAr: 'إعلانك "آيفون 15 برو" نشط الآن وجاهز للمشاهدة',
    timeEn: '3 days ago',
    timeAr: 'قبل 3 أيام',
    read: true,
    type: 'ad',
  },
];

export const NotificationsScreen: React.FC = () => {
  // Note: Market isolation deferred — notifications are currently global per current single-market/user session scope.
  const { isArabic, goBack } = useUI();
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="flex flex-col min-h-screen bg-surface pb-12" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Top Header */}
      <div className="px-4 py-3 bg-surface border-b border-border flex items-center justify-between sticky top-0 z-20">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={goBack}
          className="w-9 h-9 rounded-full bg-background text-ink hover:bg-primary hover:text-white transition-colors flex items-center justify-center shrink-0"
        >
          {isArabic ? <ArrowRight size={18} variant="Linear" /> : <ArrowLeft size={18} variant="Linear" />}
        </Button>
        <h1 className="text-sm font-bold text-ink">
          {isArabic ? 'الإشعارات والتنبيهات' : 'Notifications'}
        </h1>
        {notifications.length > 0 ? (
          <button
            onClick={handleClearAll}
            className="text-xs font-bold text-danger hover:underline cursor-pointer select-none"
          >
            {isArabic ? 'مسح الكل' : 'Clear All'}
          </button>
        ) : (
          <div className="w-9" />
        )}
      </div>

      {/* Content Area */}
      {notifications.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <EmptyState
            icon={<BellIcon size={40} variant="Linear" className="text-ink-muted animate-pulse" />}
            title={isArabic ? 'لا توجد إشعارات' : 'No Notifications'}
            description={
              isArabic
                ? 'ستظهر هنا التنبيهات المتعلقة بإعلاناتك ورسائلك.'
                : 'Alerts about your listings and messages will appear here.'
            }
          />
        </div>
      ) : (
        /* Notifications List */
        <div className="p-4 flex flex-col gap-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => handleMarkAsRead(n.id)}
              className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 cursor-pointer text-start select-none ${
                n.read ? 'bg-surface border-border' : 'bg-surface border-primary/40 shadow-xs'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  n.type === 'price' ? 'bg-amber-100 text-amber-700' :
                  n.type === 'message' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                }`}
              >
                {n.type === 'price' ? <Tag size={18} variant="Linear" /> :
                 n.type === 'message' ? <Message size={18} variant="Linear" /> : <TickCircle size={18} variant="Linear" />}
              </div>

              <div className="flex-1 min-w-0">
                <p className={`text-xs font-bold leading-snug mb-1 ${n.read ? 'text-ink-muted' : 'text-ink'}`}>
                  {isArabic ? n.titleAr : n.titleEn}
                </p>
                <span className="text-[10px] text-ink-muted">
                  {isArabic ? n.timeAr : n.timeEn}
                </span>
              </div>

              {!n.read && (
                <span className="w-2.5 h-2.5 rounded-full bg-primary mt-1 shrink-0" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
