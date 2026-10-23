import React from 'react';
import { Add, Minus, ArrowLeft2, ArrowRight2 } from 'iconsax-react';
import type { SubcategoryDef } from '@/types';
import type { CleaningGroup } from '@/data/cleaningGroups';

interface CleaningGroupCardProps {
  group: CleaningGroup;
  subcategories: readonly SubcategoryDef[];
  isExpanded: boolean;
  isArabic: boolean;
  subCounts: Record<string, number>;
  onToggle: (key: string) => void;
  onSelectSub: (slug: string) => void;
}

export const CleaningGroupCard: React.FC<CleaningGroupCardProps> = ({
  group,
  subcategories,
  isExpanded,
  isArabic,
  subCounts,
  onToggle,
  onSelectSub,
}) => {
  const ChevronIcon = isArabic ? ArrowLeft2 : ArrowRight2;
  const groupTotal = subcategories.reduce((sum, s) => sum + (subCounts[s.slug] || 0), 0);

  return (
    <div className="rounded-2xl border border-border bg-surface overflow-hidden">
      <button
        type="button"
        onClick={() => onToggle(group.key)}
        className="w-full flex items-center justify-between p-4 hover:bg-canvas/40 active:scale-[0.99] transition-all cursor-pointer"
        data-testid={`cleaning-group-${group.key}`}
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-3">
          <span className="text-lg">{group.icon}</span>
          <span className="font-cairo font-bold text-ink text-sm">
            {isArabic ? group.labelAr : group.labelEn}
          </span>
          <span className="text-[11px] text-ink-muted font-medium bg-canvas px-2 py-0.5 rounded-full font-cairo">
            {subcategories.length}
          </span>
          {groupTotal > 0 && (
            <span className="text-[11px] text-ink-muted font-medium font-cairo">
              • {groupTotal}
            </span>
          )}
        </div>
        <span className="text-ink-muted">
          {isExpanded ? <Minus size={16} /> : <Add size={16} />}
        </span>
      </button>
      {isExpanded && (
        <div className="border-t border-border bg-canvas/20 flex flex-col">
          {subcategories.map((sub) => {
            const count = subCounts[sub.slug] || 0;
            return (
              <button
                key={sub.slug}
                type="button"
                onClick={() => onSelectSub(sub.slug)}
                className="w-full flex items-center justify-between px-4 py-3 text-start hover:bg-surface active:scale-[0.99] transition-all cursor-pointer border-b border-border/50 last:border-b-0"
                data-testid={`cleaning-sub-${sub.slug}`}
              >
                <span className="font-cairo text-sm text-ink font-medium">
                  {isArabic ? sub.nameAr : sub.nameEn}
                </span>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] text-ink-muted font-cairo">
                    {count} {isArabic ? 'إعلان' : 'listings'}
                  </span>
                  <ChevronIcon size={14} className="text-ink-muted" />
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
