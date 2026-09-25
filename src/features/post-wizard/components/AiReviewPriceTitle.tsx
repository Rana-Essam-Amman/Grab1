import React from 'react';

interface AiReviewPriceTitleProps {
  readonly isArabic: boolean;
  readonly title: string;
  readonly price: string;
  readonly currency: string;
  readonly onTitleChange: (v: string) => void;
  readonly onPriceChange: (v: string) => void;
}

export const AiReviewPriceTitle: React.FC<AiReviewPriceTitleProps> = ({
  isArabic, title, price, currency, onTitleChange, onPriceChange,
}) => {
  const titleFilled = Boolean(title && title.trim());
  const priceFilled = Boolean(price && price.trim());
  return (
    <div className="flex flex-col gap-4">
      {/* PRICE — primary, biggest */}
      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-black text-ink-muted uppercase tracking-widest ps-1">
          {isArabic ? 'السعر' : 'Price'}
        </label>
        <div
          className={`relative rounded-2xl border-2 transition-all duration-300 ${priceFilled ? 'border-brand/40 bg-brand/5 shadow-sm shadow-brand/10' : 'border-line bg-canvas'}`}
        >
          <input
            type="text"
            inputMode="numeric"
            value={price}
            onChange={(e) => onPriceChange(e.target.value.replace(/[^0-9]/g, ''))}
            placeholder="0"
            className="w-full h-16 ps-5 pe-24 bg-transparent text-3xl font-black text-primary outline-none placeholder:text-ink-muted/40"
          />
          <span className={`absolute end-5 top-1/2 -translate-y-1/2 text-base font-black transition-colors duration-300 ${priceFilled ? 'text-brand' : 'text-ink-muted'}`}>
            {currency}
          </span>
        </div>
      </div>

      {/* TITLE */}
      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-black text-ink-muted uppercase tracking-widest ps-1">
          {isArabic ? 'العنوان' : 'Title'}
        </label>
        <div
          className={`relative rounded-2xl border-2 transition-all duration-300 ${titleFilled ? 'border-brand/40 bg-brand/5 shadow-sm shadow-brand/10' : 'border-line bg-canvas'}`}
        >
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder={isArabic ? 'اكتب عنوان الإعلان' : 'Write a title'}
            className="w-full h-14 px-5 bg-transparent text-lg font-bold text-ink placeholder:text-ink-muted placeholder:font-normal outline-none"
          />
        </div>
      </div>
    </div>
  );
};
