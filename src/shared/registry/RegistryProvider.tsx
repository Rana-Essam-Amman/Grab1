import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import type { FeatureManifest, ScreenDefinition } from './types';
import { discoverFeatures, buildScreenMap } from './discover';

interface RegistryContextValue {
  manifests: FeatureManifest[];
  screens: Map<string, ScreenDefinition>;
  isLoading: boolean;
  error: string | null;
}

const RegistryContext = createContext<RegistryContextValue>({
  manifests: [],
  screens: new Map(),
  isLoading: true,
  error: null,
});

export const RegistryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [manifests, setManifests] = useState<FeatureManifest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const loaded = await discoverFeatures();
        if (!cancelled) {
          setManifests(loaded);
        }
      } catch (err) {
        if (!cancelled) setError(String(err));
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const screens = useMemo(() => buildScreenMap(manifests), [manifests]);

  const value = useMemo(
    () => ({ manifests, screens, isLoading, error }),
    [manifests, screens, isLoading, error]
  );

  return <RegistryContext.Provider value={value}>{children}</RegistryContext.Provider>;
};

export function useRegistry() {
  return useContext(RegistryContext);
}
