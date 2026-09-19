import { Listing } from '@/types';
import { useUI } from '@/hooks/useUI';
import { useListings } from '@/hooks/useListings';
import { useDraft } from '@/hooks/useDraft';
import React, { useState, useMemo, useCallback } from 'react';
import { ListingCard } from '@/shared/components';
import { Add, Tag, ArchiveBook, Heart, Trash } from 'iconsax-react';
import { Button } from '@/shared/ui/Button';
import { EmptyState } from '@/shared/ui/EmptyState';
import { filterListingsByMarket } from '@/shared/lib/marketGate';

export const MyAdsScreen: React.FC = () => {
  const { isArabic, browseCountryCode } = useUI();
  const { listings, userListings, wishlistListings, deleteListing } = useListings();
  const { startPostFlow } = useDraft();

  const [activeSubTab, setActiveSubTab] = useState<'my' | 'wishlist'>('my');

  // If user hasn't created listings yet, show recent seed listings as mock user ads or empty state
  const displayedMyAds = useMemo(() => {
    if (userListings.length > 0) return userListings;
    const marketFiltered = filterListingsByMarket(listings, browseCountryCode);
    return marketFiltered.slice(0, 2);
  }, [userListings, listings, browseCountryCode]);

  const handleDelete = useCallback((e: React.MouseEvent, listingId: string) => {
    e.stopPropagation();
    deleteListing(listingId);
  }, [deleteListing]);

  const handleTabChange = useCallback((tab: 'my' | 'wishlist') => {
    setActiveSubTab(tab);
  }, []);

  return (
    <div className="flex flex-col pb-24 px-4 pt-3" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h1 className="text-xl font-bold text-ink">
            {isArabic ? 'إعلاناتي والمفضلة' : 'My Ads & Favorites'}
          </h1>
          <p className="text-xs text-ink-muted">
            {isArabic ? 'إدارة إعلاناتك المنشورة وإعلاناتك المفضلة' : 'Manage your active listings and favorite ads'}
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={startPostFlow}
          className="rounded-full flex items-center gap-1 text-xs font-bold shadow-xs transition-colors"
        >
          <Add size={16} variant="Linear" color="#FFFFFF" />
          <span>{isArabic ? 'إعلان جديد' : 'New Ad'}</span>
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex bg-background p-1 rounded-2xl border border-border mb-4">
        <button
          onClick={() => handleTabChange('my')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeSubTab === 'my'
              ? 'bg-surface text-ink shadow-xs'
              : 'text-ink-muted hover:text-ink'
          }`}
        >
          <Tag size={14} variant="Linear" />
          <span>{isArabic ? 'إعلاناتي المنشورة' : 'My Listings'} ({displayedMyAds.length})</span>
        </button>

        <button
          onClick={() => handleTabChange('wishlist')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeSubTab === 'wishlist'
              ? 'bg-surface text-ink shadow-xs'
              : 'text-ink-muted hover:text-ink'
          }`}
        >
          <div className="relative flex items-center justify-center">
            <ArchiveBook
              size={14}
              variant={activeSubTab === 'wishlist' ? 'Bold' : 'Linear'}
              color={activeSubTab === 'wishlist' ? '#E57E25' : undefined}
              className={activeSubTab === 'wishlist' ? 'text-primary' : ''}
            />
            <Heart size={7} variant="Bold" color="#FFFFFF" className="absolute top-[2px] text-white" />
          </div>
          <span>{isArabic ? 'المفضلة' : 'Favorites'} ({wishlistListings.length})</span>
        </button>
      </div>

      {/* Content */}
      {activeSubTab === 'my' ? (
        displayedMyAds.length === 0 ? (
          <EmptyState
            icon={<Tag size={24} variant="Linear" />}
            title={isArabic ? 'لم تقم بنشر أي إعلان بعد' : 'No active listings yet'}
            description={isArabic ? 'ابدأ بيع وتداول سلعك اليوم بسهولة وبسرعة!' : 'Start selling and trading your items today easily and quickly!'}
            action={
              <Button
                variant="primary"
                size="md"
                onClick={startPostFlow}
                className="rounded-full font-bold shadow-md"
              >
                {isArabic ? 'أضف أول إعلان لك الآن' : 'Post your first ad now'}
              </Button>
            }
            className="py-16 bg-surface border border-border rounded-2xl"
          />
        ) : (
          <div className="flex flex-col gap-3">
            {displayedMyAds.map((listing: Listing) => (
              <div key={listing.id} className="relative">
                <ListingCard listing={listing} layout="horizontal" />
                <button
                  onClick={(e) => handleDelete(e, listing.id)}
                  className="absolute bottom-3 start-3 p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors z-20"
                  title={isArabic ? 'حذف الإعلان' : 'Delete ad'}
                >
                  <Trash size={16} variant="Linear" color="#DC2626" />
                </button>
              </div>
            ))}
          </div>
        )
      ) : wishlistListings.length === 0 ? (
        <EmptyState
          icon={
            <div className="relative flex items-center justify-center">
              <ArchiveBook size={24} variant="Linear" color="#E57E25" className="text-primary" />
              <Heart size={11} variant="Bold" color="#EF4444" className="absolute top-4 text-red-500" />
            </div>
          }
          title={isArabic ? 'قائمة المفضلة فارغة' : 'Your favorites list is empty'}
          description={
            isArabic
              ? 'اضغط على رمز الإشارة المرجعية والقلب في أي إعلان لحفظه والرجوع إليه بسهولة لاحقاً.'
              : 'Tap the bookmark heart on any listing to save it for quick reference.'}
          className="py-16 bg-surface border border-border rounded-2xl"
        />
      ) : (
        <div className="grid grid-cols-2 gap-3.5">
          {wishlistListings.map((listing: Listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
};
