import React from 'react';
import { useTranslation } from '@/shared/i18n';
import { Call, Whatsapp, Message } from 'iconsax-react';

export interface ListingActionBarProps {
  isArabic: boolean;
  countryCode: string;
  onCall: () => void;
  onWhatsAppClick: () => void;
  onStartChat: () => void;
  isCountryMismatch: boolean;
  isAuthenticated: boolean;
  hasPhone: boolean;
}

export const ListingActionBar: React.FC<ListingActionBarProps> = React.memo((props) => {
  const { isArabic, onCall, onWhatsAppClick, onStartChat, hasPhone } = props;
  const { t } = useTranslation();
  const waDisabled = !hasPhone;

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[440px] p-3 bg-surface border-t border-border flex items-center gap-2.5 z-40 shadow-lg">
      <button
        onClick={onStartChat}
        type="button"
        className="flex-1 h-12 rounded-full bg-brand text-white flex items-center justify-center gap-2 font-bold text-sm shadow-sm hover:bg-brand-strong active:scale-[0.98] transition-all cursor-pointer"
        aria-label={isArabic ? 'دردشة داخل التطبيق' : 'Chat in app'}
      >
        <Message size={18} variant="Bold" />
        <span>{t('listings.chat')}</span>
      </button>

      <button
        onClick={onWhatsAppClick}
        disabled={waDisabled}
        type="button"
        className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 shadow-md transition-all ${
          waDisabled
            ? 'bg-border text-ink-muted cursor-not-allowed'
            : 'bg-whatsapp text-white hover:bg-whatsapp-hover active:scale-[0.95] cursor-pointer'
        }`}
        aria-label={isArabic ? 'تواصل عبر واتساب' : 'Contact via WhatsApp'}
        title={isArabic ? 'واتساب' : 'WhatsApp'}
      >
        <Whatsapp size={26} variant="Bold" />
      </button>

      <button
        onClick={onCall}
        type="button"
        className="flex-1 h-12 rounded-full bg-brand text-white flex items-center justify-center gap-2 font-bold text-sm shadow-sm hover:bg-brand-strong active:scale-[0.98] transition-all cursor-pointer"
        aria-label={isArabic ? 'اتصال' : 'Call'}
      >
        <Call size={18} variant="Bold" />
        <span>{isArabic ? 'اتصال' : 'Call'}</span>
      </button>
    </div>
  );
});

ListingActionBar.displayName = 'ListingActionBar';
