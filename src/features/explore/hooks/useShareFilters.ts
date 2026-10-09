import { useCallback } from 'react';
import { toast } from 'sonner';
import { buildCategoryPath } from '@/shared/router/categoryPaths';
import { buildFilterQuery } from '@/shared/router/filterParams';
import type { SortBy } from '@/shared/router/filterParams';

export interface ShareFiltersParams {
  readonly isArabic: boolean;
  readonly browseCountryCode: string;
  readonly draftCategory: string | null;
  readonly draftSub: string | null;
  readonly draftMin: number | null;
  readonly draftMax: number | null;
  readonly draftNeigh: string | null;
  readonly draftSort: SortBy;
  readonly draftAttrs: Record<string, string>;
}

export function useShareFilters(p: ShareFiltersParams): () => Promise<void> {
  const {
    isArabic, browseCountryCode, draftCategory, draftSub,
    draftMin, draftMax, draftNeigh, draftSort, draftAttrs,
  } = p;

  return useCallback(async () => {
    const slug = draftSub ?? draftCategory;
    const base = slug ? buildCategoryPath(browseCountryCode, slug) : '/';
    const query = buildFilterQuery({
      subcategory: null,
      minPrice: draftMin,
      maxPrice: draftMax,
      city: null,
      neighborhood: draftNeigh,
      sortBy: draftSort,
      attrs: draftAttrs,
    });
    const url = `${window.location.origin}${base}${query}`;
    const title = isArabic ? 'FOX Marketplace — نتائج الفلترة' : 'FOX Marketplace — Filtered results';
    const text = isArabic ? 'شوف هذي النتائج على FOX' : 'Check these results on FOX';

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch {
        // user cancelled or unsupported — fall through to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      toast.success(isArabic ? 'تم نسخ الرابط ✓' : 'Link copied ✓');
    } catch {
      toast.error(isArabic ? 'تعذر نسخ الرابط' : 'Could not copy link');
    }
  }, [isArabic, browseCountryCode, draftCategory, draftSub, draftMin, draftMax, draftNeigh, draftSort, draftAttrs]);
}
