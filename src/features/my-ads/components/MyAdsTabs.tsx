import React from 'react';
import { Tag, ArchiveBook, Heart } from 'iconsax-react';

interface MyAdsTabsProps {
  readonly isArabic: boolean;
  readonly activeSubTab: 'my' | 'wishlist';
  readonly myCount: number;
  readonly wishlistCount: number;
  readonly onTabChange: (tab: 'my' | 'wishlist') => void;
}

export const MyAdsTabs: React.FC<MyAdsTabsProps> = ({
  isArabic, activeSubTab, myCount, wishlistCount, onTabChange,
}) => (
  <div className="flex bg-background p-1 rounded-2xl border border-border mb-4">
    <button
      onClick={() => onTabChange('my')}
      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
        activeSubTab === 'my' ? 'bg-surface text-ink shadow-xs' : 'text-ink-muted hover:text-ink'
      }`}
    >
      <Tag size={14} variant="Linear" />
      <span>{isArabic ? 'إعلاناتي المنشورة' : 'My Listings'} ({myCount})</span>
    </button>

    <button
      onClick={() => onTabChange('wishlist')}
      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
        activeSubTab === 'wishlist' ? 'bg-surface text-ink shadow-xs' : 'text-ink-muted hover:text-ink'
      }`}
    >
      <div className="relative flex items-center justify-center">
        <ArchiveBook size={14} variant={activeSubTab === 'wishlist' ? 'Bold' : 'Linear'} color={activeSubTab === 'wishlist' ? '#E57E25' : undefined} className={activeSubTab === 'wishlist' ? 'text-primary' : ''} />
        <Heart size={7} variant="Bold" color="#FFFFFF" className="absolute top-[2px] text-white" />
      </div>
      <span>{isArabic ? 'المفضلة' : 'Favorites'} ({wishlistCount})</span>
    </button>
  </div>
);
