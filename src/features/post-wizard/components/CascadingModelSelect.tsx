import React, { useState, useEffect } from 'react';
import { CAR_BRANDS } from '@/data/brands/carBrands';
import { getModelOptions } from '@/data/brands/carModels';
import { OtherOptionInput } from './OtherOptionInput';
import { SearchableDropdown } from '@/shared/ui/SearchableDropdown';

const OTHER_VALUE = '__other__';

interface Props {
  readonly makeValue: string;
  readonly modelValue: string;
  readonly onMakeChange: (v: string) => void;
  readonly onModelChange: (v: string) => void;
  readonly isArabic: boolean;
  readonly hideMakeField?: boolean;
  readonly testId?: string;
}

export const CascadingModelSelect: React.FC<Props> = ({
  makeValue, modelValue, onMakeChange, onModelChange, isArabic, hideMakeField, testId,
}) => {
  const isMakeCustom = Boolean(makeValue && !CAR_BRANDS.some((b) => b.slug === makeValue));
  const [showOtherMake, setShowOtherMake] = useState(isMakeCustom || makeValue === 'other');
  const [customMake, setCustomMake] = useState(isMakeCustom ? makeValue : '');
  const modelOptions = getModelOptions(makeValue);
  const isModelCustom = Boolean(
    modelValue && (!modelOptions.length || !modelOptions.some((m) => m.value === modelValue))
  );
  const [showOtherModel, setShowOtherModel] = useState(isModelCustom || !modelOptions.length);
  const [customModel, setCustomModel] = useState(isModelCustom ? modelValue : '');

  useEffect(() => {
    if (isMakeCustom) { setShowOtherMake(true); setCustomMake(makeValue); }
  }, [isMakeCustom, makeValue]);

  useEffect(() => {
    if (isModelCustom) { setShowOtherModel(true); setCustomModel(modelValue); }
  }, [isModelCustom, modelValue]);

  const modelTestId = hideMakeField ? testId : (testId ? `${testId}-model` : undefined);
  const otherMakeLabel = isArabic ? 'أخرى — اكتب يدوياً' : 'Other — type manually';
  const brandOptions = CAR_BRANDS.map((b) => isArabic ? b.nameAr : b.nameEn);
  const selectedBrand = CAR_BRANDS.find((b) => b.slug === makeValue);
  const selectedBrandLabel = selectedBrand
    ? (isArabic ? selectedBrand.nameAr : selectedBrand.nameEn)
    : makeValue;

  const renderModelBlock = () => (
    <div className="flex flex-col gap-1.5 py-1.5">
      {!hideMakeField && <label className="text-xs font-bold text-ink-soft">{isArabic ? 'الموديل' : 'Model'} <span className="text-accent">*</span></label>}
      {modelOptions.length > 0 && (hideMakeField || !showOtherMake) ? (
        <>
          <select
            data-testid={modelTestId}
            value={showOtherModel ? OTHER_VALUE : modelValue}
            onChange={(e) => {
              const v = e.target.value;
              if (v === OTHER_VALUE) { setShowOtherModel(true); onModelChange(customModel); }
              else { setShowOtherModel(false); onModelChange(v); }
            }}
            className="w-full h-11 px-3 rounded-xl border border-line bg-canvas text-ink text-sm font-medium focus:outline-none focus:border-primary cursor-pointer"
          >
            <option value="">{isArabic ? '-- اختر الموديل --' : '-- Select Model --'}</option>
            {modelOptions.map((m) => (<option key={m.value} value={m.value}>{m.labelAr}</option>))}
            <option value={OTHER_VALUE}>{otherMakeLabel}</option>
          </select>
          {showOtherModel && (
            <OtherOptionInput value={customModel} onChange={(v) => { setCustomModel(v); onModelChange(v); }} placeholder={isArabic ? 'اكتب اسم الموديل...' : 'Type model name...'} isArabic={isArabic} />
          )}
        </>
      ) : (
        <OtherOptionInput value={modelValue} onChange={onModelChange} placeholder={isArabic ? 'اكتب اسم الموديل (مثل: كامري، X5)...' : 'Type model (e.g. Camry, X5)...'} isArabic={isArabic} />
      )}
    </div>
  );

  if (hideMakeField) return renderModelBlock();

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5 py-1.5">
        <label className="text-xs font-bold text-ink-soft">{isArabic ? 'الماركة' : 'Make'} <span className="text-accent">*</span></label>
        <SearchableDropdown
          options={[...brandOptions, otherMakeLabel]}
          value={showOtherMake ? otherMakeLabel : selectedBrandLabel}
          onChange={(selected) => {
            const v = selected === otherMakeLabel
              ? OTHER_VALUE
              : CAR_BRANDS.find((b) => (isArabic ? b.nameAr : b.nameEn) === selected)?.slug ?? selected;
            onModelChange(''); setCustomModel('');
            if (v === OTHER_VALUE) {
              setShowOtherMake(true); setShowOtherModel(true); onMakeChange(customMake);
            } else {
              setShowOtherMake(false); onMakeChange(v);
              setShowOtherModel(getModelOptions(v).length === 0);
            }
          }}
          placeholder={isArabic ? '-- اختر الماركة --' : '-- Select Make --'}
          isArabic={isArabic}
        />
        {showOtherMake && (
          <OtherOptionInput value={customMake} onChange={(v) => { setCustomMake(v); onMakeChange(v); }} placeholder={isArabic ? 'اكتب اسم الماركة...' : 'Type brand name...'} isArabic={isArabic} />
        )}
      </div>
      {renderModelBlock()}
    </div>
  );
};
