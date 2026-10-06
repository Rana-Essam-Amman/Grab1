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
  const {
    isArabic,
    onCall,
    onWhatsAppClick,
    onStartChat,
    hasPhone,
  } = props;
  const { t } = useTranslation();
  const showCall = true;
  const disabled = false;

  const waLabel = isArabic ? 'واتساب' : 'WhatsApp';
  const waDisabled = disabled || !hasPhone;

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[440px] p-3 bg-surface border-t border-border flex items-center gap-2 z-40 shadow-lg">
      <button
        onClick={onWhatsAppClick}
        disabled={waDisabled}
        className={`flex-[3] py-3.5 px-3 rounded-xl flex items-center justify-center gap-2 font-bold text-sm shadow-xs transition-colors ${
          waDisabled
            ? 'bg-border text-ink-muted cursor-not-allowed'
            : 'bg-success text-white hover:opacity-90 cursor-pointer active:scale-[0.98]'
        }`}
        aria-label={isArabic ? 'تواصل عبر واتساب' : 'Contact via WhatsApp'}
      >
        <Whatsapp size={18} variant="Bold" />
        <span>{waLabel}</span>
      </button>

      <button
        onClick={onStartChat}
        disabled={disabled}
        className={`flex-[2] py-3.5 px-3 rounded-xl flex items-center justify-center gap-2 font-bold text-sm shadow-xs transition-colors ${
          disabled
            ? 'bg-border text-ink-muted cursor-not-allowed'
            : 'bg-brand text-white hover:bg-brand-strong cursor-pointer active:scale-[0.98]'
        }`}
        aria-label={isArabic ? 'دردشة داخل التطبيق' : 'Chat in app'}
      >
        <Message size={18} variant="Bold" />
        <span>{t('listings.chat')}</span>
      </button>

      {showCall && (
        <button
          onClick={onCall}
          disabled={disabled}
          className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-xs transition-colors shrink-0 ${
            disabled
              ? 'bg-border text-ink-muted cursor-not-allowed'
              : 'bg-surface border border-border text-ink hover:bg-canvas cursor-pointer active:scale-[0.98]'
          }`}
          aria-label={isArabic ? 'اتصال' : 'Call'}
          title={isArabic ? 'اتصال' : 'Call'}
        >
          <Call size={18} variant="Bold" />
        </button>
      )}
    </div>
  );
});

ListingActionBar.displayName = 'ListingActionBar';
