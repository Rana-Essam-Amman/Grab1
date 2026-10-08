import { useUI } from '@/hooks/useUI';
import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, TickCircle, Tag, Message } from 'iconsax-react';
import { Button } from '@/shared/ui/Button';
import { EmptyState } from '@/shared/ui/EmptyState';
import { Icon } from '@iconify/react';
import { BrandMark } from '@/shared/components/BrandMark';
export interface Notification {
  id: string;
  titleEn: string;
  titleAr: string;
  timeEn: string;
  timeAr: string;
  read: boolean;
  type: 'price' | 'message' | 'ad';
}
export const NotificationsScreen: React.FC = () => {
  // TODO(Wave 5): wire to Supabase notifications table + realtime.
  //       For now: empty until real backend ships. No fake data.
  const { isArabic, goBack } = useUI();
  const [notifications, setNotifications] = useState<Notification[]>([]);
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
      <div className="px-4 py-3 bg-brand border-b border-white/10 flex items-center justify-between sticky top-0 z-20">
        <Button variant="ghost" size="icon" onClick={goBack} aria-label="Back" className="w-10 h-10 rounded-full bg-surface/15 hover:bg-surface/25 flex items-center justify-center p-0">
          {isArabic ? <ArrowRight size={18} variant="Linear" color="#FFFFFF" /> : <ArrowLeft size={18} variant="Linear" color="#FFFFFF" />}
        </Button>
        <h1 className="text-base font-bold text-white flex-1 text-center">{isArabic ? 'الإشعارات والتنبيهات' : 'Notifications'}</h1>
        {notifications.length > 0 ? (
          <button onClick={handleClearAll} className="text-xs font-bold text-white/80 hover:text-white cursor-pointer select-none w-10 text-center">
            {isArabic ? 'مسح' : 'Clear'}
          </button>
        ) : (
          <BrandMark isArabic={isArabic} />
        )}
      </div>
      {/* Content Area */}
      {notifications.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8">
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
                  n.type === 'price' ? 'bg-warning/15 text-ink' :
                  n.type === 'message' ? 'bg-info/15 text-info' : 'bg-success/15 text-success'
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
