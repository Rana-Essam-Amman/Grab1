import React from 'react';
import { useUI } from '@/hooks/useUI';
import { useTranslation } from '@/shared/i18n';
import { Button } from '@/shared/ui/Button';
import { Modal } from '@/shared/ui/Modal';
import { Heart } from 'lucide-react';
import { useWishlistFilter } from '../hooks/useWishlistFilter';
import { WishlistHeader } from '../components/WishlistHeader';
import { WishlistEmptyState } from '../components/WishlistEmptyState';
import { WishlistControls } from '../components/WishlistControls';
import { WishlistItemsList } from '../components/WishlistItemsList';

export const WishlistScreen: React.FC = () => {
  const { isArabic, goBack, navigateTo, browseCountryCode, setActiveTab } = useUI();
  const { t } = useTranslation();
  const {
    countryWishlistListings,
    availableCategories,
    filteredListings,
    selectedCategory,
    layoutMode,
    isConfirmOpen,
    setIsConfirmOpen,
    showToast,
    toastMessage,
    handleClearClick,
    handleConfirmClear,
    handleExplore,
    handleCategorySelect,
    handleLayoutChange,
    handleRemoveItem,
  } = useWishlistFilter(browseCountryCode, isArabic, setActiveTab, navigateTo);

  return (
    <div className="flex flex-col min-h-screen bg-surface pb-24" dir={isArabic ? 'rtl' : 'ltr'}>
      <WishlistHeader
        isArabic={isArabic}
        goBack={goBack}
        totalCount={countryWishlistListings.length}
        title={t('wishlist.title')}
        clearAllText={t('wishlist.clearAll')}
        onClearClick={handleClearClick}
      />

      {countryWishlistListings.length === 0 ? (
        <WishlistEmptyState
          isArabic={isArabic}
          emptyTitle={t('wishlist.emptyTitle')}
          onExplore={handleExplore}
        />
      ) : (
        <div className="p-4 flex flex-col gap-4">
          <WishlistControls
            isArabic={isArabic}
            selectedCategory={selectedCategory}
            availableCategories={availableCategories}
            layoutMode={layoutMode}
            onSelectCategory={handleCategorySelect}
            onChangeLayout={handleLayoutChange}
          />

          <WishlistItemsList
            isArabic={isArabic}
            filteredListings={filteredListings}
            layoutMode={layoutMode}
            onSelectCategory={handleCategorySelect}
            onRemoveItem={handleRemoveItem}
          />
        </div>
      )}

      {showToast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-ink text-white px-4 py-2.5 rounded-full text-xs font-semibold shadow-xl z-50 flex items-center gap-2 animate-fade-in transition-all">
          <Heart size={14} className="fill-red-500 text-red-500 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      <Modal
        open={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        title={isArabic ? 'تأكيد مسح المفضلة' : 'Confirm Clear Favorites'}
        description={
          isArabic
            ? 'هل أنت متأكد من رغبتك في مسح جميع الإعلانات المفضلة المحفوظة لديك؟ لا يمكن التراجع عن هذا الإجراء.'
            : 'Are you sure you want to clear your entire favorites list? This action cannot be undone.'
        }
        footer={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsConfirmOpen(false)}>
              {isArabic ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleConfirmClear}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {isArabic ? 'تأكيد المسح' : 'Confirm Clear'}
            </Button>
          </div>
        }
      />
    </div>
  );
};
