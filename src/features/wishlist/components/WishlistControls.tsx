import React from 'react';
import { Grid, List } from 'lucide-react';

interface WishlistControlsProps {
  isArabic: boolean;
  selectedCategory: string;
  availableCategories: string[];
  layoutMode: 'grid' | 'horizontal';
  onSelectCategory: (category: string) => void;
  onChangeLayout: (mode: 'grid' | 'horizontal') => void;
}

export const WishlistControls: React.FC<WishlistControlsProps> = ({
  isArabic,
  selectedCategory,
  availableCategories,
  layoutMode,
  onSelectCategory,
  onChangeLayout,
}) => {
  return (
    <div className="flex items-center justify-between gap-2.5">
      {/* Horizontal Scrollable Categories */}
      <div className="flex-1 flex gap-1.5 overflow-x-auto pb-1 scrollbar-none scroll-smooth">
        <button
          onClick={() => onSelectCategory('all')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
            selectedCategory === 'all'
              ? 'bg-ink text-white'
              : 'text-ink-muted bg-surface border border-border hover:text-ink'
          }`}
        >
          {isArabic ? 'الكل' : 'All'}
        </button>
        {availableCategories
          .filter((cat) => cat !== 'all')
          .map((cat) => (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap capitalize transition-all ${
                selectedCategory === cat
                  ? 'bg-primary text-white'
                  : 'text-ink-muted bg-surface border border-border hover:text-ink'
              }`}
            >
              {cat}
            </button>
          ))}
      </div>

      {/* Layout Toggler */}
      <div className="flex bg-background p-1 rounded-2xl border border-border">
        <button
          onClick={() => onChangeLayout('grid')}
          className={`p-2 rounded-xl transition-all ${
            layoutMode === 'grid' ? 'bg-surface text-ink shadow-xs' : 'text-ink-muted'
          }`}
          title={isArabic ? 'عرض شبكي' : 'Grid view'}
        >
          <Grid size={16} />
        </button>
        <button
          onClick={() => onChangeLayout('horizontal')}
          className={`p-2 rounded-xl transition-all ${
            layoutMode === 'horizontal' ? 'bg-surface text-ink shadow-xs' : 'text-ink-muted'
          }`}
          title={isArabic ? 'عرض طولي' : 'List view'}
        >
          <List size={16} />
        </button>
      </div>
    </div>
  );
};
