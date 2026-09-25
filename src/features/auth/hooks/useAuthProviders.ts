import { useMemo } from 'react';
import { AuthProviderDef } from '../domain/entities/AuthProvider';
import { getProvidersByPlatform } from '../domain/rules/authProviders';

type Platform = 'web' | 'ios' | 'android';

const detectPlatform = (): Platform => {
  if (typeof window === 'undefined') return 'web';
  const ua = window.navigator.userAgent.toLowerCase();
  if (/iphone|ipad|ipod/.test(ua)) return 'ios';
  if (/android/.test(ua)) return 'android';
  return 'web';
};

export interface UseAuthProvidersReturn {
  readonly providers: readonly AuthProviderDef[];
  readonly platform: Platform;
}

export const useAuthProviders = (): UseAuthProvidersReturn => {
  const platform = useMemo(detectPlatform, []);
  const providers = useMemo(
    () => getProvidersByPlatform(platform),
    [platform],
  );
  return { providers, platform };
};
