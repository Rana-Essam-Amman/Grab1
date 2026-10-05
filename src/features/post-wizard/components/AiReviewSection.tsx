import React, { useState } from 'react';
import type { ReactNode } from 'react';
import { ArrowDown2, ArrowUp2 } from 'iconsax-react';

interface AiReviewSectionProps {
  readonly title: string;
  readonly subtitle?: string;
  readonly defaultOpen?: boolean;
  readonly icon?: ReactNode;
  readonly children: ReactNode;
}

export const AiReviewSection: React.FC<AiReviewSectionProps> = ({
  title, subtitle, defaultOpen = false, icon, children,
}) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-3xl overflow-hidden bg-surface border border-line shadow-sm">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="w-full px-4 py-4 flex justify-between items-center gap-3 bg-gradient-to-l from-brand/10 via-brand/4 to-transparent hover:from-brand/15 transition-colors duration-300 cursor-pointer"
      >
        <div className="flex items-center gap-3 flex-1 text-start min-w-0">
          {icon && (
            <div className="w-10 h-10 rounded-2xl bg-surface border-2 border-brand/20 flex items-center justify-center shrink-0 shadow-sm shadow-brand/10">
              {icon}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-[15px] font-black text-ink truncate">{title}</p>
            {subtitle && (
              <p className="text-[11px] font-black text-brand uppercase tracking-widest mt-0.5 truncate">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        <div className="w-9 h-9 rounded-full bg-surface border border-line flex items-center justify-center shrink-0 transition-transform duration-300">
          {open
            ? <ArrowUp2 size={14} variant="Bold" color="currentColor" className="text-ink" />
            : <ArrowDown2 size={14} variant="Bold" color="currentColor" className="text-ink" />}
        </div>
      </button>
      {open && (
        <div className="px-4 pb-4 pt-3 border-t border-line/60 animate-[slide-down_0.3s_ease-out]">
          {children}
        </div>
      )}
    </div>
  );
};
