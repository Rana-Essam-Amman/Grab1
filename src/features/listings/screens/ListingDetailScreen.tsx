import React, { useState } from 'react';
import { useListingDetail } from '../hooks/useListingDetail';
import { ListingDetailHeader } from '../components/ListingDetailHeader';
import { ListingAntiFraudBanner } from '../components/ListingAntiFraudBanner';
import { ListingImageSlider } from '../components/ListingImageSlider';
import { ListingMainInfo } from '../components/ListingMainInfo';
import { ListingSellerCard } from '../components/ListingSellerCard';
import { ListingRateSellerButton } from '../components/ListingRateSellerButton';
import { ListingAttributesCard } from '../components/ListingAttributesCard';
import { ListingDescriptionCard } from '../components/ListingDescriptionCard';
import { ListingLocationCard } from '../components/ListingLocationCard';
import { ListingActionBar } from '../components/ListingActionBar';
import { WhatsAppIntentSheet } from '../components/WhatsAppIntentSheet';
import { ListingNotFound } from '../components/ListingNotFound';
import { ShareModal, ReportModal, ErrorBoundary } from '@/shared/components';
import { useIsAdmin } from '@/hooks/useIsAdmin';

export const ListingDetailScreen: React.FC = () => {
  const detail = useListingDetail();
  const isAdmin = useIsAdmin();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!detail.listing) {
    return <ListingNotFound isArabic={detail.isArabic} onGoBack={detail.goBack} />;
  }

  const handleDeleteClick = () => setShowDeleteConfirm(true);
  const handleConfirmDelete = async () => {
    setShowDeleteConfirm(false);
    await detail.handleDelete();
  };

  return (
    <ErrorBoundary>
      <div className="max-w-[440px] mx-auto w-full flex flex-col min-h-screen bg-canvas pb-28 relative shadow-md" dir={detail.isArabic ? 'rtl' : 'ltr'}>
        <ListingDetailHeader
          isArabic={detail.isArabic}
          onBack={detail.goBack}
          onShare={() => detail.setShowShare(true)}
          onReport={() => detail.setShowReport(true)}
          onEdit={detail.handleEdit}
          onDelete={handleDeleteClick}
          isOwner={detail.isOwner}
          isAdmin={isAdmin}
          listingId={detail.listing.id}
        />

        {detail.isCountryMismatch && <ListingAntiFraudBanner isArabic={detail.isArabic} />}

        <ListingImageSlider
          images={detail.images}
          activeIdx={detail.activePhotoIdx}
          onChangeIdx={detail.setActivePhotoIdx}
          isArabic={detail.isArabic}
          onCall={detail.handleCall}
          onWhatsApp={detail.handleWhatsApp}
          onStartChat={detail.handleStartChat}
        />

        <div className="p-4 flex flex-col gap-3">
          <ListingMainInfo
            title={detail.listing.title || ''}
            price={detail.listing.price || '0'}
            currency={detail.displayCurrency}
            locationText={detail.locationText}
            attributes={detail.listing.attributes || []}
            isArabic={detail.isArabic}
          />

          <ListingSellerCard
            sellerName={detail.listing.sellerName || ''}
            sellerPhone={detail.listing.sellerPhone || ''}
            isArabic={detail.isArabic}
            onClick={detail.handleSelectSeller}
          />
          <ListingRateSellerButton
            listingId={detail.listing.id}
            sellerName={detail.listing.sellerName || ''}
            sellerUserId={detail.listing.userId}
            sellerPhone={detail.listing.sellerPhone}
            isArabic={detail.isArabic}
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
          countryCode={detail.listing.countryCode}
          onCall={detail.handleCall}
          onWhatsAppClick={detail.handleWhatsAppClick}
          onStartChat={detail.handleStartChat}
          isCountryMismatch={detail.isCountryMismatch}
          isAuthenticated={detail.isAuthenticated}
          isOwner={detail.isOwner}
          hasPhone={Boolean(detail.listing.sellerPhone)}
          hasSellerAccount={Boolean(detail.listing.userId)}
        />

        {detail.showShare && <ShareModal listing={detail.listing} onClose={() => detail.setShowShare(false)} />}
        {detail.showReport && <ReportModal listing={detail.listing} onClose={() => detail.setShowReport(false)} />}
        {detail.showWhatsAppSheet && detail.listing && (
          <WhatsAppIntentSheet
            open={detail.showWhatsAppSheet}
            listing={detail.listing}
            isArabic={detail.isArabic}
            onClose={() => detail.setShowWhatsAppSheet(false)}
            onPick={detail.handleWhatsAppIntent}
            onWriteOwn={() => {
              detail.setShowWhatsAppSheet(false);
              detail.handleWhatsApp();
            }}
          />
        )}

        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowDeleteConfirm(false)}>
            <div className="bg-surface rounded-2xl p-6 mx-4 max-w-sm w-full shadow-xl" dir={detail.isArabic ? 'rtl' : 'ltr'} onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-bold mb-2 text-ink">
                {detail.isArabic ? 'تأكيد الحذف' : 'Confirm Delete'}
              </h3>
              <p className="text-sm text-ink-muted mb-4">
                {detail.isArabic ? 'هل أنت متأكد من حذف هذا الإعلان؟ لا يمكن التراجع.' : 'Are you sure you want to delete this listing? This cannot be undone.'}
              </p>
              <div className="flex gap-2">
                <button onClick={() => setShowDeleteConfirm(false)} disabled={detail.isDeleting} className="flex-1 py-2.5 rounded-xl border border-line text-ink font-semibold disabled:opacity-50">
                  {detail.isArabic ? 'إلغاء' : 'Cancel'}
                </button>
                <button onClick={handleConfirmDelete} disabled={detail.isDeleting} className="flex-1 py-2.5 rounded-xl bg-danger text-white font-semibold disabled:opacity-50">
                  {detail.isDeleting ? (detail.isArabic ? 'جارٍ الحذف...' : 'Deleting...') : (detail.isArabic ? 'حذف' : 'Delete')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};
