import React from 'react';
import { MARKETS, ALL_MARKET_CODES } from '@/data/markets/config';
import type { MarketCode } from '@/shared/lib/marketGate';

const FLAG_SRC: Record<MarketCode, string> = {
  JO: '/flags/jo.jpg',
  SA: '/flags/sa.jpg',
  LB: '/flags/lb.jpg',
  PS: '/flags/ps.jpg',
  SY: '/flags/sy.jpg',
};

interface ChatMarketTabsProps {
  readonly isArabic: boolean;
  readonly activeMarket: MarketCode;
  readonly counts: Record<MarketCode, number>;
  readonly onSelect: (market: MarketCode) => void;
}

export const ChatMarketTabs: React.FC<ChatMarketTabsProps> = ({
  isArabic,
  activeMarket,
  counts,
  onSelect,
}) => (
  <div
    className="flex gap-2 overflow-x-auto pb-1 no-scrollbar mb-4"
    dir={isArabic ? 'rtl' : 'ltr'}
  >
    {ALL_MARKET_CODES.map((code) => {
      const market = MARKETS[code];
      const isActive = code === activeMarket;
      const count = counts[code] ?? 0;
      return (
        <button
          key={code}
          type="button"
          onClick={() => onSelect(code)}
          data-testid={`chat-tab-${code}`}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-full border shrink-0 transition-all cursor-pointer ${
            isActive
              ? 'border-brand bg-brand text-white font-bold'
              : 'border-border bg-surface-sunken text-ink-muted hover:border-accent'
          }`}
          aria-pressed={isActive}
        >
          <img src={FLAG_SRC[code]} alt="" className="w-4 h-3 object-cover rounded-[2px]" />
          <span className="text-xs">{isArabic ? market.nameAr : market.nameEn}</span>
          <span
            className={`text-[10px] font-bold px-1.5 rounded-full ${
              isActive ? 'bg-white/20' : 'bg-ink/5'
            }`}
          >
            {count}
          </span>
        </button>
      );
    })}
  </div>
);
