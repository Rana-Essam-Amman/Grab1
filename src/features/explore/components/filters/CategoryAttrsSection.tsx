import React, { useMemo, useCallback } from 'react';
import { getListingFields } from '@/data/listingFields';
import type { ListingField } from '@/data/listingFields';
import { getRangeFiltersFor } from '@/data/filterRanges';
import { FilterFieldRenderer } from './FilterFieldRenderer';

export interface CategoryAttrsSectionProps {
  readonly isArabic: boolean;
  readonly categorySlug: string | null;
  readonly subcategorySlug: string | null;
  readonly attrs: Readonly<Record<string, string>>;
  readonly onChange: (key: string, value: string | null) => void;
}

/**
 * Generic filter eligibility — driven by field type.
 * Text fields are excluded by default (bad UX for filters) but can be opted in
 * via `filterable: true`.
 */
function isEligible(f: ListingField): boolean {
  if (f.filterable === false) return false;
  if (f.filterable === true) return true;
  switch (f.type) {
    case 'boolean':
    case 'number':
    case 'cascading-model':
    case 'cascading-trim':
      return true;
    case 'select':
      return Array.isArray(f.options) && f.options.length >= 1;
    case 'text':
      return false;
    default:
      return false;
  }
}

export const CategoryAttrsSection: React.FC<CategoryAttrsSectionProps> = ({
  isArabic,
  categorySlug,
  subcategorySlug,
  attrs,
  onChange,
}) => {
  const rangeFilters = useMemo(
    () => getRangeFiltersFor(categorySlug, subcategorySlug),
    [categorySlug, subcategorySlug],
  );

  const fields = useMemo(
    () =>
      !categorySlug
        ? []
        : getListingFields(categorySlug, subcategorySlug ?? undefined).filter(isEligible),
    [categorySlug, subcategorySlug],
  );

  const handleChange = useCallback(
    (key: string, value: string | null) => {
      onChange(key, value);
      if (key === 'make') {
        onChange('model', null);
        onChange('trim', null);
      } else if (key === 'model') {
        onChange('trim', null);
      }
    },
    [onChange],
  );

  if (fields.length === 0 && rangeFilters.length === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      {rangeFilters.map((rf) => (
        <div key={rf.filterKey} className="flex flex-col gap-2">
          <label htmlFor={rf.filterKey} className="text-[11px] font-bold text-ink-muted">
            {isArabic ? rf.labelAr : rf.labelEn}
          </label>
          <select
            id={rf.filterKey}
            value={attrs[rf.filterKey] ?? ''}
            onChange={(e) => onChange(rf.filterKey, e.target.value || null)}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-ink"
          >
            <option value="">{isArabic ? 'الكل' : 'All'}</option>
            {rf.steps.map((s) => (
              <option key={s.value} value={s.value}>
                {isArabic ? s.labelAr : s.labelEn}
              </option>
            ))}
          </select>
        </div>
      ))}

      {fields.map((field) => (
        <FilterFieldRenderer
          key={field.key}
          field={field}
          attrs={attrs}
          isArabic={isArabic}
          onChange={handleChange}
        />
      ))}
    </div>
  );
};
