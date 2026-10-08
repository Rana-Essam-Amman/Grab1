import React from 'react';
import { Icon } from '@iconify/react';
import { ArrowLeft2, ArrowRight2 } from 'iconsax-react';

export type PromoteProduct = 'featured' | 'turbo' | 'auto-bump' | 'vip';

export interface PromoteOption {
  readonly id: PromoteProduct;
  readonly emoji: string;
  readonly titleAr: string;
  readonly titleEn: string;
  readonly descAr: string;
  readonly descEn: string;
  readonly price: number;
  readonly currency: string;
  readonly durationAr: string;
  readonly durationEn: string;
  readonly accent: 'accent' | 'info' | 'success' | 'warning';
  readonly badgeAr?: string;
  readonly badgeEn?: string;
}

interface PromoteOptionCardProps {
  readonly option: PromoteOption;
  readonly isArabic: boolean;
  readonly disabled: boolean;
  readonly onSelect: (id: PromoteProduct) => void;
}

const ACCENT_STYLES: Record<PromoteOption['accent'], { ring: string; iconBg: string; priceText: string }> = {
  accent:  { ring: 'border-accent/40 hover:border-accent',  iconBg: 'bg-accent/15',  priceText: 'text-accent-strong' },
  info:    { ring: 'border-info/40 hover:border-info',      iconBg: 'bg-info/15',    priceText: 'text-info' },
  success: { ring: 'border-success/40 hover:border-success', iconBg: 'bg-success/15', priceText: 'text-success' },
  warning: { ring: 'border-warning/50 hover:border-warning', iconBg: 'bg-warning/20', priceText: 'text-warning' },
};

export const PromoteOptionCard: React.FC<PromoteOptionCardProps> = ({
  option,
  isArabic,
  disabled,
  onSelect,
}) => {
  const Arrow = isArabic ? ArrowLeft2 : ArrowRight2;
  const styles = ACCENT_STYLES[option.accent];
  const badge = isArabic ? option.badgeAr : option.badgeEn;

  return (
    <button
      type="button"
      onClick={() => onSelect(option.id)}
      disabled={disabled}
      className={`relative w-full flex items-center gap-3 p-3.5 rounded-3xl border-2 bg-surface transition-all active:scale-[0.98] cursor-pointer text-start disabled:opacity-50 disabled:cursor-not-allowed ${styles.ring}`}
    >
      {badge && (
        <span className="absolute -top-2 start-5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-accent to-accent-strong text-white text-[10px] font-black shadow-md tracking-wide">
          {badge}
        </span>
      )}

      <div className={`w-12 h-12 rounded-2xl ${styles.iconBg} flex items-center justify-center shrink-0`}>
        <Icon icon={option.emoji} width={28} height={28} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="text-sm font-black text-ink leading-tight">
          {isArabic ? option.titleAr : option.titleEn}
        </div>
        <div className="text-[11px] text-ink-muted mt-1 leading-snug">
          {isArabic ? option.descAr : option.descEn}
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <div className="text-end">
          <div className={`text-base font-black leading-none ${styles.priceText}`}>
            {option.price}
            <span className="text-[10px] text-ink-muted font-bold ms-0.5">
              {option.currency}
            </span>
          </div>
          <div className="text-[10px] text-ink-muted font-semibold mt-1">
            {isArabic ? option.durationAr : option.durationEn}
          </div>
        </div>
        <Arrow size={16} variant="Linear" className="text-ink-muted shrink-0" />
      </div>
    </button>
  );
};
