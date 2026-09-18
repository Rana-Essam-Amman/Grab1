import { useState, useMemo, useCallback, useEffect } from 'react';
import { useListings } from '@/hooks/useListings';
import { filterListingsByMarket, MarketCode } from '@/shared/lib/marketGate';
import { ScreenType, TabType } from '@/store/ui.slice.types';

export const useWishlistFilter = (
  browseCountryCode: string,
  isArabic: boolean,
  setActiveTab: (tab: TabType) => void,
  navigateTo: (screen: ScreenType) => void
) => {
  const { wishlistListings, clearWishlist, toggleWishlist, setWishlistForCountry } = useListings();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [layoutMode, setLayoutMode] = useState<'grid' | 'horizontal'>('grid');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    const timer = setTimeout(() => setShowToast(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setWishlistForCountry(browseCountryCode);
  }, [browseCountryCode, setWishlistForCountry]);

  const countryWishlistListings = useMemo(
    () => filterListingsByMarket(wishlistListings, browseCountryCode as MarketCode),
    [wishlistListings, browseCountryCode]
  );

  const availableCategories = useMemo(
    () => ['all', ...Array.from(new Set(countryWishlistListings.map((i) => i.categorySlug)))],
    [countryWishlistListings]
  );

  const filteredListings = useMemo(
    () => (selectedCategory === 'all' ? countryWishlistListings : countryWishlistListings.filter((i) => i.categorySlug === selectedCategory)),
    [countryWishlistListings, selectedCategory]
  );

  const handleClearClick = useCallback(() => setIsConfirmOpen(true), []);

  const handleConfirmClear = useCallback(() => {
    clearWishlist();
    setIsConfirmOpen(false);
    triggerToast(isArabic ? 'تم تفريغ قائمة المفضلة بنجاح' : 'Favorites list cleared successfully');
  }, [clearWishlist, isArabic, triggerToast]);

  const handleExplore = useCallback(() => {
    setActiveTab('explore');
    navigateTo('main');
  }, [setActiveTab, navigateTo]);

  const handleCategorySelect = useCallback((cat: string) => setSelectedCategory(cat), []);

  const handleLayoutChange = useCallback((mode: 'grid' | 'horizontal') => setLayoutMode(mode), []);

  const handleRemoveItem = useCallback(
    (listingId: string) => {
      toggleWishlist(listingId, browseCountryCode);
      triggerToast(isArabic ? 'تمت الإزالة من المفضلة' : 'Removed from Favorites');
    },
    [browseCountryCode, isArabic, toggleWishlist, triggerToast]
  );

  return {
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
  };
};
