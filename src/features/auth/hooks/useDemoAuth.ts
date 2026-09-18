import { useState, useCallback } from 'react';
import { useAuthStore } from '@/features/auth/store/auth.slice';
import { useUIStore } from '@/store/ui.slice';
import { publishDraftAfterAuth } from '../helpers/publishDraftAfterAuth';
import { globalStorage } from '@/shared/lib/marketStorage';
import { MarketCode } from '@/shared/lib/marketGate';
import { useUI } from '@/hooks/useUI';

export interface UseDemoAuthReturn {
  demoCountryPickerOpen: boolean;
  setDemoCountryPickerOpen: (open: boolean) => void;
  handleQuickDemoAuth: (countryCode: MarketCode) => void;
  handleDemoCountrySelect: (countryCode: MarketCode) => void;
  handleDemoCountrySelected: (countryCode: MarketCode) => void;
  isArabic: boolean;
}

export const useDemoAuth = (): UseDemoAuthReturn => {
  const [demoCountryPickerOpen, setDemoCountryPickerOpen] = useState(false);
  const { isArabic } = useUI();

  const handleQuickDemoAuth = useCallback((countryCode: MarketCode = 'JO') => {
    try {
      // 1. Login demo user with selected country
      useAuthStore.getState().loginDirectly('demo-user@deals.com', '791234567', countryCode, 'Sufyan');
      
      // 2. Set browse location to match
      useUIStore.getState().setBrowseLocation(countryCode, '', '');
      
      // 3. Publish draft with fresh market value
      publishDraftAfterAuth('791234567', 'Sufyan', countryCode);
    } catch (err: any) {
      const errorData = {
        message: err?.message || String(err),
        stack: err?.stack?.slice(0, 2000) || '',
        timestamp: new Date().toISOString(),
        location: 'useDemoAuth/handleQuickDemoAuth',
      };
      try {
        globalStorage().set('catch_crash_last', errorData);
      } catch {}
      alert('DEMO AUTH ERROR: ' + errorData.message);
      console.error('DEMO AUTH CRASH:', errorData);
    }
  }, []);

  const handleDemoCountrySelect = useCallback((countryCode: MarketCode) => {
    setDemoCountryPickerOpen(false);
    handleQuickDemoAuth(countryCode);
  }, [handleQuickDemoAuth]);

  const handleDemoCountrySelected = handleDemoCountrySelect;

  return {
    demoCountryPickerOpen,
    setDemoCountryPickerOpen,
    handleQuickDemoAuth,
    handleDemoCountrySelect,
    handleDemoCountrySelected,
    isArabic,
  };
};
