import { useUI } from '@/hooks/useUI';
import { useTranslation } from '@/shared/i18n';
import { useListings } from '@/hooks/useListings';
import { useAuth } from '@/hooks/useAuth';
import React, { useState, useMemo, useCallback } from 'react';
import { useProfileActions } from '../hooks/useProfileActions';
import { DeleteAccountModal } from '../components/DeleteAccountModal';
import { SignOutModal } from '../components/SignOutModal';
import { marketStorage } from '@/shared/lib/marketStorage';
import { isValidMarketCode } from '@/data/markets/config';
import type { MarketCode } from '@/data/markets/types';
import { getBrowseCountryCode } from '@/shared/store-getters/ui.getter';
import { ProfileHeaderSection } from '../components/ProfileHeaderSection';
import { ProfileQuotaCard } from '../components/ProfileQuotaCard';
import { ProfileActiveListings } from '../components/ProfileActiveListings';
import { ProfileAccountMenu } from '../components/ProfileAccountMenu';

// Credits are MARKET-SCOPED. A shared device with two markets must not
// share the daily AI quota across them. Also registered for GDPR cleanup.
const STORAGE_KEY_CREDITS = 'daily_ai_credits';
const STORAGE_KEY_DATE = 'daily_ai_date';

const getInitialDailyCredits = (): number => {
  try {
    const market = getBrowseCountryCode();
    if (!isValidMarketCode(market)) return 5;
    const store = marketStorage(market as MarketCode);

    const today = new Date().toISOString().slice(0, 10);
    const storedDate = store.get<string>(STORAGE_KEY_DATE);
    const storedCredits = store.get<string | number>(STORAGE_KEY_CREDITS);

    if (storedDate !== today) {
      store.set(STORAGE_KEY_DATE, today);
      store.set(STORAGE_KEY_CREDITS, 5);
      return 5;
    }
    if (storedCredits !== null) {
      const parsed = typeof storedCredits === 'number' ? storedCredits : parseInt(storedCredits, 10);
      return isNaN(parsed) ? 5 : parsed;
    }
    store.set(STORAGE_KEY_DATE, today);
    store.set(STORAGE_KEY_CREDITS, 5);
    return 5;
  } catch {
    return 5;
  }
};

export const ProfileScreen: React.FC = () => {
  const { isArabic, browseCountry, browseCityAr, browseCityEn, navigateTo, goBack } = useUI();
  const { t } = useTranslation();
  const { userListings, listings } = useListings();
  const { user } = useAuth();
  const { handleLogout, handleDeleteAccount } = useProfileActions();

  const [dailyAiCredits] = useState<number>(getInitialDailyCredits);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const userAds = useMemo(
    () => (userListings.length > 0 ? userListings : listings.slice(0, 1)),
    [userListings, listings]
  );

  const handleShare = useCallback(async () => {
    const shareUrl = window.location.origin;
    const text = isArabic
      ? 'تطبيق الصفقات الذكية الأول! بيع واشتري بالذكاء الاصطناعي:'
      : 'Smartest Marketplace app! Buy and sell with AI:';

    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await navigator.share({ title: 'FOX Marketplace', text, url: shareUrl });
        return;
      } catch {
        // fall through
      }
    }
    // Fallback: copy link
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {}
  }, [isArabic]);

  return (
    <div
      dir={isArabic ? 'rtl' : 'ltr'}
      className="max-w-[440px] mx-auto w-full flex flex-col gap-4 pb-24 px-4 pt-3 font-cairo"
    >
      <ProfileHeaderSection
        isArabic={isArabic}
        goBack={goBack}
        user={user}
        browseCountry={browseCountry}
        browseCityAr={browseCityAr}
        browseCityEn={browseCityEn}
        profileTitle={t('profile.profileTitle')}
      />

      <ProfileQuotaCard
        isArabic={isArabic}
        dailyAiCredits={dailyAiCredits}
        handleShare={handleShare}
      />

      <ProfileActiveListings
        isArabic={isArabic}
        userAds={userAds}
      />

      <ProfileAccountMenu
        isArabic={isArabic}
        accountManagementText={t('profile.accountManagement')}
        signOutText={t('profile.signOut')}
        navigateTo={navigateTo}
        setShowLogoutModal={setShowLogoutModal}
        setShowDeleteModal={setShowDeleteModal}
      />

      <SignOutModal
        open={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={() => {
          setShowLogoutModal(false);
          handleLogout();
        }}
      />
      <DeleteAccountModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => {
          setShowDeleteModal(false);
          handleDeleteAccount();
        }}
      />
    </div>
  );
};
