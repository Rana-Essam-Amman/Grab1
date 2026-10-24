import { useEffect } from 'react';

interface UseSEOOptions {
  title?: string | null;
  description?: string | null;
}

const DEFAULT_TITLE = 'FOX Marketplace';

function setOrCreateMeta(attr: 'name' | 'property', key: string, content: string): void {
  let meta = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attr, key);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
}

function removeMeta(attr: 'name' | 'property', key: string): void {
  document.querySelector(`meta[${attr}="${key}"]`)?.remove();
}

export function useSEO({ title, description }: UseSEOOptions): void {
  useEffect(() => {
    const prevTitle = document.title;

    // Snapshot existing elements and their content
    const prevDescEl = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const prevDesc = prevDescEl ? prevDescEl.getAttribute('content') : null;

    const prevOgTitleEl = document.querySelector<HTMLMetaElement>('meta[property="og:title"]');
    const prevOgTitle = prevOgTitleEl ? prevOgTitleEl.getAttribute('content') : null;

    const prevOgDescEl = document.querySelector<HTMLMetaElement>('meta[property="og:description"]');
    const prevOgDesc = prevOgDescEl ? prevOgDescEl.getAttribute('content') : null;

    // Apply new values
    const nextTitle = title?.trim() ? title.trim() : DEFAULT_TITLE;
    const nextDesc = description?.trim() ?? '';

    document.title = nextTitle;
    setOrCreateMeta('property', 'og:title', nextTitle);

    if (nextDesc) {
      setOrCreateMeta('name', 'description', nextDesc);
      setOrCreateMeta('property', 'og:description', nextDesc);
      setOrCreateMeta('name', 'twitter:card', 'summary_large_image');
      setOrCreateMeta('name', 'twitter:title', nextTitle);
      setOrCreateMeta('name', 'twitter:description', nextDesc);
    }

    // Cleanup: Restore or remove based on original state
    return () => {
      document.title = prevTitle;

      if (prevDesc !== null) {
        setOrCreateMeta('name', 'description', prevDesc);
      } else {
        removeMeta('name', 'description');
      }

      if (prevOgTitle !== null) {
        setOrCreateMeta('property', 'og:title', prevOgTitle);
      } else {
        removeMeta('property', 'og:title');
      }

      if (prevOgDesc !== null) {
        setOrCreateMeta('property', 'og:description', prevOgDesc);
      } else {
        removeMeta('property', 'og:description');
      }

      // Twitter tags are dynamic per page, so remove them on unmount
      removeMeta('name', 'twitter:card');
      removeMeta('name', 'twitter:title');
      removeMeta('name', 'twitter:description');
    };
  }, [title, description]);
}
