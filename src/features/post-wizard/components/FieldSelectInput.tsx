import React from 'react';
import type { ListingField } from '@/data/listingFields';
import { OtherOptionInput } from './OtherOptionInput';
import { SearchableDropdown } from '@/shared/ui/SearchableDropdown';

const OTHER_VALUE = '__other__';
const SEARCHABLE_THRESHOLD = 10;

interface Props {
  readonly field: ListingField;
  readonly value: string;
  readonly onChange: (key: string, value: string) => void;
  readonly isArabic: boolean;
  readonly showOther: boolean;
  readonly customValue: string;
  readonly onShowOtherChange: (show: boolean) => void;
  readonly onCustomValueChange: (v: string) => void;
}

export const FieldSelectInput: React.FC<Props> = ({
  field, value, onChange, isArabic,
  showOther, customValue, onShowOtherChange, onCustomValueChange,
}) => {
  const options = field.options ?? [];
  const useSearchable = options.length > SEARCHABLE_THRESHOLD;
  const placeholderText =
    field.placeholderAr && isArabic
      ? field.placeholderAr
      : field.placeholder || (isArabic ? 'اكتب القيمة...' : 'Type value...');
  const otherLabel = isArabic ? 'أخرى — اكتب يدوياً' : 'Other — type manually';
  const labelOf = (v: string) => {
    const opt = options.find((o) => o.value === v);
    return opt ? (isArabic ? opt.labelAr : opt.labelEn) : '';
  };

  const handleOtherText = (v: string) => {
    onCustomValueChange(v);
    onChange(field.key, v);
  };

  if (useSearchable) {
    const labels = options.map((opt) => (isArabic ? opt.labelAr : opt.labelEn));
    const allLabels = field.allowOther ? [...labels, otherLabel] : labels;
    const selectedLabel = showOther ? otherLabel : labelOf(value);

    const handleSelect = (selected: string) => {
      if (selected === otherLabel) {
        onShowOtherChange(true);
        onChange(field.key, customValue);
        return;
      }
      const match = options.find(
        (opt) => (isArabic ? opt.labelAr : opt.labelEn) === selected,
      );
      if (match) {
        onShowOtherChange(false);
        onChange(field.key, match.value);
      }
    };

    return (
      <div data-testid={`field-${field.key}`}>
        <SearchableDropdown
          options={allLabels}
          value={selectedLabel}
          onChange={handleSelect}
          placeholder={placeholderText}
          isArabic={isArabic}
        />
        {showOther && (
          <OtherOptionInput
            value={customValue}
            onChange={handleOtherText}
            placeholder={placeholderText}
            isArabic={isArabic}
          />
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      <select
        data-testid={`field-${field.key}`}
        value={showOther ? OTHER_VALUE : value}
        onChange={(e) => {
          const sel = e.target.value;
          if (sel === OTHER_VALUE) {
            onShowOtherChange(true);
            onChange(field.key, customValue);
          } else {
            onShowOtherChange(false);
            onChange(field.key, sel);
          }
        }}
        className="w-full h-11 px-3 rounded-xl border border-line bg-canvas text-ink text-sm font-medium focus:outline-none focus:border-primary cursor-pointer"
      >
        <option value="">{isArabic ? '-- اختر --' : '-- Select --'}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {isArabic ? opt.labelAr : opt.labelEn}
          </option>
        ))}
        {field.allowOther && <option value={OTHER_VALUE}>{otherLabel}</option>}
      </select>
      {showOther && (
        <OtherOptionInput
          value={customValue}
          onChange={handleOtherText}
          placeholder={placeholderText}
          isArabic={isArabic}
        />
      )}
    </div>
  );
};
