import React from 'react';
import { ArchiveBook, CloseCircle } from 'iconsax-react';
import { Listing } from '@/types';
import { ListingCard } from '@/shared/components';

interface WishlistItemsListProps {
  isArabic: boolean;
  filteredListings: Listing[];
  layoutMode: 'grid' | 'horizontal';
  onSelectCategory: (cat: string) => void;
  onRemoveItem: (listingId: string) => void;
}

export const WishlistItemsList: React.FC<WishlistItemsListProps> = ({
  isArabic,
  filteredListings,
  layoutMode,
  onSelectCategory,
  onRemoveItem,
}) => {
  if (filteredListings.length === 0) {
    return (
      <div className="py-16 text-center border border-border border-dashed rounded-2xl bg-surface flex flex-col items-center gap-2">
        <ArchiveBook size={28} variant="Linear" className="text-ink-muted" />
        <div className="text-xs font-bold text-ink">
          {isArabic ? 'لا توجد إعلانات في هذا القسم' : 'No items found in this category'}
        </div>
        <button
          onClick={() => onSelectCategory('all')}
          className="text-[10px] px-2.5 py-1 rounded-lg bg-background border border-border text-ink hover:bg-border transition-colors font-semibold cursor-pointer"
        >
          {isArabic ? 'عرض كل المحفوظات' : 'Show all saved items'}
        </button>
      </div>
    );
  }

  if (layoutMode === 'grid') {
    return (
      <div className="grid grid-cols-2 gap-3.5">
        {filteredListings.map((listing: Listing) => (
          <div key={listing.id} className="relative group">
            <ListingCard listing={listing} />
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onRemoveItem(listing.id);
              }}
              className="absolute top-2 start-2 w-7 h-7 rounded-full bg-surface/90 border border-border text-danger hover:bg-danger hover:text-white shadow-sm z-20 active:scale-90 transition-all flex items-center justify-center cursor-pointer"
              title={isArabic ? 'إزالة من المفضلة' : 'Remove from Favorites'}
            >
              <CloseCircle size={14} variant="Linear" />
            </button>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {filteredListings.map((listing: Listing) => (
        <div key={listing.id} className="relative group">
          <ListingCard listing={listing} layout="horizontal" />
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onRemoveItem(listing.id);
            }}
            className="absolute top-2 start-2 w-7 h-7 rounded-full bg-surface/90 border border-border text-danger hover:bg-danger hover:text-white shadow-sm z-20 active:scale-90 transition-all flex items-center justify-center cursor-pointer"
            title={isArabic ? 'إزالة من المفضلة' : 'Remove from Favorites'}
          >
            <CloseCircle size={14} variant="Linear" />
          </button>
        </div>
      ))}
    </div>
  );
};
