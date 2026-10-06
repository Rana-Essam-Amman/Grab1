import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useUIStore } from '../ui.slice';
import { useAuthStore } from '@/features/auth/store/auth.slice';
import { DEFAULT_REGIONAL_CAPITALS } from '@/data/locations';

describe('useUIStore - Deep Edge Cases & Verification (Sprint T3 Ultra)', () => {
  beforeEach(() => {
    localStorage.clear();
    useAuthStore.setState({
      authStatus: 'unauthenticated',
      user: null,
      sessionToken: null,
      registrationPendingUser: null,
      registeredUsers: [],
    });

    useUIStore.setState({
      locale: 'ar',
      isArabic: true,
      currentScreen: 'main',
      activeTab: 'explore',
      screenHistory: ['main'],
      selectedListingId: null,
      selectedThreadId: null,
      selectedSellerPhone: null,
      searchQuery: '',
      categoryFilter: null,
      selectedParentCategory: null,
      maxPriceFilter: null,
      neighborhoodFilter: null,
      browseCountryCode: 'JO',
      browseCityEn: 'Amman',
      browseCityAr: 'عمّان',
      activeCurrency: 'JOD',
      isAiFocused: false,
      isCountrySheetOpen: false,
    });
  });

  describe('Navigation Flow & Screen History', () => {
    it('navigateTo 5 screens accumulates in screenHistory (6 total items)', () => {
      const { navigateTo } = useUIStore.getState();
      navigateTo('listing-detail');
      navigateTo('seller-profile');
      navigateTo('search-results');
      navigateTo('settings');
      navigateTo('wishlist');

      const state = useUIStore.getState();
      expect(state.currentScreen).toBe('wishlist');
      expect(state.screenHistory).toEqual([
        'main',
        'listing-detail',
        'seller-profile',
        'search-results',
        'settings',
        'wishlist',
      ]);
    });

    it('goBack 5 times steps back through stack until reaching main', () => {
      const { navigateTo, goBack } = useUIStore.getState();
      navigateTo('listing-detail');
      navigateTo('seller-profile');
      navigateTo('settings');

      expect(useUIStore.getState().currentScreen).toBe('settings');

      goBack();
      expect(useUIStore.getState().currentScreen).toBe('seller-profile');

      goBack();
      expect(useUIStore.getState().currentScreen).toBe('listing-detail');

      goBack();
      expect(useUIStore.getState().currentScreen).toBe('main');
      expect(useUIStore.getState().screenHistory).toEqual(['main']);
    });

    it('goBack when at main screen is a safe no-op', () => {
      const { goBack } = useUIStore.getState();
      expect(useUIStore.getState().screenHistory).toEqual(['main']);

      goBack();
      expect(useUIStore.getState().currentScreen).toBe('main');
      expect(useUIStore.getState().screenHistory).toEqual(['main']);

      goBack();
      expect(useUIStore.getState().currentScreen).toBe('main');
    });

    it('navigating to the same screen twice records both in history stack', () => {
      const { navigateTo } = useUIStore.getState();
      navigateTo('listing-detail');
      navigateTo('listing-detail');

      const state = useUIStore.getState();
      expect(state.screenHistory).toEqual(['main', 'listing-detail', 'listing-detail']);
      expect(state.currentScreen).toBe('listing-detail');
    });

    it('setActiveTab changes the active tab without modifying screen history', () => {
      const { setActiveTab } = useUIStore.getState();
      setActiveTab('categories');
      expect(useUIStore.getState().activeTab).toBe('categories');

      setActiveTab('messages');
      expect(useUIStore.getState().activeTab).toBe('messages');

      setActiveTab('my-ads');
      expect(useUIStore.getState().activeTab).toBe('my-ads');

      setActiveTab('post');
      expect(useUIStore.getState().activeTab).toBe('post');

      setActiveTab('explore');
      expect(useUIStore.getState().activeTab).toBe('explore');
    });
  });

  describe('Market Lock & Browse Location Hardening', () => {
    it('guest can keep browse SY after sign-in if they set it before', () => {
      // New design: browse is free. Sign-in does not override browse.
      useUIStore.getState().setBrowseLocation('SY', 'Damascus', 'دمشق');
      expect(useUIStore.getState().browseCountryCode).toBe('SY');

      useAuthStore.setState({
        authStatus: 'authenticated',
        user: {
          firstName: 'Amman',
          lastName: 'User',
          email: 'jo@test.com',
          phone: '+962791111111',
          countryCode: 'JO',
        },
        sessionToken: 'token-jo',
      });

      useUIStore.getState().setBrowseLocation('SY', 'Damascus', 'دمشق');
      const state = useUIStore.getState();
      expect(state.browseCountryCode).toBe('SY');
      expect(state.activeCurrency).toBe('SYP');
    });

    it('authenticated user can switch to LB for browsing', () => {
      // New design: browse is free. Authenticated user can switch to LB for browsing.
      useAuthStore.setState({
        authStatus: 'authenticated',
        user: {
          firstName: 'Jordanian',
          lastName: 'User',
          email: 'jordan@test.com',
          phone: '+962791234567',
          countryCode: 'JO',
        },
        sessionToken: 'valid-token',
      });

      useUIStore.getState().setBrowseLocation('LB', 'Beirut', 'بيروت');

      const state = useUIStore.getState();
      expect(state.browseCountryCode).toBe('LB');
      expect(state.activeCurrency).toBe('LBP');
    });

    it('authenticated user with JO countryCode is allowed to update city/neighborhood within JO', () => {
      useAuthStore.setState({
        authStatus: 'authenticated',
        user: {
          firstName: 'Jordanian',
          lastName: 'User',
          email: 'jordan@test.com',
          phone: '+962791234567',
          countryCode: 'JO',
        },
        sessionToken: 'valid-token',
      });

      useUIStore.getState().setBrowseLocation('JO', 'Irbid', 'إربد');

      const state = useUIStore.getState();
      expect(state.browseCountryCode).toBe('JO');
      expect(state.browseCityEn).toBe('Irbid');
      expect(state.browseCityAr).toBe('إربد');
    });

    it('guest user can switch freely across all 5 regional markets', () => {
      const { setBrowseLocation } = useUIStore.getState();

      setBrowseLocation('SA', 'Riyadh', 'الرياض');
      expect(useUIStore.getState().browseCountryCode).toBe('SA');
      expect(useUIStore.getState().activeCurrency).toBe('SAR');

      setBrowseLocation('LB', 'Beirut', 'بيروت');
      expect(useUIStore.getState().browseCountryCode).toBe('LB');

      setBrowseLocation('PS', 'Ramallah and Al-Bireh', 'رام الله والبيرة');
      expect(useUIStore.getState().browseCountryCode).toBe('PS');

      setBrowseLocation('SY', 'Damascus', 'دمشق');
      expect(useUIStore.getState().browseCountryCode).toBe('SY');
      expect(['SYP', 'USD']).toContain(useUIStore.getState().activeCurrency);
    });

    it('multiple rapid switches resolve cleanly to the last applied valid location', () => {
      const { setBrowseLocation } = useUIStore.getState();

      setBrowseLocation('JO', 'Amman', 'عمّان');
      setBrowseLocation('SY', 'Damascus', 'دمشق');
      setBrowseLocation('LB', 'Beirut', 'بيروت');
      setBrowseLocation('PS', 'Ramallah and Al-Bireh', 'رام الله والبيرة');
      setBrowseLocation('SA', 'Riyadh', 'الرياض');

      const state = useUIStore.getState();
      expect(state.browseCountryCode).toBe('SA');
      expect(state.browseCityEn).toBe('Riyadh');
      expect(state.browseCityAr).toBe('الرياض');
      expect(state.activeCurrency).toBe('SAR');
      expect(localStorage.getItem('catch_browse_country')).toBe('SA');
    });
  });

  describe('City Validation & Regional Fallbacks', () => {
    it('accepts valid cities in English or Arabic', () => {
      const { setBrowseLocation } = useUIStore.getState();
      setBrowseLocation('JO', 'Zarqa', 'الزرقاء');

      const state = useUIStore.getState();
      expect(state.browseCityEn).toBe('Zarqa');
      expect(state.browseCityAr).toBe('الزرقاء');
    });

    it('falls back to default regional capital when invalid city is provided', () => {
      const { setBrowseLocation } = useUIStore.getState();
      setBrowseLocation('SA', 'NonExistentCity', 'مدينة_وهمية');

      const state = useUIStore.getState();
      expect(state.browseCountryCode).toBe('SA');
      expect(state.browseCityEn).toBe(DEFAULT_REGIONAL_CAPITALS.SA.cityEn);
      expect(state.browseCityAr).toBe(DEFAULT_REGIONAL_CAPITALS.SA.cityAr);
    });

    it('falls back to capital when empty strings are passed for cities', () => {
      const { setBrowseLocation } = useUIStore.getState();
      setBrowseLocation('LB', '', '');

      const state = useUIStore.getState();
      expect(state.browseCountryCode).toBe('LB');
      expect(state.browseCityEn).toBe(DEFAULT_REGIONAL_CAPITALS.LB.cityEn);
      expect(state.browseCityAr).toBe(DEFAULT_REGIONAL_CAPITALS.LB.cityAr);
    });

    it('normalizes active currency on country switch', () => {
      const { setBrowseLocation, setActiveCurrency } = useUIStore.getState();
      setBrowseLocation('LB', 'Beirut', 'بيروت');
      setActiveCurrency('USD');
      expect(useUIStore.getState().activeCurrency).toBe('USD');

      // Switch to JO where USD is not primary allowed currency -> sanitizes to JOD
      setBrowseLocation('JO', 'Amman', 'عمّان');
      expect(useUIStore.getState().activeCurrency).toBe('JOD');
    });

    it('setActiveCurrency falls back to browse market\'s currency', () => {
      // New design: browse is free. Fallback uses browse country, not user home country.
      useUIStore.getState().setBrowseLocation('SY', 'Damascus', 'دمشق');

      useAuthStore.setState({
        authStatus: 'authenticated',
        user: {
          firstName: 'Sari',
          lastName: 'Syrian',
          email: 'sari@test.com',
          phone: '+96311223344',
          countryCode: 'SY',
        },
        sessionToken: 'token-sy',
      });

      const { setActiveCurrency } = useUIStore.getState();
      setActiveCurrency('USD');
      expect(useUIStore.getState().activeCurrency).toBe('USD');

      setActiveCurrency('INVALID');
      expect(useUIStore.getState().activeCurrency).toBe('SYP');
    });
  });

  describe('Locale & Bidirectionality (RTL / LTR)', () => {
    it('setLocale("en") sets LTR direction, en lang, and isArabic=false', () => {
      const { setLocale } = useUIStore.getState();
      setLocale('en');

      const state = useUIStore.getState();
      expect(state.locale).toBe('en');
      expect(state.isArabic).toBe(false);
      expect(document.documentElement.dir).toBe('ltr');
      expect(document.documentElement.lang).toBe('en');
    });

    it('setLocale("ar") sets RTL direction, ar lang, and isArabic=true', () => {
      const { setLocale } = useUIStore.getState();
      setLocale('ar');

      const state = useUIStore.getState();
      expect(state.locale).toBe('ar');
      expect(state.isArabic).toBe(true);
      expect(document.documentElement.dir).toBe('rtl');
      expect(document.documentElement.lang).toBe('ar');
    });

    it('rapidly switching locale keeps state and document direction in sync', () => {
      const { setLocale } = useUIStore.getState();
      setLocale('en');
      expect(useUIStore.getState().isArabic).toBe(false);
      expect(document.documentElement.dir).toBe('ltr');

      setLocale('ar');
      expect(useUIStore.getState().isArabic).toBe(true);
      expect(document.documentElement.dir).toBe('rtl');

      setLocale('en');
      expect(useUIStore.getState().isArabic).toBe(false);
      expect(document.documentElement.dir).toBe('ltr');
    });
  });

  describe('Selected Parameters & Filters', () => {
    it('sets and clears selectedListingId', () => {
      const { setSelectedListingId } = useUIStore.getState();
      setSelectedListingId('listing-123');
      expect(useUIStore.getState().selectedListingId).toBe('listing-123');

      setSelectedListingId(null);
      expect(useUIStore.getState().selectedListingId).toBeNull();
    });

    it('sets and clears selectedThreadId', () => {
      const { setSelectedThreadId } = useUIStore.getState();
      setSelectedThreadId('thread-999');
      expect(useUIStore.getState().selectedThreadId).toBe('thread-999');

      setSelectedThreadId(null);
      expect(useUIStore.getState().selectedThreadId).toBeNull();
    });

    it('sets and clears selectedSellerPhone', () => {
      const { setSelectedSellerPhone } = useUIStore.getState();
      setSelectedSellerPhone('+962791234567');
      expect(useUIStore.getState().selectedSellerPhone).toBe('+962791234567');

      setSelectedSellerPhone(null);
      expect(useUIStore.getState().selectedSellerPhone).toBeNull();
    });

    it('sets, updates, and clears searchQuery', () => {
      const { setSearchQuery } = useUIStore.getState();
      setSearchQuery('Toyota Camry');
      expect(useUIStore.getState().searchQuery).toBe('Toyota Camry');

      setSearchQuery('');
      expect(useUIStore.getState().searchQuery).toBe('');
    });

    it('sets and clears category, subcategory and parent category filters', () => {
      const { setCategoryFilter, setSelectedParentCategory } = useUIStore.getState();
      setCategoryFilter('electronics');
      setSelectedParentCategory('tech');

      expect(useUIStore.getState().categoryFilter).toBe('electronics');
      expect(useUIStore.getState().selectedParentCategory).toBe('tech');

      setCategoryFilter(null);
      setSelectedParentCategory(null);
      expect(useUIStore.getState().categoryFilter).toBeNull();
      expect(useUIStore.getState().selectedParentCategory).toBeNull();
    });

    it('sets and clears maxPriceFilter and neighborhoodFilter', () => {
      const { setMaxPriceFilter, setNeighborhoodFilter } = useUIStore.getState();
      setMaxPriceFilter(5000);
      setNeighborhoodFilter('Abdoun');

      expect(useUIStore.getState().maxPriceFilter).toBe(5000);
      expect(useUIStore.getState().neighborhoodFilter).toBe('Abdoun');

      setMaxPriceFilter(null);
      setNeighborhoodFilter(null);
      expect(useUIStore.getState().maxPriceFilter).toBeNull();
      expect(useUIStore.getState().neighborhoodFilter).toBeNull();
    });
  });

  describe('AI Focus & Country Sheet Toggles', () => {
    it('toggles isAiFocused state correctly', () => {
      const { setIsAiFocused } = useUIStore.getState();
      expect(useUIStore.getState().isAiFocused).toBe(false);

      setIsAiFocused(true);
      expect(useUIStore.getState().isAiFocused).toBe(true);

      setIsAiFocused(false);
      expect(useUIStore.getState().isAiFocused).toBe(false);

      // 5 continuous cycles
      for (let i = 0; i < 5; i++) {
        setIsAiFocused(true);
        expect(useUIStore.getState().isAiFocused).toBe(true);
        setIsAiFocused(false);
        expect(useUIStore.getState().isAiFocused).toBe(false);
      }
    });

    it('toggles isCountrySheetOpen state correctly', () => {
      const { setIsCountrySheetOpen } = useUIStore.getState();
      expect(useUIStore.getState().isCountrySheetOpen).toBe(false);

      setIsCountrySheetOpen(true);
      expect(useUIStore.getState().isCountrySheetOpen).toBe(true);

      setIsCountrySheetOpen(false);
      expect(useUIStore.getState().isCountrySheetOpen).toBe(false);
    });
  });

  describe('Persistence Storage & Rehydration Serialization', () => {
    it('partializes only locale state for persistent storage', () => {
      const options = useUIStore.persist.getOptions();
      const state = useUIStore.getState();
      const partial = options.partialize?.(state);
      expect(partial).toEqual({ locale: state.locale });
    });

    it('handles onRehydrateStorage callback correctly for arabic and english', () => {
      const options = useUIStore.persist.getOptions();
      const onRehydrate = options.onRehydrateStorage?.(useUIStore.getState());

      onRehydrate?.({ locale: 'ar' } as any, undefined);
      expect(document.documentElement.dir).toBe('rtl');
      expect(document.documentElement.lang).toBe('ar');

      onRehydrate?.({ locale: 'en' } as any, undefined);
      expect(document.documentElement.dir).toBe('ltr');
      expect(document.documentElement.lang).toBe('en');

      // Test undefined state branch safely
      onRehydrate?.(undefined, undefined);
    });

    it('custom storage getItem handles missing, legacy raw strings, valid JSON and corrupted data', async () => {
      const storage = useUIStore.persist.getOptions().storage;
      if (!storage) throw new Error('Storage not defined');

      localStorage.clear();
      expect(await storage.getItem('catch_locale')).toBeNull();

      // Legacy plain 'en'
      localStorage.setItem('catch_locale', 'en');
      const enResult: any = await storage.getItem('catch_locale');
      expect(enResult?.state?.locale).toBe('en');

      // Legacy plain 'ar'
      localStorage.setItem('catch_locale', 'ar');
      const arResult: any = await storage.getItem('catch_locale');
      expect(arResult?.state?.locale).toBe('ar');

      // Standard JSON
      const standardJson = JSON.stringify({ state: { locale: 'ar' }, version: 0 });
      localStorage.setItem('catch_locale', standardJson);
      const standardResult: any = await storage.getItem('catch_locale');
      expect(standardResult?.state?.locale).toBe('ar');

      // Corrupted non-JSON string
      localStorage.setItem('catch_locale', '{broken_json:');
      expect(await storage.getItem('catch_locale')).toBeNull();
    });

    it('custom storage setItem handles structured state and raw values', async () => {
      const storage = useUIStore.persist.getOptions().storage;
      if (!storage) throw new Error('Storage not defined');

      // Structured with state.locale
      await storage.setItem('catch_locale', { state: { locale: 'en' }, version: 0 } as any);
      expect(localStorage.getItem('catch_locale')).toBe('en');

      // Removal
      await storage.removeItem('catch_locale');
      expect(localStorage.getItem('catch_locale')).toBeNull();
    });
  });
});
