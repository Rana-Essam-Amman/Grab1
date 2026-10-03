import React, { useState, useEffect } from 'react';
import type { ListingField } from '@/data/listingFields';
import { OtherOptionInput } from './OtherOptionInput';
import { CascadingModelSelect } from './CascadingModelSelect';

const OTHER_VALUE = '__other__';

interface DynamicFieldRendererProps {
  readonly field: ListingField;
  readonly value: string;
  readonly onChange: (key: string, value: string) => void;
  readonly isArabic: boolean;
  readonly allValues?: Readonly<Record<string, string>>;
}

export const DynamicFieldRenderer: React.FC<DynamicFieldRendererProps> = ({
  field, value, onChange, isArabic, allValues,
}) => {
  const label = isArabic ? field.labelAr : field.labelEn;
  const isCustom = Boolean(field.allowOther && value && field.options && !field.options.some((opt) => opt.value === value));
  const [showOther, setShowOther] = useState(isCustom);
  const [customValue, setCustomValue] = useState(isCustom ? value : '');

  useEffect(() => {
    if (isCustom) { setShowOther(true); setCustomValue(value); }
  }, [isCustom, value]);

  if (field.type === 'boolean') {
    const isChecked = value === 'true' || value === '1' || value === 'yes';
    return (
      <div className="flex items-center justify-between py-2">
        <label className="text-sm font-semibold text-ink">{label} {field.required && <span className="text-accent">*</span>}</label>
        <button
          type="button"
          data-testid={`field-${field.key}`}
          onClick={() => onChange(field.key, isChecked ? 'false' : 'true')}
          className={`w-12 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${isChecked ? 'bg-primary' : 'bg-line'}`}
        >
          <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${isChecked ? (isArabic ? '-translate-x-6' : 'translate-x-6') : 'translate-x-0'}`} />
        </button>
      </div>
    );
  }

  if (field.type === 'cascading-model') {
    const parentKey = field.dependsOn ?? '';
    const parentValue = allValues?.[parentKey] ?? '';
    return (
      <div className="flex flex-col gap-1.5 py-1.5">
        <label className="text-xs font-bold text-ink-soft">{label} {field.required && <span className="text-accent">*</span>}</label>
        <CascadingModelSelect makeValue={parentValue} modelValue={value} onMakeChange={() => { /* handled by make field */ }} onModelChange={(v) => onChange(field.key, v)} isArabic={isArabic} hideMakeField testId={`field-${field.key}`} />
      </div>
    );
  }

  if (field.type === 'select' && field.multiSelect && field.options) {
    const selectedVals = value ? value.split(',').map((s) => s.trim()).filter(Boolean) : [];
    const toggleOpt = (val: string) => {
      const next = selectedVals.includes(val) ? selectedVals.filter((v) => v !== val) : [...selectedVals, val];
      onChange(field.key, next.join(', '));
    };
    return (
      <div className="flex flex-col gap-1.5 py-1.5">
        <label className="text-xs font-bold text-ink-soft">{label} {field.required && <span className="text-accent">*</span>}</label>
        <div className="flex flex-wrap gap-2 pt-1">
          {field.options.map((opt) => (
            <button
              key={opt.value} type="button" onClick={() => toggleOpt(opt.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                selectedVals.includes(opt.value) ? 'bg-primary text-white border-primary shadow-sm' : 'bg-canvas text-ink-soft border-line hover:border-ink-muted'
              }`}
            >{isArabic ? opt.labelAr : opt.labelEn}</button>
          ))}
        </div>
      </div>
    );
  }

  if (field.type === 'select' && field.options) {
    const placeholderText = field.placeholderAr && isArabic ? field.placeholderAr : (field.placeholder || (isArabic ? 'اكتب القيمة...' : 'Type value...'));
    return (
      <div className="flex flex-col gap-1.5 py-1.5">
        <label className="text-xs font-bold text-ink-soft">{label} {field.required && <span className="text-accent">*</span>}</label>
        <select
          data-testid={`field-${field.key}`}
          value={showOther ? OTHER_VALUE : value}
          onChange={(e) => {
            const sel = e.target.value;
            if (sel === OTHER_VALUE) { setShowOther(true); onChange(field.key, customValue); }
            else { setShowOther(false); onChange(field.key, sel); }
          }}
          className="w-full h-11 px-3 rounded-xl border border-line bg-canvas text-ink text-sm font-medium focus:outline-none focus:border-primary cursor-pointer"
        >
          <option value="">{isArabic ? '-- اختر --' : '-- Select --'}</option>
          {field.options.map((opt) => (<option key={opt.value} value={opt.value}>{isArabic ? opt.labelAr : opt.labelEn}</option>))}
          {field.allowOther && (<option value={OTHER_VALUE}>{isArabic ? 'أخرى — اكتب يدوياً' : 'Other — type manually'}</option>)}
        </select>
        {showOther && (
          <OtherOptionInput value={customValue} onChange={(v) => { setCustomValue(v); onChange(field.key, v); }} placeholder={placeholderText} isArabic={isArabic} />
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5 py-1.5">
      <label className="text-xs font-bold text-ink-soft">{label} {field.required && <span className="text-accent">*</span>}</label>
      <input
        type={field.type === 'number' ? 'number' : 'text'} value={value} placeholder={field.placeholder || ''}
        onChange={(e) => onChange(field.key, e.target.value)}
        data-testid={`field-${field.key}`}
        className="w-full h-11 px-3 rounded-xl border border-line bg-canvas text-ink text-sm font-medium focus:outline-none focus:border-primary"
      />
    </div>
  );
};
