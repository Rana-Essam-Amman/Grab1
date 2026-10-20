import React, { useMemo, useCallback } from 'react';
import { getListingFields } from '@/data/listingFields';
import type { ListingField } from '@/data/listingFields';
import { FilterFieldRenderer } from './FilterFieldRenderer';

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

function isEligible(f: ListingField): boolean {
  if (f.key === 'make' || f.key === 'model' || f.key === 'trim') return true;
  if (f.type === 'boolean' || f.type === 'number') return true;
  if (f.type === 'cascading-model' || f.type === 'cascading-trim') return true;
  if (f.type === 'select' && f.options && f.options.length > 1 && f.options.length <= MAX_OPTIONS) return true;
  return false;
}

export const CategoryAttrsSection: React.FC<CategoryAttrsSectionProps> = ({ isArabic, categorySlug, subcategorySlug, attrs, onChange }) => {
  const showMileageRange = categorySlug === 'motors' && CAR_SUBS.includes(subcategorySlug ?? '');
  const fields = useMemo(() => !categorySlug ? [] : getListingFields(categorySlug, subcategorySlug ?? undefined).filter(isEligible), [categorySlug, subcategorySlug]);

  const handleChange = useCallback((key: string, value: string | null) => {
    onChange(key, value);
    if (key === 'make') { onChange('model', null); onChange('trim', null); }
    else if (key === 'model') { onChange('trim', null); }
  }, [onChange]);

  if (fields.length === 0 && !showMileageRange) return null;

  return (
    <div className="flex flex-col gap-4">
      {showMileageRange && (
        <div className="flex flex-col gap-2">
          <label htmlFor="km-range" className="text-[11px] font-bold text-ink-muted">
            {isArabic ? 'نطاق المسافة المقطوعة' : 'Mileage Range'}
          </label>
          <select id="km-range" value={attrs.km_range ?? ''} onChange={(e) => onChange('km_range', e.target.value || null)} className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-ink">
            {MILEAGE_OPTIONS.map((o) => (<option key={o.value} value={o.value}>{isArabic ? o.labelAr : o.labelEn}</option>))}
          </select>
        </div>
      )}
      {fields.map((field) => (
        <FilterFieldRenderer key={field.key} field={field} attrs={attrs} isArabic={isArabic} onChange={handleChange} />
      ))}
    </div>
  );
};
