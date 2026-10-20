import React, { useMemo } from 'react';
import { getListingFields } from '@/data/listingFields';
import type { ListingField } from '@/data/listingFields';
import { Combobox } from '@/shared/ui/Combobox';

export interface CategoryAttrsSectionProps {
  readonly isArabic: boolean;
  readonly categorySlug: string | null;
  readonly subcategorySlug: string | null;
  readonly attrs: Readonly<Record<string, string>>;
  readonly onChange: (key: string, value: string | null) => void;
}

const MAX_OPTIONS = 15;
const CAR_SUBS = ['cars', 'classic_cars', 'damaged_cars', 'lease_transfer'];
const MILEAGE_OPTIONS = [
  { value: '', labelEn: 'All', labelAr: 'الكل' },
  { value: '0-50000', labelEn: '0 - 50,000 KM', labelAr: '0 - 50,000 كم' },
  { value: '50000-100000', labelEn: '50,000 - 100,000 KM', labelAr: '50,000 - 100,000 كم' },
  { value: '100000-150000', labelEn: '100,000 - 150,000 KM', labelAr: '100,000 - 150,000 كم' },
  { value: '150000-plus', labelEn: '150,000+ KM', labelAr: '150,000+ كم' },
];

// CONTAGION (Session 4): attr filters hidden — DB stores {label,value} but RPC matches {key,value}.
// Re-enable after Phase 1 (data migration + registry unification).
const ATTRS_FILTERS_ENABLED = false;

function isEligible(f: ListingField): boolean {
  if (f.key === 'make') return true;
  if (f.type === 'boolean') return true;
  if (f.type === 'select' && f.options && f.options.length > 1 && f.options.length <= MAX_OPTIONS) return true;
  return false;
}

export const CategoryAttrsSection: React.FC<CategoryAttrsSectionProps> = ({ isArabic, categorySlug, subcategorySlug, attrs, onChange }) => {
  if (!ATTRS_FILTERS_ENABLED) return null;
  const showMileageRange = categorySlug === 'motors' && CAR_SUBS.includes(subcategorySlug ?? '');
  const fields = useMemo(() => !categorySlug ? [] : getListingFields(categorySlug, subcategorySlug ?? undefined).filter(isEligible), [categorySlug, subcategorySlug]);

  if (fields.length === 0 && !showMileageRange) return null;

  return (
    <div className="flex flex-col gap-4">
      {showMileageRange && (
        <div className="flex flex-col gap-2">
          <label htmlFor="km-range" className="text-[11px] font-bold text-ink-muted">
            {isArabic ? 'نطاق المسافة المقطوعة' : 'Mileage Range'}
          </label>
          <select
            id="km-range"
            value={attrs.km_range ?? ''}
            onChange={(event) => onChange('km_range', event.target.value || null)}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-ink"
          >
            {MILEAGE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {isArabic ? option.labelAr : option.labelEn}
              </option>
            ))}
          </select>
        </div>
      )}
      {fields.map((field) => {
        const activeValue = attrs[field.key] ?? '';
        const title = isArabic ? field.labelAr : field.labelEn;
        const chips = field.type === 'boolean'
          ? [{ value: 'true', label: isArabic ? 'نعم' : 'Yes' }, { value: 'false', label: isArabic ? 'لا' : 'No' }]
          : (field.options ?? []).map((o) => ({ value: o.value, label: isArabic ? o.labelAr : o.labelEn }));
        const useCombobox = field.type === 'select' && chips.length > MAX_OPTIONS;
        const currentLabel = chips.find((c) => c.value === activeValue)?.label ?? '';

        return (
          <div key={field.key} className="flex flex-col gap-2">
            <span className="text-[11px] font-bold text-ink-muted">{title}</span>
            {useCombobox ? (
              <Combobox
                value={currentLabel}
                options={chips.map((c) => c.label)}
                placeholder={isArabic ? 'اختر...' : 'Select...'}
                searchPlaceholder={isArabic ? 'ابحث...' : 'Search...'}
                emptyText={isArabic ? 'لا نتائج' : 'No results'}
                onChange={(newLabel) => onChange(field.key, chips.find((c) => c.label === newLabel)?.value ?? null)}
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                {chips.map((c) => {
                  const isActive = activeValue === c.value;
                  return (
                    <button key={c.value} type="button" onClick={() => onChange(field.key, isActive ? null : c.value)}
                      className={`px-3 py-1.5 rounded-full border text-xs font-bold transition-all ${isActive ? 'bg-accent/15 border-accent text-accent' : 'bg-surface border-border text-ink'}`}
                    >
                      {c.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
