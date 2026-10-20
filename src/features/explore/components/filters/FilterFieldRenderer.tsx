import React from 'react';
import type { ListingField } from '@/data/listingFields';
import { Combobox } from '@/shared/ui/Combobox';
import { CascadingModelSelect } from '@/features/post-wizard/components/CascadingModelSelect';
import { CascadingTrimSelect } from '@/features/post-wizard/components/CascadingTrimSelect';

const MAX_OPTIONS = 15;

const Hint: React.FC<{ title: string; msg: string }> = ({ title, msg }) => (
  <div className="flex flex-col gap-2">
    <span className="text-[11px] font-bold text-ink-muted">{title}</span>
    <div className="w-full rounded-lg border border-border bg-surface/50 px-3 py-2 text-xs text-ink-muted">{msg}</div>
  </div>
);

interface Props {
  readonly field: ListingField;
  readonly attrs: Readonly<Record<string, string>>;
  readonly isArabic: boolean;
  readonly onChange: (key: string, value: string | null) => void;
}

export const FilterFieldRenderer: React.FC<Props> = ({ field, attrs, isArabic, onChange }) => {
  const title = isArabic ? field.labelAr : field.labelEn;
  const activeValue = attrs[field.key] ?? '';

  if (field.type === 'number') {
    return (
      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-bold text-ink-muted">{title}</label>
        <input type="number" value={activeValue} onChange={(e) => onChange(field.key, e.target.value || null)} placeholder={isArabic ? 'أدخل رقماً...' : 'Enter a number...'} className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-ink" />
      </div>
    );
  }

  if (field.type === 'cascading-model') {
    const makeValue = attrs[field.dependsOn ?? 'make'] ?? '';
    if (!makeValue) return <Hint title={title} msg={isArabic ? 'اختر الماركة أولاً' : 'Select make first'} />;
    return (
      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-bold text-ink-muted">{title}</span>
        <CascadingModelSelect makeValue={makeValue} modelValue={activeValue} onMakeChange={() => {}} onModelChange={(v) => onChange(field.key, v || null)} isArabic={isArabic} hideMakeField testId={`filter-${field.key}`} />
      </div>
    );
  }

  if (field.type === 'cascading-trim') {
    const makeValue = attrs[field.dependsOn ?? 'make'] ?? '';
    const modelValue = attrs['model'] ?? '';
    if (!makeValue || !modelValue) return <Hint title={title} msg={isArabic ? 'اختر الماركة والموديل أولاً' : 'Select make & model first'} />;
    return (
      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-bold text-ink-muted">{title}</span>
        <CascadingTrimSelect makeValue={makeValue} modelValue={modelValue} trimValue={activeValue} onTrimChange={(v) => onChange(field.key, v || null)} isArabic={isArabic} testId={`filter-${field.key}`} />
      </div>
    );
  }

  const chips = field.type === 'boolean'
    ? [{ value: 'true', label: isArabic ? 'نعم' : 'Yes' }, { value: 'false', label: isArabic ? 'لا' : 'No' }]
    : (field.options ?? []).map((o) => ({ value: o.value, label: isArabic ? o.labelAr : o.labelEn }));
  const useCombobox = field.type === 'select' && chips.length > MAX_OPTIONS;
  const currentLabel = chips.find((c) => c.value === activeValue)?.label ?? '';

  return (
    <div className="flex flex-col gap-2">
      <span className="text-[11px] font-bold text-ink-muted">{title}</span>
      {useCombobox ? (
        <Combobox value={currentLabel} options={chips.map((c) => c.label)} placeholder={isArabic ? 'اختر...' : 'Select...'} searchPlaceholder={isArabic ? 'ابحث...' : 'Search...'} emptyText={isArabic ? 'لا نتائج' : 'No results'} onChange={(newLabel) => onChange(field.key, chips.find((c) => c.label === newLabel)?.value ?? null)} />
      ) : (
        <div className="flex flex-wrap gap-2">
          {chips.map((c) => {
            const isActive = activeValue === c.value;
            return (
              <button key={c.value} type="button" onClick={() => onChange(field.key, isActive ? null : c.value)} className={`px-3 py-1.5 rounded-full border text-xs font-bold transition-all ${isActive ? 'bg-accent/15 border-accent text-accent' : 'bg-surface border-border text-ink'}`}>
                {c.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
