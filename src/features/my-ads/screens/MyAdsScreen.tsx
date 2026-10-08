import { Listing } from '@/types';
import { useUI } from '@/hooks/useUI';
import { useListings } from '@/hooks/useListings';
import React, { useState, useMemo, useCallback } from 'react';
import { useBumpLimits } from '../hooks/useBumpLimits';
import { toast } from 'sonner';
import { usePayment } from '@/shared/services/payment';
import { PromoteSheet } from '../components/PromoteSheet';
import { PROMOTE_TYPE_MAP, getPromotePrice } from '../helpers/promoteOptions';
import type { PromoteProduct } from '../components/PromoteOptionCard';
import { MONETIZATION_MATRIX } from '@/data/monetization';
import { MyAdsHeader } from '../components/MyAdsHeader';
import { MyAdsTabs } from '../components/MyAdsTabs';
import { MyAdsContent } from '../components/MyAdsContent';

export const MyAdsScreen: React.FC = () => {
  const { isArabic, browseCountryCode, navigateTo, setSelectedListingId, setActiveTab } = useUI();
  const { userListings, wishlistListings, deleteListing, updateListing } = useListings();
  const [activeSubTab, setActiveSubTab] = useState<'my' | 'wishlist'>('my');
  const [promoteTarget, setPromoteTarget] = useState<Listing | null>(null);
  const { purchase, isProcessing } = usePayment();

  const pkg = MONETIZATION_MATRIX.packages[browseCountryCode] || MONETIZATION_MATRIX.packages['JO'];

  const displayedMyAds = useMemo(() => userListings, [userListings]);

  const sortedMyAds = useMemo(() => {
    return [...displayedMyAds].sort((a, b) => {
      const aT = new Date(a.lastBumpedAt || a.createdAt || 0).getTime();
      const bT = new Date(b.lastBumpedAt || b.createdAt || 0).getTime();
      return bT - aT;
    });
  }, [displayedMyAds]);

  const displayedIds = useMemo(() => displayedMyAds.map((l) => l.id), [displayedMyAds]);
  const { counts: bumpCounts, bump } = useBumpLimits(displayedIds);

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

  const handleBump = useCallback(async (id: string) => {
    const ok = await bump(id);
    if (ok) {
      toast.success(isArabic ? 'تم رفع الإعلان ✓' : 'Ad bumped ✓');
    } else {
      toast.error(isArabic ? 'تجاوزت الحد اليومي (3 مرات)' : 'Daily limit reached (3×)');
    }
  }, [bump, isArabic]);

  const handlePromoteSelect = useCallback(
    async (product: PromoteProduct) => {
      if (!promoteTarget) return;
      const receipt = await purchase({
        type: PROMOTE_TYPE_MAP[product],
        listingId: promoteTarget.id,
        countryCode: browseCountryCode,
        currency: pkg.currency,
        amount: getPromotePrice(pkg, product),
      });
      if (receipt) {
        if (product === 'featured') {
          updateListing(promoteTarget.id, { isPremium: true, lastBumpedAt: new Date().toISOString() });
        } else if (product === 'turbo') {
          updateListing(promoteTarget.id, { lastBumpedAt: new Date().toISOString() });
        } else if (product === 'auto-bump') {
          updateListing(promoteTarget.id, { isAutoBumpActive: true });
        }
        toast.success(isArabic ? 'تم تفعيل الخدمة ✓' : 'Service activated ✓');
      } else {
        toast.error(isArabic ? 'فشل الدفع' : 'Payment failed');
      }
      setPromoteTarget(null);
    },
    [promoteTarget, purchase, browseCountryCode, pkg, updateListing, isArabic]
  );

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
        bumpCounts={bumpCounts}
        onNewAd={handleNewAd}
        onEdit={handleEdit}
        onMarkSold={handleMarkSold}
        onDelete={handleDelete}
        onBump={handleBump}
        onPromote={setPromoteTarget}
      />

      <PromoteSheet
        open={Boolean(promoteTarget)}
        isArabic={isArabic}
        marketCode={browseCountryCode}
        isProcessing={isProcessing}
        onClose={() => setPromoteTarget(null)}
        onSelect={handlePromoteSelect}
      />
    </div>
  );
};
