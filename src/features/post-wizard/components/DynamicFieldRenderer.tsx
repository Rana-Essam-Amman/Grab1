import React from 'react';
import type { ListingField } from '@/data/listingFields';

interface DynamicFieldRendererProps {
  readonly field: ListingField;
  readonly value: string;
  readonly onChange: (key: string, value: string) => void;
  readonly isArabic: boolean;
}

export const DynamicFieldRenderer: React.FC<DynamicFieldRendererProps> = ({
  field,
  value,
  onChange,
  isArabic,
}) => {
  const label = isArabic ? field.labelAr : field.labelEn;

  if (field.type === 'boolean') {
    const isChecked = value === 'true' || value === '1' || value === 'yes';
    return (
      <div className="flex items-center justify-between py-2">
        <label className="text-sm font-semibold text-ink">
          {label} {field.required && <span className="text-accent">*</span>}
        </label>
        <button
          type="button"
          onClick={() => onChange(field.key, isChecked ? 'false' : 'true')}
          className={`w-12 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
            isChecked ? 'bg-primary' : 'bg-line'
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
              isChecked ? (isArabic ? '-translate-x-6' : 'translate-x-6') : 'translate-x-0'
            }`}
          />
        </button>
      </div>
    );
  }

  if (field.type === 'select' && field.options) {
    return (
      <div className="flex flex-col gap-1.5 py-1.5">
        <label className="text-xs font-bold text-ink-soft">
          {label} {field.required && <span className="text-accent">*</span>}
        </label>
        <select
          value={value}
          onChange={(e) => onChange(field.key, e.target.value)}
          className="w-full h-11 px-3 rounded-xl border border-line bg-canvas text-ink text-sm font-medium focus:outline-none focus:border-primary cursor-pointer"
        >
          <option value="">{isArabic ? '-- اختر --' : '-- Select --'}</option>
          {field.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {isArabic ? opt.labelAr : opt.labelEn}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5 py-1.5">
      <label className="text-xs font-bold text-ink-soft">
        {label} {field.required && <span className="text-accent">*</span>}
      </label>
      <input
        type={field.type === 'number' ? 'number' : 'text'}
        value={value}
        placeholder={field.placeholder || ''}
        onChange={(e) => onChange(field.key, e.target.value)}
        className="w-full h-11 px-3 rounded-xl border border-line bg-canvas text-ink text-sm font-medium focus:outline-none focus:border-primary"
      />
    </div>
  );
};
