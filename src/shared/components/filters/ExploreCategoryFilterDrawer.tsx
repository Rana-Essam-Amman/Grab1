import React from 'react';
import { Drawer } from '@/shared/ui/Drawer';
import { categories } from '@/data/categories';
import { CloseCircle, TickCircle } from 'iconsax-react';

export interface ExploreCategoryFilterDrawerProps {
  open: boolean;
  onClose: () => void;
  isArabic: boolean;
  activeCategory: string | null;
  onSelectCategory: (slug: string | null) => void;
}

export const ExploreCategoryFilterDrawer: React.FC<ExploreCategoryFilterDrawerProps> = React.memo(({
  open, onClose, isArabic, activeCategory, onSelectCategory,
}) => {
  const handleSelect = (slug: string | null) => { onSelectCategory(slug); onClose(); };

  return (
    <Drawer 
      open={open} 
      onOpenChange={(isOpen) => !isOpen && onClose()} 
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <div className="flex flex-col gap-3 font-cairo">
        {/* Close button (top-start) */}
        <div className="flex items-start justify-start">
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-10 h-10 rounded-full bg-brand text-white flex items-center justify-center shadow-md active:scale-95"
          >
            <CloseCircle size={18} variant="Bold" color="currentColor" />
          </button>
        </div>

        {/* Categories List */}
        <div className="flex flex-col gap-3 overflow-y-auto max-h-[65vh]">
          {/* Primary Pill ("all" option) */}
          <button 
            type="button"
            onClick={() => handleSelect(null)}
            className={`w-full h-14 rounded-full flex items-center justify-between px-4 font-bold transition-all active:scale-[0.98] ${
              !activeCategory 
                ? 'bg-brand text-white' 
                : 'bg-surface-sunken text-ink'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm">{isArabic ? 'جميع الأقسام' : 'All Categories'}</span>
            </div>
            {!activeCategory && (
              <span className="w-6 h-6 rounded-full bg-accent flex items-center justify-center">
                <TickCircle size={14} variant="Bold" color="currentColor" className="text-white" />
              </span>
            )}
          </button>

          {/* PATTERN A — Grid with images */}
          <div className="grid grid-cols-2 gap-3">
            {categories.map((cat) => {
              const isSelected = activeCategory === cat.slug;
              return (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => handleSelect(cat.slug)}
                  className={`h-16 rounded-full flex items-center justify-between px-4 gap-2 transition-all active:scale-[0.98] ${
                    isSelected 
                      ? 'bg-brand text-white font-bold' 
                      : 'bg-surface-sunken text-ink font-bold'
                  }`}
                >
                  <span className="text-sm truncate flex-1 text-start">{isArabic ? cat.nameAr : cat.nameEn}</span>
                  {isSelected ? (
                    <TickCircle size={16} variant="Bold" color="currentColor" className="text-accent shrink-0" />
                  ) : (
                    <img
                      src={cat.asset}
                      alt={cat.nameEn}
                      className="w-10 h-10 rounded-full object-cover shrink-0"
                      onError={(e) => { (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><rect width="40" height="40" fill="%23f2eee3"/><text x="20" y="25" font-size="16" text-anchor="middle">🏷️</text></svg>'; }}
                      loading="lazy"
                      decoding="async"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </Drawer>
  );
});

ExploreCategoryFilterDrawer.displayName = 'ExploreCategoryFilterDrawer';
