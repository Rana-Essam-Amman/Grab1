import React from 'react';
import { Sheet } from '@/shared/ui/Sheet';
import { Whatsapp, Edit2, ArrowLeft2, ArrowRight2 } from 'iconsax-react';
import type { Listing } from '@/types';
import { getWhatsAppIntents, type WhatsAppIntent } from '../helpers/whatsappIntents';

export interface WhatsAppIntentSheetProps {
  readonly open: boolean;
  readonly listing: Listing;
  readonly isArabic: boolean;
  readonly onClose: () => void;
  readonly onPick: (intent: WhatsAppIntent) => void;
  readonly onWriteOwn: () => void;
}

export const WhatsAppIntentSheet: React.FC<WhatsAppIntentSheetProps> = ({
  open, listing, isArabic, onClose, onPick, onWriteOwn,
}) => {
  const intents = getWhatsAppIntents(listing.countryCode, isArabic);
  const hasPhone = Boolean(listing.sellerPhone);
  const Arrow = isArabic ? ArrowLeft2 : ArrowRight2;

  return (
    <Sheet open={open} onClose={onClose} title={isArabic ? 'تواصل عبر واتساب' : 'Contact via WhatsApp'}>
      <div className="flex flex-col gap-2.5 pb-2" dir={isArabic ? 'rtl' : 'ltr'}>
        {/* Trust row */}
        <div className="flex items-center gap-2 text-xs text-ink-muted px-1">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-success" />
            <span>{hasPhone ? (isArabic ? 'رقم موثّق' : 'Verified number') : (isArabic ? 'بدون رقم' : 'No number')}</span>
          </span>
          {listing.isPremium && (
            <>
              <span className="text-line-strong">·</span>
              <span className="text-accent font-bold">{isArabic ? 'إعلان مميز' : 'Premium listing'}</span>
            </>
          )}
        </div>

        {/* Intent chips */}
        {intents.map((intent) => (
          <button
            key={intent.id}
            type="button"
            onClick={() => onPick(intent)}
            disabled={!hasPhone}
            className="w-full px-4 py-3.5 rounded-2xl bg-success/10 border border-success/30 hover:bg-success/15 active:scale-[0.99] transition-all text-start flex items-center justify-between gap-3 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <span className="flex flex-col gap-0.5 min-w-0">
              <span className="text-sm font-bold text-ink">{intent.label}</span>
              <span className="text-[11px] text-ink-muted truncate">{intent.body}</span>
            </span>
            <Arrow size={18} className="text-success shrink-0" />
          </button>
        ))}

        {/* Write own */}
        <button
          type="button"
          onClick={onWriteOwn}
          disabled={!hasPhone}
          className="w-full px-4 py-3.5 rounded-2xl bg-surface border border-border hover:bg-canvas active:scale-[0.99] transition-all flex items-center justify-between gap-3 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <span className="flex items-center gap-2.5">
            <Edit2 size={16} variant="Linear" className="text-ink-muted" />
            <span className="text-sm font-bold text-ink">
              {isArabic ? 'اكتب رسالتك' : 'Write your own'}
            </span>
          </span>
          <Arrow size={18} className="text-ink-muted shrink-0" />
        </button>

        {/* WhatsApp logo */}
        <div className="flex items-center justify-center gap-1.5 text-[10px] text-ink-muted pt-1">
          <Whatsapp size={12} variant="Linear" />
          <span>{isArabic ? 'سيفتح واتساب برسالتك الجاهزة' : 'Opens WhatsApp with your message ready'}</span>
        </div>
      </div>
    </Sheet>
  );
};
