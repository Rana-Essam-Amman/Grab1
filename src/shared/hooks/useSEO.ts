import { useEffect } from 'react';

interface UseSEOOptions {
  title?: string | null;
  description?: string | null;
}

const DEFAULT_TITLE = 'FOX Marketplace';

function getMeta(attr: 'name' | 'property', key: string): string {
  return document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)?.getAttribute('content') ?? '';
}

function setOrCreateMeta(attr: 'name' | 'property', key: string, content: string): void {
  let meta = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attr, key);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
}

export function useSEO({ title, description }: UseSEOOptions): void {
  useEffect(() => {
    // 1. Store previous values for cleanup
    const prevTitle = document.title;
    const prevDesc = getMeta('name', 'description');
    const prevOgTitle = getMeta('property', 'og:title');
    const prevOgDesc = getMeta('property', 'og:description');

    // 2. Compute new values
    const nextTitle = title?.trim() ? title.trim() : DEFAULT_TITLE;
    const nextDesc = description?.trim() ?? '';

    // 3. Apply new values
    document.title = nextTitle;
    setOrCreateMeta('property', 'og:title', nextTitle);
    
    if (nextDesc) {
      setOrCreateMeta('name', 'description', nextDesc);
      setOrCreateMeta('property', 'og:description', nextDesc);
      setOrCreateMeta('name', 'twitter:card', 'summary_large_image');
      setOrCreateMeta('name', 'twitter:title', nextTitle);
      setOrCreateMeta('name', 'twitter:description', nextDesc);
    }

    // 4. Cleanup: Restore EVERYTHING when component unmounts
    return () => {
      document.title = prevTitle;
      setOrCreateMeta('property', 'og:title', prevOgTitle || prevTitle);
      
      if (prevDesc) setOrCreateMeta('name', 'description', prevDesc);
      if (prevOgDesc) setOrCreateMeta('property', 'og:description', prevOgDesc);
    };
  }, [title, description]);
}
