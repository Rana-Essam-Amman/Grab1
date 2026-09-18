import React from 'react';
import { Drawer } from '@/shared/ui/Drawer';
import { categories } from '@/data/categories';
import { Check } from 'lucide-react';

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
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-md z-40"
          onClick={onClose}
        />
      )}
      <Drawer 
        open={open} 
        onOpenChange={(isOpen) => !isOpen && onClose()} 
        dir={isArabic ? 'rtl' : 'ltr'}
      >
        <div className="flex flex-col gap-2 font-cairo">
          {/* Close Button Only */}
          <div className="relative w-full h-8 mb-2">
            <button
              onClick={onClose}
              className="absolute top-4 left-4 z-10 w-10 h-10 rounded-full bg-brand text-white flex items-center justify-center shadow-lg cursor-pointer border-none"
              aria-label="Close"
            >
              <span className="text-lg font-bold">×</span>
            </button>
          </div>

        {/* Categories List */}
        <div className="flex flex-col gap-2 overflow-y-auto pe-1 -me-1 max-h-[55vh]">
          <button
            type="button"
            onClick={() => handleSelect(null)}
            className={`flex items-center justify-between px-4 py-3 rounded-2xl border transition-all cursor-pointer ${
              !activeCategory 
                ? 'bg-brand text-white border-brand font-bold' 
                : 'bg-surface-sunken border-line text-ink hover:border-line-strong'
            }`}
          >
            <span className="text-sm font-bold">{isArabic ? 'جميع الأقسام' : 'All Categories'}</span>
            {!activeCategory && <Check size={18} className="text-accent shrink-0" />}
          </button>

          <div className="grid grid-cols-2 gap-2 pt-1">
            {categories.map((cat) => {
              const isSelected = activeCategory === cat.slug;
              return (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => handleSelect(cat.slug)}
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl border transition-all cursor-pointer text-start ${
                    isSelected 
                      ? 'bg-brand text-white border-brand font-bold' 
                      : 'bg-surface-sunken border-line text-ink hover:border-line-strong'
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl bg-white/10 overflow-hidden shrink-0 flex items-center justify-center border border-white/25">
                    <img
                      src={cat.asset}
                      alt={cat.nameEn}
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><rect width="40" height="40" fill="%23f2eee3"/><text x="20" y="25" font-size="16" text-anchor="middle">🏷️</text></svg>'; }}
                    />
                  </div>
                  <span className="text-xs font-bold line-clamp-1 flex-1">{isArabic ? cat.nameAr : cat.nameEn}</span>
                  {isSelected && <Check size={16} className="text-accent shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </Drawer>
    </>
  );
});

ExploreCategoryFilterDrawer.displayName = 'ExploreCategoryFilterDrawer';
