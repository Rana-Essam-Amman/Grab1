import { useUI } from '@/hooks/useUI';
import { useListings } from '@/hooks/useListings';
import React, { useMemo } from 'react';
import { ListingCard } from '@/shared/components';
import { ArrowLeft, ArrowRight, User, TickCircle } from 'iconsax-react';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { Avatar } from '@/shared/ui/Avatar';
import { EmptyState } from '@/shared/ui/EmptyState';
import { filterListingsByMarket } from '@/shared/lib/marketGate';

export const SellerProfileScreen: React.FC = () => {
  const { isArabic, goBack, selectedSellerPhone, browseCountryCode } = useUI();
  const { listings } = useListings();
  const BackIcon = isArabic ? ArrowRight : ArrowLeft;

  const sellerAds = useMemo(() => {
    const marketFiltered = filterListingsByMarket(listings, browseCountryCode);
    return marketFiltered.filter((l) => l.sellerPhone === selectedSellerPhone);
  }, [listings, browseCountryCode, selectedSellerPhone]);

  const sellerName = useMemo(
    () => sellerAds[0]?.sellerName || (isArabic ? 'معلن موثوق' : 'Verified Seller'),
    [sellerAds, isArabic]
  );

  return (
    <div className="flex flex-col min-h-screen bg-background pb-16" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="p-4 bg-surface border-b border-border flex items-center gap-3 sticky top-0 z-20">
        <Button
          variant="ghost"
          size="icon"
          onClick={goBack}
          aria-label={isArabic ? 'العودة' : 'Go back'}
        >
          <BackIcon size={18} variant="Linear" />
        </Button>
        <h1 className="text-base font-bold text-ink">
          {isArabic ? 'ملف البائع' : 'Seller Profile'}
        </h1>
      </div>

      <div className="p-4 flex flex-col gap-4">
        <Card variant="default" className="p-4 flex items-center gap-3.5 shadow-xs">
          <Avatar
            fallback={sellerName.charAt(0)}
            size="lg"
            className="text-primary font-bold border-border bg-background"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-base font-bold text-ink">{sellerName}</h2>
              <TickCircle size={15} variant="Linear" color="#16A34A" className="text-success" />
            </div>
            <div className="text-xs text-ink-muted mt-0.5">{selectedSellerPhone}</div>
          </div>
        </Card>

        <div>
          <h3 className="text-sm font-bold text-ink mb-3">
            {isArabic ? 'إعلانات هذا البائع' : 'Listings from this seller'} ({sellerAds.length})
          </h3>
          {sellerAds.length === 0 ? (
            <EmptyState
              icon={<User size={40} variant="Linear" />}
              title={isArabic ? 'لا توجد إعلانات' : 'No Listings'}
              description={
                isArabic
                  ? 'هذا البائع لا يملك إعلانات نشطة حالياً.'
                  : 'This seller has no active listings right now.'
              }
            />
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {sellerAds.map((ad) => (
                <ListingCard key={ad.id} listing={ad} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

