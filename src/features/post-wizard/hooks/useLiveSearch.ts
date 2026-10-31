import { useState, useEffect } from 'react';

export function useLiveSearch(query: string, isArabic: boolean) {
  const [results, setResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsLoading(true);
      try {
        // خدمة Photon المبنية على OpenStreetMap (مجانية وبدون API Key)
        const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&lang=${isArabic ? 'ar' : 'en'}&limit=15`;
        const res = await fetch(url);
        const data = await res.json();
        
        // استخراج أسماء المدن والأحياء وإزالة التكرار
        const places = data.features
          .map((f: any) => f.properties.name)
          .filter(Boolean);
          
        setResults(Array.from(new Set(places)));
      } catch (err) {
        console.error('Live search failed', err);
      } finally {
        setIsLoading(false);
      }
    }, 500); // ننتظر 500ms بعد آخر حرف يكتبه المستخدم (Debounce)

    return () => clearTimeout(timeoutId);
  }, [query, isArabic]);

  return { results, isLoading };
}
