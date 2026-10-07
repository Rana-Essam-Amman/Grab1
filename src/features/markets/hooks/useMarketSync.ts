import { useEffect, useMemo } from 'react';
import { useAuthStore } from '@/features/auth/store/auth.slice';
import { useUIStore } from '@/store/ui.slice';
import { DEFAULT_REGIONAL_CAPITALS } from '@/data/locations';
import { resolveBrowseMarket } from '../helpers/resolveBrowseMarket';

export function useMarketSync(): void {
  const authStatus = useAuthStore((s) => s.authStatus);
  const userCountry = useAuthStore((s) => s.user?.countryCode ?? null);
  // Source of truth is the UI store override — synchronously hydrated from
  // localStorage on boot. Reading user.browseMarket caused a flicker because
  // Supabase session events replace `user` without that field.
  const storedBrowse = useUIStore((s) => s.browseMarketOverride);
  const geoCountry = useUIStore((s) => s.geoCountryCode);
  const browseCountry = useUIStore((s) => s.browseCountryCode);
  const setBrowseLocation = useUIStore((s) => s.setBrowseLocation);

  const decision = useMemo(
    () =>
      resolveBrowseMarket({
        authenticated: authStatus === 'authenticated',
        userCountry,
        geoCountry,
        storedBrowseMarket: storedBrowse,
      }),
    [authStatus, userCountry, geoCountry, storedBrowse]
  );

  useEffect(() => {
    if (authStatus !== 'authenticated') return;
    if (browseCountry === decision.market) return;
    const cap = DEFAULT_REGIONAL_CAPITALS[decision.market];
    if (cap) setBrowseLocation(decision.market, cap.cityEn, cap.cityAr);
  }, [authStatus, browseCountry, decision.market, setBrowseLocation]);
}
