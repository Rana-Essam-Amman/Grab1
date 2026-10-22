import React, { useMemo } from 'react';
import { extractTags } from '@/ai/tags/extractTags';
import { getTagDefinition } from '@/ai/tags/tagRegistry';
import type { Listing } from '@/types';

interface Props {
  readonly listing: Listing;
  readonly isArabic: boolean;
  readonly compact?: boolean;
}

export const TagChips: React.FC<Props> = ({ listing, isArabic, compact = false }) => {
  const tags = useMemo(
    () =>
      extractTags({
        title: listing.title,
        description: listing.description,
        categorySlug: listing.categorySlug,
        subcategorySlug: listing.subcategorySlug,
        attributes: listing.attributes ?? [],
      }),
    [listing]
  );

  const maxTags = compact ? 3 : 10;
  const visible = tags.slice(0, maxTags);

  if (visible.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1 mt-1" dir="auto" data-testid="tag-chips">
      {visible.map((tagSlug) => {
        const def = getTagDefinition(tagSlug);
        if (!def) return null;
        return (
          <span
            key={tagSlug}
            data-testid={`tag-${tagSlug}`}
            className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-accent/10 text-accent text-[10px] font-bold leading-tight"
          >
            {isArabic ? def.labelAr : def.labelEn}
          </span>
        );
      })}
    </div>
  );
};
