import React from 'react';
import { useListingDetail } from '../hooks/useListingDetail';
import { ListingDetailHeader } from '../components/ListingDetailHeader';
import { ListingAntiFraudBanner } from '../components/ListingAntiFraudBanner';
import { ListingImageSlider } from '../components/ListingImageSlider';
import { ListingMainInfo } from '../components/ListingMainInfo';
import { ListingSellerCard } from '../components/ListingSellerCard';
import { ListingAttributesCard } from '../components/ListingAttributesCard';
import { ListingDescriptionCard } from '../components/ListingDescriptionCard';
import { ListingLocationCard } from '../components/ListingLocationCard';
import { ListingActionBar } from '../components/ListingActionBar';
import { ListingNotFound } from '../components/ListingNotFound';
import { ShareModal, ReportModal, ErrorBoundary } from '@/shared/components';

export { getFormattedLocalPhone } from '../helpers/phoneFormatting';

export const ListingDetailScreen: React.FC = () => {
  const detail = useListingDetail();

  if (!detail.listing) {
    return <ListingNotFound isArabic={detail.isArabic} onGoBack={detail.goBack} />;
  }

  return (
    <ErrorBoundary>
      <div className="max-w-[440px] mx-auto w-full flex flex-col min-h-screen bg-surface pb-28 relative shadow-md" dir={detail.isArabic ? 'rtl' : 'ltr'}>
        <ListingDetailHeader
          isArabic={detail.isArabic}
          onBack={detail.goBack}
          onShare={() => detail.setShowShare(true)}
          onReport={() => detail.setShowReport(true)}
          onDelete={detail.handleDelete}
          isOwner={detail.isOwner}
          listingId={detail.listing.id}
        />

        {detail.isCountryMismatch && <ListingAntiFraudBanner isArabic={detail.isArabic} />}

        <ListingImageSlider
          images={detail.images}
          activeIdx={detail.activePhotoIdx}
          onChangeIdx={detail.setActivePhotoIdx}
          isArabic={detail.isArabic}
        />

        <div className="p-4 flex flex-col gap-3">
          <ListingMainInfo
            title={detail.listing.title || ''}
            price={detail.listing.price || '0'}
            currency={detail.displayCurrency}
            locationText={detail.locationText}
            views={detail.listing.views ?? 0}
            createdAt={detail.listing.createdAt || ''}
            isArabic={detail.isArabic}
          />

          <ListingSellerCard
            sellerName={detail.listing.sellerName || ''}
            sellerPhone={detail.listing.sellerPhone || ''}
            isArabic={detail.isArabic}
            onClick={detail.handleSelectSeller}
          />

          <ListingAttributesCard attributes={detail.listing.attributes || []} isArabic={detail.isArabic} />

          <ListingDescriptionCard
            description={detail.listing.description || ''}
            isArabic={detail.isArabic}
            isAuthenticated={detail.isAuthenticated}
            onNavigateToLogin={() => detail.navigateTo('login')}
          />

          <ListingLocationCard
            mapQuery={detail.mapQuery}
            locationText={detail.locationText}
            mapUrl={detail.mapUrl}
            isArabic={detail.isArabic}
          />
        </div>

        <ListingActionBar
          isArabic={detail.isArabic}
          onCall={detail.handleCall}
          onWhatsApp={detail.handleWhatsApp}
          onStartChat={detail.handleStartChat}
          isCountryMismatch={detail.isCountryMismatch}
          isAuthenticated={detail.isAuthenticated}
        />

        {detail.showShare && <ShareModal listing={detail.listing} onClose={() => detail.setShowShare(false)} />}
        {detail.showReport && <ReportModal listing={detail.listing} onClose={() => detail.setShowReport(false)} />}
      </div>
    </ErrorBoundary>
  );
};
