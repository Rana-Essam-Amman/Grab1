import React, { useMemo } from 'react';
import { Icon } from '@iconify/react';
import { TickCircle, Lock, ShieldTick } from 'iconsax-react';
import { Drawer } from '@/shared/ui/Drawer';
import { MARKETS } from '@/data/markets/config';
import { MONETIZATION_MATRIX } from '@/data/monetization';
import { PromoteOptionCard, type PromoteProduct } from './PromoteOptionCard';
import { buildPromoteOptions } from '../helpers/promoteOptions';

interface PromoteSheetProps {
  readonly open: boolean;
  readonly isArabic: boolean;
  readonly marketCode: string;
  readonly isProcessing: boolean;
  readonly onClose: () => void;
  readonly onSelect: (product: PromoteProduct) => void;
}

export const PromoteSheet: React.FC<PromoteSheetProps> = ({
  open, isArabic, marketCode, isProcessing, onClose, onSelect,
}) => {
  const pkg = MONETIZATION_MATRIX.packages[marketCode] || MONETIZATION_MATRIX.packages.JO;
  const market = MARKETS[marketCode as keyof typeof MARKETS];
  const options = useMemo(() => buildPromoteOptions(pkg), [pkg]);

  if (!open) return null;

  return (
    <Drawer open={open} onOpenChange={onClose} dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="flex flex-col gap-4 pb-4" dir={isArabic ? 'rtl' : 'ltr'}>
        <div className="flex flex-col items-center gap-2 pt-1">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-accent to-accent-strong flex items-center justify-center shadow-lg shadow-accent/30">
            <Icon icon="fluent-emoji:rocket" width={32} height={32} />
          </div>
          <h2 className="text-lg font-black text-ink mt-1">
            {isArabic ? 'روّج إعلانك' : 'Promote your ad'}
          </h2>
          <p className="text-xs text-ink-muted text-center max-w-[280px] leading-snug">
            {isArabic ? 'اختر الخدمة المناسبة لزيادة مبيعاتك' : 'Choose the service that fits your goals'}
          </p>
        </div>

        {market && (
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-ink-muted">
            <Icon icon="fluent-emoji:round-pushpin" width={12} height={12} />
            <span>{isArabic ? market.nameAr : market.nameEn}</span>
            <span className="text-line-strong">·</span>
            <span className="font-black text-ink">{pkg.currency}</span>
          </div>
        )}

        <div className="flex flex-col gap-2.5 mt-1">
          {options.map((opt) => (
            <PromoteOptionCard
              key={opt.id}
              option={opt}
              isArabic={isArabic}
              disabled={isProcessing}
              onSelect={onSelect}
            />
          ))}
        </div>

        <div className="rounded-2xl bg-success/10 border border-success/30 px-3.5 py-2.5 flex items-start gap-2.5 mt-1">
          <TickCircle size={16} variant="Bold" color="currentColor" className="text-success shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <div className="text-xs font-black text-ink">
              {isArabic ? '0% عمولة على البيع' : '0% commission'}
            </div>
            <div className="text-[10px] text-ink-muted mt-0.5 leading-snug">
              {isArabic
                ? 'على عكس Haraj (1% عمولة). FOX ما بتاخد أي نسبة من بيعك.'
                : 'Unlike Haraj (1% commission). FOX takes nothing from your sale.'}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 text-[10px] text-ink-muted pt-1">
          <span className="flex items-center gap-1">
            <Lock size={11} variant="Bold" color="currentColor" />
            {isArabic ? 'دفع آمن' : 'Secure payment'}
          </span>
          <span className="text-line-strong">·</span>
          <span className="flex items-center gap-1">
            <ShieldTick size={11} variant="Bold" color="currentColor" />
            {isArabic ? 'ضمان استرداد' : 'Refund guarantee'}
          </span>
        </div>
      </div>
    </Drawer>
  );
};
