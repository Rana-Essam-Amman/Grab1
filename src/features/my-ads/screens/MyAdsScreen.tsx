import { useUI } from '@/hooks/useUI';
import { useListings } from '@/hooks/useListings';
import React, { useState, useMemo, useCallback } from 'react';
import { toast } from 'sonner';
import { MyAdsHeader } from '../components/MyAdsHeader';
import { MyAdsTabs } from '../components/MyAdsTabs';
import { MyAdsContent } from '../components/MyAdsContent';

export const MyAdsScreen: React.FC = () => {
  const { isArabic, navigateTo, setSelectedListingId, setActiveTab } = useUI();
  const { userListings, wishlistListings, deleteListing, updateListing } = useListings();
  const [activeSubTab, setActiveSubTab] = useState<'my' | 'wishlist'>('my');

  const displayedMyAds = useMemo(() => userListings, [userListings]);

  const sortedMyAds = useMemo(() => {
    return [...displayedMyAds].sort((a, b) => {
      const aT = new Date(a.createdAt || 0).getTime();
      const bT = new Date(b.createdAt || 0).getTime();
      return bT - aT;
    });
  }, [displayedMyAds]);

  const handleBack = useCallback(() => {
    setActiveTab('explore');
    navigateTo('main');
  }, [setActiveTab, navigateTo]);

  const handleNewAd = useCallback(() => navigateTo('post-ad-entry'), [navigateTo]);

  const handleEdit = useCallback((id: string) => {
    setSelectedListingId(id);
    navigateTo('edit-post');
  }, [setSelectedListingId, navigateTo]);

  const handleMarkSold = useCallback((id: string) => {
    updateListing(id, { status: 'sold' });
  }, [updateListing]);

  const handleDelete = useCallback(async (id: string) => {
    const result = await deleteListing(id);
    if (result.success) {
      toast.success(isArabic ? 'تم حذف الإعلان' : 'Listing deleted');
    } else {
      toast.error(isArabic ? 'فشل حذف الإعلان — حاول مرة أخرى' : 'Failed to delete — try again');
    }
  }, [deleteListing, isArabic]);

  return (
    <div className="flex flex-col pb-24 px-4 pt-3" dir={isArabic ? 'rtl' : 'ltr'}>
      <MyAdsHeader isArabic={isArabic} onBack={handleBack} onNewAd={handleNewAd} />
      <MyAdsTabs
        isArabic={isArabic}
        activeSubTab={activeSubTab}
        myCount={displayedMyAds.length}
        wishlistCount={wishlistListings.length}
        onTabChange={setActiveSubTab}
      />
      <MyAdsContent
        isArabic={isArabic}
        activeSubTab={activeSubTab}
        sortedMyAds={sortedMyAds}
        wishlistListings={wishlistListings}
        onNewAd={handleNewAd}
        onEdit={handleEdit}
        onMarkSold={handleMarkSold}
        onDelete={handleDelete}
      />
    </div>
  );
};
