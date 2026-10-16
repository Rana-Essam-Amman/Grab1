import React from 'react';
import type { MarketCode } from './adminRpc';

const MARKETS_LIST: { code: MarketCode; label: string }[] = [
  { code: 'JO', label: 'الأردن' },
  { code: 'SA', label: 'السعودية' },
  { code: 'LB', label: 'لبنان' },
  { code: 'PS', label: 'فلسطين' },
  { code: 'SY', label: 'سوريا' },
];

interface Props {
  market: MarketCode;
  onMarketChange: (m: MarketCode) => void;
  metrics?: {
    users: number;
    listings: number;
    reports: number;
    revenue_cents: number;
    currency: string;
  };
}

export const AdminOverview: React.FC<Props> = ({ market, onMarketChange, metrics }) => {
  const currency = metrics?.currency || 'JOD';
  const revenue = ((metrics?.revenue_cents ?? 0) / 100).toFixed(2);

  return (
    <div className="flex flex-col gap-4 p-4" dir="rtl">
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {MARKETS_LIST.map((m) => {
          const isActive = m.code === market;
          return (
            <button
              key={m.code}
              type="button"
              onClick={() => onMarketChange(m.code)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-surface border border-border text-ink-muted hover:text-ink'
              }`}
            >
              {m.label} ({m.code})
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-surface border border-border rounded-xl p-3 flex flex-col gap-1">
          <span className="text-xs text-ink-muted">مستخدمون</span>
          <span className="text-xl font-bold text-ink">{metrics?.users ?? 0}</span>
        </div>
        <div className="bg-surface border border-border rounded-xl p-3 flex flex-col gap-1">
          <span className="text-xs text-ink-muted">إعلانات نشطة</span>
          <span className="text-xl font-bold text-ink">{metrics?.listings ?? 0}</span>
        </div>
        <div className="bg-surface border border-border rounded-xl p-3 flex flex-col gap-1">
          <span className="text-xs text-ink-muted">بلاغات معلقة</span>
          <span className="text-xl font-bold text-red-500">{metrics?.reports ?? 0}</span>
        </div>
        <div className="bg-surface border border-border rounded-xl p-3 flex flex-col gap-1">
          <span className="text-xs text-ink-muted">دخل الاشتراكات</span>
          <span className="text-xl font-bold text-emerald-600">
            {revenue} <span className="text-xs font-normal text-ink-muted">{currency}</span>
          </span>
        </div>
      </div>
    </div>
  );
};
