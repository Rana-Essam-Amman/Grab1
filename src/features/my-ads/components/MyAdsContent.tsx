import React from 'react';
import { Listing } from '@/types';
import { ListingCard } from '@/shared/components';
import { Button } from '@/shared/ui/Button';
import { EmptyState } from '@/shared/ui/EmptyState';
import { Icon } from '@iconify/react';
import { ListingActionsBar } from './ListingActionsBar';

interface MyAdsContentProps {
  readonly isArabic: boolean;
  readonly activeSubTab: 'my' | 'wishlist';
  readonly sortedMyAds: readonly Listing[];
  readonly wishlistListings: readonly Listing[];
  readonly bumpCounts: Record<string, number>;
  readonly onNewAd: () => void;
  readonly onEdit: (id: string) => void;
  readonly onMarkSold: (id: string) => void;
  readonly onDelete: (id: string) => void;
  readonly onBump: (id: string) => void;
  readonly onPromote: (listing: Listing) => void;
}

export const MyAdsContent: React.FC<MyAdsContentProps> = ({
  isArabic, activeSubTab, sortedMyAds, wishlistListings, bumpCounts,
  onNewAd, onEdit, onMarkSold, onDelete, onBump, onPromote,
}) => {
  if (activeSubTab === 'my') {
    if (sortedMyAds.length === 0) {
      return (
        <EmptyState
          icon={<Icon icon="fluent-emoji:clipboard" width={48} height={48} />}
          title={isArabic ? 'لم تقم بنشر أي إعلان بعد' : 'No active listings yet'}
          description={isArabic ? 'ابدأ بيع وتداول سلعك اليوم بسهولة وبسرعة!' : 'Start selling and trading your items today easily and quickly!'}
          action={<Button variant="primary" size="md" onClick={onNewAd} className="rounded-full font-bold shadow-md">{isArabic ? 'أضف أول إعلان لك الآن' : 'Post your first ad now'}</Button>}
          className="py-16 bg-surface border border-border rounded-2xl"
        />
      );
    }
    return (
      <div className="flex flex-col gap-3">
        {sortedMyAds.map((listing) => (
          <div key={listing.id} className="rounded-2xl border border-line bg-surface overflow-hidden">
            <ListingCard listing={listing} layout="horizontal" />
            <ListingActionsBar
              isArabic={isArabic}
              status={listing.status}
              bumpDisabled={(bumpCounts[listing.id] || 0) >= 3}
              onEdit={() => onEdit(listing.id)}
              onMarkSold={() => onMarkSold(listing.id)}
              onDelete={() => onDelete(listing.id)}
              onBump={() => onBump(listing.id)}
              onPromote={() => onPromote(listing)}
            />
          </div>
        ))}
      </div>
    );
  }

  if (wishlistListings.length === 0) {
    return (
      <EmptyState
        icon={<Icon icon="fluent-emoji:red-heart" width={48} height={48} />}
        title={isArabic ? 'قائمة المفضلة فارغة' : 'Your favorites list is empty'}
        description={isArabic ? 'اضغط على رمز الإشارة المرجعية والقلب في أي إعلان لحفظه والرجوع إليه بسهولة لاحقاً.' : 'Tap the bookmark heart on any listing to save it for quick reference.'}
        className="py-16 bg-surface border border-border rounded-2xl"
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3.5">
      {wishlistListings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
};
