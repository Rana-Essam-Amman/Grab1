import React, { useState, useEffect } from 'react';
import { getTrimOptions } from '@/data/brands';
import { OtherOptionInput } from './OtherOptionInput';

const OTHER_VALUE = '__other__';

interface Props {
  readonly makeValue: string;
  readonly modelValue: string;
  readonly trimValue: string;
  readonly onTrimChange: (v: string) => void;
  readonly isArabic: boolean;
  readonly testId?: string;
}

export const CascadingTrimSelect: React.FC<Props> = ({
  makeValue, modelValue, trimValue, onTrimChange, isArabic, testId,
}) => {
  const trimOptions = getTrimOptions(makeValue, modelValue, isArabic);
  const isTrimCustom = Boolean(trimValue && trimOptions.length > 0 && !trimOptions.includes(trimValue));
  const [showOther, setShowOther] = useState(isTrimCustom || trimOptions.length === 0);
  const [customTrim, setCustomTrim] = useState(isTrimCustom ? trimValue : '');

  useEffect(() => {
    if (isTrimCustom) { setShowOther(true); setCustomTrim(trimValue); }
  }, [isTrimCustom, trimValue]);

  const label = isArabic ? 'الفئة (Trim)' : 'Trim';
  const otherLabel = isArabic ? 'أخرى — اكتب يدوياً' : 'Other — type manually';

  if (!makeValue || !modelValue) {
    return (
      <div className="flex flex-col gap-1.5 py-1.5">
        <label className="text-xs font-bold text-ink-soft">{label} <span className="text-accent">*</span></label>
        <div className="w-full h-11 px-3 rounded-xl border border-line bg-canvas/50 text-ink-muted text-sm flex items-center">
          {isArabic ? 'اختر الماركة والموديل أولاً' : 'Select make & model first'}
        </div>
      </div>
    );
  }

  if (trimOptions.length === 0) {
    return (
      <div className="flex flex-col gap-1.5 py-1.5">
        <label className="text-xs font-bold text-ink-soft">{label} <span className="text-accent">*</span></label>
        <OtherOptionInput
          value={trimValue}
          onChange={onTrimChange}
          placeholder={isArabic ? 'اكتب اسم الفئة (مثل: LE، SE)...' : 'Type trim (e.g. LE, SE)...'}
          isArabic={isArabic}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5 py-1.5">
      <label className="text-xs font-bold text-ink-soft">{label} <span className="text-accent">*</span></label>
      <select
        data-testid={testId}
        value={showOther ? OTHER_VALUE : trimValue}
        onChange={(e) => {
          const v = e.target.value;
          if (v === OTHER_VALUE) { setShowOther(true); onTrimChange(customTrim); }
          else { setShowOther(false); onTrimChange(v); }
        }}
        className="w-full h-11 px-3 rounded-xl border border-line bg-canvas text-ink text-sm font-medium focus:outline-none focus:border-primary cursor-pointer"
      >
        <option value="">{isArabic ? '-- اختر الفئة --' : '-- Select Trim --'}</option>
        {trimOptions.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
        <option value={OTHER_VALUE}>{otherLabel}</option>
      </select>
      {showOther && (
        <OtherOptionInput
          value={customTrim}
          onChange={(v) => { setCustomTrim(v); onTrimChange(v); }}
          placeholder={isArabic ? 'اكتب اسم الفئة...' : 'Type trim name...'}
          isArabic={isArabic}
        />
      )}
    </div>
  );
};
