import React from 'react';
import type { ListingField } from '@/data/listingFields';
import { Combobox } from '@/shared/ui/Combobox';

const MAX_OPTIONS = 15;

export interface FilterChipsFieldProps {
  readonly field: ListingField;
  readonly activeValue: string;
  readonly isArabic: boolean;
  readonly onChange: (value: string | null) => void;
}

export const FilterChipsField: React.FC<FilterChipsFieldProps> = ({
  field,
  activeValue,
  isArabic,
  onChange,
}) => {
  const title = isArabic ? field.labelAr : field.labelEn;
  const chips =
    field.type === 'boolean'
      ? [
          { value: 'true', label: isArabic ? 'نعم' : 'Yes' },
          { value: 'false', label: isArabic ? 'لا' : 'No' },
        ]
      : (field.options ?? []).map((o) => ({
          value: o.value,
          label: isArabic ? o.labelAr : o.labelEn,
        }));
  const useCombobox = field.type === 'select' && chips.length > MAX_OPTIONS;
  const currentLabel = chips.find((c) => c.value === activeValue)?.label ?? '';

  return (
    <div className="flex flex-col gap-2">
      <span className="text-[11px] font-bold text-ink-muted">{title}</span>
      {useCombobox ? (
        <Combobox
          value={currentLabel}
          options={chips.map((c) => c.label)}
          placeholder={isArabic ? 'اختر...' : 'Select...'}
          searchPlaceholder={isArabic ? 'ابحث...' : 'Search...'}
          emptyText={isArabic ? 'لا نتائج' : 'No results'}
          onChange={(newLabel) =>
            onChange(chips.find((c) => c.label === newLabel)?.value ?? null)
          }
        />
      ) : (
        <div className="flex flex-wrap gap-2">
          {chips.map((c) => {
            const isActive = activeValue === c.value;
            return (
              <button
                key={c.value}
                type="button"
                onClick={() => onChange(isActive ? null : c.value)}
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
      )}
    </div>
  );
};
