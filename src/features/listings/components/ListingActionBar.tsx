import React from 'react';
import { useTranslation } from '@/shared/i18n';
import { Call, Whatsapp, Message } from 'iconsax-react';

export interface ListingActionBarProps {
  isArabic: boolean;
  onCall: () => void;
  onWhatsApp: () => void;
  onStartChat: () => void;
  isCountryMismatch: boolean;
  isAuthenticated: boolean;
}

export const ListingActionBar: React.FC<ListingActionBarProps> = React.memo(({
  isArabic,
  onCall,
  onWhatsApp,
  onStartChat,
  isCountryMismatch,
}) => {
  const { t } = useTranslation();

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[440px] p-3 bg-white border-t border-[#E2E8F0] flex items-center gap-2 z-40 shadow-lg">
      <button
        onClick={onCall}
        disabled={isCountryMismatch}
        className={`flex-1 py-3 px-2 rounded-xl flex items-center justify-center gap-1.5 font-bold text-xs shadow-xs transition-colors ${
          isCountryMismatch
            ? 'bg-border text-ink-muted cursor-not-allowed pointer-events-none'
            : 'bg-[#1a2238] text-white hover:bg-[#111827] cursor-pointer'
        }`}
      >
        <Call size={16} variant="Linear" />
        <span>{t('listings.contact')}</span>
      </button>

      <button
        onClick={onWhatsApp}
        disabled={isCountryMismatch}
        className={`py-3 px-3 rounded-xl flex items-center justify-center gap-1 font-bold text-xs shadow-xs transition-colors ${
          isCountryMismatch
            ? 'bg-border text-ink-muted cursor-not-allowed'
            : 'bg-[#25D366] text-white hover:opacity-90 cursor-pointer'
        }`}
        title={isArabic ? 'واتساب' : 'WhatsApp'}
      >
        <Whatsapp size={16} variant="Linear" />
      </button>

      <button
        onClick={onStartChat}
        disabled={isCountryMismatch}
        className={`flex-1 py-3 px-2 rounded-xl flex items-center justify-center gap-1.5 font-bold text-xs shadow-xs transition-colors ${
          isCountryMismatch
            ? 'bg-border text-ink-muted cursor-not-allowed'
            : 'bg-[#1a2238] text-white hover:bg-[#111827] cursor-pointer'
        }`}
      >
        <Message size={16} variant="Linear" />
        <span>{t('listings.chat')}</span>
      </button>
    </div>
  );
});

ListingActionBar.displayName = 'ListingActionBar';
