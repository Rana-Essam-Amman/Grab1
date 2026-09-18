import { useUI } from '@/hooks/useUI';
import { useAuth } from '@/hooks/useAuth';
import React, { useCallback } from 'react';
import { Button } from '@/shared/ui/Button';
import {
  ArrowLeft,
  ArrowRight,
  Globe,
  MapPin,
  FileText,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { SettingsProfileCard } from '../components/SettingsProfileCard';

export const SettingsScreen: React.FC = () => {
  const { isArabic, goBack, navigateTo, setLocale, browseCountry, browseCityAr, browseCityEn, setIsCountrySheetOpen } = useUI();
  const { user, logout, registered } = useAuth();

  const handleLoginCta = useCallback(() => navigateTo('register'), [navigateTo]);
  const handleLanguageToggle = useCallback(() => setLocale(isArabic ? 'en' : 'ar'), [setLocale, isArabic]);
  const handleCountryChange = useCallback(() => setIsCountrySheetOpen(true), [setIsCountrySheetOpen]);
  const handleTermsNav = useCallback(() => navigateTo('terms'), [navigateTo]);
  const handleLogout = useCallback(() => logout(), [logout]);

  const BackIcon = isArabic ? ArrowRight : ArrowLeft;
  const ChevronIcon = isArabic ? ChevronLeft : ChevronRight;

  return (
    <div className="flex flex-col min-h-screen bg-surface pb-16" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Top Bar */}
      <div className="px-4 py-4 border-b border-border flex items-center gap-3 bg-surface sticky top-0 z-20">
        <Button
          variant="ghost"
          size="icon"
          onClick={goBack}
          className="w-9 h-9 rounded-full bg-background flex items-center justify-center text-ink-soft hover:bg-border"
        >
          <BackIcon size={18} />
        </Button>
        <h1 className="text-base font-bold text-ink">
          {isArabic ? 'الإعدادات والحساب' : 'Settings & Account'}
        </h1>
      </div>

      <div className="p-4 flex flex-col gap-4">
        {/* Profile Card */}
        <SettingsProfileCard
          registered={registered}
          user={user}
          isArabic={isArabic}
          handleLoginCta={handleLoginCta}
          handleLogout={handleLogout}
        />

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
              <Globe size={18} className="text-primary" />
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
              <MapPin size={18} className="text-primary" />
              <div>
                <div className="text-sm font-semibold text-ink">
                  {isArabic ? 'الدولة والمدينة الحالية' : 'Active Region & City'}
                </div>
                <div className="text-xs text-ink-muted">
                  {isArabic ? `${browseCountry.nameAr} • ${browseCityAr}` : `${browseCountry.nameEn} • ${browseCityEn}`}
                </div>
              </div>
            </div>
            <ChevronIcon size={18} className="text-ink-muted" />
          </div>
        </div>

        {/* Legal & About Section */}
        <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-xs">
          <div className="p-3 bg-background/40 border-b border-border text-xs font-bold text-ink uppercase tracking-wider">
            {isArabic ? 'عن التطبيق والشروط' : 'About & Legal'}
          </div>

          <div
            onClick={handleTermsNav}
            className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-surface border-b border-border/60 transition-colors"
          >
            <div className="flex items-center gap-3">
              <FileText size={18} className="text-primary" />
              <div className="text-sm font-semibold text-ink">
                {isArabic ? 'شروط الخدمة وسياسة الخصوصية' : 'Terms of Service & Privacy Policy'}
              </div>
            </div>
            <ChevronIcon size={18} className="text-ink-muted" />
          </div>

          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck size={18} className="text-green-600" />
              <div>
                <div className="text-sm font-semibold text-ink">Catch the Deals</div>
                <div className="text-xs text-ink-muted">Version 1.0.0 (Regional Edition)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
