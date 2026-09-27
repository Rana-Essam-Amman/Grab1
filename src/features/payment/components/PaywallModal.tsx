import React from 'react';
import { CloseCircle, Card, TickCircle, Lock } from 'iconsax-react';
import { Modal } from '@/shared/ui/Modal';
import { Button } from '@/shared/ui/Button';

export interface PaywallModalProps {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly onConfirm: () => void;
  readonly isArabic: boolean;
  readonly isProcessing: boolean;
  readonly title: string;
  readonly titleAr: string;
  readonly description?: string;
  readonly descriptionAr?: string;
  readonly amount: number;
  readonly currency: string;
  readonly expiresLabel?: string;
  readonly expiresLabelAr?: string;
}

export const PaywallModal: React.FC<PaywallModalProps> = ({
  open, onClose, onConfirm, isArabic, isProcessing,
  title, titleAr, description, descriptionAr,
  amount, currency, expiresLabel, expiresLabelAr,
}) => {
  if (!open) return null;

  const displayTitle = isArabic ? titleAr : title;
  const displayDesc = isArabic ? descriptionAr : description;
  const displayExpires = isArabic ? expiresLabelAr : expiresLabel;

  return (
    <Modal open={open} onClose={onClose} size="md" className="max-w-[400px] rounded-3xl p-5 bg-surface [&>button:first-child]:hidden">
      <div dir={isArabic ? 'rtl' : 'ltr'} className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-accent/15 flex items-center justify-center shrink-0">
              <Lock size={18} variant="Bold" color="#E57E25" />
            </div>
            <div>
              <h3 className="text-base font-bold text-ink">{displayTitle}</h3>
              {displayExpires && (
                <div className="text-[11px] text-ink-muted mt-0.5">{displayExpires}</div>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-canvas flex items-center justify-center hover:bg-line transition-colors shrink-0"
            aria-label={isArabic ? 'إغلاق' : 'Close'}
          >
            <CloseCircle size={16} variant="Linear" className="text-ink-muted" />
          </button>
        </div>

        {displayDesc && (
          <p className="text-sm text-ink-soft leading-relaxed">{displayDesc}</p>
        )}

        <div className="rounded-2xl border border-line bg-canvas/60 px-4 py-3 flex items-center justify-between">
          <span className="text-xs font-bold text-ink-muted uppercase tracking-wide">
            {isArabic ? 'المبلغ' : 'Amount'}
          </span>
          <span className="text-lg font-black text-accent">
            {amount} <span className="text-xs font-bold text-ink-muted">{currency}</span>
          </span>
        </div>

        <div className="flex flex-col gap-2 text-[11px] text-ink-muted">
          <div className="flex items-center gap-2">
            <TickCircle size={14} variant="Bold" color="#16A34A" />
            <span>{isArabic ? 'دفع آمن عبر App Store / Google Play' : 'Secure payment via App Store / Google Play'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Card size={14} variant="Linear" color="#64748B" />
            <span>{isArabic ? 'يمكنك الإلغاء من إعدادات المتجر' : 'Cancel anytime from store settings'}</span>
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          <Button
            variant="ghost"
            size="lg"
            onClick={onClose}
            disabled={isProcessing}
            className="flex-1"
          >
            {isArabic ? 'إلغاء' : 'Cancel'}
          </Button>
          <Button
            variant="primary"
            size="lg"
            onClick={onConfirm}
            disabled={isProcessing}
            className="flex-1"
          >
            {isProcessing
              ? (isArabic ? 'جاري المعالجة...' : 'Processing...')
              : (isArabic ? 'تأكيد الدفع' : 'Confirm')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
