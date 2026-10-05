import { useUI } from '@/hooks/useUI';
import { useAuth } from '@/hooks/useAuth';
import React, { useState, useCallback } from 'react';
import { Button } from '@/shared/ui/Button';
import {
  ArrowLeft,
  ArrowRight,
  Global,
  Location,
  ArrowRight2,
  ArrowLeft2,
} from 'iconsax-react';
import { SettingsProfileCard } from '../components/SettingsProfileCard';
import { SettingsLegalSection } from '../components/SettingsLegalSection';
import { SettingsThemeSection } from '../components/SettingsThemeSection';
import { EditNicknameModal } from '../components/EditNicknameModal';
import { useAuthStore } from '@/features/auth/store/auth.slice';

export const SettingsScreen: React.FC = () => {
  const { isArabic, goBack, navigateTo, setLocale, browseCountry, browseCityAr, browseCityEn, setIsCountrySheetOpen } = useUI();
  const { user, logout, registered } = useAuth();

  const [showNicknameModal, setShowNicknameModal] = useState(false);
  const authUserId = useAuthStore((s) => s.user?.id ?? null);
  const updateUser = useAuthStore((s) => s.updateUser);

  const handleOpenNickname = useCallback(() => setShowNicknameModal(true), []);
  const handleCloseNickname = useCallback(() => setShowNicknameModal(false), []);
  const handleNicknameSaved = useCallback(
    (nickname: string) => {
      updateUser({ nickname });
      setShowNicknameModal(false);
    },
    [updateUser]
  );

  const handleLoginCta = useCallback(() => navigateTo('login'), [navigateTo]);
  const handleLanguageToggle = useCallback(() => setLocale(isArabic ? 'en' : 'ar'), [setLocale, isArabic]);
  const handleCountryChange = useCallback(() => setIsCountrySheetOpen(true), [setIsCountrySheetOpen]);
  const handleTermsNav = useCallback(() => navigateTo('terms'), [navigateTo]);
  const handlePrivacyNav = useCallback(() => navigateTo('privacy'), [navigateTo]);
  const handleSupportNav = useCallback(() => navigateTo('support'), [navigateTo]);
  const handleSafetyNav = useCallback(() => navigateTo('safety'), [navigateTo]);
  const handleAboutNav = useCallback(() => navigateTo('about'), [navigateTo]);
  const handleLogout = useCallback(() => logout(), [logout]);

  const BackIcon = isArabic ? ArrowRight : ArrowLeft;
  const ChevronIcon = isArabic ? ArrowLeft2 : ArrowRight2;

  return (
    <div className="flex flex-col min-h-screen bg-surface pb-16" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Top Bar */}
      <div className="px-4 py-4 bg-brand border-b border-white/10 flex items-center gap-3 sticky top-0 z-20">
        <Button variant="ghost" size="icon" onClick={goBack} aria-label="Back" className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center p-0">
          <BackIcon size={18} variant="Linear" color="#FFFFFF" />
        </Button>
        <h1 className="text-lg font-bold text-white">{isArabic ? 'الإعدادات والحساب' : 'Settings & Account'}</h1>
      </div>

      <div className="p-4 flex flex-col gap-4">
        {/* Profile Card */}
        <SettingsProfileCard
          registered={registered}
          user={user}
          isArabic={isArabic}
          nickname={user?.nickname}
          onEditNickname={handleOpenNickname}
          handleLoginCta={handleLoginCta}
          handleLogout={handleLogout}
        />

        {/* Theme Section */}
        <SettingsThemeSection isArabic={isArabic} />

        {/* Preferences Section */}
        <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-xs">
          <div className="p-3 bg-background/40 border-b border-border text-xs font-bold text-ink uppercase tracking-wider">
            {isArabic ? 'التفضيلات العامة' : 'General Preferences'}
          </div>

          {/* Language Switch */}
          <div
            onClick={handleLanguageToggle}
            className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-surface border-b border-border/60 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Global size={18} variant="Linear" color="currentColor" className="text-primary" />
              <div>
                <div className="text-sm font-semibold text-ink">
                  {isArabic ? 'لغة التطبيق' : 'App Language'}
                </div>
                <div className="text-xs text-ink-muted">
                  {isArabic ? 'العربية' : 'English'}
                </div>
              </div>
            </div>
            <span className="text-xs font-bold text-primary">
              {isArabic ? 'تغيير إلى English' : 'Switch to العربية'}
            </span>
          </div>

          {/* Region Switch */}
          <div
            onClick={handleCountryChange}
            className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-surface transition-colors"
          >
            <div className="flex items-center gap-3">
              <Location size={18} variant="Linear" color="currentColor" className="text-primary" />
              <div>
                <div className="text-sm font-semibold text-ink">
                  {isArabic ? 'الدولة والمدينة الحالية' : 'Active Region & City'}
                </div>
                <div className="text-xs text-ink-muted">
                  {isArabic ? `${browseCountry.nameAr} • ${browseCityAr}` : `${browseCountry.nameEn} • ${browseCityEn}`}
                </div>
              </div>
            </div>
            <ChevronIcon size={18} variant="Linear" className="text-ink-muted" />
          </div>
        </div>

        <SettingsLegalSection
          isArabic={isArabic}
          onTerms={handleTermsNav}
          onSafety={handleSafetyNav}
          onSupport={handleSupportNav}
          onPrivacy={handlePrivacyNav}
          onAbout={handleAboutNav}
        />
      </div>

      <EditNicknameModal
        open={showNicknameModal}
        isArabic={isArabic}
        userId={authUserId}
        currentNickname={user?.nickname ?? null}
        initialFallback={user?.firstName ?? ''}
        onClose={handleCloseNickname}
        onSaved={handleNicknameSaved}
      />
    </div>
  );
};
