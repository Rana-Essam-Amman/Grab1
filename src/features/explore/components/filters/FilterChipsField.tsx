import React, { useState } from 'react';
import type { ListingField } from '@/data/listingFields';
import { Combobox } from '@/shared/ui/Combobox';

const MAX_OPTIONS = 15;
const OTHER_VALUE = '__other__';

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
  const otherLabel = isArabic ? 'أخرى — اكتب يدوياً' : 'Other — type manually';
  const isOtherActive = Boolean(activeValue && !chips.some((c) => c.value === activeValue));
  const [showOther, setShowOther] = useState(isOtherActive);
  const [otherText, setOtherText] = useState(isOtherActive ? activeValue : '');

  const handleOtherClick = () => {
    if (showOther) {
      setShowOther(false);
      setOtherText('');
      onChange(null);
    } else {
      setShowOther(true);
    }
  };

  const handleOtherInput = (text: string) => {
    setOtherText(text);
    onChange(text.trim() ? text : null);
  };

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
          {field.allowOther && (
            <button
              type="button"
              onClick={handleOtherClick}
              className={`px-3 py-1.5 rounded-full border text-xs font-bold transition-all ${
                showOther
                  ? 'bg-accent/15 border-accent text-accent'
                  : 'bg-surface border-border text-ink'
              }`}
            >
              {otherLabel}
            </button>
          )}
        </div>
      )}
      {field.allowOther && showOther && (
        <input
          type="text"
          value={otherText}
          onChange={(e) => handleOtherInput(e.target.value)}
          placeholder={isArabic ? 'اكتب...' : 'Type...'}
          className="w-full h-9 px-3 rounded-lg border border-border bg-surface text-ink text-xs font-medium focus:outline-none focus:border-accent"
        />
      )}
    </div>
  );
};
