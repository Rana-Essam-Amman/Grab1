import React from 'react';
import { MagicStar, Tag, Coin1, TickCircle, DocumentText, Add, CloseCircle, Icon } from 'iconsax-react';

export interface AiPostSuggestionProps {
  readonly state: {
    readonly confidence: number;
    readonly signals: readonly string[];
    readonly rawText: string;
  };
  readonly onAccept: () => void;
  readonly onDismiss: () => void;
  readonly isArabic: boolean;
}

const SIGNAL_LABELS: Record<
  string,
  {
    ar: string;
    en: string;
    Icon: Icon;
  }
> = {
  explicit_sell: { ar: 'نية بيع', en: 'Sell intent', Icon: Tag },
  price: { ar: 'سعر محدد', en: 'Price', Icon: Coin1 },
  condition: { ar: 'حالة مذكورة', en: 'Condition', Icon: TickCircle },
  detailed: { ar: 'وصف مفصل', en: 'Detailed', Icon: DocumentText },
};

export const AiPostSuggestion: React.FC<AiPostSuggestionProps> = ({
  state,
  onAccept,
  onDismiss,
  isArabic,
}) => {
  const { rawText, signals } = state;
  const validSignals = signals.filter((s) => s in SIGNAL_LABELS);

  return (
    <div
      dir={isArabic ? 'rtl' : 'ltr'}
      className="w-full max-w-[440px] mx-auto bg-surface rounded-2xl border border-accent/30 shadow-xs p-3.5 font-cairo animate-in fade-in slide-in-from-top-2"
    >
      <div className="flex items-center gap-2">
        <MagicStar size={18} variant="Bold" color="#E57E25" />
        <h4 className="text-sm font-bold text-ink">
          {isArabic ? 'يبدو أنك تصف إعلان للبيع' : 'It looks like a listing'}
        </h4>
      </div>

      <p className="text-xs text-ink-soft italic leading-relaxed mt-2" dir="auto">
        {rawText.length > 60 ? rawText.slice(0, 60) + '…' : rawText}
      </p>

      {validSignals.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2.5">
          {validSignals.map((sig) => {
            const label = SIGNAL_LABELS[sig];
            const IconComponent = label.Icon;
            return (
              <span
                key={sig}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent/10 text-accent text-[10px] font-semibold"
              >
                <IconComponent size={10} variant="Linear" color="#E57E25" />
                {isArabic ? label.ar : label.en}
              </span>
            );
          })}
        </div>
      )}

      <div className="flex items-center gap-2 mt-3">
        <button
          onClick={onAccept}
          className="flex-1 flex items-center justify-center gap-1.5 bg-primary text-white rounded-lg px-3 py-2 text-xs font-bold hover:bg-primary-hover active:scale-[0.98] transition-all cursor-pointer"
        >
          <Add size={14} variant="Bold" color="#FFFFFF" />
          {isArabic ? 'انشر الإعلان' : 'Post it'}
        </button>
        <button
          onClick={onDismiss}
          className="flex items-center justify-center gap-1.5 bg-transparent text-ink-muted border border-line rounded-lg px-3 py-2 text-xs font-semibold hover:bg-canvas active:scale-[0.98] transition-all cursor-pointer"
        >
          <CloseCircle size={14} variant="Linear" color="currentColor" />
          {isArabic ? 'ابحث فقط' : 'Search only'}
        </button>
      </div>
    </div>
  );
};
