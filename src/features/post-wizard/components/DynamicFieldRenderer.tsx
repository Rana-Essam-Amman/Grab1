import React, { useState, useEffect } from 'react';
import type { ListingField } from '@/data/listingFields';
import { CascadingModelSelect } from './CascadingModelSelect';
import { CascadingTrimSelect } from './CascadingTrimSelect';
import { FieldSelectInput } from './FieldSelectInput';

interface DynamicFieldRendererProps {
  readonly field: ListingField;
  readonly value: string;
  readonly onChange: (key: string, value: string) => void;
  readonly isArabic: boolean;
  readonly allValues?: Readonly<Record<string, string>>;
}

const reqStar = <span className="text-accent">*</span>;

export const DynamicFieldRenderer: React.FC<DynamicFieldRendererProps> = ({ field, value, onChange, isArabic, allValues }) => {
  const label = isArabic ? field.labelAr : field.labelEn;
  const isCustom = Boolean(field.allowOther && value && field.options && !field.options.some((opt) => opt.value === value));
  const [showOther, setShowOther] = useState(isCustom);
  const [customValue, setCustomValue] = useState(isCustom ? value : '');
  useEffect(() => { if (isCustom) { setShowOther(true); setCustomValue(value); } }, [isCustom, value]);

  if (field.type === 'boolean') {
    const isChecked = value === 'true' || value === '1' || value === 'yes';
    return (
      <div className="flex items-center justify-between py-2">
        <label className="text-sm font-semibold text-ink">{label} {field.required && reqStar}</label>
        <button type="button" data-testid={`field-${field.key}`} onClick={() => onChange(field.key, isChecked ? 'false' : 'true')} className={`w-12 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${isChecked ? 'bg-success' : 'bg-line'}`}>
          <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${isChecked ? (isArabic ? '-translate-x-6' : 'translate-x-6') : 'translate-x-0'}`} />
        </button>
      </div>
    );
  }

  if (field.type === 'cascading-model') {
    const parentValue = allValues?.[field.dependsOn ?? ''] ?? '';
    return (
      <div className="flex flex-col gap-1.5 py-1.5">
        <label className="text-xs font-bold text-ink-soft">{label} {field.required && reqStar}</label>
        <CascadingModelSelect makeValue={parentValue} modelValue={value} onMakeChange={() => { /* handled by make field */ }} onModelChange={(v) => onChange(field.key, v)} isArabic={isArabic} hideMakeField testId={`field-${field.key}`} dataSource={(field.cascadeSource as 'cars' | 'phones' | 'tv' | 'audio' | 'cameras' | 'laptops' | 'appliances' | 'fashion' | 'watches' | 'beauty' | 'kids' | 'sports' | 'furniture' | 'home-garden' | 'pets' | undefined) ?? 'cars'} />
      </div>
    );
  }

  if (field.type === 'cascading-trim') {
    const makeValue = allValues?.[field.dependsOn ?? ''] ?? '';
    const modelValue = allValues?.['model'] ?? '';
    return (
      <div className="flex flex-col gap-1.5 py-1.5">
        <label className="text-xs font-bold text-ink-soft">{label} {field.required && reqStar}</label>
        <CascadingTrimSelect makeValue={makeValue} modelValue={modelValue} trimValue={value} onTrimChange={(v) => onChange(field.key, v)} isArabic={isArabic} testId={`field-${field.key}`} />
      </div>
    );
  }

  if (field.type === 'select' && field.multiSelect && field.options) {
    const selectedVals = value ? value.split(',').map((s) => s.trim()).filter(Boolean) : [];
    const toggleOpt = (val: string) => onChange(field.key, (selectedVals.includes(val) ? selectedVals.filter((v) => v !== val) : [...selectedVals, val]).join(', '));
    return (
      <div className="flex flex-col gap-1.5 py-1.5">
        <label className="text-xs font-bold text-ink-soft">{label} {field.required && reqStar}</label>
        <div className="flex flex-wrap gap-2 pt-1">
          {field.options.map((opt) => (
            <button key={opt.value} type="button" onClick={() => toggleOpt(opt.value)} className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${selectedVals.includes(opt.value) ? 'bg-primary text-white border-primary shadow-sm' : 'bg-canvas text-ink-soft border-line hover:border-ink-muted'}`}>{isArabic ? opt.labelAr : opt.labelEn}</button>
          ))}
        </div>
        {field.allowOther && (
          <input
            type="text"
            placeholder={isArabic ? 'قيمة أخرى — اكتب ثم Enter' : 'Other — type and press Enter'}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                const v = (e.target as HTMLInputElement).value.trim();
                if (v) {
                  const current = value ? value.split(',').map((s) => s.trim()).filter(Boolean) : [];
                  if (!current.includes(v)) {
                    onChange(field.key, [...current, v].join(', '));
                  }
                  (e.target as HTMLInputElement).value = '';
                }
              }
            }}
            className="w-full mt-2 h-10 px-3 rounded-xl border border-line bg-canvas text-ink text-xs font-medium focus:outline-none focus:border-primary"
          />
        )}
      </div>
    );
  }

  if (field.type === 'select' && field.options) {
    return (
      <div className="flex flex-col gap-1.5 py-1.5">
        <label className="text-xs font-bold text-ink-soft">{label} {field.required && reqStar}</label>
        <FieldSelectInput field={field} value={value} onChange={onChange} isArabic={isArabic} showOther={showOther} customValue={customValue} onShowOtherChange={setShowOther} onCustomValueChange={setCustomValue} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5 py-1.5">
      <label className="text-xs font-bold text-ink-soft">{label} {field.required && reqStar}</label>
      <input type={field.type === 'number' ? 'number' : 'text'} value={value} placeholder={field.placeholder || ''} onChange={(e) => onChange(field.key, e.target.value)} data-testid={`field-${field.key}`} className="w-full h-11 px-3 rounded-xl border border-line bg-canvas text-ink text-sm font-medium focus:outline-none focus:border-primary" />
    </div>
  );
};
