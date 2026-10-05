import React, { useEffect, useState } from 'react';

interface AiReviewProgressProps {
  readonly isArabic: boolean;
  readonly completed: number;
  readonly total: number;
}

export const AiReviewProgress: React.FC<AiReviewProgressProps> = ({
  isArabic, completed, total,
}) => {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const isComplete = pct === 100;
  const [fillPct, setFillPct] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setFillPct(pct), 50);
    return () => clearTimeout(t);
  }, [pct]);

  return (
    <div className="rounded-xl border border-line bg-surface px-4 py-3 flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] font-bold text-ink-muted uppercase tracking-widest">
          {isArabic ? 'حقول مكتملة' : 'Fields complete'}
        </span>
        <span className={`text-[12px] font-black transition-colors duration-300 ${isComplete ? 'text-success' : 'text-accent'}`}>
          {completed}/{total}
        </span>
      </div>
      <div className="relative h-1.5 rounded-full bg-canvas">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${isComplete ? 'bg-success' : 'bg-accent'}`}
          style={{ width: `${fillPct}%` }}
        />
        {!isComplete && fillPct > 0 && fillPct < 100 && (
          <span
            className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-accent animate-pulse transition-all duration-500"
            style={{ left: `calc(${fillPct}% - 4px)` }}
          />
        )}
      </div>
    </div>
  );
};
