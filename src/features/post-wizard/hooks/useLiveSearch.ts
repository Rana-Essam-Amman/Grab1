import { useState, useEffect, useRef } from 'react';

interface UseLiveSearchOptions {
  readonly query: string;
  readonly isArabic: boolean;
  readonly countryCode?: string;
}

interface PhotonFeature {
  properties?: {
    name?: string;
    countrycode?: string;
  };
}

export function useLiveSearch({ query, isArabic, countryCode }: UseLiveSearchOptions) {
  const [results, setResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      setIsLoading(true);
      try {
        const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&lang=${isArabic ? 'ar' : 'en'}&limit=20`;
        const res = await fetch(url, { signal });
        const data = await res.json();

        const places = (data.features as PhotonFeature[])
          .filter((f) => {
            if (!countryCode) return true;
            const fc = String(f.properties?.countrycode || '').toUpperCase();
            return fc === countryCode.toUpperCase();
          })
          .map((f) => f.properties?.name)
          .filter((n): n is string => Boolean(n));

        setResults(Array.from(new Set(places)));
      } catch (err: unknown) {
        if ((err as { name?: string })?.name !== 'AbortError') {
          console.error('Live search failed', err);
        }
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => {
      clearTimeout(timeoutId);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [query, isArabic, countryCode]);

  return { results, isLoading };
}
