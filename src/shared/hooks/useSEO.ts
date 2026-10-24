import { useEffect } from 'react';

interface UseSEOOptions {
  title?: string | null;
  description?: string | null;
}

const DEFAULT_TITLE = 'FOX Marketplace';

function setOrCreateMeta(name: string, content: string): void {
  let meta = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', name);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
}

function setOrCreatePropertyMeta(property: string, content: string): void {
  let meta = document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('property', property);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
}

export function useSEO({ title, description }: UseSEOOptions): void {
  useEffect(() => {
    const previousTitle = document.title;
    const previousDescription =
      document.querySelector<HTMLMetaElement>('meta[name="description"]')?.getAttribute('content') ?? '';

    const nextTitle = title?.trim() ? title.trim() : DEFAULT_TITLE;
    document.title = nextTitle;

    const nextDescription = description?.trim() ?? '';
    if (nextDescription) {
      setOrCreateMeta('description', nextDescription);
      setOrCreatePropertyMeta('og:description', nextDescription);
      setOrCreatePropertyMeta('og:title', nextTitle);
      setOrCreateMeta('twitter:card', 'summary_large_image');
      setOrCreateMeta('twitter:title', nextTitle);
      setOrCreateMeta('twitter:description', nextDescription);
    }

    return () => {
      document.title = previousTitle;
      if (previousDescription) {
        setOrCreateMeta('description', previousDescription);
      }
    };
  }, [title, description]);
}
