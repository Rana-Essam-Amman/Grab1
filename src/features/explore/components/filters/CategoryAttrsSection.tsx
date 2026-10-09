import React, { useMemo } from 'react';
import { getListingFields } from '@/data/listingFields';
import type { ListingField } from '@/data/listingFields';

export interface CategoryAttrsSectionProps {
  readonly isArabic: boolean;
  readonly categorySlug: string | null;
  readonly subcategorySlug: string | null;
  readonly attrs: Readonly<Record<string, string>>;
  readonly onChange: (key: string, value: string | null) => void;
}

const MAX_OPTIONS = 15;

function isEligible(f: ListingField): boolean {
  if (f.type === 'boolean') return true;
  if (f.type === 'select' && f.options && f.options.length > 1 && f.options.length <= MAX_OPTIONS) return true;
  return false;
}

export const CategoryAttrsSection: React.FC<CategoryAttrsSectionProps> = ({
  isArabic, categorySlug, subcategorySlug, attrs, onChange,
}) => {
  const fields = useMemo(() => {
    if (!categorySlug) return [];
    const all = getListingFields(categorySlug, subcategorySlug ?? undefined);
    return all.filter(isEligible);
  }, [categorySlug, subcategorySlug]);

  if (fields.length === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      {fields.map((field) => {
        const activeValue = attrs[field.key] ?? '';
        const title = isArabic ? field.labelAr : field.labelEn;
        const chips: readonly { readonly value: string; readonly label: string }[] =
          field.type === 'boolean'
            ? [
                { value: 'true', label: isArabic ? 'نعم' : 'Yes' },
                { value: 'false', label: isArabic ? 'لا' : 'No' },
              ]
            : (field.options ?? []).map((o) => ({
                value: o.value,
                label: isArabic ? o.labelAr : o.labelEn,
              }));

        return (
          <div key={field.key} className="flex flex-col gap-2">
            <span className="text-[11px] font-bold text-ink-muted">{title}</span>
            <div className="flex flex-wrap gap-2">
              {chips.map((c) => {
                const isActive = activeValue === c.value;
                return (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => onChange(field.key, isActive ? null : c.value)}
                    className={`px-3 py-1.5 rounded-full border text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-accent/15 border-accent text-accent'
                        : 'bg-surface border-border text-ink'
                    }`}
                  >
                    {c.label}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
