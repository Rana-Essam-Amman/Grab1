import React from 'react';
import { Button } from '@/shared/ui/Button';

interface HeaderCurrencySelectorProps {
  currencies: Array<{ code: string }>;
  activeCurrency: string;
  isArabic: boolean;
  handleCurrencySelect: (code: string) => void;
}

export const HeaderCurrencySelector: React.FC<HeaderCurrencySelectorProps> = ({
  currencies,
  activeCurrency,
  isArabic,
  handleCurrencySelect,
}) => {
  if (currencies.length <= 1) return null;

  return (
    <div className="flex flex-col gap-1.5 pt-1.5 border-t border-border">
      <span className="text-[10px] font-bold text-ink-muted self-start">
        {isArabic ? 'اختر العملة:' : 'Select Currency:'}
      </span>
      <div className="flex items-center gap-1.5 bg-background p-1 rounded-full border border-border w-full justify-around">
        {currencies.map((curr) => {
          const active = curr.code === activeCurrency;
          return (
            <Button
              key={curr.code}
              variant={active ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => handleCurrencySelect(curr.code)}
              className={`flex-1 h-auto py-1 px-0 rounded-full text-xs font-bold transition-all ${
                active ? 'shadow-xs' : 'text-ink-muted hover:text-ink hover:bg-transparent'
              }`}
            >
              {curr.code}
            </Button>
          );
        })}
      </div>
    </div>
  );
};
