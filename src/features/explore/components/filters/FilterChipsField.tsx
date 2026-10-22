import React from 'react';
import type { ListingField } from '@/data/listingFields';
import { Combobox } from '@/shared/ui/Combobox';
import { FilterOtherField } from './FilterOtherField';

const MAX_OPTIONS = 15;
const OTHER_LABEL_AR = 'أخرى — اكتب يدوياً';
const OTHER_LABEL_EN = 'Other — type manually';

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
  const currentLabel = field.multiSelect
    ? activeValue.split(',').map((s) => s.trim()).filter(Boolean).map((v) => chips.find((c) => c.value === v)?.label ?? '').filter(Boolean).join(', ')
    : chips.find((c) => c.value === activeValue)?.label ?? '';
  const otherLabel = isArabic ? OTHER_LABEL_AR : OTHER_LABEL_EN;
  const knownValues = chips.map((c) => c.value);
  const isOtherActive = field.multiSelect
    ? activeValue.split(',').map((s) => s.trim()).filter(Boolean).some((v) => v && !knownValues.includes(v))
    : Boolean(activeValue && !knownValues.includes(activeValue));

  return (
    <div className="flex flex-col gap-2">
      <span className="text-[11px] font-bold text-ink-muted">{title}</span>
      {useCombobox ? (
        <div className="flex flex-col gap-2">
          <Combobox
            value={isOtherActive ? otherLabel : currentLabel}
            options={field.allowOther ? [...chips.map((c) => c.label), otherLabel] : chips.map((c) => c.label)}
            placeholder={isArabic ? 'اختر...' : 'Select...'}
            searchPlaceholder={isArabic ? 'ابحث...' : 'Search...'}
            emptyText={isArabic ? 'لا نتائج' : 'No results'}
            onChange={(newLabel) => {
              if (newLabel === otherLabel) {
                onChange(' ');
                return;
              }
              onChange(chips.find((c) => c.label === newLabel)?.value ?? null);
            }}
          />
          {field.allowOther && (
            <FilterOtherField
              isArabic={isArabic}
              activeValue={isOtherActive ? activeValue : ''}
              knownValues={knownValues}
              onChange={onChange}
              variant="input-only"
            />
          )}
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {chips.map((c) => {
            const isMulti = Boolean(field.multiSelect);
            const activeList = isMulti ? activeValue.split(',').map((s) => s.trim()).filter(Boolean) : [];
            const isActive = isMulti ? activeList.includes(c.value) : activeValue === c.value;
            const toggle = () => {
              if (!isMulti) {
                onChange(isActive ? null : c.value);
                return;
              }
              const next = isActive
                ? activeList.filter((x) => x !== c.value)
                : [...activeList, c.value];
              onChange(next.length > 0 ? next.join(',') : null);
            };
            return (
              <button
                key={c.value}
                type="button"
                onClick={toggle}
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
          {field.allowOther && (
            <FilterOtherField
              isArabic={isArabic}
              activeValue={activeValue}
              knownValues={knownValues}
              onChange={onChange}
              variant="chip"
            />
          )}
        </div>
      )}
    </div>
  );
};
