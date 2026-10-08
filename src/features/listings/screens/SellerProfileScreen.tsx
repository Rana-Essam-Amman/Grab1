import { useUI } from '@/hooks/useUI';
import { useListings } from '@/hooks/useListings';
import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { ListingCard } from '@/shared/components';
import { ArrowLeft, ArrowRight, User, TickCircle } from 'iconsax-react';
import { Card } from '@/shared/ui/Card';
import { Avatar } from '@/shared/ui/Avatar';
import { EmptyState } from '@/shared/ui/EmptyState';
import { BrandMark } from '@/shared/components/BrandMark';
import { filterListingsByMarket } from '@/shared/lib/marketGate';
import { isUuid } from '@/shared/lib/uuid';
import { fetchProfile, type ProfileRecord } from '@/shared/lib/profilesService';
import { fetchSellerReviews, type SellerReview } from '../services/sellerReviewsService';
import { SellerRatingBadge } from '../components/SellerRatingBadge';
import { ReviewList } from '../components/ReviewList';

export const SellerProfileScreen: React.FC = () => {
  const { isArabic, goBack, selectedSellerPhone, browseCountryCode } = useUI();
  const { listings } = useListings();
  const BackIcon = isArabic ? ArrowRight : ArrowLeft;
  const sellerKeyIsUuid = isUuid(selectedSellerPhone);
  const sellerAds = useMemo(() => {
    const scoped = filterListingsByMarket(listings, browseCountryCode);
    if (sellerKeyIsUuid) {
      return scoped.filter((l) => l.userId === selectedSellerPhone);
    }
    return scoped.filter((l) => l.sellerPhone === selectedSellerPhone);
  }, [listings, browseCountryCode, selectedSellerPhone, sellerKeyIsUuid]);
  const sellerId = sellerAds[0]?.userId ?? null;
  const [sellerProfile, setSellerProfile] = useState<ProfileRecord | null>(null);
  const [reviews, setReviews] = useState<SellerReview[]>([]);

  const loadSellerData = useCallback(async () => {
    if (!sellerId) return;
    const [pRes, rRes] = await Promise.all([fetchProfile(sellerId), fetchSellerReviews(sellerId)]);
    setSellerProfile(pRes);
    setReviews(rRes.data);
  }, [sellerId]);

  useEffect(() => { loadSellerData(); }, [loadSellerData]);

  const sellerName = useMemo(() => sellerAds[0]?.sellerName || (isArabic ? 'معلن موثوق' : 'Verified Seller'), [sellerAds, isArabic]);

  return (
    <div className="flex flex-col min-h-screen bg-background pb-16" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="px-4 py-4 bg-brand border-b border-white/10 flex items-center gap-3 sticky top-0 z-20">
        <button type="button" onClick={goBack} aria-label={isArabic ? 'العودة' : 'Go back'}
          className="w-10 h-10 rounded-full bg-surface/15 hover:bg-surface/25 flex items-center justify-center shrink-0 cursor-pointer transition-colors">
          <BackIcon size={18} variant="Linear" color="#FFFFFF" />
        </button>
        <h1 className="text-base font-bold text-white flex-1">{isArabic ? 'ملف البائع' : 'Seller Profile'}</h1>
        <BrandMark isArabic={isArabic} />
      </div>
      <div className="p-4 flex flex-col gap-4">
        <Card variant="default" className="p-4 flex flex-col gap-3 shadow-xs">
          <div className="flex items-center gap-3.5">
            <Avatar fallback={sellerName.charAt(0)} size="lg" className="text-primary font-bold border-border bg-background" />
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-base font-bold text-ink">{sellerName}</h2>
                <TickCircle size={15} variant="Linear" color="currentColor" className="text-success" />
              </div>
              {!sellerKeyIsUuid && selectedSellerPhone && (
                <div className="text-xs text-ink-muted mt-0.5" dir="ltr">{selectedSellerPhone}</div>
              )}
            </div>
          </div>
          <div className="pt-1 border-t border-border">
            <SellerRatingBadge ratingAvg={sellerProfile?.rating_avg ?? 0} ratingCount={sellerProfile?.rating_count ?? 0} isArabic={isArabic} />
          </div>
        </Card>
        {reviews.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-ink mb-3">{isArabic ? 'التقييمات' : 'Reviews'} ({reviews.length})</h3>
            <ReviewList reviews={reviews} isArabic={isArabic} />
          </div>
        )}
        <div>
          <h3 className="text-sm font-bold text-ink mb-3">{isArabic ? 'إعلانات هذا البائع' : 'Listings from this seller'} ({sellerAds.length})</h3>
          {sellerAds.length === 0 ? (
            <EmptyState icon={<User size={40} variant="Linear" />} title={isArabic ? 'لا توجد إعلانات' : 'No Listings'}
              description={isArabic ? 'هذا البائع لا يملك إعلانات نشطة حالياً.' : 'This seller has no active listings right now.'} />
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {sellerAds.map((ad) => (<ListingCard key={ad.id} listing={ad} />))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
