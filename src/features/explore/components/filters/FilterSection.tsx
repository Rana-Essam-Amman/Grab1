import React, { useState } from 'react';
import { ArrowDown2, ArrowUp2 } from 'iconsax-react';

export interface FilterSectionProps {
  readonly isArabic: boolean;
  readonly title: string;
  readonly activeCount?: number;
  readonly defaultOpen?: boolean;
  readonly children: React.ReactNode;
}

export const FilterSection: React.FC<FilterSectionProps> = ({
  title, activeCount = 0, defaultOpen = true, children,
}) => {
  const [open, setOpen] = useState(defaultOpen);
  const Chevron = open ? ArrowUp2 : ArrowDown2;
  return (
    <section className="rounded-2xl border border-border bg-surface overflow-hidden shadow-xs">
      <button
        type="button"
        data-testid="filter-section-toggle"
        data-section-title={title}
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-start cursor-pointer hover:bg-canvas/40 transition-colors"
      >
        <span className="flex items-center gap-2">
          <span className="text-sm font-bold text-ink">{title}</span>
          {activeCount > 0 && (
            <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-accent text-white text-[10px] font-black flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </span>
        <Chevron size={16} variant="Bold" className="text-ink-muted shrink-0" />
      </button>
      {open && <div className="px-4 pb-4 pt-1">{children}</div>}
    </section>
  );
};
